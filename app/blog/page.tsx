import type { Metadata } from "next";
import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { BlogPage } from "@/components/blog/BlogPage";
import type { BlogPage as BlogPageData, BlogPageSection, WPCategory, WPPost } from "@/lib/types";


type BlogRouteProps = {
  searchParams: Promise<{ categoria?: string; pagina?: string }>;
};

const POSTS_PER_PAGE = 9;

function stripHtml(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function getBannerBlogSection(page: BlogPageData | null): BlogPageSection | undefined {
  return page?.acf_full?.sections?.find((s) => s.acf_fc_layout === "banner_blog");
}

function getFeaturedPostId(
  featured?: { ID?: number; id?: number; post_title?: string; post_type?: string },
): number | undefined {
  if (!featured) return undefined;
  if (typeof featured === "number") return featured;
  return featured.ID ?? featured.id;
}

async function getBlogPage(): Promise<BlogPageData | null> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    const response = await wordpress.collection<BlogPageData[]>(
      `/wp-json/wp/v2/pages?slug=blog&acf_format=standard&status=publish&_fields=acf_full,title`,
    );
    return response.data[0] ?? null;
  } catch {
    return null;
  }
}

async function getCategories(): Promise<WPCategory[]> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    const response = await wordpress.collection<WPCategory[]>(
      "/wp-json/wp/v2/categories?per_page=100&hide_empty=true",
    );
    return response.data;
  } catch {
    return [];
  }
}

async function getPosts({
  page,
  categoryId,
  exclude,
}: {
  page: number;
  categoryId?: number;
  exclude?: number;
}): Promise<{ posts: WPPost[]; totalPages: number }> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    const params = new URLSearchParams();
    params.set("per_page", String(POSTS_PER_PAGE));
    params.set("page", String(page));
    params.set("_embed", "1");
    if (categoryId) params.set("categories", String(categoryId));
    if (exclude) params.set("exclude", String(exclude));
    const response = await wordpress.collection<WPPost[]>(
      `/wp-json/wp/v2/posts?${params.toString()}`,
    );
    return { posts: response.data, totalPages: response.totalPages };
  } catch {
    return { posts: [], totalPages: 1 };
  }
}

async function getPostById(id: number): Promise<WPPost | null> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    return await wordpress.request<WPPost>(
      `/wp-json/wp/v2/posts/${id}?_embed=1`,
    );
  } catch {
    return null;
  }
}

async function getStickyPost(categoryId?: number): Promise<WPPost | null> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    const params = new URLSearchParams({
      sticky: "true",
      per_page: "1",
      orderby: "date",
      order: "desc",
      _embed: "1",
    });
    if (categoryId) params.set("categories", String(categoryId));

    const response = await wordpress.collection<WPPost[]>(
      `/wp-json/wp/v2/posts?${params.toString()}`,
    );
    return response.data[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getBlogPage();
  const banner = getBannerBlogSection(page);
  const title = stripHtml(page?.title?.rendered);
  return {
    title: title ? `${title} | Armando Paredes` : "Blog | Armando Paredes",
    description: stripHtml(banner?.banner_description) || "Noticias y artículos de Armando Paredes.",
  };
}

export default async function BlogRoute({ searchParams }: BlogRouteProps) {
  const { categoria, pagina } = await searchParams;
  const page = await getBlogPage();
  const categories = await getCategories();
  const bannerSection = getBannerBlogSection(page);
  const selectedCategory = categories.find((c) => c.slug === categoria);
  const currentPage = Math.max(1, Number(pagina) || 1);
  const configuredFeaturedPostId = getFeaturedPostId(bannerSection?.featured_post);
  const stickyPost = await getStickyPost(selectedCategory?.id);
  const configuredFeaturedPost = configuredFeaturedPostId
    ? await getPostById(configuredFeaturedPostId)
    : null;
  const featuredPost = stickyPost ?? configuredFeaturedPost;
  const featuredPostId = featuredPost?.id;
  const { posts, totalPages } = await getPosts({
    page: currentPage,
    categoryId: selectedCategory?.id,
    exclude: featuredPostId,
  });

  return (
    <BlogPage
      page={page}
      bannerSection={bannerSection}
      categories={categories}
      featuredPost={currentPage === 1 ? featuredPost : null}
      posts={posts}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
