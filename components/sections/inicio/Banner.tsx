"use client";

import { useEffect, useRef, useState } from "react";
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
  const progressRef = useRef<HTMLSpanElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const activeSlide = validSlides[activeIndex] ?? validSlides[0];

  useEffect(() => {
    const element = imageRef.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animation = element.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 1000, easing: "ease-out", fill: "both" },
    );
    animation.pause();

    const intro = element.closest(".intro-start");
    let textReady = !intro || intro.hasAttribute("data-intro-ready");
    let inView = false;
    let started = false;
    const reveal = () => {
      if (!textReady || !inView || started) return;
      started = true;
      animation.play();
      observer.disconnect();
    };
    const onTextReady = () => {
      textReady = true;
      reveal();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      reveal();
    }, { threshold: 0.1 });
    window.addEventListener("home-typewriter-revealed", onTextReady, { once: true });
    observer.observe(element);

    return () => {
      observer.disconnect();
      window.removeEventListener("home-typewriter-revealed", onTextReady);
      animation.cancel();
    };
  }, [activeSlide?.imagen?.url]);

  useEffect(() => {
    const updateProgress = (event: Event) => {
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${(event as CustomEvent<number>).detail})`;
      }
    };
    window.addEventListener("home-typewriter-progress", updateProgress);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && progressRef.current) {
      progressRef.current.style.transform = "scaleX(1)";
    }
    return () => window.removeEventListener("home-typewriter-progress", updateProgress);
  }, [activeIndex]);

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
      className="relative flex h-[100svh] w-full flex-col items-center overflow-hidden bg-white pt-[var(--banner-padding-top)] md:h-auto"
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
            className={`relative h-[calc(6*var(--fx))] cursor-pointer overflow-hidden rounded-full border-0 bg-dots-inactive p-0 transition-[width] duration-300 ${
              index === activeIndex
                ? "w-[calc(91*var(--fx))]"
                : "w-[calc(27*var(--fx))]"
            }`}
          >
            {index === activeIndex && (
              <span
                ref={progressRef}
                className="absolute inset-0 origin-left rounded-full bg-dots-active motion-reduce:transition-none"
                style={{ transform: "scaleX(0)", transition: "transform 85ms linear" }}
              />
            )}
          </button>
        ))}
      </div>

      {activeSlide.imagen?.url && (
        <div data-intro-fade className="relative mt-61 min-h-0 w-full flex-1 md:mt-34 md:h-[calc(817*var(--fx))] md:flex-none">
          <div ref={imageRef} className="absolute inset-0">
            <Image
              key={activeSlide.imagen.url}
              src={activeSlide.imagen.url}
              alt={activeSlide.imagen.alt || ""}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </section>
  );
}
