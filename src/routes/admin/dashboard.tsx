import { createFileRoute } from "@tanstack/react-router";
import AdminDashboard from "@/components/admin/AdminDashboard";

const title = "Admin Dashboard — ResQBD";
const description = "Live operations view of all active incidents, volunteers, and emergency services.";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AdminDashboard,
});