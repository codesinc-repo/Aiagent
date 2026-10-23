import { NextResponse } from "next/server";
import { MissingKeyError, runAgent } from "@/lib/agent";
import { crisisReply, isCrisis, looksSpanish } from "@/lib/crisis";
import { addRecord } from "@/lib/store";
import type { ChatMsg, ChatResponse, Lang } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Tiny in-memory rate limit to protect the free Groq key (per IP, per 10 minutes).
const hits = new Map<string, { count: number; reset: number }>();
const LIMIT = 40;
const WINDOW_MS = 10 * 60 * 1000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  h.count += 1;
  return h.count > LIMIT;
}

function clean(messages: unknown): ChatMsg[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(
      (m): m is ChatMsg =>
        !!m &&
        typeof m === "object" &&
        ((m as ChatMsg).role === "user" || (m as ChatMsg).role === "assistant") &&
        typeof (m as ChatMsg).content === "string"
    )
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }));
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { messages?: unknown; lang?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const history = clean(body.messages);
  const lang: Lang = body.lang === "es" ? "es" : "en";
  const lastUser = [...history].reverse().find((m) => m.role === "user");
  if (!lastUser) return NextResponse.json({ error: "no_message" }, { status: 400 });

  // 1) Deterministic safety check BEFORE the model.
  if (isCrisis(lastUser.content)) {
    const replyLang: Lang = lang === "es" || looksSpanish(lastUser.content) ? "es" : "en";
    addRecord({
      kind: "crisis_alert",
      name: "Unknown",
      contact: "Not provided",
      language: replyLang,
      notes: "Crisis language detected in chat. No message text stored. Reach out if the visitor shares contact details.",
      status: "urgent",
    });
    const out: ChatResponse = { reply: crisisReply(replyLang), ui: [{ type: "crisis" }] };
    return NextResponse.json(out);
  }

  const crisisSeen = history.some((m) => m.role === "user" && isCrisis(m.content));

  // 2) Normal agent flow (Groq, with tools).
  try {
    const out = await runAgent(history, lang, crisisSeen);
    return NextResponse.json(out);
  } catch (e) {
    if (e instanceof MissingKeyError) {
      return NextResponse.json({ error: "missing_key" }, { status: 503 });
    }
    const status = (e as { status?: number }).status;
    if (status === 429) return NextResponse.json({ error: "model_busy" }, { status: 503 });
    console.error("[chat] agent error:", e);
    return NextResponse.json({ error: "agent_error" }, { status: 502 });
  }
}
