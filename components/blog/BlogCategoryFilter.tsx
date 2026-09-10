"use client";

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

type BlogCategoryFilterProps = {
  categories: WPCategory[];
};

export function BlogCategoryFilter({ categories }: BlogCategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get("categoria") || "";
  const parentCategories = categories.filter((category) => category.parent === 0);
  const selectedCategory = parentCategories.find((category) => category.slug === selected);

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("categoria", value);
    } else {
      params.delete("categoria");
    }
    params.delete("pagina");
    router.push(`/blog?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="relative w-full md:w-326">
      <label htmlFor="blog-category" className="sr-only">
        Filtrar por categoría
      </label>
      <select
        id="blog-category"
        value={selectedCategory ? selected : ""}
        onChange={(e) => handleChange(e.target.value)}
        className="block h-[calc(56*var(--fx))] w-full appearance-none rounded-10 border border-border-light bg-white px-24 py-0 pr-52 text-left font-sans md:font-gotham text-[calc(22*var(--fx))] font-medium not-italic leading-[normal] text-transparent focus:outline-none focus:ring-0 md:h-52 md:text-text-muted"
      >
        <option value="" className="bg-white text-near-black">Categorías</option>
        {parentCategories.map((category) => (
          <option key={category.id} value={category.slug} className="bg-white text-near-black">
            {category.name}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center px-24 pr-52 font-sans text-[calc(22*var(--fx))] font-medium leading-[1.3] text-text-muted md:hidden"
      >
        <span className="truncate">{selectedCategory?.name || "Categorías"}</span>
      </span>
      <ChevronDownIcon className="pointer-events-none absolute right-20 top-1/2 h-[calc(11*var(--fx))] w-[calc(20*var(--fx))] -translate-y-1/2 md:h-[11px] md:w-[20px]" />
    </div>
  );
}
