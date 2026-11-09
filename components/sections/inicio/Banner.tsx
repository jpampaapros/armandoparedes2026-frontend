"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { EmblaSlider } from "@/components/EmblaSlider";
import type { ACFImage, HomeBannerSlide } from "@/lib/types";
import { HOME_INTRO_SKIP_ATTRIBUTE, hasSeenHomeIntroToday, markHomeIntroSeen } from "@/lib/home-intro";
import { TypewriterTitle } from "./TypewriterTitle";

/* Imagen de escritorio + imagen_mobile. Dos <Image> con corte md (767px),
   igual que BannerVideo: evita object-cover de un landscape en móvil. */
function BannerImage({
  image,
  imageMobile,
  priority,
}: {
  image?: ACFImage;
  imageMobile?: ACFImage;
  priority?: boolean;
}) {
  const desktopUrl = image?.url || imageMobile?.url;
  const mobileUrl = imageMobile?.url || image?.url;
  if (!desktopUrl && !mobileUrl) return null;

  const alt = image?.alt || imageMobile?.alt || "";
  const sameUrl = desktopUrl === mobileUrl;

  // Misma URL en ambos campos: un solo Image basta.
  if (sameUrl && desktopUrl) {
    return (
      <Image
        src={desktopUrl}
        alt={alt}
        fill
        className="object-cover"
        sizes="100vw"
        priority={priority}
      />
    );
  }

  return (
    <>
      {mobileUrl && (
        <Image
          src={mobileUrl}
          alt={alt}
          fill
          className="object-cover md:hidden"
          sizes="100vw"
          priority={priority}
        />
      )}
      {desktopUrl && (
        <Image
          src={desktopUrl}
          alt={alt}
          fill
          className="hidden object-cover md:block"
          sizes="100vw"
          priority={priority}
        />
      )}
    </>
  );
}

const TYPEWRITER_COMPLETE_EVENT = "home-typewriter-complete";
const TEXT_VISIBLE_DURATION = 30000;
const TEXT_FADE_DURATION = 500;
/** Tiempo del autoplay del carrusel de media según tipo de slide. */
const IMAGE_SLIDE_DELAY = 5000;
const VIDEO_SLIDE_DELAY = 15000;

type BannerProps = {
  titleSlides: HomeBannerSlide[];
  imageSlides: HomeBannerSlide[];
  ocultar_en_movil?: boolean;
};

function processTitle(html?: string) {
  if (!html) return "";
  return html
    .replace(/<strong>/gi, '<span class="text-slate font-medium">')
    .replace(/<\/strong>/gi, "</span>");
}

/* Controles propios, sin barra de duración: los nativos no dejan ocultar solo el tiempo. */
function VideoControls({
  paused,
  muted,
  onTogglePlay,
  onToggleMute,
  onFullscreen,
}: {
  paused: boolean;
  muted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onFullscreen: () => void;
}) {
  const buttonClass =
    "flex h-44 w-44 cursor-pointer items-center justify-center rounded-full border-0 bg-black/70 p-0";

  return (
    <div
      data-video-controls
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-center gap-8 bg-gradient-to-t from-black/45 to-transparent px-16 py-16 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100"
    >
      <button type="button" className={buttonClass} aria-label={paused ? "Reproducir" : "Pausar"} onClick={onTogglePlay}>
        <Image
          unoptimized
          src={paused ? "/images/banner-video/play.svg" : "/images/banner-video/pause.svg"}
          alt=""
          width={22}
          height={22}
        />
      </button>
      <button type="button" className={buttonClass} aria-label={muted ? "Activar sonido" : "Silenciar"} onClick={onToggleMute}>
        <Image
          unoptimized
          src={muted ? "/images/banner-video/speaker-x-mark.svg" : "/images/banner-video/speaker-wave.svg"}
          alt=""
          width={22}
          height={22}
        />
      </button>
      <button type="button" className={`${buttonClass} ml-auto`} aria-label="Pantalla completa" onClick={onFullscreen}>
        <Image unoptimized src="/images/banner-video/arrows-pointing-out.svg" alt="" width={22} height={22} />
      </button>
    </div>
  );
}

/* Dos <video>: desktop (src) y mobile (video_mobile). Solo reproduce el
   visible según max-width 767px (= Tailwind md). */
