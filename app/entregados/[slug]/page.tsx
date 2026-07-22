import { notFound } from "next/navigation";
import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { EntregadosSingleSectionMapper } from "@/components/sections/EntregadosSingleSectionMapper";
import type { Delivered, EntregadosSingleSection, Project } from "@/lib/types";

type EntregadoPageProps = {
  params: Promise<{ slug: string }>;
};

async function getDeliveredBySlug(slug: string): Promise<Delivered | null> {
  try {
    const entregados = await getDelivered();
    return entregados.find((d) => d.slug === slug) ?? null;
  } catch {
    return null;
  }
}

async function getAllDeliveredSlugs(): Promise<string[]> {
  try {
    const entregados = await getDelivered();
    return entregados.map((d) => d.slug);
  } catch {
    return [];
  }
}

async function getDelivered(): Promise<Delivered[]> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    const response = await wordpress.collection<Delivered[]>(
      "/wp-json/wp/v2/entregados?per_page=100\u0026acf_format=standard\u0026_embed=1",
    );
    return response.data;
  } catch {
    return [];
  }
}

async function getProjects(): Promise<Project[]> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    const response = await wordpress.collection<Project[]>(
      "/wp-json/wp/v2/proyectos?per_page=100\u0026acf_format=standard\u0026_embed=1",
    );
    return response.data;
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const slugs = await getAllDeliveredSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: EntregadoPageProps) {
  const { slug } = await params;
  const entregado = await getDeliveredBySlug(slug);

  return {
    title: entregado?.title?.rendered
      ? `${entregado.title.rendered} | Armando Paredes`
      : "Proyecto entregado | Armando Paredes",
  };
}

function featuredImageToAcfImage(delivered: Delivered) {
  const media = delivered._embedded?.["wp:featuredmedia"]?.[0];
  if (!media?.source_url) return undefined;
  return {
    url: media.source_url,
    alt: media.alt_text || delivered.title.rendered,
    width: media.media_details?.width,
    height: media.media_details?.height,
  };
}

function buildDefaultSections(
  delivered: Delivered,
): EntregadosSingleSection[] {
  const image = featuredImageToAcfImage(delivered);
  const sections: EntregadosSingleSection[] = [
    {
      acf_fc_layout: "banner",
      titulo: delivered.title.rendered,
      descripcion: "",
      imagen: image,
    },
    {
      acf_fc_layout: "galeria",
      imagenes: image ? [image] : [],
    },
    {
      acf_fc_layout: "detalle",
      imagen: image,
      direccion: delivered.acf?.distrito,
      pisos: "",
      area: "",
      dormitorios: "",
      fecha: delivered.acf?.ano,
    },
  ];

  return sections;
}

export default async function EntregadoPage({ params }: EntregadoPageProps) {
  const { slug } = await params;
  const entregado = await getDeliveredBySlug(slug);

  if (!entregado) {
    notFound();
  }

  const [entregados, proyectos] = await Promise.all([
    getDelivered(),
    getProjects(),
  ]);

  const sections =
    Array.isArray(entregado.acf?.sections) && entregado.acf.sections.length > 0
      ? entregado.acf.sections
      : buildDefaultSections(entregado);

  return (
    <main className="w-full max-w-none p-0">
      <EntregadosSingleSectionMapper
        current={entregado}
        entregados={entregados}
        sections={sections}
        proyectos={proyectos}
      />
    </main>
  );
}
