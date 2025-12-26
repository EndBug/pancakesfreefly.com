import { getTranslations } from "next-intl/server";
import { type EventId } from "~/lib/events";

interface SundaySharingRegistrationFormProps {
  eventId: EventId;
}

export async function SundaySharingRegistrationForm({
  eventId: _eventId,
}: SundaySharingRegistrationFormProps) {
  const t = await getTranslations();

  return (
    <div className="not-prose relative mx-auto mt-12 w-full max-w-2xl rounded-2xl bg-white/5 p-6 backdrop-blur">
      <div
        id="registrationForm"
        className="absolute -top-16 right-0 left-0 sm:-top-23"
      ></div>
      <div className="text-center">
        <h2 className="text-2xl font-semibold">
          {t("event.sundaySharing.registrationForm.title")}
        </h2>
        <p className="mt-4 text-sm">
          {t("event.sundaySharing.registrationForm.closed")}
        </p>
      </div>
    </div>
  );
}
