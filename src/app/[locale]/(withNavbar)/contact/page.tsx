import { Mail } from "lucide-react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const dynamic = "force-static";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const members = t.raw("contact.team.members") as Array<{
    name: string;
    instagram: string;
    handle: string;
  }>;

  return (
    <div className="bg-page-background min-h-screen">
      {/* Primary contact section */}
      <section className="border-border border-b py-24 md:py-32">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-foreground mb-6 text-6xl font-bold tracking-tight md:text-8xl">
            {t("contact.title")}
          </h1>

          <p className="text-muted-foreground mb-12 max-w-xl text-lg">
            {t("contact.primary.description")}
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <a
              href="https://instagram.com/pancakes_freefly"
              target="_blank"
              rel="noopener noreferrer"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground inline-flex cursor-pointer items-center gap-3 border-2 px-6 py-4 text-sm font-bold tracking-wider uppercase transition-colors"
            >
              <Image
                src="/images/brand-icons/instagram.svg"
                alt="Instagram"
                width={20}
                height={20}
                className="h-5 w-5 brightness-0 invert"
              />
              {t("contact.primary.instagram")}
            </a>

            <a
              href="mailto:team@pancakesfreefly.com"
              className="border-foreground/30 text-foreground hover:border-foreground inline-flex cursor-pointer items-center gap-3 border-2 px-6 py-4 text-sm font-bold tracking-wider uppercase transition-colors"
            >
              <Mail className="h-5 w-5" />
              {t("contact.primary.email")}
            </a>
          </div>
        </div>
      </section>

      {/* Team members section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-foreground mb-12 text-4xl font-bold tracking-tight md:text-5xl">
            {t("contact.team.heading")}
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {members.map((member) => (
              <a
                key={member.handle}
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border group cursor-pointer border-2 p-6 transition-colors hover:border-primary"
              >
                <h3 className="text-foreground mb-2 text-2xl font-bold uppercase">
                  {member.name}
                </h3>
                <div className="text-muted-foreground group-hover:text-primary flex items-center gap-2 transition-colors">
                  <Image
                    src="/images/brand-icons/instagram.svg"
                    alt="Instagram"
                    width={16}
                    height={16}
                    className="h-4 w-4 brightness-0 invert"
                  />
                  <span className="text-sm">{member.handle}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
