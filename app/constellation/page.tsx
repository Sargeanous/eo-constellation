import { redirect } from "next/navigation";

// Single-page restructure: legacy route now redirects to the
// constellation section anchor on the scrolling home page.
export default function ConstellationPage() {
  redirect("/#constellation");
}
