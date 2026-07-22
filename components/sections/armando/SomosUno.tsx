import { stripHtml } from "@/lib/utils";
import Image from "next/image";
import type { ACFImage } from "@/lib/types";

type SomosUnoProps = {
  imagen_primaria?: ACFImage;
  imagen_secundaria?: ACFImage;
  frase?: string;
  titulo?: string;
  texto?: string;
};

export function SomosUno({
  imagen_primaria,
  imagen_secundaria,
  frase,
  titulo,
  texto,
}: SomosUnoProps) {
  return (
    <section className="relative w-full overflow-hidden md:h-700">
      {imagen_primaria?.url ? (
        <Image
          src={imagen_primaria.url}
          alt={stripHtml(imagen_primaria.alt || titulo) || ""}
          fill
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-light-gray" />
      )}

      <div className="relative mx-auto flex h-full min-h-600 max-w-1440 flex-col justify-between px-16 py-40 md:absolute md:inset-0 md:px-80 md:py-60">
        {frase && (
          <div className="w-fit bg-slate px-16 py-12 md:max-w-430 md:px-24 md:py-20">
            <p className="font-poppins text-16 font-light italic text-white md:text-24">
              {frase}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-24 md:flex-row md:items-end md:justify-between">
          <div className="bg-peach px-16 py-20 md:max-w-520 md:px-40 md:py-40">
            {titulo && (
              <h2 className="font-gotham text-28 font-medium leading-[1.1] text-near-black md:text-48">
                {titulo}
              </h2>
            )}
            {texto && (
              <div
                className="mt-16 font-poppins text-14 font-light leading-[1.5] text-near-black md:mt-24 md:text-20"
                dangerouslySetInnerHTML={{ __html: texto }}
              />
            )}
          </div>

          {imagen_secundaria?.url && (
            <div className="relative h-280 w-full md:h-400 md:w-400">
              <Image
                src={imagen_secundaria.url}
                alt={imagen_secundaria.alt || ""}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
