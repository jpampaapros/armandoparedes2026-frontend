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
    <section className="relative w-full overflow-hidden bg-white md:h-[calc(1615*var(--fx))]">
      <div className="grid w-full grid-cols-1 md:h-full md:grid-cols-[55.625%_44.375%] md:grid-rows-[calc(850*var(--fx))_calc(765*var(--fx))]">
        <div className="relative h-360 w-full bg-light-gray md:col-span-2 md:h-[calc(850*var(--fx))]">
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
          <div className="flex min-h-[calc(250*var(--fx))] w-full items-center justify-center bg-slate px-[calc(30*var(--fx))] py-[calc(40*var(--fx))] text-center md:hidden">
            <div>
              <span
                aria-hidden="true"
                className="block text-center font-gotham-black text-[calc(85*var(--fx))] font-medium not-italic leading-[calc(35*var(--fx))] text-white"
              >
                “
              </span>
              <p className="m-0 mt-10 font-poppins text-14 font-light leading-[1.45] text-white">
                {frase}
              </p>
            </div>
          </div>
        )}

        <div className="flex min-h-360 w-full flex-col justify-center bg-peach px-30 py-50 md:h-[calc(765*var(--fx))] md:min-h-0 md:px-[calc(80*var(--fx))] md:py-[calc(48*var(--fx))]">
          {titulo && (
            <h2
              className="m-0 w-[calc(512*var(--fx))] max-w-full font-gotham text-32 font-light leading-[1.15] text-near-black md:text-[calc(42*var(--fx))] [&_strong]:font-medium"
              dangerouslySetInnerHTML={{ __html: titulo }}
            />
          )}
          {texto && (
            <div
              className="mt-24 max-w-480 font-poppins text-14 font-light leading-[1.5] text-near-black md:mt-[calc(28*var(--fx))] md:text-[calc(16*var(--fx))] [&_p]:m-0 [&_p+p]:mt-[calc(22*var(--fx))]"
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
        <div className="absolute right-[calc(140*var(--fx))] top-[calc(400*var(--fx))] z-10 hidden h-[calc(571*var(--fx))] w-[calc(590*var(--fx))] items-center justify-center bg-slate px-[calc(55*var(--fx))] py-[calc(40*var(--fx))] text-center md:flex">
          <div>
            <span
              aria-hidden="true"
              className="block text-center font-gotham-black text-[calc(85*var(--fx))] font-medium not-italic leading-[calc(35*var(--fx))] text-white"
            >
              “
            </span>
            <p className="m-0 mt-10 font-poppins text-14 font-light leading-[1.45] text-white md:text-[calc(16*var(--fx))]">
              {frase}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
