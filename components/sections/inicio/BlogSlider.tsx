"use client";

import { useMemo, useState } from "react";
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
      className="group flex h-full w-full flex-col gap-12 bg-card-dark px-[calc(12*var(--fx))] pb-[calc(16*var(--fx))] pt-[calc(12*var(--fx))] text-white md:flex-row md:gap-24 md:p-20"
    >
      {image?.source_url && (
        <div className="relative min-h-200 shrink-0 overflow-hidden md:w-[calc(280*var(--fx))]">
          <Image
            src={image.source_url}
            alt={image.alt_text || post.title.rendered}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 45vw, 40vw"
          />
          {category && (
            <span className="absolute left-[calc(16*var(--fx))] top-[calc(16*var(--fx))] bg-white px-12 py-6 font-poppins text-[calc(14*var(--fx))] font-medium not-italic leading-normal text-black md:bottom-16 md:left-0 md:top-auto md:px-16 md:py-8 md:text-14 md:font-normal md:leading-18 md:text-near-black">
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
          className="mt-14 hidden line-clamp-6 font-poppins text-12 font-normal leading-18 text-white md:mt-20 md:block md:line-clamp-8 md:text-14 md:leading-20"
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
  const [activePostIndex, setActivePostIndex] = useState(0);
  const activePost = posts[activePostIndex] ?? posts[0];
  const activeBlogLink = boton && activePost
    ? { ...boton, url: activePost.link }
    : boton;

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
            {activeBlogLink && (
              <SmartLink
                link={activeBlogLink}
                className="hidden h-50 min-w-250 items-center justify-center bg-peach px-24 font-gotham text-18 font-bold text-white transition-opacity hover:opacity-90 md:inline-flex"
              />
            )}
          </div>

          <div className="min-h-398 w-full md:h-[calc(396*var(--fx))] md:min-h-0 md:w-848">
            <EmblaSlider
              slides={posts}
              // En mobile el slide mide 306: card de 281 + espacio de 25.
              // En desktop el slide mide 575: card de 550 + espacio de 25.
              slidesPerView={{ base: 1.33, md: 1 }}
              slideClassName="!basis-[calc(306*var(--fx))] md:!basis-[calc(575*var(--fx))]"
              slidesToScroll={1}
              gap={0}
              loop
              plugins={plugins}
              showArrows={false}
              onSelectChange={setActivePostIndex}
              renderSlide={(post) => (
                <div className="h-auto w-[calc(281*var(--fx))] md:h-full md:w-[calc(550*var(--fx))]">
                  <BlogCard key={post.id} post={post} />
                </div>
              )}
            />
          </div>

          {activeBlogLink && (
            <SmartLink
              link={activeBlogLink}
              className="inline-flex h-50 min-w-250 items-center justify-center bg-peach px-24 font-gotham text-18 font-bold text-white transition-opacity hover:opacity-90 md:hidden"
            />
          )}
        </div>
      </div>
    </section>
  );
}
