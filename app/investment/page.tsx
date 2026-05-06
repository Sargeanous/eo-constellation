import { redirect } from "next/navigation";

// Single-page restructure: legacy route now redirects to the
// investment section anchor on the scrolling home page.
export default function InvestmentPage() {
  redirect("/#investment");
}
