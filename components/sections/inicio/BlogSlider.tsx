"use client";

import Image from "next/image";
import Link from "next/link";
import { resolveWordPressUrl } from "@/lib/urls";
import { EmblaSlider } from "@/components/EmblaSlider";
import { SmartLink } from "@/components/SmartLink";
import type { ACFLink } from "@/lib/types";

export type WPPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  date: string;
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: {
      source_url: string;
      alt_text?: string;
      media_details?: { width?: number; height?: number };
    }[];
    "wp:term"?: { taxonomy: string; name: string }[][];
    author?: { name?: string }[];
  };
};

type BlogSliderVariant = "dark" | "light";

type BlogSliderProps = {
  titulo?: string;
  boton?: ACFLink;
  posts: WPPost[];
  variant?: BlogSliderVariant;
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function CompactBlogCard({ post }: { post: WPPost }) {
  const image = post._embedded?.["wp:featuredmedia"]?.[0];
  const category = post._embedded?.["wp:term"]
    ?.flat()
    .find((t) => t.taxonomy === "category")?.name;

  return (
    <Link
      href={resolveWordPressUrl(post.link)}
      className="group relative flex h-391 w-full flex-col justify-end overflow-hidden p-16 text-white md:p-24"
    >
      {image?.source_url && (
        <Image
          src={image.source_url}
          alt={image.alt_text || post.title.rendered}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="relative z-10 flex flex-col gap-8">
        {category && (
          <span className="font-poppins text-14 font-medium uppercase tracking-[0.05em] text-white/80">
            {category}
          </span>
        )}
        <h3
          className="font-gotham text-20 font-bold leading-[1.1] text-white"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
      </div>
    </Link>
  );
}

function DetailedBlogCard({ post }: { post: WPPost }) {
  const image = post._embedded?.["wp:featuredmedia"]?.[0];
  const category = post._embedded?.["wp:term"]
    ?.flat()
    .find((t) => t.taxonomy === "category")?.name;
  const date = formatDate(post.date);
  const author = post._embedded?.author?.[0]?.name;

  return (
    <Link
      href={resolveWordPressUrl(post.link)}
      className="group flex h-398 w-[calc(281*var(--fx))] flex-col gap-16 bg-card-dark p-12 text-white md:h-full md:w-full md:flex-row md:gap-12"
    >
      {image?.source_url && (
        <div className="relative aspect-[280/200] w-full shrink-0 overflow-hidden md:aspect-auto md:h-full md:w-1/2">
          <Image
            src={image.source_url}
            alt={image.alt_text || post.title.rendered}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 90vw, 25vw"
          />
          {category && (
            <span className="absolute bottom-0 left-0 bg-white px-12 py-6 font-poppins text-14 font-medium text-near-black">
              {category}
            </span>
          )}
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-8">
        {date && (
          <span className="self-start bg-slate px-10 py-4 font-poppins text-14 font-normal text-white">
            {date}
          </span>
        )}

        <h3
          className="font-gotham text-20 font-bold leading-24 text-white md:text-22"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {author && (
          <span className="font-poppins text-14 font-normal leading-18 text-light-gray">
            {author}
          </span>
        )}

        <div
          className="hidden font-poppins text-14 font-normal leading-18 text-white md:line-clamp-8"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />

        <span className="mt-auto font-poppins text-14 font-normal leading-24 underline text-white">
          Leer más
        </span>
      </div>
    </Link>
  );
}

export function BlogSlider({ titulo, boton, posts, variant = "dark" }: BlogSliderProps) {
  const isLight = variant === "light";

  return (
    <section className={isLight ? "bg-white" : "bg-slate"}>
      <div className="mx-auto max-w-1440 px-16 py-56 md:px-80 md:py-120">
        <div className="flex flex-col gap-40 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col items-start gap-25 md:max-w-402">
            {titulo && (
              <h2
                className={`font-gotham text-36 font-bold leading-[1.1] md:text-60 ${
                  isLight ? "text-near-black" : "text-white"
                }`}
              >
                {titulo}
              </h2>
            )}
            {boton && (
              <SmartLink
                link={boton}
                className="hidden h-50 min-w-250 items-center justify-center bg-peach px-24 font-gotham text-18 font-bold text-white transition-opacity hover:opacity-90 md:inline-flex"
              />
            )}
          </div>

          <div className="h-398 w-full md:h-391 md:w-[calc(848*var(--fx))]">
            <EmblaSlider
              slides={posts}
              slidesPerView={{ base: 1, md: isLight ? 2.2 : 3 }}
              gap={isLight ? 16 : 25}
              loop={false}
              showArrows={false}
              renderSlide={(post) =>
                isLight ? (
                  <DetailedBlogCard key={post.id} post={post} />
                ) : (
                  <CompactBlogCard key={post.id} post={post} />
                )
              }
            />
          </div>

          {boton && (
            <SmartLink
              link={boton}
              className="inline-flex h-50 min-w-250 items-center justify-center bg-peach px-24 font-gotham text-18 font-bold text-white transition-opacity hover:opacity-90 md:hidden"
            />
          )}
        </div>
      </div>
    </section>
  );
}
