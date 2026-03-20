import { eventsData, type rawEventsData } from "./data";

export { eventsData } from "./data";
export {
  ContactType,
  contactItemSchema,
  eventSchema,
  eventTypeSchema,
  type ContactItem,
  type Event,
  type EventType,
} from "./types";
export { getEventIdFromPathname } from "./utils";

/**
 * Type-safe event ID extracted from events data
 */
export type EventId = (typeof rawEventsData)[number]["id"];

/**
 * Get all events
 */
export function getAllEvents() {
  return eventsData;
}

/**
 * Get a single event by ID
 */
export function getEventById(id: string) {
  return eventsData.find((event) => event.id === id);
}

/**
 * Get events by type
 */
export function getEventsByType(type: "tunnel" | "skydiving") {
  return eventsData.filter((event) => event.type.includes(type));
}
