"use client";

import { DateTime } from "luxon";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "~/components/ui/badge";
import { ContactType, type Event } from "~/lib/events";

interface EventBannerProps {
  event: Event;
}

export function EventBanner({ event }: EventBannerProps) {
  const locale = useLocale();
  const t = useTranslations();

  const now = DateTime.now();
  const today = now.startOf("day");
  const startDate = DateTime.fromISO(event.date);
  const endDate = event.endDate ? DateTime.fromISO(event.endDate) : null;
  const registrationDeadline = DateTime.fromISO(event.registrationDeadline);

  const effectiveEnd = endDate ?? startDate;
  const isRegistrationOpen = now < registrationDeadline;
  const isPastEvent = effectiveEnd < today;

  const formatDate = (dt: DateTime) => {
    return dt.setLocale(locale).toLocaleString(DateTime.DATE_FULL);
  };

  // Default contacts that should always be displayed
  const defaultContacts = [
    { type: ContactType.Instagram, value: "@pancakes_freefly" },
    { type: ContactType.Email, value: "team@pancakesfreefly.com" },
  ];

  // Get all event-specific contacts
  const eventContacts = event.contacts ?? [];

  // Combine: all event contacts + all default contacts
  const allContacts = [...eventContacts, ...defaultContacts];

  const getContactUrl = (type: ContactType, value: string) => {
    switch (type) {
      case ContactType.Email:
        return `mailto:${value}`;
      case ContactType.Phone:
        return `tel:${value}`;
      case ContactType.WhatsApp:
        // Remove any non-digit characters except + for WhatsApp URL
        const whatsappNumber = value.replace(/[^\d+]/g, "");
        return `https://wa.me/${whatsappNumber}`;
      case ContactType.Instagram:
        // If it's already a URL, use it; otherwise construct Instagram URL
        if (value.startsWith("http")) return value;
        const handle = value.startsWith("@") ? value.slice(1) : value;
        return `https://instagram.com/${handle}`;
      case ContactType.Facebook:
        return value;
      default:
        return value;
    }
  };

  const getContactIcon = (type: ContactType) => {
    switch (type) {
      case ContactType.Email:
        return <Mail className="h-5 w-5" />;
      case ContactType.Phone:
        return <Phone className="h-5 w-5" />;
      case ContactType.WhatsApp:
        return (
          <Image
            src="/images/brand-icons/whatsapp.svg"
            alt="WhatsApp"
            width={20}
            height={20}
            className="h-5 w-5 brightness-0 invert"
          />
        );
      case ContactType.Instagram:
        return (
          <Image
            src="/images/brand-icons/instagram.svg"
            alt="Instagram"
            width={20}
            height={20}
            className="h-5 w-5 brightness-0 invert"
          />
        );
      case ContactType.Facebook:
        return (
          <Image
            src="/images/brand-icons/facebook.svg"
            alt="Facebook"
            width={20}
            height={20}
            className="h-5 w-5 brightness-0 invert"
          />
        );
    }
  };

  return (
    <div className="border-border bg-card mb-8 border-2">
      <div className="flex flex-col lg:flex-row lg:items-stretch">
        {/* Image - on top for mobile, on side for desktop */}
        <div className="relative aspect-8/10 w-full shrink-0 lg:w-2/5">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h1 className="text-foreground mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
            {event.title}
          </h1>

          <div className="space-y-4">
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

            {/* Dates */}
            <div>
              <h3 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                {t("event.banner.dates")}
              </h3>
              <p className="text-foreground">
                {formatDate(startDate)}
                {endDate && startDate.toMillis() !== endDate.toMillis() && (
                  <>
                    {" – "}
                    {formatDate(endDate)}
                  </>
                )}
              </p>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                {t("event.banner.location")}
              </h3>
              <p className="text-foreground">{event.location}</p>
            </div>

            {/* Registration Deadline */}
            {!isPastEvent && event.showDeadline && (
              <div>
                <h3 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                  {t("event.banner.registrationDeadline")}
                </h3>
                <p className="text-foreground">
                  {formatDate(registrationDeadline)}
                </p>
                {isRegistrationOpen ? (
                  <p className="text-primary mt-1 text-sm font-medium">
                    {t("event.banner.registrationsOpen")}
                  </p>
                ) : (
                  <p className="text-muted-foreground mt-1 text-sm">
                    {t("event.banner.registrationsClosed")}
                  </p>
                )}
              </div>
            )}

            {/* Contacts */}
            <div>
              <h3 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                {t("event.banner.contacts")}
              </h3>
              <div className="flex flex-col gap-2">
                {allContacts.map((contact, index) => (
                  <Link
                    key={`${contact.type}-${contact.value}-${index}`}
                    href={getContactUrl(contact.type, contact.value)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground flex items-center gap-2"
                  >
                    <span className="shrink-0">
                      {getContactIcon(contact.type)}
                    </span>
                    <span className="after:bg-primary relative text-sm after:absolute after:-bottom-px after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full">
                      {contact.value}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
