"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
};

function DoubleChevron({ direction }: { direction: "left" | "right" }) {
  const rotate = direction === "left" ? "rotate-180" : "";
  return (
    <svg
      className={`h-24 w-24 text-current ${rotate}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
      <polyline points="13 18 19 12 13 6" />
    </svg>
  );
}

export function BlogPagination({ currentPage, totalPages }: BlogPaginationProps) {
  const searchParams = useSearchParams();

  function buildHref(page: number): string {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete("pagina");
    } else {
      params.set("pagina", String(page));
    }
    const query = params.toString();
    return query ? `/blog?${query}` : "/blog";
  }

  if (totalPages <= 1) return null;

  const pages: number[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (currentPage <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push(-1);
    pages.push(totalPages);
  } else if (currentPage >= totalPages - 3) {
    pages.push(1);
    pages.push(-1);
    for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    pages.push(-1);
    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
    pages.push(-1);
    pages.push(totalPages);
  }

  return (
    <nav aria-label="Paginación del blog">
      <div className="flex items-center justify-center gap-12">
        <span className="hidden font-gotham text-18 font-normal text-peach md:inline md:text-20">
          Ir a página
        </span>
        <div className="flex items-center gap-[calc(12*var(--fx))] md:gap-4">
          {currentPage === 1 && (
            <span
              aria-hidden="true"
              className="-mr-[calc(8*var(--fx))] inline-flex h-30 w-30 items-center justify-center text-near-black opacity-40 md:hidden"
            >
              <DoubleChevron direction="left" />
            </span>
          )}
          {currentPage > 1 && (
            <Link
              href={buildHref(currentPage - 1)}
              aria-label="Ir a la página anterior"
              className="-mr-[calc(8*var(--fx))] inline-flex h-30 w-30 items-center justify-center text-near-black transition-colors hover:text-peach md:mr-0"
            >
              <DoubleChevron direction="left" />
            </Link>
          )}
          <ul className="flex list-none items-center gap-4 [padding-inline:0] md:[padding-inline:revert]">
            {pages.map((page, index) => {
              if (page === -1) {
                return (
                  <li key={`ellipsis-${index}`}>
                    <span className="inline-flex h-30 w-24 items-center justify-center font-gotham text-20 font-normal text-near-black">
                      …
                    </span>
                  </li>
                );
              }
              const isActive = page === currentPage;
              return (
                <li key={page}>
                  <Link
                    href={buildHref(page)}
                    className={`grid size-[30px] place-items-center rounded-full font-gotham text-20 font-normal leading-none transition-colors ${
                      isActive
                        ? "bg-peach text-near-black"
                        : "text-near-black hover:text-peach"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="block leading-none">{page}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={currentPage < totalPages ? buildHref(currentPage + 1) : "#"}
            aria-disabled={currentPage >= totalPages}
            aria-label="Ir a la página siguiente"
            className={`inline-flex h-30 w-30 items-center justify-center text-near-black transition-colors ${
              currentPage >= totalPages
                ? "pointer-events-none opacity-40"
                : "hover:text-peach"
            }`}
          >
            <DoubleChevron direction="right" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
