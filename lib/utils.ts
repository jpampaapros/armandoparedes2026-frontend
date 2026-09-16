import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
