import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ACFList, ACFPostObject } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripHtml(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}


/**
 * Normaliza un repeater de ACF a un array real.
 *
 * ACF devuelve `false` cuando el repeater está vacío, así que ni un default de prop
 * (`= []`) ni `??` ni `?.` lo protegen: `false.map(...)` revienta el prerender con
 * "x.map is not a function" y tumba el build entero.
 */
export function toArray<T>(value: T[] | false | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

/**
 * True/false de ACF vía REST: puede llegar como boolean, 0/1 o "0"/"1".
 * Usar para `ocultar_seccion`, `desactivar_seccion`, etc.
 */
export function isAcfTrue(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

/**
 * Filtra una colección del REST con la selección de un campo "post object" de ACF,
 * respetando el orden en que el editor ordenó los posts.
 *
 * Sin selección devuelve la colección completa: es el comportamiento previo al campo
 * y el que siguen necesitando los grupos de ACF donde todavía no existe.
 */
export function selectByPostObject<T extends { id: number }>(
  items: T[],
  seleccion: ACFList<ACFPostObject | number> | undefined,
): T[] {
  const ids = toArray(seleccion)
    .map((entry) => (typeof entry === "number" ? entry : entry?.ID ?? entry?.id))
    .filter((id): id is number => typeof id === "number");

  if (ids.length === 0) return items;

  const byId = new Map(items.map((item) => [item.id, item]));

  return ids
    .map((id) => byId.get(id))
    .filter((item): item is T => item !== undefined);
}
