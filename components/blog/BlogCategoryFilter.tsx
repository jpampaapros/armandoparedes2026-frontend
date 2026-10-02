"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { WPCategory } from "@/lib/types";

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="11"
      className={className}
      viewBox="0 0 20 11"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 1.19583L9.66917 10.865L19.3383 1.19583L18.1254 0L9.66917 8.45625L1.21292 0L0 1.19583Z"
        fill="#707070"
      />
    </svg>
  );
}

// Categoría por defecto de WordPress; no se ofrece como filtro.
const HIDDEN_CATEGORY_SLUGS = ["sin-categoria", "uncategorized"];

// WordPress devuelve los nombres con entidades HTML ("Diseño &amp; Arquitectura").
function decodeEntities(text: string) {
  return text.replace(/&amp;/g, "&").replace(/&#0?38;/g, "&");
}

type BlogCategoryFilterProps = {
  categories: WPCategory[];
};

export function BlogCategoryFilter({ categories }: BlogCategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = searchParams.get("categoria") || "";
  const parentCategories = categories.filter(
    (category) => category.parent === 0 && !HIDDEN_CATEGORY_SLUGS.includes(category.slug),
  );
  const selectedCategory = parentCategories.find((category) => category.slug === selected);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Volver a elegir la categoría activa la quita y muestra todas.
  function handleSelect(slug: string) {
    setOpen(false);
    const params = new URLSearchParams(searchParams.toString());
    if (slug !== selectedCategory?.slug) {
      params.set("categoria", slug);
    } else {
      params.delete("categoria");
    }
    params.delete("pagina");
    router.push(`/blog?${params.toString()}`, { scroll: false });
  }

  return (
    <div ref={ref} className="relative w-full md:w-326">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Filtrar por categoría"
        className="flex h-56 w-full cursor-pointer items-center rounded-10 border border-solid border-border-light bg-white px-24 pr-52 text-left font-sans text-22 font-medium not-italic leading-[normal] text-text-muted outline-none md:h-52 md:font-gotham"
      >
        <span className="truncate">{selectedCategory ? decodeEntities(selectedCategory.name) : "Categorías"}</span>
      </button>
      <ChevronDownIcon
        className={`pointer-events-none absolute right-20 top-1/2 h-11 w-20 -translate-y-1/2 transition-transform md:h-[11px] md:w-[20px] ${open ? "rotate-180" : ""}`}
      />
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-20 m-0 mt-4 flex w-full list-none flex-col overflow-hidden rounded-10 border border-solid border-border-light bg-white p-0 shadow-md"
        >
          {parentCategories.map((category) => {
            const isSelected = category.slug === selectedCategory?.slug;
            return (
              <li key={category.id} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => handleSelect(category.slug)}
                  className={`w-full cursor-pointer border-0 bg-transparent px-24 py-12 text-left font-sans text-18 leading-[1.3] hover:bg-bg md:font-gotham ${isSelected ? "font-bold text-near-black" : "font-medium text-text-muted"}`}
                >
                  {decodeEntities(category.name)}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
