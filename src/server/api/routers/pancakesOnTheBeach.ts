import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const formationSchema = z.enum(["2-4", "5-7", "8+"]);
const tShirtSchema = z.enum(["XS", "S", "M", "L", "XL", "XXL"]);

const pancakesOnTheBeachInputSchema = z.object({
  firstName: z.string().min(1).trim(),
  lastName: z.string().min(1).trim(),
  phone: z.string().min(1).trim(),
  email: z.string().min(1).email().trim(),
  jumpsCount: z.number().min(0),
  tunnelHours: z.number().min(0),
  biggestFormationHeadFirst: formationSchema,
  biggestFormationFeetFirst: formationSchema,
  igProfile: z.string().trim(),
  tShirtSize: tShirtSchema,
  rideMilanoToRavenna: z.boolean(),
  rideRavennaToMilano: z.boolean(),
  language: z.enum(["it", "en"]),
});

type GoogleResponse = { status: "OK" } | { status: "Error"; error: string };

async function forwardToGoogleEndpoint(
  data: z.infer<typeof pancakesOnTheBeachInputSchema>,
): Promise<void> {
  const endpoint = env.PANCAKES_ON_THE_BEACH_REGISTRATION_ENDPOINT;
  const url = new URL(endpoint);

  url.searchParams.set("firstName", data.firstName);
  url.searchParams.set("lastName", data.lastName);
  url.searchParams.set("phone", data.phone.replace(/\+/, "00"));
  url.searchParams.set("email", data.email);
  url.searchParams.set("jumpsCount", data.jumpsCount.toString());
  url.searchParams.set("tunnelHours", data.tunnelHours.toString());
  url.searchParams.set(
    "biggestFormationHeadFirst",
    data.biggestFormationHeadFirst,
  );
  url.searchParams.set(
    "biggestFormationFeetFirst",
    data.biggestFormationFeetFirst,
  );
  url.searchParams.set("igProfile", data.igProfile);
  url.searchParams.set("tShirtSize", data.tShirtSize);
  url.searchParams.set(
    "rideMilanoToRavenna",
    data.rideMilanoToRavenna.toString(),
  );
  url.searchParams.set(
    "rideRavennaToMilano",
    data.rideRavennaToMilano.toString(),
  );
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

export const pancakesOnTheBeachRouter = createTRPCRouter({
  submit: publicProcedure
    .input(pancakesOnTheBeachInputSchema)
    .mutation(async ({ input }) => {
      await forwardToGoogleEndpoint(input);
      return {
        success: true,
      };
    }),
});
