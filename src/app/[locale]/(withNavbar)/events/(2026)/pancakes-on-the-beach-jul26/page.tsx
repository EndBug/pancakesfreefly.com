import { type Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EventLayout } from "~/components/event-layout";
import { PancakesOnTheBeachRegistrationForm } from "~/components/pancakes-on-the-beach-registration-form";
import { YoutubeEmbed } from "~/components/youtube-embed";
import { getEventById } from "~/lib/events";

export const dynamic = "force-static";

const EVENT_ID = "pancakes-on-the-beach-jul26";
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

export default async function PancakesOnTheBeachJul26Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale });

  const event = getEventById(EVENT_ID);

  const coaches = t.raw("event.pancakesOnTheBeachJul26.coaches") as Array<{
    name: string;
    instagram: string;
  }>;

  return (
    <EventLayout eventId={EVENT_ID}>
      <p>{t("event.pancakesOnTheBeachJul26.intro")}</p>

      <h2>{t("event.pancakesOnTheBeachJul26.whereHeading")}</h2>
      <p>{t("event.pancakesOnTheBeachJul26.whereDay1")}</p>
      <p>{t("event.pancakesOnTheBeachJul26.whereDays2_4")}</p>

      <h2>{t("event.pancakesOnTheBeachJul26.coachesHeading")}</h2>
      <ul>
        {coaches.map((coach) => (
          <li key={coach.name}>
            <a href={coach.instagram} target="_blank" rel="noopener noreferrer">
              {coach.name}
            </a>
          </li>
        ))}
      </ul>

      <p>{t("event.pancakesOnTheBeachJul26.groupsAndJumps")}</p>

      <h2>{t("event.pancakesOnTheBeachJul26.priceHeading")}</h2>
      <p>{t("event.pancakesOnTheBeachJul26.priceAmount")}</p>
      <ul>
        <li>{t("event.pancakesOnTheBeachJul26.priceJam")}</li>
        <li>{t("event.pancakesOnTheBeachJul26.priceJumps")}</li>
        <li>{t("event.pancakesOnTheBeachJul26.priceGoodie")}</li>
      </ul>
      <p>{t("event.pancakesOnTheBeachJul26.ticketPrice")}</p>

      <h2>{t("event.pancakesOnTheBeachJul26.scheduleHeading")}</h2>
      <ul>
        <li>{t("event.pancakesOnTheBeachJul26.scheduleFriday")}</li>
        <li>{t("event.pancakesOnTheBeachJul26.scheduleSaturday")}</li>
        <li>{t("event.pancakesOnTheBeachJul26.scheduleSunday")}</li>
        <li>{t("event.pancakesOnTheBeachJul26.scheduleMonday")}</li>
      </ul>

      <h2>{t("event.pancakesOnTheBeachJul26.videoHeading")}</h2>
      <YoutubeEmbed
        videoId={YOUTUBE_VIDEO_ID}
        title={t("event.pancakesOnTheBeachJul26.videoHeading")}
        className="mt-4"
      />

      {event?.registrationDeadline && (
        <PancakesOnTheBeachRegistrationForm
          registrationDeadline={event.registrationDeadline}
        />
      )}
    </EventLayout>
  );
}
