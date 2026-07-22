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
      <div className="flex flex-col items-center justify-center gap-16 md:flex-row md:gap-30">
        <span className="hidden font-gotham text-22 font-medium text-peach md:block">
          Ir a página
        </span>
        <div className="flex items-center gap-16 md:gap-30">
          <Link
            href={currentPage > 1 ? buildHref(currentPage - 1) : "#"}
            aria-disabled={currentPage <= 1}
            className={`inline-flex h-32 w-32 items-center justify-center text-near-black transition-colors md:h-40 md:w-40 ${
              currentPage <= 1
                ? "pointer-events-none opacity-40"
                : "hover:text-peach"
            }`}
          >
            <DoubleChevron direction="left" />
          </Link>
          <ul className="flex list-none items-center gap-16 md:gap-30">
            {pages.map((page, index) => {
              if (page === -1) {
                return (
                  <li key={`ellipsis-${index}`}>
                    <span className="inline-flex h-32 w-32 items-center justify-center font-gotham text-22 font-light text-near-black md:h-40 md:w-40 md:text-25">
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
                    className={`inline-flex h-32 w-32 items-center justify-center font-gotham text-22 font-medium transition-colors md:h-40 md:w-40 md:text-25 ${
                      isActive
                        ? "rounded-full bg-peach text-near-black underline md:bg-transparent md:text-near-black md:underline"
                        : "font-light text-near-black hover:text-peach"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {page}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={currentPage < totalPages ? buildHref(currentPage + 1) : "#"}
            aria-disabled={currentPage >= totalPages}
            className={`inline-flex h-32 w-32 items-center justify-center text-near-black transition-colors md:h-40 md:w-40 ${
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
