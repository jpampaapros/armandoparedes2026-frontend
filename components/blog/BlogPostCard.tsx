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
  const author = post._embedded?.author?.[0]?.name || "Armando Paredes";

  if (variant === "featured") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group relative flex w-full flex-col overflow-hidden bg-card-dark p-[calc(16*var(--fx))] md:aspect-[1250/561] md:flex-row md:gap-[55px] md:p-0"
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
            <span className="absolute left-0 top-[calc(16*var(--fx))] bg-white px-10 py-6 font-poppins text-14 font-medium text-near-black md:bottom-16 md:left-16 md:top-auto">
              {category}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-[calc(16*var(--fx))] px-0 pb-[calc(30*var(--fx))] pt-[calc(22*var(--fx))] md:w-[calc(54%-55px)] md:gap-24 md:py-24 md:pl-0 md:pr-24">
          <div className="mb-0 flex flex-wrap items-center gap-8 md:mb-[50px]">
            {date && (
              <span className="bg-slate px-10 py-6 font-poppins text-14 font-normal text-white">
                {date}
              </span>
            )}
          </div>
          <h2
            className="font-gotham text-[calc(28*var(--fx))] font-bold leading-[1.25] text-white md:text-36 md:leading-42"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          <span className="font-poppins text-14 font-light italic leading-24 text-white">
            {author}
          </span>
          <div
            className="line-clamp-3 font-poppins text-16 font-normal leading-24 text-white md:text-20"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />
          <span className="mt-auto font-poppins text-[calc(14*var(--fx))] font-light not-italic leading-[calc(17.409*var(--fx))] text-white underline decoration-solid md:text-[calc(9.152*var(--fx))] md:italic [text-decoration-skip-ink:none] [text-decoration-thickness:auto] [text-underline-offset:auto] [text-underline-position:from-font]">
            Leer más
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex h-full w-full flex-col gap-12 border-b border-border-light bg-white px-0 py-24 text-near-black md:border-b-0 md:px-24 md:py-30 md:after:pointer-events-none md:after:absolute md:after:bottom-0 md:after:h-px md:after:bg-border-light md:after:content-[''] md:[&:nth-child(odd)]:before:pointer-events-none md:[&:nth-child(odd)]:before:absolute md:[&:nth-child(odd)]:before:bottom-12 md:[&:nth-child(odd)]:before:right-0 md:[&:nth-child(odd)]:before:top-12 md:[&:nth-child(odd)]:before:w-px md:[&:nth-child(odd)]:before:bg-border-light md:[&:nth-child(odd)]:before:content-[''] md:[&:nth-child(odd)]:after:left-0 md:[&:nth-child(odd)]:after:right-12 md:[&:nth-child(even)]:after:left-12 md:[&:nth-child(even)]:after:right-0"
    >
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
          <span className="absolute left-0 top-32 bg-slate px-16 py-6 font-poppins text-14 font-medium text-white">
            {category}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-8">
        <h3
          className="font-gotham text-22 font-bold leading-28 text-peach md:text-28"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <div className="flex flex-wrap items-center gap-4 font-poppins text-[calc(10.155*var(--fx))] font-medium leading-normal text-near-black">
          <span className="italic">{author}</span>
          {date && <span className="not-italic">| {date}</span>}
        </div>
        <div
          className="line-clamp-3 font-poppins text-14 font-normal leading-18 text-near-black md:text-10 md:leading-13"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
        <span className="mt-auto font-poppins text-[calc(9.152*var(--fx))] font-light italic leading-[calc(17.409*var(--fx))] text-near-black underline decoration-solid [text-decoration-skip-ink:none] [text-decoration-thickness:auto] [text-underline-offset:auto] [text-underline-position:from-font]">
          Leer más
        </span>
      </div>
    </Link>
  );
}
