import fs from "node:fs";
import path from "node:path";
import type { TeamRecord } from "./types";

// Demo persistence: a small JSON file, with an in-memory fallback for read-only hosts.
// For production, replace with a database (Postgres, Supabase, Airtable, Google Sheets...).

const DIR = process.env.RALU_DATA_DIR || path.join(process.cwd(), ".data");
const FILE = path.join(DIR, "store.json");

let cache: TeamRecord[] | null = null;

function load(): TeamRecord[] {
  if (cache) return cache;
  try {
    cache = JSON.parse(fs.readFileSync(FILE, "utf8")) as TeamRecord[];
  } catch {
    cache = [];
  }
  return cache;
}

function persist(records: TeamRecord[]) {
  try {
    fs.mkdirSync(DIR, { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(records, null, 2));
  } catch {
    // read-only filesystem: keep in memory only
  }
}

export function listRecords(): TeamRecord[] {
  return [...load()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addRecord(input: Omit<TeamRecord, "id" | "createdAt">): TeamRecord {
  const records = load();
  const record: TeamRecord = {
    ...input,
    id: `R${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
    createdAt: new Date().toISOString(),
  };
  records.push(record);
  persist(records);
  return record;
}

export function isSlotTaken(slotISO: string): boolean {
  return load().some((r) => r.kind === "dropin" && r.slotISO === slotISO);
}
