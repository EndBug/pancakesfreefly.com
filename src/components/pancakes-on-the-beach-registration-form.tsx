"use client";

import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const FORMATION_OPTIONS = ["2-4", "5-7", "8+"] as const;
const TSHIRT_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

type FormationSize = (typeof FORMATION_OPTIONS)[number];
type TShirtSize = (typeof TSHIRT_OPTIONS)[number];

type PancakesRegistrationFormValues = {
  requirementsAccepted: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  jumpsCount: number;
  tunnelHours: number;
  biggestFormationHeadFirst: FormationSize | "";
  biggestFormationFeetFirst: FormationSize | "";
  igProfile: string;
  tShirtSize: TShirtSize | "";
  rideMilanoToRavenna: boolean;
  rideRavennaToMilano: boolean;
};

function getFirstErrorMessage(input: unknown): string | undefined {
  if (!input) return undefined;
  if (typeof input === "string") return input;
  if (Array.isArray(input)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

function createFormSchema(t: (key: string) => string) {
  return z.object({
    requirementsAccepted: z.literal(true, {
      errorMap: () => ({
        message: t(
          "event.pancakesOnTheBeachJul26.registrationForm.validation.required",
        ),
      }),
    }),
    firstName: z
      .string()
      .min(
        1,
        t("event.pancakesOnTheBeachJul26.registrationForm.validation.required"),
      ),
    lastName: z
      .string()
      .min(
        1,
        t("event.pancakesOnTheBeachJul26.registrationForm.validation.required"),
      ),
    phone: z
      .string()
      .min(
        1,
        t("event.pancakesOnTheBeachJul26.registrationForm.validation.required"),
      )
      .refine(
        (val) => {
          const defaultCountry = val.startsWith("+") ? undefined : "IT";
          const parsed = parsePhoneNumberFromString(val, defaultCountry);
          return parsed?.isValid() ?? false;
        },
        t("event.pancakesOnTheBeachJul26.registrationForm.validation.invalidPhone"),
      ),
    email: z
      .string()
      .min(
        1,
        t("event.pancakesOnTheBeachJul26.registrationForm.validation.required"),
      )
      .email(
        t(
          "event.pancakesOnTheBeachJul26.registrationForm.validation.invalidEmail",
        ),
      ),
    jumpsCount: z
      .number()
      .min(
        0,
        t("event.pancakesOnTheBeachJul26.registrationForm.validation.minValue"),
      ),
    tunnelHours: z
      .number()
      .min(
        0,
        t("event.pancakesOnTheBeachJul26.registrationForm.validation.minValue"),
      ),
    biggestFormationHeadFirst: z.enum(FORMATION_OPTIONS, {
      errorMap: () => ({
        message: t(
          "event.pancakesOnTheBeachJul26.registrationForm.validation.required",
        ),
      }),
    }),
    biggestFormationFeetFirst: z.enum(FORMATION_OPTIONS, {
      errorMap: () => ({
        message: t(
          "event.pancakesOnTheBeachJul26.registrationForm.validation.required",
        ),
      }),
    }),
    igProfile: z.string(),
    tShirtSize: z.enum(TSHIRT_OPTIONS, {
      errorMap: () => ({
        message: t(
          "event.pancakesOnTheBeachJul26.registrationForm.validation.required",
        ),
      }),
    }),
    rideMilanoToRavenna: z.boolean(),
    rideRavennaToMilano: z.boolean(),
  });
}

const defaultValues: PancakesRegistrationFormValues = {
  requirementsAccepted: false,
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  jumpsCount: 0,
  tunnelHours: 0,
  biggestFormationHeadFirst: "",
  biggestFormationFeetFirst: "",
  igProfile: "",
  tShirtSize: "",
  rideMilanoToRavenna: false,
  rideRavennaToMilano: false,
};

export function PancakesOnTheBeachRegistrationForm(props: {
  registrationDeadline: string;
}) {
  const t = useTranslations();
  const [submitSuccess, setSubmitSuccess] = useState(false);
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
              Record<keyof PancakesRegistrationFormValues, string>
            >,
          };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      let phone = value.phone;
      if (phone) {
        const defaultCountry = phone.startsWith("+") ? undefined : "IT";
        const parsed = parsePhoneNumberFromString(phone, defaultCountry);
        phone = parsed?.format("E.164") ?? phone;
      }
      const payload = { ...value, phone };
      console.log(">>>", payload);
      setSubmitSuccess(true);
    },
  });

  const requirementsAccepted = useStore(
    form.store,
    (state) => state.values.requirementsAccepted === true,
  );

  if (isRegistrationClosed) return null;

  return (
    <div className="not-prose border-border bg-card relative mx-auto mt-12 w-full max-w-2xl border p-6">
      <div
        id="registrationForm"
        className="absolute -top-16 right-0 left-0 sm:-top-23"
      />
      <h2 className="text-2xl font-semibold">{t("event.pancakesOnTheBeachJul26.registrationForm.title")}</h2>

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
        {/* Question 1: Requirements + checkbox — always visible */}
        <div className="space-y-3">
          <p className="text-sm font-medium">
            {t("event.pancakesOnTheBeachJul26.registrationForm.requirementsQuestion")}
          </p>
          <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
            <li>{t("event.pancakesOnTheBeachJul26.registrationForm.requirementsBullet1")}</li>
            <li>
              {t("event.pancakesOnTheBeachJul26.registrationForm.requirementsBullet2")}
              <ul className="list-inside list-disc pl-4">
                <li>
                  {t(
                    "event.pancakesOnTheBeachJul26.registrationForm.requirementsBullet2Sub1",
                  )}
                </li>
                <li>
                  {t(
                    "event.pancakesOnTheBeachJul26.registrationForm.requirementsBullet2Sub2",
                  )}
                </li>
                <li>
                  {t(
                    "event.pancakesOnTheBeachJul26.registrationForm.requirementsBullet2Sub3",
                  )}
                </li>
              </ul>
            </li>
            <li>
              {t("event.pancakesOnTheBeachJul26.registrationForm.requirementsBullet3")}
              <ul className="list-inside list-disc pl-4">
                <li>
                  {t(
                    "event.pancakesOnTheBeachJul26.registrationForm.requirementsBullet3Sub1",
                  )}
                </li>
                <li>
                  {t(
                    "event.pancakesOnTheBeachJul26.registrationForm.requirementsBullet3Sub2",
                  )}
                </li>
                <li>
                  {t(
                    "event.pancakesOnTheBeachJul26.registrationForm.requirementsBullet3Sub3",
                  )}
                </li>
              </ul>
            </li>
            <li>{t("event.pancakesOnTheBeachJul26.registrationForm.requirementsBullet4")}</li>
          </ul>
          <form.Field name="requirementsAccepted">
            {(field) => {
              const errorMessage = getFirstErrorMessage(
                field.state.meta.errors,
              );
              const isInvalid =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;
              return (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="requirementsAccepted"
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked === true)
                      }
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    <Label
                      htmlFor="requirementsAccepted"
                      className="cursor-pointer text-sm font-medium"
                    >
                      {t("event.pancakesOnTheBeachJul26.registrationForm.requirementsCheckboxLabel")}
                    </Label>
                  </div>
                  {errorMessage && (
                    <p className="text-destructive text-sm">{errorMessage}</p>
                  )}
                </div>
              );
            }}
          </form.Field>
        </div>

        {/* Rest of form — only visible when requirements are accepted */}
        {requirementsAccepted && (
          <div className="border-border space-y-5 border-t pt-6">
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
                      <Label
                        htmlFor="firstName"
                        className="text-sm font-medium"
                      >
                        {t("event.pancakesOnTheBeachJul26.registrationForm.firstName")}{" "}
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
                        <p className="text-destructive text-sm">
                          {errorMessage}
                        </p>
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
                        {t("event.pancakesOnTheBeachJul26.registrationForm.lastName")}{" "}
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
                        <p className="text-destructive text-sm">
                          {errorMessage}
                        </p>
                      )}
                    </div>
                  );
                }}
              </form.Field>
            </div>

            <form.Field name="phone">
              {(field) => {
                const errorMessage = getFirstErrorMessage(
                  field.state.meta.errors,
                );
                const isInvalid =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      {t("event.pancakesOnTheBeachJul26.registrationForm.phone")}{" "}
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

            <form.Field name="email">
              {(field) => {
                const errorMessage = getFirstErrorMessage(
                  field.state.meta.errors,
                );
                const isInvalid =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      {t("event.pancakesOnTheBeachJul26.registrationForm.email")}{" "}
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

            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="jumpsCount">
                {(field) => {
                  const errorMessage = getFirstErrorMessage(
                    field.state.meta.errors,
                  );
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <div className="space-y-2">
                      <Label
                        htmlFor="jumpsCount"
                        className="text-sm font-medium"
                      >
                        {t("event.pancakesOnTheBeachJul26.registrationForm.jumpsCount")}{" "}
                        <span className="text-primary" aria-hidden="true">
                          *
                        </span>
                      </Label>
                      <Input
                        id="jumpsCount"
                        name={field.name}
                        type="number"
                        min={0}
                        step={1}
                        value={
                          field.state.value === 0
                            ? ""
                            : String(field.state.value)
                        }
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") field.handleChange(0);
                          else {
                            const n = Number.parseInt(v, 10);
                            if (!Number.isNaN(n)) field.handleChange(n);
                          }
                        }}
                        aria-invalid={isInvalid}
                        className="w-full"
                      />
                      {errorMessage && (
                        <p className="text-destructive text-sm">
                          {errorMessage}
                        </p>
                      )}
                    </div>
                  );
                }}
              </form.Field>
              <form.Field name="tunnelHours">
                {(field) => {
                  const errorMessage = getFirstErrorMessage(
                    field.state.meta.errors,
                  );
                  const isInvalid =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0;
                  return (
                    <div className="space-y-2">
                      <Label
                        htmlFor="tunnelHours"
                        className="text-sm font-medium"
                      >
                        {t("event.pancakesOnTheBeachJul26.registrationForm.tunnelHours")}{" "}
                        <span className="text-primary" aria-hidden="true">
                          *
                        </span>
                      </Label>
                      <Input
                        id="tunnelHours"
                        name={field.name}
                        type="number"
                        min={0}
                        step={0.5}
                        value={
                          field.state.value === 0
                            ? ""
                            : String(field.state.value)
                        }
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v === "") field.handleChange(0);
                          else {
                            const n = Number.parseFloat(v);
                            if (!Number.isNaN(n)) field.handleChange(n);
                          }
                        }}
                        aria-invalid={isInvalid}
                        className="w-full"
                      />
                      {errorMessage && (
                        <p className="text-destructive text-sm">
                          {errorMessage}
                        </p>
                      )}
                    </div>
                  );
                }}
              </form.Field>
            </div>

            <form.Field name="biggestFormationHeadFirst">
              {(field) => {
                const errorMessage = getFirstErrorMessage(
                  field.state.meta.errors,
                );
                const isInvalid =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <div className="space-y-2">
                    <Label
                      htmlFor="biggestFormationHeadFirst"
                      className="text-sm font-medium"
                    >
                      {t("event.pancakesOnTheBeachJul26.registrationForm.biggestFormationHeadFirst")}{" "}
                      <span className="text-primary" aria-hidden="true">
                        *
                      </span>
                    </Label>
                    <Select
                      value={
                        field.state.value === "" ? null : field.state.value
                      }
                      onValueChange={(v) => field.handleChange(v ?? "")}
                    >
                      <SelectTrigger
                        id="biggestFormationHeadFirst"
                        className="w-full"
                        aria-invalid={isInvalid}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FORMATION_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errorMessage && (
                      <p className="text-destructive text-sm">{errorMessage}</p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            <form.Field name="biggestFormationFeetFirst">
              {(field) => {
                const errorMessage = getFirstErrorMessage(
                  field.state.meta.errors,
                );
                const isInvalid =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <div className="space-y-2">
                    <Label
                      htmlFor="biggestFormationFeetFirst"
                      className="text-sm font-medium"
                    >
                      {t("event.pancakesOnTheBeachJul26.registrationForm.biggestFormationFeetFirst")}{" "}
                      <span className="text-primary" aria-hidden="true">
                        *
                      </span>
                    </Label>
                    <Select
                      value={
                        field.state.value === "" ? null : field.state.value
                      }
                      onValueChange={(v) => field.handleChange(v ?? "")}
                    >
                      <SelectTrigger
                        id="biggestFormationFeetFirst"
                        className="w-full"
                        aria-invalid={isInvalid}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FORMATION_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errorMessage && (
                      <p className="text-destructive text-sm">{errorMessage}</p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            <form.Field name="igProfile">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="igProfile" className="text-sm font-medium">
                    {t("event.pancakesOnTheBeachJul26.registrationForm.igProfile")}
                  </Label>
                  <Input
                    id="igProfile"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="tShirtSize">
              {(field) => {
                const errorMessage = getFirstErrorMessage(
                  field.state.meta.errors,
                );
                const isInvalid =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0;
                return (
                  <div className="space-y-2">
                    <Label htmlFor="tShirtSize" className="text-sm font-medium">
                      {t("event.pancakesOnTheBeachJul26.registrationForm.tShirtSize")}{" "}
                      <span className="text-primary" aria-hidden="true">
                        *
                      </span>
                    </Label>
                    <Select
                      value={
                        field.state.value === "" ? null : field.state.value
                      }
                      onValueChange={(v) => field.handleChange(v ?? "")}
                    >
                      <SelectTrigger
                        id="tShirtSize"
                        className="w-full"
                        aria-invalid={isInvalid}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TSHIRT_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {t(`event.pancakesOnTheBeachJul26.registrationForm.tShirt${opt}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errorMessage && (
                      <p className="text-destructive text-sm">{errorMessage}</p>
                    )}
                  </div>
                );
              }}
            </form.Field>

            <div className="space-y-3">
              <p className="text-sm font-medium">
                {t("event.pancakesOnTheBeachJul26.registrationForm.rideQuestion")}
              </p>
              <div className="flex flex-col gap-2">
                <form.Field name="rideMilanoToRavenna">
                  {(field) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="rideMilanoToRavenna"
                        checked={field.state.value}
                        onCheckedChange={(checked) =>
                          field.handleChange(checked === true)
                        }
                        onBlur={field.handleBlur}
                      />
                      <Label
                        htmlFor="rideMilanoToRavenna"
                        className="cursor-pointer text-sm font-normal"
                      >
                        {t("event.pancakesOnTheBeachJul26.registrationForm.rideMilanoToRavenna")}
                      </Label>
                    </div>
                  )}
                </form.Field>
                <form.Field name="rideRavennaToMilano">
                  {(field) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="rideRavennaToMilano"
                        checked={field.state.value}
                        onCheckedChange={(checked) =>
                          field.handleChange(checked === true)
                        }
                        onBlur={field.handleBlur}
                      />
                      <Label
                        htmlFor="rideRavennaToMilano"
                        className="cursor-pointer text-sm font-normal"
                      >
                        {t("event.pancakesOnTheBeachJul26.registrationForm.rideRavennaToMilano")}
                      </Label>
                    </div>
                  )}
                </form.Field>
              </div>
            </div>

            <div className="pt-2">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting
                      ? t("event.pancakesOnTheBeachJul26.registrationForm.submitting")
                      : t("event.pancakesOnTheBeachJul26.registrationForm.submit")}
                  </Button>
                )}
              </form.Subscribe>
            </div>

            {submitSuccess && (
              <p className="text-primary text-center text-sm font-medium">
                {t("event.pancakesOnTheBeachJul26.registrationForm.successMessage")}
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
