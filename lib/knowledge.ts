// Everything the agent is allowed to state as fact about RALU.
// Items marked PENDING were not provided yet: the agent must say the team will confirm them.
// Update this file after the discovery call with Bishop Luis.

export const KNOWLEDGE = {
  name: "Recognize & Level Up (RALU)",
  leader: "Bishop Luis Melendez",
  region: "Puerto Rico",
  tagline: "Anybody that's addicted to drugs, there's a way out, and His way is Jesus.",
  services: [
    {
      key: "street_outreach",
      name: "Street Outreach",
      summary: "The RALU team meets people where they are, on the street, with care and a way forward.",
    },
    {
      key: "dropin",
      name: "Virtual Drop-In Center",
      summary:
        "A free-to-ask, online conversation with the RALU team. Visitors can book a time through this assistant.",
    },
    {
      key: "referral",
      name: "Community Referral Services",
      summary: "The team connects people and families with community resources and next steps.",
    },
  ],
  pending: {
    cost: "PENDING: not confirmed. Do not say whether services are free; say the team will confirm.",
    hours: "PENDING: official hours not confirmed. Demo appointment times are shown in Puerto Rico time (AST).",
    serviceArea: "PENDING: street outreach service area not confirmed.",
    contact: "PENDING: phone/WhatsApp/email of the ministry not confirmed. Do not invent any.",
    confidentiality:
      "PENDING: do not promise confidentiality. Say details go to the RALU team and the team will explain how information is handled.",
    donations:
      "PENDING: donation method not confirmed. Collect interest and say the team will share how to give.",
    licensing:
      "RALU is a faith-based outreach ministry. Do NOT claim it is a licensed medical or treatment provider.",
  },
} as const;

export function knowledgeBlock(): string {
  const k = KNOWLEDGE;
  return [
    `ORGANIZATION: ${k.name}, led by ${k.leader} in ${k.region}.`,
    `MESSAGE: "${k.tagline}"`,
    `SERVICES:`,
    ...k.services.map((s) => `- ${s.name}: ${s.summary}`),
    `UNCONFIRMED FACTS (never guess these):`,
    ...Object.values(k.pending).map((p) => `- ${p}`),
  ].join("\n");
}
