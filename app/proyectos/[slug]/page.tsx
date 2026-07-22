import { notFound } from "next/navigation";
import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { ProjectSectionMapper } from "@/components/sections/ProjectSectionMapper";
import { FloatingButtons } from "@/components/FloatingButtons";
import type { Project, ProjectSection } from "@/lib/types";

type ProyectoPageProps = {
  params: Promise<{ slug: string }>;
};

async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    const response = await wordpress.collection<Project[]>(
      `/wp-json/wp/v2/proyectos?slug=${encodeURIComponent(slug)}&acf_format=standard&_embed=1`,
    );
    return response.data[0] ?? null;
  } catch {
    return null;
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

export async function generateMetadata({ params }: ProyectoPageProps) {
  const { slug } = await params;
  const proyecto = await getProjectBySlug(slug);

  return {
    title: proyecto?.title?.rendered ?? "Proyecto",
  };
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

export default async function ProyectoPage({ params }: ProyectoPageProps) {
  const { slug } = await params;
  const proyecto = await getProjectBySlug(slug);

  if (!proyecto) {
    notFound();
  }

  const proyectos = await getProjects();
  const sections = proyecto.acf?.sections ?? [];

  const contactSection = sections.find(
    (s): s is ProjectSection & { acf_fc_layout: "formulario_contacto" } =>
      s.acf_fc_layout === "formulario_contacto",
  );
  const formularioId = contactSection?.formulario_id ?? 4;
  const whatsappNumero = proyecto.acf?.whatsapp_numero;

  return (
    <>
      <main className="w-full max-w-none p-0">
        <ProjectSectionMapper sections={sections} proyectos={proyectos} />
      </main>
      <FloatingButtons whatsapp={whatsappNumero} formId={formularioId} />
    </>
  );
}