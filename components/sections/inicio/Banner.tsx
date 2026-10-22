"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { EmblaSlider } from "@/components/EmblaSlider";
import type { HomeBannerSlide } from "@/lib/types";
import { HOME_INTRO_SKIP_ATTRIBUTE, hasSeenHomeIntroToday, markHomeIntroSeen } from "@/lib/home-intro";
import { useHomeIntroSkipped } from "@/hooks/useHomeIntroSkipped";
import { TypewriterTitle } from "./TypewriterTitle";

const TYPEWRITER_COMPLETE_EVENT = "home-typewriter-complete";
const TEXT_VISIBLE_DURATION = 30000;
const TEXT_FADE_DURATION = 500;

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
  const mediaRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const skipDecisionRef = useRef<boolean | null>(null);
  const mediaTopRef = useRef<number | null>(null);
  const introSkipped = useHomeIntroSkipped();
  const [textHidden, setTextHidden] = useState(false);
  const [textFading, setTextFading] = useState(false);
  const showText = !introSkipped && !textHidden;
  const activeSlide = validSlides[activeIndex] ?? validSlides[0];

  /* El texto se muestra una vez al día: se marca como visto en cuanto empieza.
     La decisión se toma una sola vez por montaje (el ref sobrevive al doble
     efecto de StrictMode) y antes del pintado, para que el CSS oculte el texto
     también al llegar al home por navegación del cliente. */
  useLayoutEffect(() => {
    skipDecisionRef.current ??= hasSeenHomeIntroToday();
    if (skipDecisionRef.current) {
      document.documentElement.setAttribute(HOME_INTRO_SKIP_ATTRIBUTE, "");
    } else {
      document.documentElement.removeAttribute(HOME_INTRO_SKIP_ATTRIBUTE);
      markHomeIntroSeen();
    }
  }, []);

  /* El texto desaparece al pasar al slider o a los 30 s. */
  useEffect(() => {
    if (!showText) return;
    const hideText = () => {
      mediaTopRef.current = mediaRef.current?.getBoundingClientRect().top ?? null;
      setTextHidden(true);
    };
    let fadeTimer: number | undefined;
    const visibleTimer = window.setTimeout(() => {
      setTextFading(true);
      fadeTimer = window.setTimeout(hideText, TEXT_FADE_DURATION);
    }, TEXT_VISIBLE_DURATION);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && entry.boundingClientRect.bottom <= 0) hideText();
    });
    if (dotsRef.current) observer.observe(dotsRef.current);

    return () => {
      window.clearTimeout(visibleTimer);
      if (fadeTimer !== undefined) window.clearTimeout(fadeTimer);
      observer.disconnect();
    };
  }, [showText]);

  /* Al quitar el texto, el slider se mantiene donde estaba en pantalla (si el
     usuario está arriba del todo, el scroll no puede subir y el slider queda arriba). */
  useLayoutEffect(() => {
    const previousTop = mediaTopRef.current;
    const media = mediaRef.current;
    if (!textHidden || previousTop === null || !media) return;
    mediaTopRef.current = null;
    const shift = media.getBoundingClientRect().top - previousTop;
    if (shift) window.scrollBy(0, shift);
  }, [textHidden]);

  useEffect(() => {
    const element = imageRef.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const animation = element.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 1000, easing: "ease-out", fill: "both" },
    );
    animation.pause();

    const intro = element.closest(".intro-start");
    let textReady = !intro
      || intro.hasAttribute("data-intro-ready")
      || document.documentElement.hasAttribute(HOME_INTRO_SKIP_ATTRIBUTE);
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
      className={`relative flex h-[100svh] w-full flex-col items-center overflow-hidden bg-white md:h-auto ${
        showText ? "pt-[var(--banner-padding-top)]" : ""
      }`}
    >
      {showText && (
        <>
          <div
            data-intro-hero
            className={`mx-auto flex w-full max-w-382 flex-col justify-center px-4 text-center transition-opacity duration-500 md:max-w-760 md:px-0 [&_p]:m-0 ${
              textFading ? "opacity-0" : ""
            }`}
          >
            {activeSlide && <TypewriterTitle
              key={activeIndex}
              className="font-gotham font-light text-36 leading-[1.11] text-black md:text-80 md:leading-[1.14]"
              html={processTitle(activeSlide.titulo)}
            />}
          </div>

          <div
            ref={dotsRef}
            data-intro-fade
            data-intro-dots
            className={`mt-57 flex gap-3 transition-opacity duration-500 md:mt-153 ${textFading ? "opacity-0" : ""}`}
          >
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
        </>
      )}

      {mediaSlides.length > 0 && (
        <div
          ref={mediaRef}
          data-intro-fade
          data-intro-media
          className={`relative min-h-0 w-full flex-1 md:h-817 md:flex-none ${showText ? "mt-61 md:mt-34" : ""}`}
        >
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
