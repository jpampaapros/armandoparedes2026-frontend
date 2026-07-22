import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { BlogHeader } from "@/components/sections/blog/BlogHeader";
import { BlogSectionMapper } from "@/components/sections/blog/BlogSectionMapper";
import { EncuentraArmandoSection } from "@/components/sections/blog/EncuentraArmandoSection";
import { BlogCategoryFilter } from "@/components/blog/BlogCategoryFilter";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

const wordpress = createWordPressRestClient({
  cache: { revalidate: 3600, tags: ["wordpress-content"] },
});

export async function generateStaticParams() {
  const posts = await wordpress.getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

function stripHtml(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await wordpress.getBlogPostBySlug(slug);
  const title = post?.title?.rendered;
  return {
    title: title ? `${stripHtml(title)} | Blog | Armando Paredes` : "Blog | Armando Paredes",
    description: stripHtml(post?.excerpt?.rendered).slice(0, 160) || undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await wordpress.getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [options, categories] = await Promise.all([
    wordpress.getBlogOptions(),
    wordpress.getBlogCategories(),
  ]);

  return (
    <main className="w-full bg-white">
      <article className="mx-auto max-w-382 px-16 py-40 md:max-w-730 md:py-80">
        <div className="flex flex-col gap-16 md:flex-row md:items-start md:justify-between md:gap-24">
          <BlogHeader post={post} />
          <div className="hidden shrink-0 md:block md:w-326">
            <Suspense fallback={<div className="h-52 w-full rounded-10 border border-border-light bg-white md:w-326" />}>
              <BlogCategoryFilter categories={categories} />
            </Suspense>
          </div>
        </div>
        <div className="mt-32 md:mt-48">
          <BlogSectionMapper sections={post.acf?.sections ?? []} />
        </div>
      </article>
      <EncuentraArmandoSection options={options} />
    </main>
  );
}
