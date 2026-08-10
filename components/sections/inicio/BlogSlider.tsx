"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
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

// Card única: el fondo oscuro no depende de la variante del section.
function BlogCard({ post }: { post: WPPost }) {
  const image = post._embedded?.["wp:featuredmedia"]?.[0];
  const category = post._embedded?.["wp:term"]
    ?.flat()
    .find((t) => t.taxonomy === "category")?.name;
  const date = formatDate(post.date);
  const author = post._embedded?.author?.[0]?.name;

  return (
    <Link
      href={resolveWordPressUrl(post.link)}
      className="group flex flex-col md:flex-row h-full w-full gap-12 bg-card-dark p-20 text-white md:gap-24"
    >
      {image?.source_url && (
        <div className="relative shrink-0 overflow-hidden md:w-[53%] min-h-200">
          <Image
            src={image.source_url}
            alt={image.alt_text || post.title.rendered}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 45vw, 40vw"
          />
          {category && (
            <span className="absolute bottom-16 left-0 bg-white px-12 py-6 font-poppins text-12 font-normal leading-18 text-near-black md:px-16 md:py-8 md:text-14">
              {category}
            </span>
          )}
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {date && (
          <span className="self-start bg-slate px-10 py-4 font-poppins text-12 font-normal leading-18 text-white md:px-12 md:py-5 md:text-14">
            {date}
          </span>
        )}

        <h3
          className="mt-12 font-gotham text-18 font-bold leading-22 text-white md:mt-16 md:text-24 md:leading-28"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {author && (
          <span className="mt-6 font-poppins text-12 font-normal italic leading-18 text-light-gray md:text-14">
            {author}
          </span>
        )}

        <div
          className="mt-14 line-clamp-6 font-poppins text-12 font-normal leading-18 text-white md:mt-20 md:line-clamp-8 md:text-14 md:leading-20"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />

        <span className="mt-auto pt-12 font-poppins text-12 font-normal leading-24 underline text-white md:pt-16 md:text-14">
          Leer más
        </span>
      </div>
    </Link>
  );
}

export function BlogSlider({ titulo, boton, posts, variant = "dark" }: BlogSliderProps) {
  const isLight = variant === "light";

  // Referencia estable: si el plugin se recrea en cada render, Embla reinicia
  // el carrusel y el autoplay nunca llega a avanzar.
  const plugins = useMemo(
    () => [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
    [],
  );

  return (
    <section className={isLight ? "bg-white" : "bg-slate"}>
      <div className="mx-auto max-w-1440 px-16 py-56 md:px-80 md:py-120">
        <div className="flex flex-col gap-40 md:flex-row md:items-start md:justify-between">
          <div className="flex w-full flex-col items-start gap-25 md:max-w-402 my-auto">
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

          <div className="min-h-398 w-full md:min-h-391 md:w-848">
            <EmblaSlider
              slides={posts}
              // 1 card + peek de la siguiente. La fracción sale de
              // (W + gap) / (card + gap): mobile 407/306 (card 281, peek ~76),
              // desktop 873/746 (card 721, peek ~102).
              slidesPerView={{ base: 1.33, md: 1.60 }}
              slidesToScroll={1}
              gap={25}
              loop
              plugins={plugins}
              showArrows={false}
              renderSlide={(post) => <BlogCard key={post.id} post={post} />}
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