function BannerVideo({
  src,
  mobileSrc,
  poster,
  active,
}: {
  src: string;
  mobileSrc?: string;
  poster?: string;
  active: boolean;
}) {
  const desktopRef = useRef<HTMLVideoElement>(null);
  const mobileRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const userPausedRef = useRef(false);
  const mobileUrl = mobileSrc || src;
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);

  const visibleVideo = () => {
    const media = window.matchMedia("(max-width: 767px)");
    const mobile = mobileRef.current;
    const desktop = desktopRef.current;
    return media.matches ? mobile ?? desktop : desktop ?? mobile;
  };

  useEffect(() => {
    const desktop = desktopRef.current;
    const mobile = mobileRef.current;
    const videos = [desktop, mobile].filter((video): video is HTMLVideoElement => !!video);
    if (videos.length === 0) return;

    let inView = false;
    // Mismo corte que md:hidden / md:block en el markup.
    const media = window.matchMedia("(max-width: 767px)");
    const currentVideo = () => (media.matches ? mobile ?? desktop : desktop ?? mobile);

    const updatePlayback = () => {
      const current = currentVideo();
      for (const video of videos) {
        if (video === current && active && inView && !document.hidden && !userPausedRef.current) {
          void video.play().catch(() => {
            // El navegador puede bloquear la reproducción automática; quedan los controles disponibles.
          });
        } else {
          video.pause();
        }
      }
      setPaused(userPausedRef.current || Boolean(current?.paused));
      setMuted(current?.muted ?? true);
    };

    if (active) {
      userPausedRef.current = false;
      for (const video of videos) video.currentTime = 0;
    }

    // Hay dos <video> (escritorio oculto con md:hidden). El observer avisa de los dos
    // juntos y el primero es el de escritorio, que en móvil no intersecta. Si solo
    // se lee esa entrada, inView queda en false y el video visible nunca hace play().
    const inViewByVideo = new WeakMap<HTMLVideoElement, boolean>();
    const syncPlayback = () => {
      const current = currentVideo();
      inView = current ? inViewByVideo.get(current) === true : false;
      updatePlayback();
    };
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        inViewByVideo.set(entry.target as HTMLVideoElement, entry.isIntersecting);
      }
      syncPlayback();
    }, { threshold: 0.1 });
    for (const video of videos) observer.observe(video);

    media.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    syncPlayback();

    return () => {
      observer.disconnect();
      media.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      for (const video of videos) video.pause();
    };
  }, [active, src, mobileUrl]);

  const togglePlay = () => {
    const video = visibleVideo();
    if (!video) return;
    if (video.paused) {
      userPausedRef.current = false;
      void video.play();
      setPaused(false);
      return;
    }
    userPausedRef.current = true;
    video.pause();
    setPaused(true);
  };

  const toggleMute = () => {
    const video = visibleVideo();
    if (!video) return;
    const nextMuted = !video.muted;
    if (desktopRef.current) desktopRef.current.muted = nextMuted;
    if (mobileRef.current) mobileRef.current.muted = nextMuted;
    setMuted(nextMuted);
    if (!nextMuted) void video.play();
  };

  const enterFullscreen = () => {
    const video = visibleVideo();
    const target = video ?? rootRef.current;
    if (!target) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    void target.requestFullscreen?.();
  };

  /* Sin poster, el <video> se queda en negro hasta decodificar el primer
     fotograma. Forzamos un seek mínimo para pintarlo y evitar el hueco negro
     antes de que arranque la reproducción. */
  useEffect(() => {
    if (poster) return;
    const videos = [desktopRef.current, mobileRef.current].filter(
      (video): video is HTMLVideoElement => !!video,
    );
    const paintFirstFrame = (video: HTMLVideoElement) => {
      if (video.currentTime > 0) return;
      try {
        video.currentTime = 0.001;
      } catch {
        // El navegador aún no permite el seek; queda el fotograma en negro.
      }
    };
    const cleanups: Array<() => void> = [];
    for (const video of videos) {
      if (video.readyState >= 1) {
        paintFirstFrame(video);
        continue;
      }
      const onLoadedMetadata = () => paintFirstFrame(video);
      video.addEventListener("loadedmetadata", onLoadedMetadata, { once: true });
      cleanups.push(() => video.removeEventListener("loadedmetadata", onLoadedMetadata));
    }
    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [poster, src, mobileUrl]);

  return (
    <div ref={rootRef} className="group absolute inset-0">
      {/* Móvil: video_mobile (o desktop si no hay). */}
      <video
        ref={mobileRef}
        src={mobileUrl}
        poster={poster}
        muted
        playsInline
        loop
        preload={poster ? "metadata" : "auto"}
        aria-label="Video del proyecto"
        className="absolute inset-0 h-full w-full object-cover md:hidden"
      />
      {/* Desktop desde md. */}
      <video
        ref={desktopRef}
        src={src}
        poster={poster}
        muted
        playsInline
        loop
        preload={poster ? "metadata" : "auto"}
        aria-label="Video del proyecto"
        className="absolute inset-0 hidden h-full w-full object-cover md:block"
      />
      <VideoControls
        paused={paused}
        muted={muted}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        onFullscreen={enterFullscreen}
      />
    </div>
  );
}

