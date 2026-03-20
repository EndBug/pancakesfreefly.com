import type { Metadata } from "next";
import { getHeroPriorityImageUrls } from "~/lib/hero-stream-config";

/**
 * Preload hero LCP images so they are sent with the initial HTML.
 * Hero images live in a client component, so Next/Image priority is applied at runtime
 * and doesn't add preload links in the server-rendered document. This layout runs on the
 * server and injects the preload links into <head> for the home route only.
 */
export const metadata: Metadata = {
  icons: {
    other: getHeroPriorityImageUrls().map((url) => ({
      rel: "preload",
      url,
      fetchPriority: "high",
      // Link preload for images requires as="image"; Next IconDescriptor types don't include it but it's valid and passed through
      as: "image",
    })) as Metadata["icons"] extends { other?: infer O } ? O : never,
  },
};

export default function HomeLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
