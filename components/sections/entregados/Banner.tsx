import Image from "next/image";
import type { ACFImage } from "@/lib/types";

type BannerProps = {
  titulo?: string;
  descripcion?: string;
  imagen?: ACFImage;
};

export function Banner({ titulo, descripcion, imagen }: BannerProps) {
  return (
    <section
      data-section="banner"
      className="flex w-full flex-col bg-white md:flex-row md:h-700"
    >
      <div className="relative h-414 w-full md:h-auto md:w-1/2">
        {imagen?.url ? (
          <Image
            src={imagen.url}
            alt={imagen.alt || ""}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-light-gray" />
        )}
      </div>

      <div className="flex w-full flex-col justify-center bg-white px-16 py-40 md:w-1/2 md:px-80 md:py-60">
        {titulo && (
          <h1
            className="font-ga-maamli text-36 leading-[1.1] text-near-black md:text-60 [&_span]:font-light [&_strong]:font-medium [&_strong]:text-peach"
            dangerouslySetInnerHTML={{ __html: titulo }}
          />
        )}
        {descripcion && (
          <div
            className="mt-16 font-poppins text-16 font-light leading-24 text-near-black md:mt-24 md:text-24 md:leading-30"
            dangerouslySetInnerHTML={{ __html: descripcion }}
          />
        )}
      </div>
    </section>
  );
}
