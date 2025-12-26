import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import { type Event } from "~/lib/events";

interface EventCardProps {
  event: Event;
}

export async function EventCard({ event }: EventCardProps) {
  const t = await getTranslations();
  const locale = await getLocale();
  const now = new Date();
  const registrationDeadline = new Date(event.registrationDeadline);
  const registrationsOpen = now < registrationDeadline;

  // Format dates
  const startDate = new Date(event.date);
  const endDate = event.endDate ? new Date(event.endDate) : null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const dateDisplay = endDate
    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
    : formatDate(startDate);

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="border-border bg-card group hover:border-primary mx-auto flex max-w-md flex-col overflow-hidden rounded-none border-2 py-0 transition-all sm:mx-0 sm:max-w-none sm:flex-row">
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

          {/* Registration Status CTA */}
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
        </CardContent>
      </Card>
    </Link>
  );
}
