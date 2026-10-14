import type { Metadata } from "next";
import { LegalPage, getLegalPageMetadata } from "@/components/LegalPage";

const PAGE_ID = 17;

export function generateMetadata(): Promise<Metadata> {
  return getLegalPageMetadata(PAGE_ID, "Términos y condiciones");
}

export default function TerminosYCondicionesPage() {
  return <LegalPage id={PAGE_ID} />;
}
