import { stripHtml } from "@/lib/utils";
import Image from "next/image";
import type { ACFImage } from "@/lib/types";

type BannerProps = {
  titulo?: string;
  descripcion?: string;
  imagen_fondo?: ACFImage;
  imagen_decorativa?: ACFImage;
};

function renderTitle(titulo?: string) {
  if (!titulo) return null;

  const separator = " / ";
  const index = titulo.indexOf(separator);
  if (index === -1) {
    return <h1 className="font-gotham text-48 font-light leading-[1] text-near-black md:text-90">{titulo}</h1>;
  }

  const first = titulo.slice(0, index); // "Armando"
  const second = titulo.slice(index + separator.length); // "el Arquitecto"

  return (
    <h1 className="font-gotham text-48 font-light leading-[1] text-near-black md:text-90">
      <span className="block">{first}</span>
      <span className="block w-fit border-b-2 border-near-black pb-2 font-gotham-black md:border-b-4 md:pb-4">
        {second}
      </span>
    </h1>
  );
}

export function Banner({ titulo, descripcion, imagen_fondo, imagen_decorativa }: BannerProps) {
  return (
    <section className="relative w-full overflow-hidden">
      {imagen_fondo?.url ? (
        <Image
          src={imagen_fondo.url}
          alt={imagen_fondo.alt || stripHtml(titulo) || ""}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      ) : null}
      <div className="absolute inset-0 bg-white/90 md:bg-white/80" />

      <div className="relative mx-auto max-w-1440 px-16 py-80 md:px-80 md:py-120">
        <div className="grid items-end gap-40 md:grid-cols-2 md:gap-24">
          <div className="flex flex-col gap-24 md:gap-31">
            {renderTitle(titulo)}
          </div>

          <div className="flex flex-col gap-24 md:items-end md:gap-31">
            {descripcion && (
              <div
                className="max-w-480 font-poppins text-16 font-light leading-[1.5] text-warm-gray md:text-right md:text-22"
                dangerouslySetInnerHTML={{ __html: descripcion }}
              />
            )}

            {imagen_decorativa?.url ? (
              <div className="relative h-280 w-full md:h-420 md:w-480">
                <Image
                  src={imagen_decorativa.url}
                  alt={stripHtml(imagen_decorativa.alt || titulo) || ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 480px"
                  priority
                />
              </div>
            ) : (
              <div className="h-280 w-full bg-light-gray md:h-420 md:w-480" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
