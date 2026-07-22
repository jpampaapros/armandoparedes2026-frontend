import type { Metadata } from "next";
import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { EntregadosPageSectionMapper } from "@/components/sections/EntregadosPageSectionMapper";
import { ProyectosEntregados } from "@/components/sections/entregados/ProyectosEntregados";
import type { EntregadosPageSection, Delivered } from "@/lib/types";

type WordPressEntregadosPage = {
  id: number;
  title: { rendered: string };
  acf: {
    sections?: EntregadosPageSection[];
  };
};

function stripHtml(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^\u003e]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function getEntregadosPage(): Promise<WordPressEntregadosPage | null> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    return await wordpress.request<WordPressEntregadosPage>(
      "/wp-json/wp/v2/pages/11?acf_format=standard&_fields=acf,title"
    );
  } catch {
    return null;
  }
}

async function getDelivered(): Promise<Delivered[]> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    const response = await wordpress.collection<Delivered[]>(
      "/wp-json/wp/v2/entregados?per_page=100&acf_format=standard&_embed=1"
    );
    return response.data;
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getEntregadosPage();
  const title = stripHtml(page?.title?.rendered);

  return {
    title: title
      ? `${title} | Armando Paredes`
      : "Proyectos entregados | Armando Paredes",
  };
}

export default async function ProyectosEntregadosPage() {
  const page = await getEntregadosPage();
  const entregados = await getDelivered();
  const sections = page?.acf?.sections ?? [];
  const hasProyectosEntregados = sections.some(
    (s) => s.acf_fc_layout === "proyectos_entregados"
  );

  return (
    <main className="w-full max-w-none p-0">
      <EntregadosPageSectionMapper
        sections={sections}
        entregados={entregados}
      />
      {!hasProyectosEntregados && (
        <ProyectosEntregados entregados={entregados} />
      )}
    </main>
  );
}
