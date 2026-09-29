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
    <section className="relative w-full overflow-hidden bg-white md:h-1615">
      <div className="grid w-full grid-cols-1 md:h-full md:grid-cols-[55.625%_44.375%] md:grid-rows-[calc(850*var(--fx))_calc(765*var(--fx))]">
        <div className="relative h-360 w-full bg-light-gray md:col-span-2 md:h-850">
          {imagen_primaria?.url && (
            <Image
              src={imagen_primaria.url}
              alt={stripHtml(imagen_primaria.alt || titulo) || ""}
              fill
              className="object-cover"
              sizes="100vw"
            />
          )}
        </div>

        {frase && (
          <div className="relative z-10 mx-auto -mb-160 -mt-155 flex min-h-315 w-326 max-w-[calc(100%_-_32*var(--fx))] items-center justify-center bg-slate px-30 py-40 text-center md:hidden">
            <div>
              <span
                aria-hidden="true"
                className="block text-center font-gotham-black text-85 font-medium not-italic leading-35 text-white"
              >
                “
              </span>
              <p className="m-0 mt-10 font-poppins text-14 font-light leading-[1.45] text-white">
                {frase}
              </p>
            </div>
          </div>
        )}

        <div className="flex min-h-360 w-full flex-col justify-center bg-peach px-30 pb-50 pt-210 md:h-765 md:min-h-0 md:px-80 md:py-48">
          {titulo && (
            <h2
              className="mx-0 mb-0 mt-24 w-512 max-w-full font-gotham text-32 font-normal leading-[1.15] text-near-black md:mt-0 md:text-42 [&_strong]:font-medium"
              dangerouslySetInnerHTML={{ __html: titulo }}
            />
          )}
          {texto && (
            <div
              className="mt-24 max-w-480 font-poppins text-14 font-light leading-[1.5] text-near-black md:mt-28 md:text-16 [&_p]:m-0 [&_p+p]:mt-22"
              dangerouslySetInnerHTML={{ __html: texto }}
            />
          )}
        </div>

        <div className="relative h-360 w-full bg-light-gray md:h-full">
          {imagen_secundaria?.url && (
            <Image
              src={imagen_secundaria.url}
              alt={imagen_secundaria.alt || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          )}
        </div>
      </div>

      {frase && (
        <div className="absolute right-140 top-400 z-10 hidden h-571 w-590 items-center justify-center bg-slate px-55 py-40 text-center md:flex">
          <div>
            <span
              aria-hidden="true"
              className="block text-center font-gotham-black text-85 font-medium not-italic leading-35 text-white"
            >
              “
            </span>
            <p className="m-0 mt-10 font-poppins text-14 font-light leading-[1.45] text-white md:text-16">
              {frase}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
