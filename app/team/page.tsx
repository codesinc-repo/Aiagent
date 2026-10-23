import type { Metadata } from "next";
import TeamBoard from "@/components/TeamBoard";

export const metadata: Metadata = { title: "RALU · Team dashboard", robots: { index: false, follow: false } };

export default function TeamPage() {
  return <TeamBoard />;
}
