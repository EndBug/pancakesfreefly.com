/**
 * Extract event ID from the pathname
 * Expected format: /locale/events/event-id
 */
export function getEventIdFromPathname(pathname: string): string | null {
  const regex = /\/events\/([^/]+)/;
  const match = regex.exec(pathname);
  return match?.[1] ?? null;
}
