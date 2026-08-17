import Image from "next/image";
import type { ACFImage } from "@/lib/types";

type BannerEntregadosPageProps = {
  titulo?: string;
  descripcion?: string;
  imagen?: ACFImage;
};

/** Banner exclusivo de /proyectos-entregados. */
export function BannerEntregadosPage({
  titulo,
  descripcion,
  imagen,
}: BannerEntregadosPageProps) {
  return (
    <section
      data-section="banner-entregados-page"
      className="relative flex h-[calc(500*var(--fx))] w-full items-center justify-center overflow-hidden bg-near-black md:h-[calc(600*var(--fx))]"
    >
      {imagen?.url && (
        <Image
          src={imagen.url}
          alt={imagen.alt || ""}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex w-full flex-col items-center px-24 text-center text-white md:px-[calc(80*var(--fx))]">
        {titulo && (
          <h1
            className="m-0 font-gotham text-42 font-light leading-[1] text-white md:text-[calc(95*var(--fx))] [&_p]:m-0 [&_strong]:font-medium [&_strong]:text-white"
            dangerouslySetInnerHTML={{ __html: titulo }}
          />
        )}
        {descripcion && (
          <div
            className="mt-[calc(24*var(--fx))] max-w-[calc(720*var(--fx))] font-poppins text-14 font-light leading-[1.4] text-white md:text-[calc(18*var(--fx))] [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: descripcion }}
          />
        )}
      </div>
    </section>
  );
}
