import { getPageContent } from "@/app/actions/content";
import { redirect } from "next/navigation";
import LookbookClient from "./LookbookClient";

export const metadata = {
  title: "Lookbook | WWJ — Wildlife Wonder Jewellery",
  description: "Browse the latest Lookbook and product catalog of Wildlife Wonder Jewellery.",
  alternates: {
    canonical: "/lookbook",
  },
};

export default async function LookbookPage() {
  const catalogContent = await getPageContent("shop-catalog");

  let catalogPdfUrl = "";
  if (catalogContent) {
    try {
      const parsed = JSON.parse(catalogContent);
      if (parsed.pdfUrl) {
        catalogPdfUrl = parsed.pdfUrl;
      }
    } catch (e) {
      console.error("Failed to parse catalogContent", e);
    }
  }

  // Redirect to shop if no PDF is uploaded yet
  if (!catalogPdfUrl) {
    redirect("/shop");
  }

  return <LookbookClient catalogPdfUrl={catalogPdfUrl} />;
}
