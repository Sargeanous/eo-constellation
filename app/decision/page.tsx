import { redirect } from "next/navigation";

// Single-page restructure: legacy route now redirects to the
// decision section anchor on the scrolling home page.
export default function DecisionPage() {
  redirect("/#decision");
}
