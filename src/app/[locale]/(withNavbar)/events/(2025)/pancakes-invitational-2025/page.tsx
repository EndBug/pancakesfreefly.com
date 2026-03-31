import { type Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EventLayout } from "~/components/event-layout";
import { YoutubeEmbed } from "~/components/youtube-embed";
import { getEventById } from "~/lib/events";

export const dynamic = "force-static";

const EVENT_ID = "pancakes-invitational-2025";
const YOUTUBE_VIDEO_ID = "MqPsE6aRCDg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const event = getEventById(EVENT_ID);

  if (!event) {
    return {
      title: t("metadata.title"),
      description: t("metadata.description"),
    };
  }

  return {
    title: `${event.title} | ${t("metadata.title")}`,
    description: `${event.title} - ${event.location} - ${t("metadata.description")}`,
  };
}

export default async function PancakesInvitational2025Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);
  // Explicitly pass locale to ensure correct translations during client-side navigation
  const t = await getTranslations({ locale });

  return (
    <EventLayout eventId={EVENT_ID}>
      <p>{t("event.pancakesInvitational2025.intro")}</p>

      <h2>{t("event.pancakesInvitational2025.videoHeading")}</h2>
      <YoutubeEmbed
        videoId={YOUTUBE_VIDEO_ID}
        title={t("event.pancakesInvitational2025.videoHeading")}
        className="mt-4"
      />
    </EventLayout>
  );
}
