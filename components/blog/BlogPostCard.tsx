import Image from "next/image";
import Link from "next/link";
import type { WPPost } from "@/lib/types";

export type BlogPostCardProps = {
  post: WPPost;
  variant?: "default" | "featured";
};

export function formatBlogDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getBlogCategory(post: WPPost): string | undefined {
  return post._embedded?.["wp:term"]
    ?.flat()
    .find((t) => t.taxonomy === "category")?.name;
}

export function getBlogImage(post: WPPost) {
  return post._embedded?.["wp:featuredmedia"]?.[0];
}

export function BlogPostCard({ post, variant = "default" }: BlogPostCardProps) {
  const image = getBlogImage(post);
  const category = getBlogCategory(post);
  const date = formatBlogDate(post.date);

  if (variant === "featured") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group relative flex w-full flex-col overflow-hidden bg-card-dark md:aspect-[1250/561] md:flex-row"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-auto md:w-[46%]">
          {image?.source_url ? (
            <Image
              src={image.source_url}
              alt={image.alt_text || post.title.rendered}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 46vw"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-light-gray">
              <span className="text-14 text-text-muted">Sin imagen</span>
            </div>
          )}
          {category && (
            <span className="absolute bottom-16 left-16 bg-white px-10 py-6 font-poppins text-14 font-medium text-near-black">
              {category}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-16 p-16 md:w-[54%] md:gap-24 md:p-24">
          <div className="flex flex-wrap items-center gap-8">
            {date && (
              <span className="bg-slate px-10 py-6 font-poppins text-14 font-normal text-white">
                {date}
              </span>
            )}
          </div>
          <h2
            className="font-gotham text-24 font-bold leading-30 text-white md:text-36 md:leading-42"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          <div
            className="line-clamp-3 font-poppins text-16 font-normal leading-24 text-white md:text-20"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />
          <span className="mt-auto font-poppins text-14 font-light italic leading-24 text-white">
            Armando Paredes
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full w-full flex-col gap-16 bg-white p-12 pb-16 text-near-black"
    >
      <div className="relative aspect-[280/200] w-full overflow-hidden">
        {image?.source_url ? (
          <Image
            src={image.source_url}
            alt={image.alt_text || post.title.rendered}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-light-gray">
            <span className="text-14 text-text-muted">Sin imagen</span>
          </div>
        )}
        {category && (
          <span className="absolute bottom-12 left-0 bg-slate px-10 py-6 font-poppins text-14 font-medium text-white">
            {category}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center gap-8">
          {date && (
            <span className="font-poppins text-10 font-light italic leading-13 text-near-black">
              {date}
            </span>
          )}
        </div>
        <h3
          className="font-gotham text-22 font-bold leading-28 text-peach md:text-28"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <div
          className="line-clamp-3 font-poppins text-14 font-normal leading-18 text-near-black md:text-10 md:leading-13"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
        <span className="mt-auto font-poppins text-14 font-normal leading-24 underline text-near-black">
          Leer más
        </span>
      </div>
    </Link>
  );
}
