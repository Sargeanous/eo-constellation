import { redirect } from "next/navigation";

// Single-page restructure: legacy route now redirects to the
// mission section anchor on the scrolling home page.
export default function MissionPage() {
  redirect("/#mission");
}
