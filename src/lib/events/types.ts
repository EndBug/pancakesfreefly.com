import { z } from "zod";

export const eventTypeSchema = z.enum(["tunnel", "skydiving"]);

export enum ContactType {
  Email = "email",
  Phone = "phone",
  WhatsApp = "whatsapp",
  Instagram = "instagram",
  Facebook = "facebook",
}

// Validate contact value depending on the ContactType
const emailValueSchema = z.string().email();
const phoneLikeSchema = z.string().regex(/^[+]?[\d\s().-]{5,}$/);
const instagramHandleOrUrlSchema = z.string().refine(
  (val) => {
    // Accepts full URLs or handles like "@user" or "user"
    try {
      // valid URL
      new URL(val);
      return true;
    } catch {
      // fallback to handle validation
      return /^@?[\w.]{1,30}$/.test(val);
    }
  },
  {
    message: "Invalid Instagram URL or handle",
  },
);
const facebookUrlSchema = z.string().refine(
  (val) => {
    try {
      const url = new URL(val);
      return url.hostname.includes("facebook.com");
    } catch {
      return false;
    }
  },
  {
    message: "Invalid Facebook URL",
  },
);

export const contactItemSchema = z
  .object({
    type: z.nativeEnum(ContactType),
    value: z.string(),
  })
  .superRefine((data, ctx) => {
    switch (data.type) {
      case ContactType.Email: {
        const res = emailValueSchema.safeParse(data.value);
        if (!res.success)
          ctx.addIssue({
            code: "custom",
            message: res.error.issues[0]?.message ?? "Invalid email",
          });
        return;
      }
      case ContactType.Phone: {
        const res = phoneLikeSchema.safeParse(data.value);
        if (!res.success)
          ctx.addIssue({
            code: "custom",
            message: "Invalid phone number",
          });
        return;
      }
      case ContactType.WhatsApp: {
        const res = phoneLikeSchema.safeParse(data.value);
        if (!res.success)
          ctx.addIssue({
            code: "custom",
            message: "Invalid WhatsApp number",
          });
        return;
      }
      case ContactType.Instagram: {
        const res = instagramHandleOrUrlSchema.safeParse(data.value);
        if (!res.success)
          ctx.addIssue({
            code: "custom",
            message: res.error.issues[0]?.message ?? "Invalid Instagram",
          });
        return;
      }
      case ContactType.Facebook: {
        const res = facebookUrlSchema.safeParse(data.value);
        if (!res.success)
          ctx.addIssue({
            code: "custom",
            message: res.error.issues[0]?.message ?? "Invalid Facebook URL",
          });
        return;
      }
    }
  });

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
        message:
          "Image URL must be a local path (starting with /) or a valid URL",
      },
    ),
  showDeadline: z.boolean().optional(),
  contacts: z.array(contactItemSchema).optional(),
});

export type EventType = z.infer<typeof eventTypeSchema>;
export type Event = z.infer<typeof eventSchema>;
export type ContactItem = z.infer<typeof contactItemSchema>;
