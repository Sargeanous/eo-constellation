import { redirect } from "next/navigation";

// Single-page restructure: legacy route now redirects to the
// problem section anchor on the scrolling home page.
export default function ProblemPage() {
  redirect("/#problem");
}
