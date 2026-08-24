"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { WPCategory } from "@/lib/types";

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
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
        value={selected}
        onChange={(e) => handleChange(e.target.value)}
        className="h-52 w-full appearance-none rounded-10 border border-border-light bg-white px-24 pb-0 pt-[calc(7px+6px)] pr-52 text-left font-gotham text-18 font-medium leading-normal text-text-muted focus:outline-none focus:ring-2 focus:ring-peach md:text-22"
      >
        <option value="" className="bg-white text-near-black">Categorías</option>
        {categories.map((category) => (
          <option key={category.id} value={category.slug} className="bg-white text-near-black">
            {category.name}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-20 top-1/2 h-20 w-20 -translate-y-1/2 text-text-muted" />
    </div>
  );
}
