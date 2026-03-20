import { type Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EventLayout } from "~/components/event-layout";
import { SundaySharingRegistrationForm } from "~/components/sunday-sharing-registration-form";
import { getEventById } from "~/lib/events";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const event = getEventById("sunday-sharing-dec25");

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

export default async function SundaySharingDec25Page({
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
    <EventLayout eventId="sunday-sharing-dec25">
      <p>{t("event.sundaySharingDec25.intro")}</p>
      <p>{t("event.sundaySharingDec25.secondEdition")}</p>
      <p>{t("event.sundaySharingDec25.winter")}</p>
      <p>{t("event.sundaySharingDec25.purpose")}</p>
      <h2>{t("event.sundaySharingDec25.whenAndWhere")}</h2>
      <p>
        {t.rich("event.sundaySharingDec25.dateTime", {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>
      <h2>{t("event.sundaySharingDec25.whatIncludes")}</h2>
      <p>
        {t.rich("event.sundaySharingDec25.mobilitySession", {
          strong: (chunks) => <strong>{chunks}</strong>,
          link: (chunks) => (
            <a
              href="https://www.instagram.com/ferrero_chiara/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {chunks}
            </a>
          ),
        })}
      </p>
      <p>
        {t.rich("event.sundaySharingDec25.flyingTime", {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>
      <p>
        {t.rich("event.sundaySharingDec25.pizzaBeer", {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>
      <p>{t("event.sundaySharingDec25.price")}</p>
      <p>{t("event.sundaySharingDec25.registrationInfo")}</p>
      <p>{t("event.sundaySharingDec25.contactInfo")}</p>
      <SundaySharingRegistrationForm eventId="sunday-sharing-dec25" />
    </EventLayout>
  );
}
