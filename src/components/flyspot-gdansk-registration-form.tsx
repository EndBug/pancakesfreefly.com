"use client";

import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { api } from "~/trpc/react";

const CAMP_START = "2026-11-03";
const CAMP_END = "2026-11-07";
const MIN_FLYING_MINUTES = 30;
const MAX_FLYING_MINUTES = 20 * 60;
const DEFAULT_FLYING_MINUTES = 60;

const CREDIT_OPTIONS = [
  "self_purchase",
  "share_with_friends",
  "need_help",
] as const;

type CreditHandling = (typeof CREDIT_OPTIONS)[number];

type FlyspotRegistrationFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  flyingMinutes: number;
  availableFrom: string;
  availableTo: string;
  sharingWithSomeone: boolean | null;
  companionName: string;
  creditHandling: CreditHandling | "";
};

function getFirstErrorMessage(input: unknown): string | undefined {
  if (!input) return undefined;
  if (typeof input === "string") return input;
  if (Array.isArray(input)) {
    const first = input[0];
    return typeof first === "string" ? first : undefined;
  }
  if (typeof input === "object" && input !== null) {
    const [firstKey] = Object.keys(input as Record<string, unknown>);
    if (!firstKey) return undefined;
    const candidate = (input as Record<string, unknown>)[firstKey];
    return typeof candidate === "string" ? candidate : undefined;
  }
  return undefined;
}

function formatFlyingMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

function createFormSchema(t: (key: string) => string) {
  return z
    .object({
      firstName: z
        .string()
        .min(
          1,
          t("event.flyspotGdanskNov26.registrationForm.validation.required"),
        ),
      lastName: z
        .string()
        .min(
          1,
          t("event.flyspotGdanskNov26.registrationForm.validation.required"),
        ),
      email: z
        .string()
        .min(
          1,
          t("event.flyspotGdanskNov26.registrationForm.validation.required"),
        )
        .email(
          t(
            "event.flyspotGdanskNov26.registrationForm.validation.invalidEmail",
          ),
        ),
      phone: z
        .string()
        .min(
          1,
          t("event.flyspotGdanskNov26.registrationForm.validation.required"),
        )
        .refine((val) => {
          const defaultCountry = val.startsWith("+") ? undefined : "IT";
          const parsed = parsePhoneNumberFromString(val, defaultCountry);
          return parsed?.isValid() ?? false;
        }, t("event.flyspotGdanskNov26.registrationForm.validation.invalidPhone")),
      flyingMinutes: z
        .number()
        .int()
        .min(
          MIN_FLYING_MINUTES,
          t("event.flyspotGdanskNov26.registrationForm.validation.minHours"),
        )
        .max(MAX_FLYING_MINUTES),
      availableFrom: z
        .string()
        .min(
          1,
          t("event.flyspotGdanskNov26.registrationForm.validation.required"),
        ),
      availableTo: z
        .string()
        .min(
          1,
          t("event.flyspotGdanskNov26.registrationForm.validation.required"),
        ),
      sharingWithSomeone: z
        .boolean()
        .nullable()
        .refine((val) => val !== null, {
          message: t(
            "event.flyspotGdanskNov26.registrationForm.validation.required",
          ),
        }),
      companionName: z.string(),
      creditHandling: z.enum(CREDIT_OPTIONS, {
        errorMap: () => ({
          message: t(
            "event.flyspotGdanskNov26.registrationForm.validation.required",
          ),
        }),
      }),
    })
    .superRefine((data, ctx) => {
      if (data.availableFrom > data.availableTo) {
        ctx.addIssue({
          code: "custom",
          message: t(
            "event.flyspotGdanskNov26.registrationForm.validation.invalidDateRange",
          ),
          path: ["availableTo"],
        });
      }

      if (data.sharingWithSomeone && !data.companionName.trim()) {
        ctx.addIssue({
          code: "custom",
          message: t(
            "event.flyspotGdanskNov26.registrationForm.validation.required",
          ),
          path: ["companionName"],
        });
      }
    });
}

const defaultValues: FlyspotRegistrationFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  flyingMinutes: DEFAULT_FLYING_MINUTES,
  availableFrom: CAMP_START,
  availableTo: CAMP_END,
  sharingWithSomeone: null,
  companionName: "",
  creditHandling: "",
};

