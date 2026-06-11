import { notFound } from "next/navigation";
import { MeetingWorkspace } from "@/components/meeting-workspace";
import { meetings } from "@/lib/data";

export default async function MeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meeting = meetings.find((item) => item.id === id);
  if (!meeting) notFound();
  return <MeetingWorkspace meeting={meeting} />;
}
