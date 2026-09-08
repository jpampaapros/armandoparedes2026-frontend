"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { HomeBannerSlide } from "@/lib/types";
import { TypewriterTitle } from "./TypewriterTitle";

const TYPEWRITER_COMPLETE_EVENT = "home-typewriter-complete";

type BannerProps = {
  slides: HomeBannerSlide[];
};

function processTitle(html?: string) {
  if (!html) return "";
  return html
    .replace(/<strong>/gi, '<span class="text-slate font-medium">')
    .replace(/<\/strong>/gi, "</span>");
}

export function Banner({ slides }: BannerProps) {
  const validSlides = slides.filter((slide) => slide.titulo || slide.imagen?.url);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = validSlides[activeIndex] ?? validSlides[0];

  useEffect(() => {
    if (validSlides.length <= 1) return;

    const advanceSlide = () => {
      setActiveIndex((current) => (current + 1) % validSlides.length);
    };
    window.addEventListener(TYPEWRITER_COMPLETE_EVENT, advanceSlide);

    return () => window.removeEventListener(TYPEWRITER_COMPLETE_EVENT, advanceSlide);
  }, [validSlides.length]);

  if (!activeSlide) return null;

  return (
    <section
      data-intro-banner
      className="relative flex h-[100svh] w-full flex-col items-center overflow-hidden bg-white pt-[var(--banner-padding-top)]"
    >
      <div
        data-intro-hero
        className="mx-auto flex w-full max-w-382 flex-col justify-center px-4 text-center md:max-w-760 md:px-0 [&_p]:m-0"
      >
        <TypewriterTitle
          key={activeIndex}
          className="font-gotham font-light text-36 leading-[1.11] text-black md:text-80 md:leading-[1.14]"
          html={processTitle(activeSlide.titulo)}
        />
      </div>

      <div data-intro-fade className="mt-57 flex gap-3 md:mt-153">
        {validSlides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Ir al slide ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
            className={`h-6 cursor-pointer rounded-full border-0 p-0 transition-[width,background-color] duration-300 ${
              index === activeIndex
                ? "w-91 bg-dots-active"
                : "w-27 bg-dots-inactive"
            }`}
          />
        ))}
      </div>

      {activeSlide.imagen?.url && (
        <div data-intro-fade className="relative mt-61 min-h-0 w-full flex-1 md:mt-34">
          <Image
            key={activeSlide.imagen.url}
            src={activeSlide.imagen.url}
            alt={activeSlide.imagen.alt || ""}
            fill
            className="object-cover md:object-fill"
            sizes="100vw"
            priority
          />
        </div>
      )}
    </section>
  );
}
