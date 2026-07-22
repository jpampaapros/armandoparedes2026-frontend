import Link from "next/link";
import { resolveWordPressUrl } from "@/lib/urls";
import { ChevronLeft } from "@/components/icons/ChevronLeft";
import { ChevronRight } from "@/components/icons/ChevronRight";
import type { ACFLink, Delivered } from "@/lib/types";

function sortDeliveredByYear(list: Delivered[]) {
  return [...list].sort((a, b) => {
    const yearA = Number(a.acf?.ano ?? 0);
    const yearB = Number(b.acf?.ano ?? 0);
    if (yearB !== yearA) return yearB - yearA;
    return a.title.rendered.localeCompare(b.title.rendered);
  });
}

function resolveNavLink(
  current: Delivered,
  entregados: Delivered[],
  link?: ACFLink,
  direction: "prev" | "next" = "prev"
): ACFLink | undefined {
  if (link?.url) {
    return link;
  }

  const sorted = sortDeliveredByYear(entregados);
  const index = sorted.findIndex((d) => d.id === current.id);
  if (index === -1) return undefined;

  const neighbor =
    direction === "prev"
      ? sorted[index - 1]
      : sorted[index + 1];

  if (!neighbor) return undefined;

  return {
    title: neighbor.title.rendered,
    url: `/entregados/${neighbor.slug}`,
    target: "",
  };
}

type NavegacionProps = {
  current: Delivered;
  entregados: Delivered[];
};

export function Navegacion({ current, entregados }: NavegacionProps) {
  const prev = resolveNavLink(
    current,
    entregados,
    current.acf?.navegacion_anterior,
    "prev"
  );
  const next = resolveNavLink(
    current,
    entregados,
    current.acf?.navegacion_posterior,
    "next"
  );

  const year = current.acf?.ano ?? "";
  const subtitle = current.acf?.distrito
    ? `${current.title.rendered}, ${current.acf.distrito}`
    : current.title.rendered;

  return (
    <nav
      data-section="navegacion"
      className="w-full bg-peach px-10 py-10 md:px-574 md:py-10"
    >
      <div className="mx-auto flex max-w-1440 items-center justify-between gap-16">
        <div className="flex-1">
          {prev?.url ? (
            <Link
              href={resolveWordPressUrl(prev.url)}
              target={prev.target || undefined}
              prefetch={false}
              className="group flex items-center gap-10 text-black transition-opacity hover:opacity-70"
            >
              <ChevronLeft className="h-24 w-24" />
            </Link>
          ) : (
            <span className="invisible flex items-center gap-10">
              <ChevronLeft className="h-24 w-24" />
            </span>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 text-center text-black">
          {year && (
            <span className="font-poppins text-16 font-light">{year}</span>
          )}
          <span className="font-poppins text-20 font-semibold italic leading-22 md:text-22">
            {subtitle}
          </span>
        </div>

        <div className="flex-1 text-right">
          {next?.url ? (
            <Link
              href={resolveWordPressUrl(next.url)}
              target={next.target || undefined}
              prefetch={false}
              className="group inline-flex items-center justify-end gap-10 text-black transition-opacity hover:opacity-70"
            >
              <ChevronRight className="h-24 w-24" />
            </Link>
          ) : (
            <span className="invisible inline-flex items-center gap-10">
              <ChevronRight className="h-24 w-24" />
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
