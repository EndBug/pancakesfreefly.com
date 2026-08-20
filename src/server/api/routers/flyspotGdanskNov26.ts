import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const creditHandlingSchema = z.enum([
  "self_purchase",
  "share_with_friends",
  "need_help",
]);

const flyspotGdanskInputSchema = z
  .object({
    firstName: z.string().min(1).trim(),
    lastName: z.string().min(1).trim(),
    email: z.string().min(1).email().trim(),
    phone: z.string().min(1).trim(),
    flyingMinutes: z.number().int().min(30).max(20 * 60),
    availableFrom: z.string().min(1),
    availableTo: z.string().min(1),
    sharingWithSomeone: z.boolean(),
    companionName: z.string().trim().optional(),
    creditHandling: creditHandlingSchema,
    language: z.enum(["it", "en"]),
  })
  .refine(
    (data) => {
      if (data.sharingWithSomeone) {
        return (data.companionName?.trim().length ?? 0) > 0;
      }
      return true;
    },
    {
      message: "Companion name is required when sharing with someone",
      path: ["companionName"],
    },
  )
  .refine((data) => data.availableFrom <= data.availableTo, {
    message: "End date must be on or after start date",
    path: ["availableTo"],
  });

type GoogleResponse = { status: "OK" } | { status: "Error"; error: string };

async function forwardToGoogleEndpoint(
  data: z.infer<typeof flyspotGdanskInputSchema>,
): Promise<void> {
  const endpoint = env.FLYSPOT_GDANSK_NOV26_REGISTRATION_ENDPOINT;
  const url = new URL(endpoint);

  url.searchParams.set("firstName", data.firstName);
  url.searchParams.set("lastName", data.lastName);
  url.searchParams.set("phone", data.phone.replace(/\+/, "00"));
  url.searchParams.set("email", data.email);
  url.searchParams.set("flyingMinutes", data.flyingMinutes.toString());
  url.searchParams.set("availableFrom", data.availableFrom);
  url.searchParams.set("availableTo", data.availableTo);
  url.searchParams.set(
    "sharingWithSomeone",
    data.sharingWithSomeone.toString(),
  );
  url.searchParams.set("companionName", data.companionName ?? "");
  url.searchParams.set("creditHandling", data.creditHandling);
  url.searchParams.set("language", data.language);

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "User-Agent": "PanCakes-Registration-Service/1.0",
      },
      signal: AbortSignal.timeout(20000),
      cache: "no-store",
    });
  } catch {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to reach Google endpoint",
    });
  }

  if (!response.ok) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Google endpoint HTTP error: ${response.status}`,
    });
  }

  let parsed: unknown;
  try {
    parsed = (await response.json()) as unknown;
  } catch {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Google endpoint returned invalid JSON",
    });
  }

  const parsedResponse = parsed as GoogleResponse;
  if (
    !parsedResponse ||
    typeof parsedResponse !== "object" ||
    !("status" in parsedResponse)
  ) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Google endpoint returned an unexpected response",
    });
  }

  if (parsedResponse.status === "Error") {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: parsedResponse.error || "Google endpoint returned an error",
    });
  }
}

export const flyspotGdanskNov26Router = createTRPCRouter({
  submit: publicProcedure
    .input(flyspotGdanskInputSchema)
    .mutation(async ({ input }) => {
      await forwardToGoogleEndpoint(input);
      return {
        success: true,
      };
    }),
});