export function FlyspotGdanskRegistrationForm(props: {
  registrationDeadline: string;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const registrationDeadlineMs = useMemo(
    () => Date.parse(props.registrationDeadline),
    [props.registrationDeadline],
  );

  const isRegistrationClosed =
    isClient &&
    Number.isFinite(registrationDeadlineMs) &&
    Date.now() > registrationDeadlineMs;

  const formSchema = createFormSchema(t);
  const submitForm = api.flyspotGdanskNov26.submit.useMutation();

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: ({ value }) => {
        const result = formSchema.safeParse(value);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          for (const issue of result.error.issues) {
            const path = issue.path.join(".");
            fieldErrors[path] ??= issue.message;
          }
          return {
            fields: fieldErrors as Partial<
              Record<keyof FlyspotRegistrationFormValues, string>
            >,
          };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      const validated = formSchema.parse(value);

      let phone = validated.phone;
      if (phone) {
        const defaultCountry = phone.startsWith("+") ? undefined : "IT";
        const parsed = parsePhoneNumberFromString(phone, defaultCountry);
        phone = parsed?.format("E.164") ?? phone;
      }

      const language = locale === "en" ? "en" : "it";
      setSubmitSuccess(false);
      setSubmitError(false);

      try {
        await submitForm.mutateAsync({
          firstName: validated.firstName,
          lastName: validated.lastName,
          phone,
          email: validated.email,
          flyingMinutes: validated.flyingMinutes,
          availableFrom: validated.availableFrom,
          availableTo: validated.availableTo,
          sharingWithSomeone: validated.sharingWithSomeone ?? false,
          companionName: validated.companionName.trim() || undefined,
          creditHandling: validated.creditHandling,
          language,
        });
        setSubmitSuccess(true);
      } catch {
        setSubmitError(true);
      }
    },
  });

  const sharingWithSomeone = useStore(
    form.store,
    (state) => state.values.sharingWithSomeone,
  );

  if (isRegistrationClosed) {
    return (
      <div className="not-prose border-border bg-card relative mx-auto mt-12 w-full max-w-2xl border p-6">
        <div
          id="registrationForm"
          className="absolute -top-16 right-0 left-0 sm:-top-23"
        />
        <div className="text-center">
          <h2 className="text-2xl font-semibold">
            {t("event.flyspotGdanskNov26.registrationForm.title")}
          </h2>
          <p className="mt-4 text-sm">
            {t("event.flyspotGdanskNov26.registrationForm.closed")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="not-prose border-border bg-card relative mx-auto mt-12 w-full max-w-2xl border p-6">
      <div
        id="registrationForm"
        className="absolute -top-16 right-0 left-0 sm:-top-23"
      />
      <h2 className="text-2xl font-semibold">
        {t("event.flyspotGdanskNov26.registrationForm.title")}
      </h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await form.validateAllFields("blur");
          void form.handleSubmit().catch(() => {
            const firstError = document.querySelector('[aria-invalid="true"]');
            if (firstError) {
              firstError.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          });
        }}
        className="mt-6 space-y-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field name="firstName">
            {(field) => {
              const errorMessage = getFirstErrorMessage(
                field.state.meta.errors,
              );
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    {t("event.flyspotGdanskNov26.registrationForm.firstName")}{" "}
                    <span className="text-primary" aria-hidden="true">
                      *
                    </span>
                  </Label>
                  <Input
                    id="firstName"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    autoComplete="given-name"
                    aria-invalid={isInvalid}
                    className="w-full"
                  />
                  {errorMessage && (
                    <p className="text-destructive text-sm">{errorMessage}</p>
                  )}
                </div>
              );
            }}
          </form.Field>

          <form.Field name="lastName">
            {(field) => {
              const errorMessage = getFirstErrorMessage(
                field.state.meta.errors,
              );
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    {t("event.flyspotGdanskNov26.registrationForm.lastName")}{" "}
                    <span className="text-primary" aria-hidden="true">
                      *
                    </span>
                  </Label>
                  <Input
                    id="lastName"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    autoComplete="family-name"
                    aria-invalid={isInvalid}
                    className="w-full"
                  />
                  {errorMessage && (
                    <p className="text-destructive text-sm">{errorMessage}</p>
                  )}
                </div>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="email">
          {(field) => {
            const errorMessage = getFirstErrorMessage(field.state.meta.errors);
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("event.flyspotGdanskNov26.registrationForm.email")}{" "}
                  <span className="text-primary" aria-hidden="true">
                    *
                  </span>
                </Label>
                <Input
                  id="email"
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="email"
                  aria-invalid={isInvalid}
                  className="w-full"
                />
                {errorMessage && (
                  <p className="text-destructive text-sm">{errorMessage}</p>
                )}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="phone">
          {(field) => {
            const errorMessage = getFirstErrorMessage(field.state.meta.errors);
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            return (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  {t("event.flyspotGdanskNov26.registrationForm.phone")}{" "}
                  <span className="text-primary" aria-hidden="true">
                    *
                  </span>
                </Label>
                <Input
                  id="phone"
                  name={field.name}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const allowed = raw.replace(/[^\d+\s]/g, "");
                    const hasPlus = allowed.startsWith("+");
                    const rest = allowed.replace(/^\+?/, "").replace(/\+/g, "");
                    const next = hasPlus ? "+" + rest : rest;
                    field.handleChange(next);
                  }}
                  aria-invalid={isInvalid}
                  className="w-full"
                />
                {errorMessage && (
                  <p className="text-destructive text-sm">{errorMessage}</p>
                )}
              </div>
            );
          }}
        </form.Field>

        <form.Field name="flyingMinutes">
          {(field) => {
            const errorMessage = getFirstErrorMessage(field.state.meta.errors);
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;
            const adjustMinutes = (delta: number) => {
              const next = Math.min(
                MAX_FLYING_MINUTES,
                Math.max(MIN_FLYING_MINUTES, field.state.value + delta),
              );
              field.handleChange(next);
            };

            return (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("event.flyspotGdanskNov26.registrationForm.flyingHours")}{" "}
                  <span className="text-primary" aria-hidden="true">
                    *
                  </span>
                </Label>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustMinutes(-60)}
                    disabled={field.state.value <= MIN_FLYING_MINUTES}
                  >
                    {t("event.flyspotGdanskNov26.registrationForm.hoursMinusOne")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustMinutes(-15)}
                    disabled={field.state.value <= MIN_FLYING_MINUTES}
                  >
                    {t(
                      "event.flyspotGdanskNov26.registrationForm.hoursMinusFifteen",
                    )}
                  </Button>
                  <div
                    className="border-border bg-background flex min-w-24 items-center justify-center border px-4 py-2 text-sm font-medium tabular-nums"
                    aria-live="polite"
                  >
                    {formatFlyingMinutes(field.state.value)}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustMinutes(15)}
                    disabled={field.state.value >= MAX_FLYING_MINUTES}
                  >
                    {t(
                      "event.flyspotGdanskNov26.registrationForm.hoursPlusFifteen",
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustMinutes(60)}
                    disabled={field.state.value >= MAX_FLYING_MINUTES}
                  >
                    {t("event.flyspotGdanskNov26.registrationForm.hoursPlusOne")}
                  </Button>
                </div>
                {errorMessage && (
                  <p className="text-destructive text-sm">{errorMessage}</p>
                )}
                {isInvalid && !errorMessage && (
                  <p className="text-destructive text-sm" aria-hidden="true" />
                )}
              </div>
            );
          }}
        </form.Field>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("event.flyspotGdanskNov26.registrationForm.availableDates")}{" "}
            <span className="text-primary" aria-hidden="true">
              *
            </span>
          </Label>
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="availableFrom">
              {(field) => {
                const errorMessage = getFirstErrorMessage(
                  field.state.meta.errors,
                );
                const isInvalid =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <div className="space-y-2">
                    <Label htmlFor="availableFrom" className="text-sm">
                      {t("event.flyspotGdanskNov26.registrationForm.availableFrom")}
                    </Label>
                    <Input
                      id="availableFrom"
                      name={field.name}
                      type="date"
                      min={CAMP_START}
                      max={CAMP_END}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      className="w-full cursor-pointer"
                    />
                    {errorMessage && (
                      <p className="text-destructive text-sm">{errorMessage}</p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            <form.Field name="availableTo">
              {(field) => {
                const errorMessage = getFirstErrorMessage(
                  field.state.meta.errors,
                );
                const isInvalid =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <div className="space-y-2">
                    <Label htmlFor="availableTo" className="text-sm">
                      {t("event.flyspotGdanskNov26.registrationForm.availableTo")}
                    </Label>
                    <Input
                      id="availableTo"
                      name={field.name}
                      type="date"
                      min={CAMP_START}
                      max={CAMP_END}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      className="w-full cursor-pointer"
                    />
                    {errorMessage && (
                      <p className="text-destructive text-sm">{errorMessage}</p>
                    )}
                  </div>
                );
              }}
            </form.Field>
          </div>
        </div>

        <form.Field name="sharingWithSomeone">
          {(field) => {
            const errorMessage = getFirstErrorMessage(field.state.meta.errors);
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;

            return (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t(
                    "event.flyspotGdanskNov26.registrationForm.sharingWithSomeone",
                  )}{" "}
                  <span className="text-primary" aria-hidden="true">
                    *
                  </span>
                </Label>
                <RadioGroup
                  value={
                    field.state.value === null
                      ? ""
                      : field.state.value
                        ? "true"
                        : "false"
                  }
                  onValueChange={(value) => {
                    field.handleChange(
                      value === "true"
                        ? true
                        : value === "false"
                          ? false
                          : null,
                    );
                  }}
                  className="flex flex-col gap-3"
                  aria-invalid={isInvalid}
                >
                  <div className="hover:bg-muted/30 -mx-2 flex cursor-pointer items-center space-x-2 px-2 py-2 transition-colors">
                    <RadioGroupItem value="true" id="sharing-yes" />
                    <Label
                      htmlFor="sharing-yes"
                      className="cursor-pointer text-sm font-normal"
                    >
                      {t("event.flyspotGdanskNov26.registrationForm.sharingYes")}
                    </Label>
                  </div>
                  <div className="hover:bg-muted/30 -mx-2 flex cursor-pointer items-center space-x-2 px-2 py-2 transition-colors">
                    <RadioGroupItem value="false" id="sharing-no" />
                    <Label
                      htmlFor="sharing-no"
                      className="cursor-pointer text-sm font-normal"
                    >
                      {t("event.flyspotGdanskNov26.registrationForm.sharingNo")}
                    </Label>
                  </div>
                </RadioGroup>
                {errorMessage && (
                  <p className="text-destructive text-sm">{errorMessage}</p>
                )}
              </div>
            );
          }}
        </form.Field>

        {sharingWithSomeone === true && (
          <form.Field name="companionName">
            {(field) => {
              const errorMessage = getFirstErrorMessage(
                field.state.meta.errors,
              );
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <div className="space-y-2">
                  <Label htmlFor="companionName" className="text-sm font-medium">
                    {t(
                      "event.flyspotGdanskNov26.registrationForm.companionName",
                    )}{" "}
                    <span className="text-primary" aria-hidden="true">
                      *
                    </span>
                  </Label>
                  <Input
                    id="companionName"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    className="w-full"
                  />
                  <p className="text-muted-foreground text-sm">
                    {t(
                      "event.flyspotGdanskNov26.registrationForm.companionRemark",
                    )}
                  </p>
                  {errorMessage && (
                    <p className="text-destructive text-sm">{errorMessage}</p>
                  )}
                </div>
              );
            }}
          </form.Field>
        )}

        <form.Field name="creditHandling">
          {(field) => {
            const errorMessage = getFirstErrorMessage(field.state.meta.errors);
            const isInvalid =
              field.state.meta.isTouched && field.state.meta.errors.length > 0;

            return (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("event.flyspotGdanskNov26.registrationForm.creditHandling")}{" "}
                  <span className="text-primary" aria-hidden="true">
                    *
                  </span>
                </Label>
                <RadioGroup
                  value={field.state.value}
                  onValueChange={(value) => {
                    field.handleChange((value ?? "") as CreditHandling | "");
                  }}
                  className="flex flex-col gap-3"
                  aria-invalid={isInvalid}
                >
                  <div className="hover:bg-muted/30 -mx-2 flex cursor-pointer items-start space-x-2 px-2 py-2 transition-colors">
                    <RadioGroupItem
                      value="self_purchase"
                      id="credit-self-purchase"
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="credit-self-purchase"
                      className="cursor-pointer text-sm font-normal"
                    >
                      {t(
                        "event.flyspotGdanskNov26.registrationForm.creditSelfPurchase",
                      )}
                    </Label>
                  </div>
                  <div className="hover:bg-muted/30 -mx-2 flex cursor-pointer items-start space-x-2 px-2 py-2 transition-colors">
                    <RadioGroupItem
                      value="share_with_friends"
                      id="credit-share-friends"
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="credit-share-friends"
                      className="cursor-pointer text-sm font-normal"
                    >
                      {t(
                        "event.flyspotGdanskNov26.registrationForm.creditShareWithFriends",
                      )}
                    </Label>
                  </div>
                  <div className="hover:bg-muted/30 -mx-2 flex cursor-pointer items-start space-x-2 px-2 py-2 transition-colors">
                    <RadioGroupItem
                      value="need_help"
                      id="credit-need-help"
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="credit-need-help"
                      className="cursor-pointer text-sm font-normal"
                    >
                      {t(
                        "event.flyspotGdanskNov26.registrationForm.creditNeedHelp",
                      )}
                    </Label>
                  </div>
                </RadioGroup>
                {errorMessage && (
                  <p className="text-destructive text-sm">{errorMessage}</p>
                )}
              </div>
            );
          }}
        </form.Field>

        <p className="text-muted-foreground text-sm">
          {t("event.flyspotGdanskNov26.registrationForm.disclaimer")}
        </p>

        <div className="pt-2">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="w-full"
                disabled={
                  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                  !canSubmit || isSubmitting || submitForm.isPending
                }
              >
                {isSubmitting || submitForm.isPending
                  ? t("event.flyspotGdanskNov26.registrationForm.submitting")
                  : t("event.flyspotGdanskNov26.registrationForm.submit")}
              </Button>
            )}
          </form.Subscribe>
        </div>

        {submitSuccess && (
          <p className="text-primary text-center text-sm font-medium">
            {t("event.flyspotGdanskNov26.registrationForm.successMessage")}
          </p>
        )}
        {submitError && (
          <p className="text-destructive text-center text-sm font-medium">
            {t("event.flyspotGdanskNov26.registrationForm.errorMessage")}
          </p>
        )}
      </form>
    </div>
  );
}
