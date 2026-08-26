"use client";

import Image from "next/image";
import Link from "next/link";
import type { Delivered } from "@/lib/types";

export function DeliveredCard({
  project,
  size = "small",
  priority = false,
  showYear = true,
  showButton = false,
  distrito,
  mobileYear24 = false,
}: {
  project: Delivered;
  size?: "large" | "small";
  priority?: boolean;
  showYear?: boolean;
  showButton?: boolean;
  distrito?: string;
  mobileYear24?: boolean;
}) {
  const image = project._embedded?.["wp:featuredmedia"]?.[0];
  const isLarge = size === "large";

  const titleClass = isLarge
    ? "text-20 md:text-36"
    : "text-20 md:text-16";
  const metaClass = isLarge
    ? "text-16 md:text-24"
    : "text-16 md:text-16";
  const paddingClass = isLarge
    ? "p-16 md:p-54"
    : "p-16 md:p-20";
  const yearClass = mobileYear24
    ? isLarge
      ? "text-[calc(24*var(--fx))] md:text-24"
      : "text-[calc(24*var(--fx))] md:text-16"
    : metaClass;

  return (
    <Link
      href={`/entregados/${project.slug}`}
      prefetch={false}
      data-card="entregado"
      className={`group relative flex h-full w-full min-w-0 flex-col overflow-hidden bg-near-black text-white ${paddingClass}`}
    >
      {image?.source_url && (
        <Image
          src={image.source_url}
          alt={image.alt_text || project.title.rendered}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 382px, 630px"
          priority={priority}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="relative z-10 mt-auto flex flex-col gap-10">
        <div className="flex flex-col gap-8">
          <h3 className={`font-gotham font-bold uppercase leading-[1.1] text-white ${titleClass}`} /* leading-[1.1] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */>
            {project.title.rendered}
          </h3>
          <hr className="h-px w-full border-0 bg-white" />
        </div>
        {distrito && (
          <p className={`font-poppins font-light leading-[1.2] text-white ${metaClass}`} /* leading-[1.2] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */>
            {distrito}
          </p>
        )}
        {showYear && (
          <p className={`font-poppins font-light leading-[1.2] text-white ${yearClass}`} /* leading-[1.2] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */>
            {project.acf.ano}
          </p>
        )}
        {showButton && (
          <span className="inline-flex h-40 w-max items-center justify-center border border-white px-20 font-gotham text-14 font-bold uppercase text-white md:h-50 md:text-16">
            Ver proyecto
          </span>
        )}
      </div>
    </Link>
  );
}
