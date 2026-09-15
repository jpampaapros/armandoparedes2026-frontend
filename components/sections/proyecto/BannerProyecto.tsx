"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import { EmblaSlider } from "@/components/EmblaSlider";
import type { ACFImage } from "@/lib/types";

type BannerProyectoProps = {
  badge?: string;
  distrito?: string;
  logo?: ACFImage;
  slides?: { imagen?: ACFImage }[];
};

export function BannerProyecto({ badge, distrito, logo, slides = [] }: BannerProyectoProps) {
  const items = slides.length > 0 ? slides : [{ imagen: logo }];
  const [api, setApi] = useState<EmblaCarouselType>();
  const [selected, setSelected] = useState(0);
  const progressRef = useRef<HTMLSpanElement>(null);
  const restartRef = useRef(() => {});

  useEffect(() => {
    if (!api || items.length < 2) return;
    let started = performance.now();
    let frame: number;
    let dragging = false;
    const restart = () => {
      started = performance.now();
      setSelected(api.selectedScrollSnap());
      if (progressRef.current) progressRef.current.style.transform = "scaleX(0)";
    };
    restartRef.current = restart;
    const pause = () => { dragging = true; };
    const resume = () => { dragging = false; restart(); };
    const tick = (now: number) => {
      if (!dragging) {
        const progress = Math.min((now - started) / 3000, 1);
        if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`;
        if (progress === 1) {
          if (api.canScrollNext()) api.scrollNext();
          else api.scrollTo(0);
          restart();
        }
      }
      frame = requestAnimationFrame(tick);
    };
    restart();
    frame = requestAnimationFrame(tick);
    api.on("select", restart).on("reInit", restart).on("pointerDown", pause).on("pointerUp", resume);
    return () => {
      cancelAnimationFrame(frame);
      restartRef.current = () => {};
      api.off("select", restart).off("reInit", restart).off("pointerDown", pause).off("pointerUp", resume);
    };
  }, [api, items.length]);

  return (
    <section
      data-layout="banner_proyecto"
      className="relative h-672 w-full overflow-hidden md:h-700"
    >
      <EmblaSlider
        slides={items}
        onApiReady={setApi}
        renderSlide={(slide) => (
          <div className="relative h-full w-full">
            {slide?.imagen?.url ? (
              <Image
                src={slide.imagen.url}
                alt={slide.imagen.alt || ""}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="h-full w-full bg-neutral-800" />
            )}
            <div className="absolute inset-0 bg-black/35" />
          </div>
        )}
        loop={items.length > 1}
        draggable={items.length > 1}
        showArrows={false}
        showBullets={false}
        gap={0}
        bulletsContainerClassName="bottom-120 gap-3"
        bulletClassName="h-6 w-27 rounded-full bg-white/80 shrink-0"
        bulletActiveClassName="w-91 bg-white"
      />

      {items.length > 1 && (
        <div className="absolute bottom-[calc(120*var(--fx))] left-1/2 z-10 hidden -translate-x-1/2 gap-[calc(3*var(--fx))] md:flex">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Ir al slide ${index + 1}`}
              aria-current={selected === index ? "true" : undefined}
              onClick={() => { api?.scrollTo(index); restartRef.current(); }}
              className="relative h-[calc(6*var(--fx))] shrink-0 cursor-pointer overflow-hidden rounded-full border-0 bg-white/40 p-0"
              style={{ width: `calc(${selected === index ? 91 : 27}*var(--fx))` }}
            >
              {selected === index && (
                <span ref={progressRef} className="absolute inset-0 origin-left bg-white" style={{ transform: "scaleX(0)" }} />
              )}
            </button>
          ))}
        </div>
      )}

      {badge && (
        <div className="absolute top-0 left-1/2 hidden -translate-x-1/2 bg-slate px-24 py-12 md:flex md:px-48 md:py-16">
          <span className="font-poppins text-14 font-medium text-white md:text-20">
            {badge}
          </span>
        </div>
      )}

      {logo?.url && (
        <div className="absolute left-1/2 top-257 h-100 w-380 -translate-x-1/2 md:top-143 md:h-141 md:w-612">
          <Image
            src={logo.url}
            alt={logo.alt || ""}
            fill
            sizes="(max-width: 768px) 380px, 612px"
            className="object-contain"
            priority
          />
        </div>
      )}

      {distrito && (
        <div className="absolute left-1/2 top-405 w-274 -translate-x-1/2 border border-white px-24 py-10 md:top-312 md:px-48 md:py-12 text-center">
          <span className="font-poppins text-18 text-white md:text-24">
            {distrito}
          </span>
        </div>
      )}
    </section>
  );
}
