import { ArrowLeft, ChevronRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { type ReactNode } from "react";
import { Link } from "~/i18n/navigation";
import { EventBanner } from "~/components/event-banner";
import { getEventById, type EventId } from "~/lib/events";

interface EventLayoutProps {
  eventId: EventId;
  children: ReactNode;
}

export async function EventLayout({ eventId, children }: EventLayoutProps) {
  const event = getEventById(eventId);

  if (!event) {
    throw new Error(`Event with id "${eventId}" not found`);
  }

  const t = await getTranslations();

  return (
    <div className="bg-page-background min-h-screen">
      <div className="container mx-auto px-4 pt-16 pb-8 md:pt-8">
        {/* Breadcrumb */}
        <nav className="text-muted-foreground mb-6 flex items-center gap-2 text-sm">
          <Link href="/" className="hover:text-foreground cursor-pointer transition-colors">
            {t("navbar.home")}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/events"
            className="hover:text-foreground cursor-pointer transition-colors"
          >
            {t("navbar.events")}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{event.title}</span>
        </nav>

        {/* Event Banner */}
        <EventBanner event={event} />

        {/* Page Content */}
        <div className="prose prose-invert prose-h1:underline prose-h1:decoration-primary prose-h1:underline-offset-4 prose-h2:underline prose-h2:decoration-primary prose-h2:underline-offset-4 prose-h3:underline prose-h3:decoration-primary prose-h3:underline-offset-4 prose-a:cursor-pointer prose-a:hover:text-primary prose-a:transition-colors mt-8 max-w-none">
          {children}
        </div>

        {/* Backlink to all events */}
        <div className="border-border mt-12 border-t-2 pt-8">
          <Link
            href="/events"
            className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-2 text-sm font-medium tracking-wider uppercase transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("event.backToEvents")}
          </Link>
        </div>
      </div>
    </div>
  );
}
