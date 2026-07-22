import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { GraciasSectionMapper } from "@/components/sections/GraciasSectionMapper";
import { FloatingContactButton } from "@/components/sections/gracias/FloatingContactButton";
import type { GraciasPageSection, Project } from "@/lib/types";

type GraciasPageProps = {
  params: Promise<{ slug: string }>;
};

type WordPressGraciasPage = {
  id: number;
  title: { rendered: string };
  acf: {
    sections?: GraciasPageSection[];
  };
};

function stripHtml(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function getGraciasPage(): Promise<WordPressGraciasPage | null> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    return await wordpress.request<WordPressGraciasPage>(
      "/wp-json/wp/v2/pages/18?_fields=acf,title&acf_format=standard",
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

async function getAllProjectSlugs(): Promise<string[]> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    const response = await wordpress.collection<Project[]>(
      "/wp-json/wp/v2/proyectos?per_page=100&_fields=slug&status=publish",
    );
    return response.data.map((p) => p.slug);
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GraciasPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getGraciasPage();
  const title = stripHtml(page?.title?.rendered);

  return {
    title: title ? `${title} | Armando Paredes` : "Gracias | Armando Paredes",
    description: `Confirmación de contacto${slug ? ` sobre el proyecto` : ""}.`,
  };
}

export default async function GraciasPage({ params }: GraciasPageProps) {
  const { slug } = await params;
  const page = await getGraciasPage();

  if (!page) {
    notFound();
  }

  const proyectos = await getProjects();
  const sections = page.acf?.sections ?? [];

  return (
    <>
      <main className="w-full max-w-none p-0">
        <GraciasSectionMapper sections={sections} proyectos={proyectos} proyectoSlug={slug} />
      </main>
      <FloatingContactButton />
    </>
  );
}
