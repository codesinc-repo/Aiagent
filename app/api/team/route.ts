import { NextResponse } from "next/server";
import { listRecords } from "@/lib/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const passcode = process.env.TEAM_PASSCODE;
  if (passcode && req.headers.get("x-team-key") !== passcode) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ records: listRecords(), protected: Boolean(passcode) });
}
