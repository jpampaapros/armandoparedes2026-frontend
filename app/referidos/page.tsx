import type { Metadata } from "next";
import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { ReferidosSectionMapper } from "@/components/sections/ReferidosSectionMapper";
import type { ReferidosPageSection } from "@/lib/types";

type WordPressReferidosPage = {
  id: number;
  title: { rendered: string };
  acf: {
    sections?: ReferidosPageSection[];
  };
};

function stripHtml(html?: string): string {
  if (!html) return "";
  return html.replace(/\u003c[^\u003e]+\u003e/g, " ").replace(/\s+/g, " ").trim();
}

async function getReferidosPage(): Promise<WordPressReferidosPage | null> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    const response = await wordpress.collection<WordPressReferidosPage[]>(
      "/wp-json/wp/v2/pages?slug=referidos\u0026acf_format=standard\u0026status=publish",
    );
    return response.data[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getReferidosPage();
  const title = stripHtml(page?.title?.rendered);

  return {
    title: title ? `${title} | Armando Paredes` : "Referidos | Armando Paredes",
    description: "Recomienda a tus amigos y obtén beneficios con Armando Paredes.",
  };
}

export default async function ReferidosPage() {
  const page = await getReferidosPage();
  const sections = page?.acf?.sections ?? [];

  return (
    <main className="w-full max-w-none p-0">
      <ReferidosSectionMapper sections={sections} />
    </main>
  );
}
