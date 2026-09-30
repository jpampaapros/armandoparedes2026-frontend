import { notFound } from "next/navigation";
import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { ProjectSectionMapper } from "@/components/sections/ProjectSectionMapper";
import { FloatingButtons } from "@/components/FloatingButtons";
import type { Project } from "@/lib/types";
import { stripHtml, toArray } from "@/lib/utils";
import type { LeadContext } from "@/lib/lead";

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
  const sections = toArray(proyecto.acf?.sections);

  const whatsappNumero = proyecto.acf?.whatsapp_numero;

  // Grupo "Cotizador" de ACF: identificadores de Sperant y página de gracias.
  const cotizador = proyecto.acf?.cotizador;
  const paginaGracias =
    cotizador?.pagina_de_gracias && typeof cotizador.pagina_de_gracias === "object"
      ? cotizador.pagina_de_gracias.post_name
      : undefined;

  const lead: LeadContext = {
    projectId: cotizador?.api_project_related,
    inputChannelId: cotizador?.api_input_channel_ids,
    sourceId: cotizador?.api_source_id,
    interestTypeId: cotizador?.api_nivel_id,
    redirectTo: paginaGracias ? `/proyectos/${paginaGracias}` : undefined,
    formSource: `Proyecto ${stripHtml(proyecto.title?.rendered) || slug}`,
  };

  const presupuestos = toArray(cotizador?.valores_de_presupuesto)
    .map((item) => item.valor)
    .filter((valor): valor is string => Boolean(valor));

  return (
    <>
      <main className="w-full max-w-none p-0">
        <ProjectSectionMapper
          sections={sections}
          proyectos={proyectos}
          lead={lead}
          presupuestos={presupuestos}
        />
      </main>
      <FloatingButtons whatsapp={whatsappNumero} />
    </>
  );
}