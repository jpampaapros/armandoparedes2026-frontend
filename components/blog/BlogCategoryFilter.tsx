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
      <ChevronDownIcon className="pointer-events-none absolute right-20 top-1/2 h-[11px] w-[20px] -translate-y-1/2" />
    </div>
  );
}
