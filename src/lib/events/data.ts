import { eventSchema, type Event } from "./types";

// This file contains all event data
// Add new events to this array
export const eventsData: Event[] = [
  {
    id: "ag-skill-camp-mar26",
    title: "Human Flight x PanCakes Freefly | Skill Camp",
    type: ["tunnel"],
    date: "2026-03-02T09:00:00Z",
    endDate: "2026-03-13T18:00:00Z",
    location: "Aero Gravity",
    registrationDeadline: "2026-02-20T23:59:59Z",
    imageUrl: "/images/events/ag-skill-camp-mar26.png",
  },
  {
    id: "ag-skill-camp-mar262",
    title: "Human Flight x PanCakes Freefly | Skill Camp",
    type: ["tunnel"],
    date: "2026-03-02T09:00:00Z",
    endDate: "2026-03-13T18:00:00Z",
    location: "Aero Gravity",
    registrationDeadline: "2026-02-20T23:59:59Z",
    imageUrl: "/images/events/ag-skill-camp-mar26.png",
  },
  {
    id: "example-tunnel-event",
    title: "Tunnel Training Session",
    type: ["tunnel"],
    date: "2024-06-15T10:00:00Z",
    endDate: "2024-06-15T18:00:00Z",
    location: "Wind Tunnel Facility, Location",
    registrationDeadline: "2024-06-10T23:59:59Z",
    imageUrl: "https://example.com/images/tunnel-event.jpg",
  },
  {
    id: "example-skydiving-event",
    title: "Skydiving Competition",
    type: ["skydiving"],
    date: "2024-07-20T08:00:00Z",
    location: "Drop Zone, Location",
    registrationDeadline: "2024-07-15T23:59:59Z",
    imageUrl: "https://example.com/images/skydiving-event.jpg",
  },
  {
    id: "example-combined-event",
    title: "Tunnel & Skydiving Workshop",
    type: ["tunnel", "skydiving"],
    date: "2024-08-10T09:00:00Z",
    endDate: "2024-08-12T17:00:00Z",
    location: "Training Facility, Location",
    registrationDeadline: "2024-08-05T23:59:59Z",
    imageUrl: "https://example.com/images/combined-event.jpg",
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
