import type { BlogOptions, BlogPost, WPCategory } from "./types";

export type WordPressCacheOptions = {
  revalidate?: number | false;
  tags?: string[];
  dynamic?: boolean;
};

export type WordPressCollection<T> = {
  data: T;
  total: number;
  totalPages: number;
};

type FetchInit = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

export function resolveWordPressBaseUrl(value = process.env.WORDPRESS_API_URL): string {
  const baseUrl = value?.trim().replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error("WORDPRESS_API_URL must be configured for server-side REST requests.");
  }

  return baseUrl;
}

export function createWordPressRestClient(options: {
  baseUrl?: string;
  cache?: WordPressCacheOptions;
  fetchImpl?: typeof fetch;
}) {
  const baseUrl = resolveWordPressBaseUrl(options.baseUrl);
  const fetchImpl = options.fetchImpl ?? fetch;

  function getFetchInit(cache: WordPressCacheOptions = {}): FetchInit {
    if (cache.dynamic) {
      return { cache: "no-store", headers: { Accept: "application/json" } };
    }

    return {
      headers: { Accept: "application/json" },
      next: {
        revalidate: cache.revalidate ?? options.cache?.revalidate,
        tags: cache.tags ?? options.cache?.tags,
      },
    };
  }

  async function request<T>(path: string, cache?: WordPressCacheOptions): Promise<T> {
    const response = await fetchImpl(new URL(`${baseUrl}${path}`), getFetchInit(cache));

    if (!response.ok) {
      throw new Error(`WordPress REST request failed (${response.status}) for ${path}.`);
    }

    return response.json() as Promise<T>;
  }

  async function collection<T>(path: string, cache?: WordPressCacheOptions): Promise<WordPressCollection<T>> {
    const response = await fetchImpl(new URL(`${baseUrl}${path}`), getFetchInit(cache));

    if (!response.ok) {
      throw new Error(`WordPress REST request failed (${response.status}) for ${path}.`);
    }

    return {
      data: (await response.json()) as T,
      total: Number(response.headers.get("X-WP-Total") ?? "0"),
      totalPages: Math.max(Number(response.headers.get("X-WP-TotalPages") ?? "1"), 1),
    };
  }

  return {
    request,
    collection,
    async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
      try {
        const response = await collection<BlogPost[]>(
          `/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&acf_format=standard&_embed=1`,
        );
        return response.data[0] ?? null;
      } catch {
        return null;
      }
    },
    async getBlogPosts(): Promise<BlogPost[]> {
      try {
        const response = await collection<BlogPost[]>(
          "/wp-json/wp/v2/posts?per_page=100&_fields=slug&status=publish",
        );
        return response.data;
      } catch {
        return [];
      }
    },
    async getBlogOptions(): Promise<BlogOptions | null> {
      try {
        return await request<BlogOptions>("/wp-json/armando-paredes/v1/options/blog");
      } catch {
        return null;
      }
    },
    async getBlogCategories(): Promise<WPCategory[]> {
      try {
        const response = await collection<WPCategory[]>(
          "/wp-json/wp/v2/categories?per_page=100&hide_empty=true",
        );
        return response.data;
      } catch {
        return [];
      }
    },
  };
}
