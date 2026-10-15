"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { EmblaSlider } from "@/components/EmblaSlider";
import type { HomeBannerSlide } from "@/lib/types";
import { TypewriterTitle } from "./TypewriterTitle";

const TYPEWRITER_COMPLETE_EVENT = "home-typewriter-complete";

type BannerProps = {
  titleSlides: HomeBannerSlide[];
  imageSlides: HomeBannerSlide[];
};

function processTitle(html?: string) {
  if (!html) return "";
  return html
    .replace(/<strong>/gi, '<span class="text-slate font-medium">')
    .replace(/<\/strong>/gi, "</span>");
}

function BannerVideo({ src, poster, active }: { src: string; poster?: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let inView = false;
    const updatePlayback = () => {
      if (active && inView && !document.hidden) {
        void video.play().catch(() => {
          // El navegador puede bloquear la reproducción automática; quedan los controles disponibles.
        });
      } else {
        video.pause();
      }
    };
    if (active) video.currentTime = 0;
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    }, { threshold: 0.1 });
    observer.observe(video);
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      video.pause();
    };
  }, [active]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      playsInline
      loop
      controls
      preload="metadata"
      aria-label="Video del proyecto"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

export function Banner({ titleSlides, imageSlides }: BannerProps) {
  const validSlides = titleSlides.filter((slide) => slide.titulo?.trim());
  const mediaSlides = imageSlides.flatMap<{ image?: HomeBannerSlide["imagen"]; videoUrl?: string }>((slide) => {
    const videoUrl = slide.tipo_medio === "video" && slide.video ? slide.video.url : undefined;
    if (videoUrl) return [{ image: slide.imagen, videoUrl }];
    return slide.imagen?.url ? [{ image: slide.imagen, videoUrl: undefined }] : [];
  });
  const autoplay = useMemo(() => Autoplay({ delay: 5000, stopOnInteraction: false, playOnInit: false }), []);
  const imagePlugins = useMemo(() => [autoplay], [autoplay]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [mediaReady, setMediaReady] = useState(false);
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
      void animation.finished.then(() => {
        element.dataset.autoplayReady = "true";
        setMediaReady(true);
        if (mediaSlides.length > 1) autoplay.play();
      }).catch(() => {
        // La animación se cancela al desmontar el banner.
      });
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
      delete element.dataset.autoplayReady;
      autoplay.stop();
    };
  }, [autoplay, mediaSlides.length]);

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

  if (!activeSlide && mediaSlides.length === 0) return null;

  return (
    <section
      data-intro-banner
      className="relative flex h-[100svh] w-full flex-col items-center overflow-hidden bg-white pt-[var(--banner-padding-top)] md:h-auto"
    >
      <div
        data-intro-hero
        className="mx-auto flex w-full max-w-382 flex-col justify-center px-4 text-center md:max-w-760 md:px-0 [&_p]:m-0"
      >
        {activeSlide && <TypewriterTitle
          key={activeIndex}
          className="font-gotham font-light text-36 leading-[1.11] text-black md:text-80 md:leading-[1.14]"
          html={processTitle(activeSlide.titulo)}
        />}
      </div>

      <div data-intro-fade className="mt-57 flex gap-3 md:mt-153">
        {validSlides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Ir al slide ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
            className={`relative h-6 cursor-pointer overflow-hidden rounded-full border-0 bg-dots-inactive p-0 transition-[width] duration-300 ${
              index === activeIndex
                ? "w-91"
                : "w-27"
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

      {mediaSlides.length > 0 && (
        <div data-intro-fade className="relative mt-61 min-h-0 w-full flex-1 md:mt-34 md:h-817 md:flex-none">
          <div ref={imageRef} className="absolute inset-0">
            <EmblaSlider
              slides={mediaSlides}
              plugins={imagePlugins}
              showArrows={false}
              showBullets={mediaSlides.length > 1}
              bulletsContainerClassName="bottom-61 gap-3 md:bottom-34"
              bulletClassName="h-6 cursor-pointer rounded-full border-0 p-0 transition-[width] duration-300"
              bulletActiveClassName="w-91 bg-dots-inactive"
              bulletInactiveClassName="w-27 bg-dots-inactive"
              bulletProgress={{ duration: 5000, className: "bg-dots-active" }}
              onApiReady={(api) => {
                const startWhenReady = () => {
                  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches && imageRef.current) {
                    imageRef.current.dataset.autoplayReady = "true";
                    setMediaReady(true);
                  }
                  if (imageRef.current?.dataset.autoplayReady === "true" && mediaSlides.length > 1) autoplay.play();
                };
                startWhenReady();
                api.on("reInit", startWhenReady);
                api.on("destroy", () => api.off("reInit", startWhenReady));
              }}
              onSelectChange={setActiveMediaIndex}
              renderSlide={(slide, index) => (
                <div className="relative h-full w-full">
                  {slide.videoUrl ? (
                    <BannerVideo src={slide.videoUrl} poster={slide.image?.url} active={mediaReady && index === activeMediaIndex} />
                  ) : slide.image?.url ? (
                    <Image src={slide.image.url} alt={slide.image.alt || ""} fill className="object-cover" sizes="100vw" priority={index === 0} />
                  ) : null}
                </div>
              )}
            />
          </div>
        </div>
      )}
    </section>
  );
}
