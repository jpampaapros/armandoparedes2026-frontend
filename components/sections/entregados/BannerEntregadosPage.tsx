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
      className="relative flex h-500 w-full items-center justify-center overflow-hidden bg-near-black md:h-600"
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

      <div className="relative z-10 flex w-full flex-col items-center px-24 text-center text-white md:px-80">
        {titulo && (
          <h1
            className="m-0 font-gotham text-42 font-light leading-[1] text-white md:text-95 [&_p]:m-0 [&_strong]:font-medium [&_strong]:text-white"
            dangerouslySetInnerHTML={{ __html: titulo }}
          />
        )}
        {descripcion && (
          <div
            className="mt-24 max-w-720 font-poppins text-14 font-light leading-[1.4] text-white md:text-18 [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: descripcion }}
          />
        )}
      </div>
    </section>
  );
}
