"use client";

import { useCallback, useEffect, useState } from "react";
import Wordmark from "./Wordmark";
import type { RecordKind, TeamRecord } from "@/lib/types";

const KIND_LABEL: Record<RecordKind, string> = {
  dropin: "Virtual Drop-In",
  street_outreach: "Street Outreach",
  referral: "Referral",
  volunteer: "Volunteer",
  donation: "Donation interest",
  crisis_alert: "Safety alert",
};

const WHOM: Record<string, string> = { self: "Self", loved_one: "Loved one", ministry: "Ministry" };

function when(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Puerto_Rico",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function TeamBoard() {
  const [records, setRecords] = useState<TeamRecord[]>([]);
  const [needKey, setNeedKey] = useState(false);
  const [key, setKey] = useState("");
  const [filter, setFilter] = useState<"all" | RecordKind>("all");
  const [updated, setUpdated] = useState<Date | null>(null);

  const load = useCallback(async (k: string) => {
    const res = await fetch("/api/team", { headers: k ? { "x-team-key": k } : {}, cache: "no-store" });
    if (res.status === 401) {
      setNeedKey(true);
      return;
    }
    const data = (await res.json()) as { records: TeamRecord[] };
    setNeedKey(false);
    setRecords(data.records);
    setUpdated(new Date());
  }, []);

  useEffect(() => {
    let saved = "";
    try {
      saved = sessionStorage.getItem("ralu-team-key") ?? "";
    } catch {
      /* ignore */
    }
    setKey(saved);
    void load(saved);
    const id = setInterval(() => void load(saved), 5000);
    return () => clearInterval(id);
  }, [load]);

  if (needKey) {
    return (
      <main className="team team--gate">
        <form
          className="gate"
          onSubmit={(e) => {
            e.preventDefault();
            try {
              sessionStorage.setItem("ralu-team-key", key);
            } catch {
              /* ignore */
            }
            void load(key).then(() => window.location.reload());
          }}
        >
          <Wordmark />
          <h1>Team access</h1>
          <p>Enter the team passcode to see requests.</p>
          <input type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Passcode" autoFocus />
          <button className="btn btn--blue" type="submit">
            Open dashboard
          </button>
        </form>
      </main>
    );
  }

  const shown = records.filter((r) => filter === "all" || r.kind === filter);
  const bookings = records
    .filter((r) => r.kind === "dropin" && r.slotISO && new Date(r.slotISO).getTime() > Date.now() - 3600_000)
    .sort((a, b) => (a.slotISO ?? "").localeCompare(b.slotISO ?? ""));
  const urgent = records.filter((r) => r.kind === "crisis_alert").length;

  return (
    <main className="team">
      <header className="team__head">
        <Wordmark small />
        <div>
          <h1>Team dashboard</h1>
          <p>
            Live view of what RALU Guide captures. {updated ? `Updated ${updated.toLocaleTimeString()}` : "Loading…"}
          </p>
        </div>
        <a className="btn btn--outline btn--sm" href="/">
          ← Site
        </a>
      </header>

      <section className="stats">
        <div className="stat">
          <span>{records.length}</span>
          <p>Total requests</p>
        </div>
        <div className="stat">
          <span>{bookings.length}</span>
          <p>Upcoming drop-ins</p>
        </div>
        <div className={`stat${urgent ? " stat--urgent" : ""}`}>
          <span>{urgent}</span>
          <p>Safety alerts</p>
        </div>
      </section>

      <div className="team__grid">
        <section className="panel">
          <h2>Upcoming Virtual Drop-Ins</h2>
          {bookings.length === 0 && <p className="empty">No bookings yet. Try booking from the site.</p>}
          <ul className="agenda">
            {bookings.map((b) => (
              <li key={b.id}>
                <strong>{when(b.slotISO!)} AST</strong>
                <span>
                  {b.name} · {b.contact}
                </span>
                <em>
                  {b.language.toUpperCase()} · {WHOM[b.forWhom ?? "self"]}
                </em>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel panel--wide">
          <div className="panel__top">
            <h2>All requests</h2>
            <select value={filter} onChange={(e) => setFilter(e.target.value as "all" | RecordKind)} aria-label="Filter">
              <option value="all">All</option>
              {Object.entries(KIND_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          {shown.length === 0 && <p className="empty">Nothing here yet.</p>}
          <ul className="rows">
            {shown.map((r) => (
              <li key={r.id} className={r.status === "urgent" ? "row row--urgent" : "row"}>
                <div className="row__main">
                  <span className={`tag tag--${r.kind}`}>{KIND_LABEL[r.kind]}</span>
                  <strong>{r.name}</strong>
                  <span className="row__contact">{r.contact}</span>
                </div>
                <div className="row__meta">
                  <span>{when(r.createdAt)}</span>
                  <span>{r.language.toUpperCase()}</span>
                  {r.forWhom && <span>{WHOM[r.forWhom]}</span>}
                  {r.area && <span>Area: {r.area}</span>}
                  {r.slotISO && <span>Slot: {when(r.slotISO)} AST</span>}
                  <span className="row__id">#{r.id}</span>
                </div>
                {r.notes && <p className="row__notes">{r.notes}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
