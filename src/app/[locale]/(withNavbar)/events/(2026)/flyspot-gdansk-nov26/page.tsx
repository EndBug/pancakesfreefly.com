import { type Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EventLayout } from "~/components/event-layout";
import { FlyspotGdanskRegistrationForm } from "~/components/flyspot-gdansk-registration-form";
import { getEventById } from "~/lib/events";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const event = getEventById("flyspot-gdansk-nov26");

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

export default async function FlyspotGdanskNov26Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const event = getEventById("flyspot-gdansk-nov26");

  return (
    <EventLayout eventId="flyspot-gdansk-nov26">
      <p>{t("event.flyspotGdanskNov26.intro")}</p>
      <p>{t("event.flyspotGdanskNov26.winterSeason")}</p>
      <h2>{t("event.flyspotGdanskNov26.whenAndWhere")}</h2>
      <p>
        {t.rich("event.flyspotGdanskNov26.datesLocation", {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>
      <p>{t("event.flyspotGdanskNov26.locationDetails")}</p>
      <h2>{t("event.flyspotGdanskNov26.costsHeading")}</h2>
      <p>
        {t.rich("event.flyspotGdanskNov26.tunnelPricing", {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>
      <p>{t("event.flyspotGdanskNov26.packages")}</p>
      <p>
        {t.rich("event.flyspotGdanskNov26.coachingPrice", {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>
      <p>{t("event.flyspotGdanskNov26.registrationInfo")}</p>
      {event && (
        <FlyspotGdanskRegistrationForm
          registrationDeadline={event.registrationDeadline}
        />
      )}
    </EventLayout>
  );
}
