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

  const event = getEventById("sunday-sharing-jan26");

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

export default async function SundaySharingJan26Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <EventLayout eventId="sunday-sharing-jan26">
      <p>{t("event.sundaySharingJan26.intro")}</p>
      <p>{t("event.sundaySharingJan26.newDate")}</p>
      <p>{t("event.sundaySharingJan26.winter")}</p>
      <p>{t("event.sundaySharingJan26.purpose")}</p>
      <h2>{t("event.sundaySharingJan26.whenAndWhere")}</h2>
      <p>
        {t.rich("event.sundaySharingJan26.dateTime", {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>
      <h2>{t("event.sundaySharingJan26.whatIncludes")}</h2>
      <p>
        {t.rich("event.sundaySharingJan26.mobilitySession", {
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
        {t.rich("event.sundaySharingJan26.flyingTime", {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>
      <p>
        {t.rich("event.sundaySharingJan26.pizzaBeer", {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </p>
      <p>{t("event.sundaySharingJan26.price")}</p>
      <p>{t("event.sundaySharingJan26.registrationInfo")}</p>
      <p>{t("event.sundaySharingJan26.contactInfo")}</p>
      <SundaySharingRegistrationForm eventId="sunday-sharing-jan26" />
    </EventLayout>
  );
}
