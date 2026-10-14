import type { Metadata } from "next";
import { LegalPage, getLegalPageMetadata } from "@/components/LegalPage";

const PAGE_ID = 16;

export function generateMetadata(): Promise<Metadata> {
  return getLegalPageMetadata(PAGE_ID, "Política de privacidad");
}

export default function PoliticaDePrivacidadPage() {
  return <LegalPage id={PAGE_ID} />;
}
