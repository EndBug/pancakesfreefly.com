"use client";

import { DateTime } from "luxon";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "~/i18n/navigation";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { type Event } from "~/lib/events";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const t = useTranslations();
  const locale = useLocale();

  const now = DateTime.now();
  const today = now.startOf("day");
  const startDate = DateTime.fromISO(event.date);
  const endDate = event.endDate ? DateTime.fromISO(event.endDate) : null;
  const registrationDeadline = DateTime.fromISO(event.registrationDeadline);

  const effectiveEnd = endDate ?? startDate;
  const isPastEvent = effectiveEnd < today;
  const registrationsOpen = !isPastEvent && now < registrationDeadline;

  const formatDate = (dt: DateTime) => {
    return dt.setLocale(locale).toLocaleString(DateTime.DATE_MED);
  };

  const dateDisplay = endDate
    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
    : formatDate(startDate);

  return (
    <Link href={`/events/${event.id}`} className="group relative block">
      <Card className="border-border bg-card mx-auto flex max-w-md flex-col overflow-hidden rounded-none border-2 py-0 transition-all sm:mx-0 sm:max-w-none sm:flex-row">
        {/* Animated border - using separate divs for each side to avoid stretching */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {/* Top border */}
          <div
            className="border-reveal-top bg-primary absolute top-0 left-0 h-[2px]"
            style={{ width: "100%" }}
          />
          {/* Right border */}
          <div
            className="border-reveal-right bg-primary absolute top-0 right-0 w-[2px]"
            style={{ height: "100%" }}
          />
          {/* Bottom border */}
          <div
            className="border-reveal-bottom bg-primary absolute right-0 bottom-0 h-[2px]"
            style={{ width: "100%" }}
          />
          {/* Left border */}
          <div
            className="border-reveal-left bg-primary absolute bottom-0 left-0 w-[2px]"
            style={{ height: "100%" }}
          />
        </div>
        {/* Event Image */}
        <div className="bg-muted relative aspect-square w-full shrink-0 overflow-hidden sm:aspect-4/5 sm:w-auto sm:max-w-[300px] sm:min-w-[200px] xl:max-w-[400px]">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover sm:object-contain"
          />
        </div>

        <CardContent className="flex flex-1 flex-col justify-between space-y-3 p-6">
          <div className="flex flex-col space-y-3">
            {/* Event Type Badges */}
            <div className="flex flex-wrap gap-2">
              {event.type.map((type) => (
                <Badge
                  key={type}
                  variant="outline"
                  className="border-primary text-primary rounded-none"
                >
                  {t(`home.events.type.${type}`)}
                </Badge>
              ))}
            </div>

            {/* Event Title */}
            <h3 className="text-foreground line-clamp-2 text-2xl font-bold">
              {event.title}
            </h3>

            {/* Date(s) */}
            <p className="text-foreground text-sm font-medium">{dateDisplay}</p>

            {/* Location */}
            <p className="text-muted-foreground text-sm">{event.location}</p>
          </div>

          {/* Registration Status CTA - Only show for upcoming events */}
          {!isPastEvent && (
            <div className="pt-2">
              <Badge
                variant={registrationsOpen ? "default" : "secondary"}
                className={`rounded-none ${
                  registrationsOpen ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                {registrationsOpen
                  ? t("home.events.registrationsOpen")
                  : t("home.events.registrationsClosed")}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
