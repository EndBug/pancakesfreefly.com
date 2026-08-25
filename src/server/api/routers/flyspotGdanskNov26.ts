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
    flyingMinutes: z.number().int().min(60).max(20 * 60),
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

  // #region agent log
  fetch("http://127.0.0.1:7896/ingest/4eef14c4-5abb-4d7f-a8fc-9d8997a5fcb5", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "d484d2",
    },
    body: JSON.stringify({
      sessionId: "d484d2",
      runId: "pre-fix",
      hypothesisId: "A",
      location: "flyspotGdanskNov26.ts:forwardToGoogleEndpoint:beforeFetch",
      message: "Google endpoint URL shape before POST",
      data: {
        host: url.host,
        hasWorkspacePrefix: url.pathname.includes("/a/macros/"),
        pathnamePrefix: url.pathname.slice(0, 48),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {
    /* ignore debug ingest failures */
  });
  // #endregion

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
  } catch (error) {
    // #region agent log
    fetch("http://127.0.0.1:7896/ingest/4eef14c4-5abb-4d7f-a8fc-9d8997a5fcb5", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "d484d2",
      },
      body: JSON.stringify({
        sessionId: "d484d2",
        runId: "pre-fix",
        hypothesisId: "D",
        location: "flyspotGdanskNov26.ts:forwardToGoogleEndpoint:fetchThrow",
        message: "fetch threw before HTTP response",
        data: {
          errorName: error instanceof Error ? error.name : "unknown",
          errorMessage: error instanceof Error ? error.message : String(error),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {
      /* ignore debug ingest failures */
    });
    // #endregion
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to reach Google endpoint",
    });
  }

  let bodyPreview = "";
  try {
    bodyPreview = (await response.clone().text()).slice(0, 400);
  } catch {
    bodyPreview = "";
  }

  let finalUrl: URL | null = null;
  try {
    finalUrl = new URL(response.url);
  } catch {
    finalUrl = null;
  }

  // #region agent log
  fetch("http://127.0.0.1:7896/ingest/4eef14c4-5abb-4d7f-a8fc-9d8997a5fcb5", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "d484d2",
    },
    body: JSON.stringify({
      sessionId: "d484d2",
      runId: "pre-fix",
      hypothesisId: "B",
      location: "flyspotGdanskNov26.ts:forwardToGoogleEndpoint:afterFetch",
      message: "Google endpoint HTTP response",
      data: {
        status: response.status,
        ok: response.ok,
        redirected: response.redirected,
        finalHost: finalUrl?.host ?? null,
        finalHasWorkspacePrefix:
          finalUrl?.pathname.includes("/a/macros/") ?? null,
        finalPathnamePrefix: finalUrl?.pathname.slice(0, 64) ?? null,
        contentType: response.headers.get("content-type"),
        wwwAuthenticate: response.headers.get("www-authenticate"),
        location: response.headers.get("location"),
        bodyLooksLikeHtml: bodyPreview.trimStart().startsWith("<"),
        bodyLooksLikeLogin:
          /accounts\.google|Sign in|ServiceLogin|signin/i.test(bodyPreview),
        bodyPreview,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {
    /* ignore debug ingest failures */
  });
  // #endregion

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
