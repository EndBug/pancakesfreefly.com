import { eventsData } from "./data";

export { eventsData } from "./data";
export {
  eventSchema,
  eventTypeSchema,
  type Event,
  type EventType,
} from "./types";

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
