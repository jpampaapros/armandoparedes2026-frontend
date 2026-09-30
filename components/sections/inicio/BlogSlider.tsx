"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { EmblaSlider } from "@/components/EmblaSlider";
import { SmartLink } from "@/components/SmartLink";
import { useBreakpoint } from "@/hooks/use-breakpoint";
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
      href={`/blog/${post.slug}`}
      className="group flex h-full w-full flex-col gap-12 bg-card-dark px-12 pb-16 pt-12 text-white md:flex-row md:gap-16 md:p-20"
    >
      {image?.source_url && (
        <div className="relative min-h-200 shrink-0 overflow-hidden md:w-1/2">
          <Image
            src={image.source_url}
            alt={image.alt_text || post.title.rendered}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 80vw, 25vw"
          />
          {category && (
            <span className="absolute left-16 top-16 bg-white px-12 py-6 font-poppins text-14 font-medium not-italic leading-normal text-black md:bottom-16 md:left-0 md:top-auto md:px-16 md:py-8 md:text-14 md:font-normal md:leading-18 md:text-near-black">
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
  const bp = useBreakpoint();
  const isDesktop = bp === "md" || bp === "lg" || bp === "xl";
  const [activePostIndex, setActivePostIndex] = useState(0);
  const activePost = posts[activePostIndex] ?? posts[0];
  const activeBlogLink = boton && activePost
    ? { ...boton, url: `/blog/${activePost.slug}` }
    : boton;

  // Con el slider sangrando hasta el borde derecho entran más cards en vista:
  // con pocos posts Embla desactiva el loop, así que se repiten hasta tener 6.
  const slides = useMemo(
    () =>
      posts.length > 0 && posts.length < 6
        ? Array.from({ length: Math.ceil(6 / posts.length) }, () => posts).flat()
        : posts,
    [posts],
  );

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
    <section className={`overflow-x-clip ${isLight ? "bg-white" : "bg-slate"}`}>
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

          <div className="min-h-398 w-full min-w-0 md:h-396 md:min-h-0 md:w-806">
            <EmblaSlider
              // La columna fija el borde izquierdo (card a 554 en el diseño de
              // 1440); solo el slider se estira por la derecha hasta el borde de
              // la pantalla: padding del contenedor + margen fuera del max-w-1440.
              className="w-[calc(100%+16*var(--fx))] md:w-[calc(100%+80*var(--fx)+(100vw-1440*var(--fx))/2)]"
              slides={slides}
              // Mobile: slide de 306 = card de 281 + 25, la siguiente asoma.
              // Desktop: 2 cards completas que llenan hasta el borde de la
              // pantalla; el gap va como padding izquierdo compensado, así la
              // segunda card queda pegada al borde sin espacio sobrante.
              slidesPerView={{ base: 1, md: 2 }}
              slideClassName="max-md:!basis-306"
              slidesToScroll={1}
              gap={isDesktop ? 16 : 25}
              loop
              plugins={plugins}
              showArrows={false}
              onSelectChange={(index) => setActivePostIndex(index % posts.length)}
              renderSlide={(post) => (
                <div className="h-full w-full">
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
