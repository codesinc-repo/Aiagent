export type Lang = "en" | "es";

export type RecordKind =
  | "dropin"
  | "street_outreach"
  | "referral"
  | "volunteer"
  | "donation"
  | "crisis_alert";

export type ForWhom = "self" | "loved_one" | "ministry";

export interface TeamRecord {
  id: string;
  kind: RecordKind;
  createdAt: string; // ISO
  name: string;
  contact: string;
  language: Lang;
  forWhom?: ForWhom;
  area?: string;
  notes?: string;
  slotISO?: string;
  status: "new" | "scheduled" | "urgent";
}

export interface Slot {
  id: string; // ISO UTC string, also used as slot id
  labelEn: string;
  labelEs: string;
  dayKey: string; // YYYY-MM-DD in Puerto Rico time
}

export interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

export type UiEvent =
  | { type: "slots"; slots: Slot[] }
  | {
      type: "booking";
      booking: { id: string; slotISO: string; labelEn: string; labelEs: string; name: string };
    }
  | { type: "logged"; kind: RecordKind; id: string }
  | { type: "crisis" };

export interface ChatResponse {
  reply: string;
  ui: UiEvent[];
}
