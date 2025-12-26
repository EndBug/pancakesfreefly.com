import { type Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EventLayout } from "~/components/event-layout";
import { getEventById } from "~/lib/events";

export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const event = getEventById("ag-skill-camp-mar26");

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

export default async function AgSkillCampMar26Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);

  const t = await getTranslations({ locale });

  const coaches = t.raw("event.agSkillCampMar26.coaches") as Array<{
    name: string;
    instagram: string;
  }>;

  return (
    <EventLayout eventId="ag-skill-camp-mar26">
      <div className="prose prose-invert prose-h1:text-primary prose-h2:text-primary prose-h3:text-primary prose-a:hover:text-primary prose-a:transition-colors mt-8 max-w-none">
        <p>{t("event.agSkillCampMar26.intro")}</p>
        <p>
          {t.rich("event.agSkillCampMar26.promoPrice", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
        <p>
          {t.rich("event.agSkillCampMar26.dates", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
        <p>
          {t.rich("event.agSkillCampMar26.coachesIntro", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
        <ul>
          {coaches.map((coach) => (
            <li key={coach.name}>
              <a
                href={coach.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                {coach.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </EventLayout>
  );
}
