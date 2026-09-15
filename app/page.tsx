import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { HomeSectionMapper } from "@/components/sections/HomeSectionMapper";
import { HomeIntro } from "@/components/HomeIntro";
import { getHeaderData } from "@/components/Header";
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

async function getIntroLogo() {
  try {
    const header = await getHeaderData();
    return header.logo?.url ? header.logo : null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const page = await getHomePage();
  const proyectos = await getProjects();
  const entregados = await getDelivered();
  const introLogo = await getIntroLogo();
  const sections = page?.acf_full?.sections ?? [];
  const hasBanner = sections.some((section) => section.acf_fc_layout === "banner" && section.titulo?.trim());
  const content = (
    <HomeSectionMapper
      sections={sections}
      proyectos={proyectos}
      entregados={entregados}
    />
  );

  return (
    <main className="w-full max-w-none p-0">
      {introLogo?.url && hasBanner ? (
        <HomeIntro src={introLogo.url} width={introLogo.width} height={introLogo.height}>
          {content}
        </HomeIntro>
      ) : content}
    </main>
  );
}
