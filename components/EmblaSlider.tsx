"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import type {
  EmblaCarouselType,
  EmblaPluginType,
} from "embla-carousel";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "@/components/icons/ChevronLeft";
import { ChevronRight } from "@/components/icons/ChevronRight";
import {
  BREAKPOINT_ORDER,
  useBreakpoint,
  type Breakpoint,
} from "@/hooks/use-breakpoint";

export interface EmblaSliderProps<T> {
  slides: T[];
  className?: string;
  /** Contenedor del carrusel (viewport) */
  viewportClassName?: string;
  renderSlide: (
    slide: T,
    index: number,
  ) => React.ReactNode;
  showArrows?: ResponsiveVisibility;
  showBullets?: ResponsiveVisibility;
  onSelectChange?: (index: number) => void;
  onApiReady?: (api: EmblaCarouselType) => void;
  slidesPerView?: SlidesPerView;
  /** Cuántos slides avanza cada paso (flecha/drag). Default 1. Acepta el mismo mapa responsive que `slidesPerView` o `"auto"` (avanza los que entren en vista). */
  slidesToScroll?: SlidesToScroll;
  /** Espacio entre slides (px CSS). En fade no afecta entre slides superpuestos; útil si cambias a slide. */
  gap?: number;
  effect?: SliderEffect;
  loop?: boolean;
  draggable?: boolean;
  /** Alineación en modo slide */
  align?: "start" | "center" | "end";
  /** Auto-scroll continuo (tipo cinta): ajusta loop/dragFree/containScroll para ese modo. El plugin `AutoScroll` en sí lo instancia el llamador y se pasa vía `plugins`. */
  autoScroll?: boolean;
  /** Duración de la transición de scroll de Embla (unitless; default 25, mayor = más lento). */
  duration?: number;
  /** Escala el slide centrado a 1 y achica los laterales hacia minScale (efecto "zoom in" al activarse, ligado al scroll). Requiere effect "slide". */
  scaleTween?: boolean | ScaleTweenConfig;
  /** Plugins de Embla (Fade/AutoScroll/Autoplay/etc.) ya instanciados por el llamador. Referencia estable (useMemo) para no reinicializar el carrusel en cada render. */
  plugins?: EmblaPluginType[];
  bulletsContainerClassName?: string;
  bulletClassName?: string;
  bulletActiveClassName?: string;
  bulletInactiveClassName?: string;
}

interface ScaleTweenConfig {
  /** Escala mínima de los slides alejados del centro. Default 0.85 */
  minScale?: number;
  /** Override del transform-origin. Por defecto cada slide se achica HACIA el slide activo, dejando una separación pareja (≈ gap) a ambos lados. */
  origin?: string;
}

type SlidesPerView =
  | number
  | Partial<Record<Breakpoint, number>>;

type SlidesToScroll =
  | number
  | "auto"
  | Partial<Record<Breakpoint, number | "auto">>;

type SliderEffect = "slide" | "fade";
type ResponsiveVisibility =
  | boolean
  | {
      mobile?: boolean;
      desktop?: boolean;
    };

// Referencia estable para el default de `plugins`: evita que Embla reinicialice
// el carrusel en cada render cuando el llamador no pasa ninguno.
const EMPTY_PLUGINS: EmblaPluginType[] = [];

function resolveSlidesPerView(
  value: SlidesPerView | undefined,
  bp: Breakpoint,
) {
  if (!value) return 1;
  // Permite fracciones (ej. 3.5) para mostrar parte del siguiente slide
  if (typeof value === "number")
    return Math.max(0.5, value);

  const bpIndex = BREAKPOINT_ORDER.indexOf(bp);

  for (let i = bpIndex; i >= 0; i--) {
    const key = BREAKPOINT_ORDER[i];
    const v = value[key];
    if (v != null && v > 0)
      return Math.max(0.5, v);
  }

  return 1;
}

function resolveSlidesToScroll(
  value: SlidesToScroll | undefined,
  bp: Breakpoint,
): number | "auto" {
  if (value == null) return 1;
  if (typeof value !== "object")
    return value === "auto"
      ? "auto"
      : Math.max(1, Math.round(value));

  const bpIndex = BREAKPOINT_ORDER.indexOf(bp);

  for (let i = bpIndex; i >= 0; i--) {
    const v = value[BREAKPOINT_ORDER[i]];
    if (v === "auto") return "auto";
    if (v != null && v > 0)
      return Math.max(1, Math.round(v));
  }

  return 1;
}

