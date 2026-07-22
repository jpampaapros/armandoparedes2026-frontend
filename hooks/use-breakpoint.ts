"use client";

import { useEffect, useState } from "react";

/** Breakpoints alineados a la escala por defecto de Tailwind. */
export const BREAKPOINT_ORDER = [
  "base",
  "sm",
  "md",
  "lg",
  "xl",
] as const;

export type Breakpoint =
  (typeof BREAKPOINT_ORDER)[number];

/** Número fijo o valor responsive por breakpoint (se resuelve con el actual). */
export type ResponsiveNumber =
  | number
  | Partial<Record<Breakpoint, number>>;

/**
 * Devuelve el breakpoint actual ("base" | "sm" | "md" | "lg" | "xl"),
 * actualizado con debounce en cada resize.
 */
export function useBreakpoint() {
  const [bp, setBp] = useState<Breakpoint>("base");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setBp("xl");
      else if (w >= 1024) setBp("lg");
      else if (w >= 768) setBp("md");
      else if (w >= 640) setBp("sm");
      else setBp("base");
    };

    // Debounce: un resize manual dispara decenas de eventos por segundo; sin
    // esto, cada consumidor re-renderiza (y un carrusel, por ejemplo, se
    // reinicializa junto con sus plugins) a mitad de gesto.
    let resizeTimeoutId: ReturnType<typeof setTimeout>;
    const debouncedUpdate = () => {
      clearTimeout(resizeTimeoutId);
      resizeTimeoutId = setTimeout(update, 200);
    };

    update();
    window.addEventListener("resize", debouncedUpdate);
    return () => {
      clearTimeout(resizeTimeoutId);
      window.removeEventListener("resize", debouncedUpdate);
    };
  }, []);

  return bp;
}

/**
 * Resuelve un número responsive (`{ base, md, ... }`) al breakpoint actual,
 * tomando el valor del breakpoint igual o más chico más cercano.
 */
export function resolveResponsiveNumber(
  value: ResponsiveNumber | undefined,
  bp: Breakpoint,
  fallback: number,
) {
  if (value == null) return fallback;
  if (typeof value === "number") return value;

  const bpIndex = BREAKPOINT_ORDER.indexOf(bp);
  for (let i = bpIndex; i >= 0; i--) {
    const v = value[BREAKPOINT_ORDER[i]];
    if (v != null) return v;
  }

  return fallback;
}
