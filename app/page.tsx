import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { HomeSectionMapper } from "@/components/sections/HomeSectionMapper";
import type { HomeSection, Project, Delivered } from "@/lib/types";

type WordPressHomePage = {
  id: number;
  title: { rendered: string };
  acf_full: {
    sections?: HomeSection[];
  };
};

async function getHomePage(): Promise<WordPressHomePage | null> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    return await wordpress.request<WordPressHomePage>(
      "/wp-json/wp/v2/pages/9?_fields=acf_full",
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

async function getDelivered(): Promise<Delivered[]> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    const response = await wordpress.collection<Delivered[]>(
      "/wp-json/wp/v2/entregados?per_page=100&acf_format=standard&_embed=1",
    );
    return response.data;
  } catch {
    return [];
  }
}

export default async function Home() {
  const page = await getHomePage();
  const proyectos = await getProjects();
  const entregados = await getDelivered();

  return (
    <main className="w-full max-w-none p-0">
      <HomeSectionMapper
        sections={page?.acf_full?.sections}
        proyectos={proyectos}
        entregados={entregados}
      />
    </main>
  );
}
