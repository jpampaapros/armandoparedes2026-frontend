import type { Metadata } from "next";
import { ContactoForm } from "@/components/forms/ContactoForm";
import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import type { ContactoPageFields, Project } from "@/lib/types";
import { stripHtml } from "@/lib/utils";

type ContactoPage = {
  title: { rendered: string };
  acf?: ContactoPageFields;
  acf_full?: ContactoPageFields;
};

async function getData() {
  try {
    const wordpress = createWordPressRestClient({ cache: { revalidate: 3600, tags: ["wordpress-content"] } });
    const [pageResponse, projectsResponse] = await Promise.all([
      wordpress.collection<ContactoPage[]>("/wp-json/wp/v2/pages?slug=contacto&acf_format=standard&status=publish"),
      wordpress.collection<Project[]>("/wp-json/wp/v2/proyectos?per_page=100&acf_format=standard&_embed=1"),
    ]);
    return { page: pageResponse.data[0] ?? null, projects: projectsResponse.data };
  } catch {
    return { page: null, projects: [] as Project[] };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getData();
  const title = stripHtml(page?.title.rendered);
  return { title: title ? `${title} | Armando Paredes` : "Contacto | Armando Paredes", description: "Contáctanos y conoce los proyectos de Armando Paredes." };
}

export default async function ContactoPage() {
  const { page, projects } = await getData();
  const fields = page?.acf_full ?? page?.acf ?? {};
  return <main className="w-full max-w-none p-0"><ContactoForm {...fields} proyectos={projects} /></main>;
}
