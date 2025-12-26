import { z } from "zod";

export const eventTypeSchema = z.enum(["tunnel", "skydiving"]);

export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.array(eventTypeSchema).min(1),
  date: z.string(), // ISO date string
  endDate: z.string().optional(), // ISO date string
  location: z.string(),
  registrationDeadline: z.string(), // ISO date string
  imageUrl: z
    .string()
    .refine(
      (val) => val.startsWith("/") || z.string().url().safeParse(val).success,
      {
        message: "Image URL must be a local path (starting with /) or a valid URL",
      },
    ),
});

export type EventType = z.infer<typeof eventTypeSchema>;
export type Event = z.infer<typeof eventSchema>;