export function Banner({ titleSlides, imageSlides, ocultar_en_movil = false }: BannerProps) {
  const validSlides = titleSlides.filter((slide) => slide.titulo?.trim());
  // Normaliza slides ACF: imagen / imagen_mobile / video / video_mobile.
  const mediaSlides = useMemo(() => imageSlides.flatMap<{
    image?: HomeBannerSlide["imagen"];
    imageMobile?: HomeBannerSlide["imagen_mobile"];
    videoUrl?: string;
    videoUrlMobile?: string;
  }>((slide) => {
    const image = slide.imagen?.url ? slide.imagen : undefined;
    const imageMobile = slide.imagen_mobile?.url ? slide.imagen_mobile : undefined;
    if (slide.tipo_medio !== "video") {
      return image || imageMobile ? [{ image, imageMobile }] : [];
    }
    const videoUrl = slide.video && typeof slide.video === "object" ? slide.video.url : undefined;
    const videoUrlMobile =
      slide.video_mobile && typeof slide.video_mobile === "object" ? slide.video_mobile.url : undefined;
    if (!videoUrl && !videoUrlMobile) {
      return image || imageMobile ? [{ image, imageMobile }] : [];
    }
    return [{ image, imageMobile, videoUrl: videoUrl || videoUrlMobile, videoUrlMobile }];
  }), [imageSlides]);
  // Delay por slide: video 15s, imagen 5s (API de Embla Autoplay).
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: (scrollSnaps) =>
          scrollSnaps.map((_, index) =>
            mediaSlides[index]?.videoUrl ? VIDEO_SLIDE_DELAY : IMAGE_SLIDE_DELAY,
          ),
        stopOnInteraction: false,
        playOnInit: false,
      }),
    [mediaSlides],
  );
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
  const sectionRef = useRef<HTMLElement>(null);
  const viewedSecondBannerRef = useRef(false);
  const programmaticScrollRef = useRef(false);
  const restoreArmedAtRef = useRef(0);
  const pendingRestoreScrollRef = useRef(false);
  const ignoreHideRef = useRef(false);
  const [textHidden, setTextHidden] = useState(false);
  const [textFading, setTextFading] = useState(false);
  const [textPresentation, setTextPresentation] = useState<"typewriter" | "static">("typewriter");
  const showText = !textHidden;
  const activeSlide = validSlides[activeIndex] ?? validSlides[0];

  /* La máquina de escribir corre solo la primera vez del día. En una recarga
     el texto sigue visible, ya completo. */
  useLayoutEffect(() => {
    skipDecisionRef.current ??= hasSeenHomeIntroToday();
    if (skipDecisionRef.current) {
      document.documentElement.setAttribute(HOME_INTRO_SKIP_ATTRIBUTE, "");
      setTextPresentation("static");
    } else {
      document.documentElement.removeAttribute(HOME_INTRO_SKIP_ATTRIBUTE);
      markHomeIntroSeen();
    }
  }, []);

  /* El texto desaparece al pasar al slider o, en la primera visita, a los 30 s. */
  useEffect(() => {
    if (!showText) return;
    const hideText = (fromScroll: boolean) => {
      if (ignoreHideRef.current) return;
      mediaTopRef.current = mediaRef.current?.getBoundingClientRect().top ?? null;
      if (fromScroll) {
        viewedSecondBannerRef.current = true;
        restoreArmedAtRef.current = performance.now() + 500;
      }
      setTextHidden(true);
    };
    let fadeTimer: number | undefined;
    const visibleTimer = textPresentation === "typewriter"
      ? window.setTimeout(() => {
          setTextFading(true);
          fadeTimer = window.setTimeout(() => hideText(false), TEXT_FADE_DURATION);
        }, TEXT_VISIBLE_DURATION)
      : undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        ignoreHideRef.current = false;
        return;
      }
      if (!entry.isIntersecting && entry.boundingClientRect.bottom <= 0) hideText(true);
    });
    if (dotsRef.current) observer.observe(dotsRef.current);

    return () => {
      if (visibleTimer !== undefined) window.clearTimeout(visibleTimer);
      if (fadeTimer !== undefined) window.clearTimeout(fadeTimer);
      observer.disconnect();
    };
  }, [showText, textPresentation]);

  /* Tras ver el slider, subir de nuevo muestra el primer texto ya completo. */
  useEffect(() => {
    if (!textHidden) return;

    const restore = () => {
      if (!viewedSecondBannerRef.current || programmaticScrollRef.current) return;
      if (performance.now() < restoreArmedAtRef.current) return;
      const mediaTop = mediaRef.current?.getBoundingClientRect().top ?? 0;
      if (mediaTop < -8) return;
      viewedSecondBannerRef.current = false;
      ignoreHideRef.current = true;
      mediaTopRef.current = mediaRef.current?.getBoundingClientRect().top ?? null;
      pendingRestoreScrollRef.current = true;
      setTextFading(false);
      setActiveIndex(0);
      setTextPresentation("static");
      setTextHidden(false);
    };

    let lastY = window.scrollY;
    const onScroll = () => {
      const goingUp = window.scrollY < lastY - 1;
      lastY = window.scrollY;
      if (goingUp) restore();
    };
    const onWheel = (event: WheelEvent) => {
      if (event.deltaY < 0) restore();
    };
    let touchStartY = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY ?? 0;
      if (y - touchStartY > 12) restore();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [textHidden]);

  /* Al ocultar o devolver el texto, el slider se queda donde el usuario lo
     estaba viendo. No se fuerza el scroll al inicio del banner. */
  useLayoutEffect(() => {
    const previousTop = mediaTopRef.current;
    const media = mediaRef.current;
    const shouldAdjust = textHidden || pendingRestoreScrollRef.current;
    if (!shouldAdjust || previousTop === null || !media) return;
    pendingRestoreScrollRef.current = false;
    mediaTopRef.current = null;
    const shift = media.getBoundingClientRect().top - previousTop;
    if (!shift) return;
    programmaticScrollRef.current = true;
    window.scrollBy(0, shift);
    requestAnimationFrame(() => {
      programmaticScrollRef.current = false;
    });
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
      ref={sectionRef}
      data-intro-banner
      className={`bb2 relative flex w-full flex-col items-center overflow-x-hidden overflow-anchor-none bg-white md:h-auto ${ocultar_en_movil ? "hidden md:block" : ""} ${
        // Con texto: texto + media. Sin texto: media fijo 75svh en mobile (no crece al scrollear).
        showText ? "min-h-[100svh]" : "h-[75svh] overflow-hidden md:h-[100svh]"
      }`}
    >
      {showText && (
        /* Bloque blanco del intro en mobile ≈ 75svh (peek del media ~25%).
           Título centrado (flex-1); dots cerca del borde inferior. En md: altura auto. */
        <div className="flex h-[75svh] w-full shrink-0 flex-col items-center pt-[var(--banner-padding-top)] md:h-auto">
          <div
            data-intro-hero
            className={`mx-auto flex w-full max-w-382 flex-1 flex-col justify-center px-4 text-center transition-opacity duration-500 md:max-w-760 md:flex-none md:px-0 [&_p]:m-0 ${
              textFading ? "opacity-0" : ""
            }`}
          >
            {activeSlide && <TypewriterTitle
              key={activeIndex}
              animate={textPresentation === "typewriter"}
              className="font-gotham font-light text-36 leading-[1.11] text-black md:text-80 md:leading-[1.14]"
              html={processTitle(activeSlide.titulo)}
            />}
          </div>

          {/* Un solo slide: se ocultan los dots pero se conserva el espacio (mismo alto de layout). */}
          <div
            ref={dotsRef}
            data-intro-fade
            data-intro-dots
            className={`mt-40 mb-32 flex shrink-0 justify-center gap-3 transition-opacity duration-500 md:mt-153 md:mb-0 ${
              textFading ? "opacity-0" : ""
            } ${validSlides.length <= 1 ? "invisible pointer-events-none" : ""}`}
            aria-hidden={validSlides.length <= 1 || undefined}
          >
            {validSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Ir al slide ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => setActiveIndex(index)}
                tabIndex={validSlides.length <= 1 ? -1 : undefined}
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
                    style={{ transform: textPresentation === "static" ? "scaleX(1)" : "scaleX(0)", transition: "transform 85ms linear" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {mediaSlides.length > 0 && (
        /* Mobile: siempre 75svh (igual que el bloque de texto). Si fuera flex-1
           al ocultar el intro, el media crecería al scrollear. */
        <div
          ref={mediaRef}
          data-intro-fade
          data-intro-media
          className={`relative h-[75svh] w-full shrink-0 md:h-817 md:flex-none ${
            showText ? "md:mt-34" : "md:min-h-0 md:flex-1"
          }`}
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
              bulletProgress={{ duration: IMAGE_SLIDE_DELAY, className: "bg-dots-active" }}
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
              renderSlide={(slide, index) => {
                // Sin poster no hay imagen que tape el hueco negro: arrancamos
                // la reproducción en cuanto el slide es el activo, sin esperar
                // a mediaReady (que llega tras el fundido del intro).
                const posterUrl = slide.image?.url;
                const active = index === activeMediaIndex && (mediaReady || !posterUrl);
                return (
                  <div className="relative h-full w-full">
                    {slide.videoUrl ? (
                      <BannerVideo
                        src={slide.videoUrl}
                        mobileSrc={slide.videoUrlMobile}
                        poster={posterUrl}
                        active={active}
                      />
                    ) : (
                      <BannerImage
                        image={slide.image}
                        imageMobile={slide.imageMobile}
                        priority={index === 0}
                      />
                    )}
                  </div>
                );
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
