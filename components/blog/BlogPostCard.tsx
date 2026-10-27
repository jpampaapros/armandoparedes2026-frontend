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
        className="group relative flex w-full flex-col overflow-hidden border border-near-black bg-white text-near-black md:aspect-[1250/561] md:flex-row md:gap-[28px]"
      >
        <div className="w-full p-20 md:w-[46%] md:py-20 md:pl-20 md:pr-0">
          <div className="relative aspect-[16/10] w-full overflow-hidden md:h-full md:aspect-auto">
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
              <span className="absolute left-0 top-0 bg-white px-10 py-6 font-poppins text-14 font-medium text-near-black md:bottom-16 md:left-16 md:top-auto">
                {category}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-16 px-20 pb-20 md:w-[calc(54%-28px)] md:gap-20 md:py-20 md:pl-0 md:pr-24">
          <div className="flex flex-wrap items-center gap-8">
            {date && (
              <span className="bg-slate px-10 py-6 font-poppins text-14 font-normal text-white">
                {date}
              </span>
            )}
          </div>
          <h2
            className="font-gotham text-28 font-bold leading-[1.25] text-[#DDA783] md:text-36 md:leading-[1.5]"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          <div
            className="line-clamp-5 font-poppins text-14 font-normal leading-22 text-near-black md:text-16 md:leading-24"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />
          <span className="mt-auto font-poppins text-15 font-normal not-italic leading-17 text-near-black underline decoration-solid [text-decoration-skip-ink:none] [text-decoration-thickness:auto] [text-underline-offset:auto] [text-underline-position:from-font]">
            Leer más
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex h-full w-full flex-col gap-12 bg-white px-0 py-24 text-near-black md:px-24 md:odd:pl-0 md:even:pr-0 md:py-30"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-border-light md:group-odd:right-12 md:group-even:left-12"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-12 right-0 top-12 hidden w-px bg-border-light md:group-odd:block"
      />
      <div className="relative aspect-[413/240] w-full overflow-hidden">
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
          <span className="absolute left-0 top-0 md:top-32 bg-slate px-16 py-6 font-poppins text-14 font-medium text-white">
            {category}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-8">
        <h3
          className="font-gotham text-22 font-bold leading-28 text-peach md:text-28"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        {date && (
          <span className="font-poppins text-10 font-medium leading-normal text-near-black">
            {date}
          </span>
        )}
        <div
          className="line-clamp-3 font-poppins text-14 font-normal leading-18 text-near-black md:text-10 md:leading-13"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
        <span className="mt-auto font-poppins text-14 font-light not-italic leading-17 md:text-10 md:italic text-near-black underline decoration-solid [text-decoration-skip-ink:none] [text-decoration-thickness:auto] [text-underline-offset:auto] [text-underline-position:from-font]">
          Leer más
        </span>
      </div>
    </Link>
  );
}
