import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { BlogSlider, type WPPost } from "@/components/sections/inicio/BlogSlider";
import type { ACFLink } from "@/lib/types";

type BlogProps = {
  titulo?: string;
  boton?: ACFLink;
  variant?: "dark" | "light";
};

async function getLatestPosts(): Promise<WPPost[]> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    const response = await wordpress.collection<WPPost[]>(
      "/wp-json/wp/v2/posts?per_page=3&_embed=1",
    );
    return response.data;
  } catch {
    return [];
  }
}

export async function Blog({ titulo, boton, variant = "dark" }: BlogProps) {
  const posts = await getLatestPosts();
  if (posts.length === 0) return null;

  return <BlogSlider titulo={titulo} boton={boton} posts={posts} variant={variant} />;
}
