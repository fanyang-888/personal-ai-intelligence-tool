import type { Metadata } from "next";
import { EventsClient } from "./events-client";

export const metadata: Metadata = { title: "Events · Admin" };

export default function EventsPage() {
  return <EventsClient />;
}
