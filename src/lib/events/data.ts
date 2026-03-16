import { ContactType, eventSchema, type Event } from "./types";

// This file contains all event data
// Add new events to this array
export const rawEventsData = [
  {
    id: "fooni-feb24",
    title: "Skill Camp",
    type: ["tunnel"],
    date: "2024-02-06",
    endDate: "2024-02-10",
    location: "Fööni | Helsinki, FI",
    registrationDeadline: "2024-04-22T23:59:59+02:00",
    imageUrl: "/images/events/fooni-feb24.png",
    contacts: [
      { type: ContactType.Instagram, value: "@pier_andrea.ag" },
      { type: ContactType.Instagram, value: "@federico.grandi_" },
    ],
  },
  {
    id: "ag-skill-camp-apr24",
    title: "Human Flight x PanCakes Freefly | Skill Camp",
    type: ["tunnel"],
    date: "2024-04-23",
    endDate: "2024-05-03",
    location: "Aero Gravity | Milano, IT",
    registrationDeadline: "2024-04-22T23:59:59+02:00",
    // Re-using the same image as the September 2024 skill camp, we had no flyer for this one
    imageUrl: "/images/events/ag-skill-camp-sep24.png",
    contacts: [
      { type: ContactType.Instagram, value: "@lucagiovannini_lg" },
      { type: ContactType.Instagram, value: "@pier_andrea.ag" },
      { type: ContactType.Instagram, value: "@federico.grandi_" },
    ],
  },
  {
    id: "ag-skill-camp-sep24",
    title: "Human Flight x PanCakes Freefly | Skill Camp",
    type: ["tunnel"],
    date: "2024-09-16",
    endDate: "2024-09-27",
    location: "Aero Gravity | Milano, IT",
    registrationDeadline: "2024-09-15T23:59:59+02:00",
    imageUrl: "/images/events/ag-skill-camp-sep24.png",
    contacts: [
      { type: ContactType.Instagram, value: "@lucagiovannini_lg" },
      { type: ContactType.Instagram, value: "@pier_andrea.ag" },
      { type: ContactType.Instagram, value: "@federico.grandi_" },
    ],
  },
  {
    id: "ag-skill-camp-feb25",
    title: "Human Flight x PanCakes Freefly | Skill Camp",
    type: ["tunnel"],
    date: "2025-02-18",
    endDate: "2025-02-28",
    location: "Aero Gravity | Milano, IT",
    registrationDeadline: "2025-02-17T23:59:59+02:00",
    imageUrl: "/images/events/ag-skill-camp-feb25.png",
    contacts: [
      { type: ContactType.Instagram, value: "@lucagiovannini_lg" },
      { type: ContactType.Instagram, value: "@pier_andrea.ag" },
      { type: ContactType.Instagram, value: "@federico.grandi_" },
    ],
  },
  {
    id: "ag-skill-camp-oct25",
    title: "Human Flight x PanCakes Freefly | Skill Camp",
    type: ["tunnel"],
    date: "2025-10-13",
    endDate: "2025-10-24",
    location: "Aero Gravity | Milano, IT",
    registrationDeadline: "2025-10-12T23:59:59+02:00",
    imageUrl: "/images/events/ag-skill-camp-oct25.png",
    contacts: [
      { type: ContactType.Instagram, value: "@lucagiovannini_lg" },
      { type: ContactType.Instagram, value: "@pier_andrea.ag" },
      { type: ContactType.Instagram, value: "@federico.grandi_" },
    ],
  },
  {
    id: "sunday-sharing-nov25",
    title: "Sunday Sharing",
    type: ["tunnel"],
    date: "2025-11-30",
    location: "Aero Gravity | Milano, IT",
    registrationDeadline: "2025-11-28T23:59:59+01:00",
    imageUrl: "/images/events/sunday-sharing-nov25.png",
    contacts: [
      { type: ContactType.Instagram, value: "@pier_andrea.ag" },
      { type: ContactType.Instagram, value: "@ferrero_chiara" },
      { type: ContactType.Instagram, value: "@federico.grandi_" },
    ],
  },
  {
    id: "sunday-sharing-dec25",
    title: "Sunday Sharing",
    type: ["tunnel"],
    date: "2025-12-14",
    location: "Aero Gravity | Milano, IT",
    registrationDeadline: "2025-12-12T23:59:59+01:00",
    imageUrl: "/images/events/sunday-sharing-dec25.png",
    contacts: [
      { type: ContactType.Instagram, value: "@pier_andrea.ag" },
      { type: ContactType.Instagram, value: "@ferrero_chiara" },
      { type: ContactType.Instagram, value: "@federico.grandi_" },
    ],
  },
  {
    id: "sunday-sharing-jan26",
    title: "Sunday Sharing",
    type: ["tunnel"],
    date: "2026-01-25",
    location: "Aero Gravity | Milano, IT",
    registrationDeadline: "2026-01-23T23:59:59+01:00",
    imageUrl: "/images/events/sunday-sharing-jan26.png",
    contacts: [
      { type: ContactType.Instagram, value: "@pier_andrea.ag" },
      { type: ContactType.Instagram, value: "@ferrero_chiara" },
      { type: ContactType.Instagram, value: "@federico.grandi_" },
    ],
  },
  {
    id: "sunday-sharing-feb26",
    title: "Sunday Sharing",
    type: ["tunnel"],
    date: "2026-02-15",
    location: "Aero Gravity | Milano, IT",
    registrationDeadline: "2026-02-13T23:59:59+01:00",
    imageUrl: "/images/events/sunday-sharing-feb26.png",
    contacts: [
      { type: ContactType.Instagram, value: "@pier_andrea.ag" },
      { type: ContactType.Instagram, value: "@ferrero_chiara" },
      { type: ContactType.Instagram, value: "@federico.grandi_" },
    ],
  },
  {
    id: "ag-skill-camp-mar26",
    title: "Human Flight x PanCakes Freefly | Skill Camp",
    type: ["tunnel"],
    date: "2026-03-02",
    endDate: "2026-03-13",
    location: "Aero Gravity | Milano, IT",
    registrationDeadline: "2026-03-01T23:59:59+01:00",
    imageUrl: "/images/events/ag-skill-camp-mar26.png",
    contacts: [
      { type: ContactType.Instagram, value: "@lucagiovannini_lg" },
      { type: ContactType.Instagram, value: "@pier_andrea.ag" },
      { type: ContactType.Instagram, value: "@federico.grandi_" },
    ],
  },
  {
    id: "pancakes-on-the-beach-jul26",
    title: "PanCakes on the Beach",
    type: ["skydiving"],
    date: "2026-07-03",
    endDate: "2026-07-06",
    location: "Aero Gravity, Milano, IT → Skydive Pull Out, Ravenna, IT",
    registrationDeadline: "2026-06-01T23:59:59+02:00",
    imageUrl: "/images/events/pancakes-on-the-beach-jul26.png",
    showDeadline: true,
    contacts: [{ type: ContactType.Instagram, value: "@pier_andrea.ag" }],
  },
] as const satisfies Event[];

export const eventsData = rawEventsData as Event[];

// Validate all events at module load time
eventsData.forEach((event, index) => {
  try {
    eventSchema.parse(event);
  } catch (error) {
    throw new Error(
      `Invalid event data at index ${index}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
});
