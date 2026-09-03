import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { BlogHeader } from "@/components/sections/blog/BlogHeader";
import { BlogSectionMapper } from "@/components/sections/blog/BlogSectionMapper";
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

  const categories = await wordpress.getBlogCategories();

  return (
    <main className="w-full bg-white">
      <article className="mx-auto min-w-0 w-[calc(382*var(--fx))] overflow-hidden py-40 md:w-[calc(730*var(--fx))] md:py-80">
        <div className="flex flex-col gap-16 md:flex-row md:items-start md:justify-between md:gap-24">
          <BlogHeader post={post} />
          <div className="hidden shrink-0 md:block md:w-326">
            <Suspense fallback={<div className="h-52 w-full rounded-10 border border-border-light bg-white md:w-326" />}>
              <BlogCategoryFilter categories={categories} />
            </Suspense>
          </div>
        </div>
        <div className="mt-32 md:mt-48">
          {post.acf?.sections?.length ? (
            <BlogSectionMapper sections={post.acf.sections} />
          ) : (
            <div
              className="min-w-0 max-w-full font-poppins text-16 font-normal leading-[1.6] text-near-black md:text-18 md:leading-[1.7] [&_p]:m-0 [&_p+p]:mt-16 [&_ul]:mt-16 [&_ul]:list-disc [&_ul]:pl-24 [&_ol]:mt-16 [&_ol]:list-decimal [&_ol]:pl-24 [&_li]:mb-8 [&_strong]:font-semibold [&_em]:italic [&_a]:text-peach [&_a]:underline [&_h2]:mt-32 [&_h2]:text-24 [&_h2]:font-semibold [&_h3]:mt-24 [&_h3]:text-20 [&_h3]:font-semibold [&_img]:mx-auto [&_img]:my-24 [&_img]:block [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-10 [&_figure]:mx-auto [&_figure]:my-24 [&_figure]:max-w-full [&_figure]:overflow-hidden [&_figcaption]:mt-8 [&_figcaption]:text-14 [&_figcaption]:text-near-black/60"
              dangerouslySetInnerHTML={{ __html: post.content?.rendered ?? "" }}
            />
          )}
        </div>
      </article>
    </main>
  );
}