function resolveVisibility(
  value: ResponsiveVisibility | undefined,
  bp: Breakpoint,
  defaultValue: boolean,
) {
  if (typeof value === "boolean") return value;
  if (!value) return defaultValue;

  const isDesktop =
    bp === "md" || bp === "lg" || bp === "xl";
  return isDesktop
    ? (value.desktop ?? defaultValue)
    : (value.mobile ?? defaultValue);
}

export function EmblaSlider<T>({
  slides,
  className,
  viewportClassName,
  renderSlide,
  showArrows = true,
  showBullets = false,
  onSelectChange,
  onApiReady,
  slidesPerView = 1,
  slidesToScroll = 1,
  gap = 0,
  effect = "slide",
  loop = true,
  draggable = true,
  align = "start",
  autoScroll = false,
  duration,
  scaleTween = false,
  plugins = EMPTY_PLUGINS,
  bulletsContainerClassName,
  bulletClassName,
  bulletActiveClassName,
  bulletInactiveClassName,
}: EmblaSliderProps<T>) {
  const bp = useBreakpoint();
  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const autoScrollEnabled = !!autoScroll;

  const scaleTweenEnabled =
    !!scaleTween && effect !== "fade";
  const stConfig: ScaleTweenConfig =
    typeof scaleTween === "object" ? scaleTween : {};
  const {
    minScale: stMinScale = 0.85,
    origin: stOrigin,
  } = stConfig;

  const spv = useMemo(() => {
    if (effect === "fade") return 1;
    return resolveSlidesPerView(
      slidesPerView,
      bp,
    );
  }, [slidesPerView, bp, effect]);

  // En fade cada slide es un snap propio: avanzar de a más rompe el efecto.
  const stepToScroll = useMemo(() => {
    if (effect === "fade" || autoScrollEnabled)
      return 1;
    return resolveSlidesToScroll(
      slidesToScroll,
      bp,
    );
  }, [
    slidesToScroll,
    bp,
    effect,
    autoScrollEnabled,
  ]);

  const gapPx = Math.max(0, gap);
  const shouldShowArrows = resolveVisibility(
    showArrows,
    bp,
    true,
  );
  const shouldShowBullets = resolveVisibility(
    showBullets,
    bp,
    false,
  );

  const emblaOptions = useMemo(
    () => ({
      // El auto-scroll continuo necesita loop para ser infinito. El autoplay
      // discreto respeta el `loop` explícito (p. ej. `loop={false}` +
      // `stopOnLastSnap` para detenerse al llegar al último slide).
      loop: autoScrollEnabled ? true : loop,
      align:
        effect === "fade"
          ? ("center" as const)
          : align,
      containScroll:
        effect === "fade" || autoScrollEnabled
          ? (false as const)
          : ("trimSnaps" as const),
      slidesToScroll: stepToScroll,
      skipSnaps: false,
      watchDrag: draggable,
      // dragFree evita el "snap" peleando contra el desplazamiento continuo
      dragFree: autoScrollEnabled,
      ...(duration != null ? { duration } : {}),
    }),
    [
      loop,
      effect,
      align,
      draggable,
      autoScrollEnabled,
      duration,
      stepToScroll,
    ],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    emblaOptions,
    plugins,
  );

  const basisPercent = 100 / spv;

  /** Re-medir slides cuando cambia el layout (ancho % o gap), sin depender solo del hook */
  useEffect(() => {
    if (!emblaApi) return;
    const id = requestAnimationFrame(() =>
      emblaApi.reInit(),
    );
    return () => cancelAnimationFrame(id);
  }, [emblaApi, spv, gapPx]);

  // Refs "latest callback": evita que un `onApiReady`/`onSelectChange`
  // inline (nueva identidad en cada render del padre) fuerce a re-suscribir
  // y re-disparar `handleSelect` de más — solo debe correr cuando cambia
  // `emblaApi` de verdad.
  const onApiReadyRef = useRef(onApiReady);
  const onSelectChangeRef = useRef(onSelectChange);
  useEffect(() => {
    onApiReadyRef.current = onApiReady;
    onSelectChangeRef.current = onSelectChange;
  });

  useEffect(() => {
    if (!emblaApi) return;

    onApiReadyRef.current?.(emblaApi);

    const handleSelect = () => {
      const nextIndex =
        emblaApi.selectedScrollSnap();
      setSelectedIndex(nextIndex);
      onSelectChangeRef.current?.(nextIndex);
    };

    handleSelect();
    emblaApi.on("select", handleSelect);
    emblaApi.on("reInit", handleSelect);

    return () => {
      emblaApi.off("select", handleSelect);
      emblaApi.off("reInit", handleSelect);
    };
  }, [emblaApi]);

  // Efecto "zoom in": el slide centrado queda a escala 1 y los laterales se
  // achican hacia minScale. La escala se interpola con el scroll, así que el
  // slide que entra hace zoom-in. Se escala el hijo interno del slide (no el
  // wrapper) para no afectar el gap. Replica el ejemplo oficial Embla "Scale",
  // incluyendo el ajuste del seam del loop para que no salte al dar la vuelta.
  useEffect(() => {
    if (!emblaApi || !scaleTweenEnabled) return;

    const clamp = (
      n: number,
      min: number,
      max: number,
    ) => Math.min(Math.max(n, min), max);

    const applyScale = (isScrollEvent: boolean) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const snaps = emblaApi.scrollSnapList();
      const slideNodes = emblaApi.slideNodes();
      const slidesInView = emblaApi.slidesInView();
      const factor = (1 - stMinScale) * snaps.length;

      snaps.forEach((snap, snapIndex) => {
        // En scroll solo tocamos los slides en vista (perf en galerías largas).
        if (
          isScrollEvent &&
          !slidesInView.includes(snapIndex)
        ) {
          return;
        }

        let diffToTarget = snap - scrollProgress;

        // Corrección del seam solo cuando Embla está looping de verdad.
        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach(
            (loopItem) => {
              const target = loopItem.target();
              if (
                loopItem.index === snapIndex &&
                target !== 0
              ) {
                const sign = Math.sign(target);
                if (sign === -1) {
                  diffToTarget =
                    snap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget =
                    snap + (1 - scrollProgress);
                }
              }
            },
          );
        }

        const scale = clamp(
          1 - Math.abs(diffToTarget) * factor,
          stMinScale,
          1,
        );
        const node = slideNodes[snapIndex]
          ?.firstElementChild as HTMLElement | null;
        if (node) {
          // Cada slide se achica HACIA el activo: el de la derecha hacia su
          // izquierda y el de la izquierda hacia su derecha → la separación
          // visible queda pareja (= gap) de ambos lados. `origin` lo overridea.
          node.style.transformOrigin =
            stOrigin ??
            (diffToTarget > 0
              ? "left center"
              : diffToTarget < 0
                ? "right center"
                : "center");
          node.style.transform = `scale(${scale})`;
        }
      });
    };

    const onScroll = () => applyScale(true);
    const onReset = () => applyScale(false);

    applyScale(false);
    emblaApi
      .on("scroll", onScroll)
      .on("reInit", onReset)
      .on("slideFocus", onReset);

    return () => {
      emblaApi
        .off("scroll", onScroll)
        .off("reInit", onReset)
        .off("slideFocus", onReset);
      // Limpia transforms por si scaleTween se desactiva con el slider montado.
      emblaApi.slideNodes().forEach((slideNode) => {
        const node =
          slideNode.firstElementChild as HTMLElement | null;
        if (node) {
          node.style.transform = "";
          node.style.transformOrigin = "";
        }
      });
    };
  }, [
    emblaApi,
    scaleTweenEnabled,
    stMinScale,
    stOrigin,
  ]);

  return (
    <div
      className={cn(
        "relative w-full h-full",
        className,
      )}
    >
      <div
        className={cn(
          "w-full h-full overflow-hidden",
          viewportClassName,
        )}
        ref={emblaRef}
      >
        <div
          className="flex touch-pan-y h-full"
          style={
            gapPx > 0
              ? { marginLeft: `-${gapPx}px` }
              : undefined
          }
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-0 shrink-0 grow-0"
              style={{
                flex: `0 0 ${basisPercent}%`,
                ...(gapPx > 0
                  ? { paddingLeft: `${gapPx}px` }
                  : {}),
              }}
            >
              {renderSlide(slide, index)}
            </div>
          ))}
        </div>
      </div>

      {shouldShowArrows && slides.length > 1 && (
        <div className="slide-arrows--contain">
          <button
            type="button"
            className="absolute left-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2.5 text-white flex items-center justify-center slide-arrows--prev"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            className="absolute right-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2.5 text-white flex items-center justify-center slide-arrows--next"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Siguiente slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {shouldShowBullets && slides.length > 0 && (
        <div className={cn(
          "absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 slides-bullets--contain",
          bulletsContainerClassName,
        )}>
          {slides.map((_, index) => {
            const isActive =
              selectedIndex === index;

            return (
              <button
                key={index}
                type="button"
                onClick={() =>
                  emblaApi?.scrollTo(index)
                }
                aria-label={`Ir al slide ${index + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  bulletClassName,
                  isActive
                    ? cn("w-8 bg-white active-slides-bullets", bulletActiveClassName)
                    : cn("w-2 bg-white/50", bulletInactiveClassName),
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
