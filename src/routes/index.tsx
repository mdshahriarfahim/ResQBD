import { createFileRoute } from "@tanstack/react-router";
import Home from "@/pages/Home";

const title = "ResQBD — Smart Emergency Response Network";
const description =
  "Report emergencies instantly and get matched with the nearest available volunteer or emergency service in Bangladesh — transparently and fast.";

export const Route = createFileRoute("/")({
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
  component: Home,
});
