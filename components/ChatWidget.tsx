"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { DICT } from "@/lib/i18n";
import type { ChatResponse, Lang, Slot, UiEvent } from "@/lib/types";

interface DisplayMsg {
  id: number;
  role: "user" | "assistant";
  content: string; // what the visitor sees
  apiContent?: string; // what the model receives (e.g. includes slot id)
  ui?: UiEvent[];
  error?: boolean;
}

export interface OpenChatDetail {
  text?: string;
  apiText?: string;
}

let nextId = 1;

function renderText(text: string) {
  return text.split("\n").map((line, i, arr) => (
    <Fragment key={i}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={j}>{part.slice(2, -2)}</strong>
        ) : (
          <Fragment key={j}>{part}</Fragment>
        )
      )}
      {i < arr.length - 1 && <br />}
    </Fragment>
  ));
}

function downloadIcs(slotISO: string, title: string) {
  const start = new Date(slotISO);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const f = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RALU//Demo//EN",
    "BEGIN:VEVENT",
    `UID:${slotISO}@ralu-demo`,
    `DTSTAMP:${f(new Date())}`,
    `DTSTART:${f(start)}`,
    `DTEND:${f(end)}`,
    `SUMMARY:${title}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "ralu-drop-in.ics";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ChatWidget({ lang }: { lang: Lang }) {
  const t = DICT[lang].chat;
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<DisplayMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const msgsRef = useRef<DisplayMsg[]>([]);
  const loadingRef = useRef(false);
  const langRef = useRef(lang);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  // Greeting (display only, but also part of the history the model sees).
  useEffect(() => {
    setMsgs((prev) => {
      if (prev.length === 0 || (prev.length === 1 && prev[0].role === "assistant" && !prev[0].ui)) {
        return [{ id: nextId++, role: "assistant", content: DICT[lang].chat.greeting }];
      }
      return prev;
    });
  }, [lang]);

  useEffect(() => {
    msgsRef.current = msgs;
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, loading, open]);

  const send = useCallback(async (text: string, apiText?: string) => {
    const clean = text.trim();
    if (!clean || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const userMsg: DisplayMsg = { id: nextId++, role: "user", content: clean, apiContent: apiText ?? clean };
    const next = [...msgsRef.current, userMsg];
    msgsRef.current = next;
    setMsgs(next);

    const l = DICT[langRef.current].chat;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang: langRef.current,
          messages: next.filter((m) => !m.error).map((m) => ({ role: m.role, content: m.apiContent ?? m.content })),
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        const msg =
          data.error === "missing_key"
            ? l.errMissingKey
            : data.error === "model_busy" || data.error === "rate_limited"
              ? l.errBusy
              : l.errGeneric;
        setMsgs((p) => [...p, { id: nextId++, role: "assistant", content: msg, error: true }]);
        return;
      }
      const data = (await res.json()) as ChatResponse;
      setMsgs((p) => [...p, { id: nextId++, role: "assistant", content: data.reply, ui: data.ui }]);
    } catch {
      setMsgs((p) => [...p, { id: nextId++, role: "assistant", content: l.errGeneric, error: true }]);
    } finally {
      loadingRef.current = false;
      setLoading(false);
      inputRef.current?.focus();
    }
  }, []);

  const sendRef = useRef(send);
  useEffect(() => {
    sendRef.current = send;
  }, [send]);

  // Other parts of the page can open the chat and optionally send a first message.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<OpenChatDetail>).detail;
      setOpen(true);
      if (detail?.text) void sendRef.current(detail.text, detail.apiText);
    };
    window.addEventListener("ralu:open", onOpen);
    return () => window.removeEventListener("ralu:open", onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    inputRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const lastIdx = msgs.length - 1;
  const userCount = msgs.filter((m) => m.role === "user").length;

  const pickSlot = (s: Slot) => {
    const label = lang === "es" ? s.labelEs : s.labelEn;
    void send(`${t.iPick} ${label}`, `${t.iPick} ${label} (slot_id: ${s.id})`);
  };

  return (
    <>
      {!open && (
        <button className="chat-fab" onClick={() => setOpen(true)} aria-label={t.open}>
          <span className="chat-fab__dot" aria-hidden />
          {t.open}
        </button>
      )}

      {open && (
        <section className="chat" role="dialog" aria-label={t.name}>
          <header className="chat__head">
            <div className="chat__avatar" aria-hidden>
              R
            </div>
            <div className="chat__title">
              <strong>{t.name}</strong>
              <span>{t.status}</span>
            </div>
            <button className="chat__close" onClick={() => setOpen(false)} aria-label={t.close}>
              ×
            </button>
          </header>

          <div className="chat__log" ref={logRef} role="log" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={m.id} className={`msg msg--${m.role}${m.error ? " msg--error" : ""}`}>
                <div className="msg__bubble">{renderText(m.content)}</div>

                {m.ui?.map((ev, k) => {
                  if (ev.type === "slots") {
                    return (
                      <div className="card card--slots" key={k}>
                        <p className="card__title">{t.slotsTitle}</p>
                        <div className="slot-grid">
                          {ev.slots.map((s) => (
                            <button
                              key={s.id}
                              className="slot"
                              onClick={() => pickSlot(s)}
                              disabled={loading || i !== lastIdx}
                            >
                              {lang === "es" ? s.labelEs : s.labelEn}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  if (ev.type === "booking") {
                    const label = lang === "es" ? ev.booking.labelEs : ev.booking.labelEn;
                    return (
                      <div className="card card--ok" key={k}>
                        <p className="card__title">✓ {t.bookedTitle}</p>
                        <p className="card__big">{label}</p>
                        <p className="card__muted">
                          {t.bookedBody} · #{ev.booking.id}
                        </p>
                        <button
                          className="btn btn--ghost btn--sm"
                          onClick={() => downloadIcs(ev.booking.slotISO, "RALU Virtual Drop-In")}
                        >
                          {t.addCal}
                        </button>
                      </div>
                    );
                  }
                  if (ev.type === "logged" && ev.kind !== "crisis_alert") {
                    return (
                      <div className="card card--ok" key={k}>
                        <p className="card__title">✓ {t.loggedTitle}</p>
                        <p className="card__muted">
                          {t.loggedBody} · #{ev.id}
                        </p>
                      </div>
                    );
                  }
                  if (ev.type === "crisis") {
                    return (
                      <div className="card card--crisis" key={k}>
                        <p className="card__title">{t.crisisTitle}</p>
                        <div className="crisis-actions">
                          <a className="btn btn--danger" href="tel:911">
                            {t.crisisCall911}
                          </a>
                          <a className="btn btn--light" href="tel:988">
                            {t.crisisCall988}
                          </a>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            ))}

            {loading && (
              <div className="msg msg--assistant">
                <div className="msg__bubble typing" aria-label={t.thinking}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            {userCount === 0 && !loading && (
              <div className="chips">
                {t.chips.map((c) => (
                  <button key={c.label} className="chip" onClick={() => void send(c.prompt)}>
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="chat__form"
            onSubmit={(e) => {
              e.preventDefault();
              const v = input;
              setInput("");
              void send(v);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              maxLength={1000}
              aria-label={t.placeholder}
              autoComplete="off"
            />
            <button type="submit" disabled={loading || !input.trim()}>
              {t.send}
            </button>
          </form>
        </section>
      )}
    </>
  );
}
