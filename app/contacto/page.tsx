import type { Metadata } from "next";
import { ContactoSectionMapper } from "@/components/sections/ContactoSectionMapper";
import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import type { ContactoPageFields, ContactoPageSection, Delivered, Project } from "@/lib/types";
import { stripHtml, toArray } from "@/lib/utils";

/** Las páginas de gracias también son posts de `proyectos`; no son proyectos elegibles. */
const GRACIAS_TEMPLATE = "page-templates/template-proyectos-interna-gracias.php";

type ContactoPage = {
  title: { rendered: string };
  acf?: ContactoPageFields;
  acf_full?: ContactoPageFields;
};

async function getData() {
  try {
    const wordpress = createWordPressRestClient({ cache: { revalidate: 3600, tags: ["wordpress-content"] } });
    const [pageResponse, projectsResponse, deliveredResponse] = await Promise.all([
      wordpress.collection<ContactoPage[]>("/wp-json/wp/v2/pages?slug=contacto&acf_format=standard&status=publish"),
      wordpress.collection<Project[]>("/wp-json/wp/v2/proyectos?per_page=100&acf_format=standard&_embed=1"),
      wordpress.collection<Delivered[]>("/wp-json/wp/v2/entregados?per_page=100&_fields=id,slug,title").catch(() => ({ data: [] as Delivered[] })),
    ]);
    return { page: pageResponse.data[0] ?? null, projects: projectsResponse.data.filter((p) => p.template !== GRACIAS_TEMPLATE), delivered: deliveredResponse.data };
  } catch {
    return { page: null, projects: [] as Project[], delivered: [] as Delivered[] };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getData();
  const title = stripHtml(page?.title.rendered);
  return { title: title ? `${title} | Armando Paredes` : "Contacto | Armando Paredes", description: "Contáctanos y conoce los proyectos de Armando Paredes." };
}

export default async function ContactoPage() {
  const { page, projects, delivered } = await getData();
  // `acf_full` llega como `{ sections: [] }` en esta página y taparía a `acf`; se combinan
  // para no perder `secciones`. ACF devuelve `[]` (no un objeto) cuando no hay campos.
  const acf = Array.isArray(page?.acf) ? {} : page?.acf;
  const { secciones, ...formulario }: ContactoPageFields = { ...acf, ...page?.acf_full, secciones: page?.acf_full?.secciones ?? acf?.secciones };
  // Sin secciones cargadas en ACF se muestra el bloque de formulario con sus textos por defecto.
  const sections = toArray(secciones);
  const contenido: ContactoPageSection[] = sections.length ? sections : [{ acf_fc_layout: "formulario" }];
  return (
    <main className="w-full max-w-none p-0">
      <h1 className="sr-only">{stripHtml(page?.title.rendered) || "Contacto"}</h1>
      <ContactoSectionMapper sections={contenido} formulario={formulario} proyectos={projects} entregados={delivered} />
    </main>
  );
}
