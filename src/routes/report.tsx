import { createFileRoute } from "@tanstack/react-router";
import Report from "@/pages/Report";

const title = "Report an Emergency — ResQBD";
const description =
  "Report an emergency in under a minute. No account needed — get matched with the nearest available volunteer or emergency service instantly.";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Report,
});