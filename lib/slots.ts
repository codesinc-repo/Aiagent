import type { Slot } from "./types";

// Puerto Rico is on Atlantic Standard Time all year (UTC-4, no daylight saving).
const AST_OFFSET_HOURS = 4;
const TZ = "America/Puerto_Rico";

// Demo availability (local Puerto Rico hours). Replace with the ministry's real schedule.
const HOURS_AST = [10, 14, 16, 19];
const DAYS_AHEAD = 7;
const MIN_NOTICE_HOURS = 2;

function fmt(iso: string, locale: "en-US" | "es-PR"): string {
  const d = new Date(iso);
  const day = new Intl.DateTimeFormat(locale, {
    timeZone: TZ,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(d);
  const time = new Intl.DateTimeFormat(locale, {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
  return `${day} · ${time} AST`;
}

export function dayKeyOf(iso: string): string {
  // en-CA gives YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date(iso));
}

export function makeSlot(iso: string): Slot {
  return { id: iso, labelEn: fmt(iso, "en-US"), labelEs: fmt(iso, "es-PR"), dayKey: dayKeyOf(iso) };
}

export function generateSlots(now: Date = new Date()): Slot[] {
  const nowMs = now.getTime();
  const astNow = new Date(nowMs - AST_OFFSET_HOURS * 3600 * 1000);
  const slots: Slot[] = [];
  for (let d = 0; d < DAYS_AHEAD; d++) {
    for (const h of HOURS_AST) {
      const utcMs = Date.UTC(
        astNow.getUTCFullYear(),
        astNow.getUTCMonth(),
        astNow.getUTCDate() + d,
        h + AST_OFFSET_HOURS,
        0,
        0
      );
      if (utcMs < nowMs + MIN_NOTICE_HOURS * 3600 * 1000) continue;
      slots.push(makeSlot(new Date(utcMs).toISOString()));
    }
  }
  return slots;
}

/** Pick a spread of slots: two per day across the next days, or all for one preferred day. */
export function pickSlots(all: Slot[], preferredDay?: string, max = 6): Slot[] {
  if (preferredDay) {
    const sameDay = all.filter((s) => s.dayKey === preferredDay);
    if (sameDay.length) return sameDay.slice(0, 4);
  }
  const perDay = new Map<string, number>();
  const out: Slot[] = [];
  for (const s of all) {
    const n = perDay.get(s.dayKey) ?? 0;
    if (n >= 2) continue;
    perDay.set(s.dayKey, n + 1);
    out.push(s);
    if (out.length >= max) break;
  }
  return out;
}
