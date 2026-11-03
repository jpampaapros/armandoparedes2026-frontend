import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { GraciasSectionMapper } from "@/components/sections/GraciasSectionMapper";
import type { GraciasPageSection, WordPressPage } from "@/lib/types";
import { stripHtml, toArray } from "@/lib/utils";

/** Página WP "Gracias de PostVenta" (solo banner_gracias). */
const POSTVENTA_GRACIAS_PAGE_ID = 4826;

type WordPressGraciasPage = WordPressPage<GraciasPageSection, "acf">;

async function getGraciasPage(): Promise<WordPressGraciasPage | null> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    return await wordpress.request<WordPressGraciasPage>(
      `/wp-json/wp/v2/pages/${POSTVENTA_GRACIAS_PAGE_ID}?_fields=acf,title&acf_format=standard`,
    );
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getGraciasPage();
  const title = stripHtml(page?.title?.rendered);

  return {
    title: title ? `${title} | Armando Paredes` : "Gracias | Armando Paredes",
    description: "Confirmación de tu consulta de postventa.",
  };
}

export default async function PostventaGraciasPage() {
  const page = await getGraciasPage();

  if (!page) {
    notFound();
  }

  const sections = toArray(page.acf?.sections);

  return (
    <main className="w-full max-w-none p-0">
      <GraciasSectionMapper
        sections={sections}
        fallbackHref="/contacto"
        bannerBoton={{
          title: "Ver preguntas frecuentes",
          url: "/contacto?tab=postventa#postventa-faq",
        }}
      />
    </main>
  );
}
