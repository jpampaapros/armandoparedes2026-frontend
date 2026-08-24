"use client";

import { BlogCategoryFilter } from "./BlogCategoryFilter";
import { BlogPagination } from "./BlogPagination";
import { BlogPostCard } from "./BlogPostCard";
import type { BlogPage as BlogPageData, BlogPageSection, WPCategory, WPPost } from "@/lib/types";

type BlogPageProps = {
  page: BlogPageData | null;
  bannerSection?: BlogPageSection;
  categories: WPCategory[];
  featuredPost: WPPost | null;
  posts: WPPost[];
  currentPage: number;
  totalPages: number;
};

export function BlogPage({
  page,
  bannerSection,
  categories,
  featuredPost,
  posts,
  currentPage,
  totalPages,
}: BlogPageProps) {
  const bannerTitle = bannerSection?.banner_title || page?.title?.rendered || "Blog";
  const bannerDescription = bannerSection?.banner_description || "Ideas, ciudad y proyectos";

  return (
    <main className="w-full bg-white">
      <section className="bg-white">
        <div className="mx-auto max-w-1440 px-16 pt-32 md:px-80 md:pt-50">
          <div className="flex flex-col gap-16 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="font-gotham text-36 font-bold leading-[1.1] text-slate md:text-60">
                {bannerTitle}
              </h1>
              <div
                className="mt-8 font-poppins text-16 font-semibold leading-24 text-near-black md:text-24"
                dangerouslySetInnerHTML={{ __html: bannerDescription }}
              />
            </div>
            <BlogCategoryFilter categories={categories} />
          </div>
        </div>
      </section>

      {featuredPost && (
        <section className="bg-white">
          <div className="mx-auto max-w-1440 px-16 pt-32 md:px-80 md:pt-50">
            <BlogPostCard post={featuredPost} variant="featured" />
          </div>
        </section>
      )}

      <section className="bg-white">
        <div className="mx-auto max-w-1440 px-16 py-32 md:px-80 md:py-50">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-40 text-center font-poppins text-18 text-text-muted">
              No hay entradas disponibles.
            </div>
          )}
        </div>
      </section>

      {totalPages > 1 && (
        <section className="bg-white pb-40 md:pb-80">
          <div className="mx-auto max-w-1440 px-16 md:px-80">
            <BlogPagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        </section>
      )}
    </main>
  );
}
