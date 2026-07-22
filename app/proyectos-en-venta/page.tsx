import type { Metadata } from "next";
import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { ProyectosPageSectionMapper } from "@/components/sections/ProyectosPageSectionMapper";
import { ProyectosLista } from "@/components/sections/proyectos-en-venta/ProyectosLista";
import type { ProyectosPageSection, Project } from "@/lib/types";

type WordPressProyectosPage = {
  id: number;
  title: { rendered: string };
  acf: {
    sections?: ProyectosPageSection[];
  };
};

function stripHtml(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function getProyectosPage(): Promise<WordPressProyectosPage | null> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    return await wordpress.request<WordPressProyectosPage>(
      "/wp-json/wp/v2/pages/10?_fields=acf,title",
    );
  } catch {
    return null;
  }
}

async function getProjects(): Promise<Project[]> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    const response = await wordpress.collection<Project[]>(
      "/wp-json/wp/v2/proyectos?per_page=100&acf_format=standard&_embed=1",
    );
    return response.data;
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getProyectosPage();
  const title = stripHtml(page?.title?.rendered);

  return {
    title: title ? `${title} | Armando Paredes` : "Proyectos en venta | Armando Paredes",
    description: "Descubre los proyectos en venta de Armando Paredes.",
  };
}

export default async function ProyectosEnVentaPage() {
  const page = await getProyectosPage();
  const proyectos = await getProjects();
  const sections = page?.acf?.sections ?? [];
  const hasProjectList = sections.some((s) => s.acf_fc_layout === "proyectos_lista");

  return (
    <main className="w-full max-w-none p-0">
      <ProyectosPageSectionMapper sections={sections} proyectos={proyectos} />
      {!hasProjectList && <ProyectosLista proyectos={proyectos} />}
    </main>
  );
}
