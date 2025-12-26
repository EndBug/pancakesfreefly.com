import { eventSchema, type Event } from "./types";

// This file contains all event data
// Add new events to this array
export const eventsData: Event[] = [
  {
    id: "ag-skill-camp-oct25",
    title: "Human Flight x PanCakes Freefly | Skill Camp",
    type: ["tunnel"],
    date: "2025-10-13",
    endDate: "2025-10-24",
    location: "Aero Gravity",
    registrationDeadline: "2025-10-12T23:59:59+02:00",
    imageUrl: "/images/events/ag-skill-camp-oct25.png",
  },
  {
    id: "sunday-sharing-nov25",
    title: "Sunday Sharing",
    type: ["tunnel"],
    date: "2025-11-30",
    location: "Aero Gravity",
    registrationDeadline: "2025-11-28T23:59:59+01:00",
    imageUrl: "/images/events/sunday-sharing-nov25.png",
  },
  {
    id: "sunday-sharing-dec25",
    title: "Sunday Sharing",
    type: ["tunnel"],
    date: "2025-12-14",
    location: "Aero Gravity",
    registrationDeadline: "2025-12-12T23:59:59+01:00",
    imageUrl: "/images/events/sunday-sharing-dec25.png",
  },
  {
    id: "ag-skill-camp-mar26",
    title: "Human Flight x PanCakes Freefly | Skill Camp",
    type: ["tunnel"],
    date: "2026-03-02",
    endDate: "2026-03-13",
    location: "Aero Gravity",
    registrationDeadline: "2026-03-01T23:59:59+01:00",
    imageUrl: "/images/events/ag-skill-camp-mar26.png",
  },
];

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
