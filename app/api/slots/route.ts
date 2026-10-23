import { NextResponse } from "next/server";
import { generateSlots } from "@/lib/slots";
import { listRecords } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const taken = new Set(listRecords().filter((r) => r.kind === "dropin" && r.slotISO).map((r) => r.slotISO));
  const free = generateSlots().filter((s) => !taken.has(s.id));
  return NextResponse.json({ slots: free.slice(0, 3) });
}
