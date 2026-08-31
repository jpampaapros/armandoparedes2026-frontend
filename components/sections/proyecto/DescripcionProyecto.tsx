import Image from "next/image";
import type { ACFImage } from "@/lib/types";

type DescripcionProyectoProps = {
  titulo?: string;
  descripcion?: string;
  imagen?: ACFImage;
  cambiar_lado?: boolean;
};

export function DescripcionProyecto({ titulo, descripcion, imagen, cambiar_lado }: DescripcionProyectoProps) {
  let head = "";
  let tail = "";
  const normalized = (titulo || "").trim();
  if (normalized) {
    const splitMarker = " si estás ";
    const idx = normalized.toLowerCase().indexOf(splitMarker);
    if (idx >= 0) {
      head = normalized.slice(0, idx + splitMarker.length - 1).trimEnd();
      tail = normalized.slice(idx + splitMarker.length).trim();
    } else {
      const words = normalized.split(" ");
      head = words.slice(0, -1).join(" ");
      tail = words.at(-1) || "";
    }
  }

  const imageCell = (
    <div className="relative h-430 w-full md:h-772">
      {imagen?.url ? (
        <Image
          src={imagen.url}
          alt={imagen.alt || ""}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      ) : (
        <div className="h-full w-full bg-neutral-100" />
      )}
    </div>
  );

  const textCell = (
    <div className="flex flex-col justify-start px-16 pt-48 pb-38 md:pb-0 md:pt-0 md:px-0">
      <div className="mx-auto w-full max-w-573">
        <div className={cambiar_lado ? "text-left" : "text-right"}>
          {tail ? (
            <h2
              className="m-0 font-gotham text-32 leading-[1.1] text-near-black md:text-60 md:leading-60" /* leading-[1.1] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */
              dangerouslySetInnerHTML={{
                __html: `${head}<span class="font-medium text-peach"> ${tail}</span>`,
              }}
            />
          ) : (
            <h2 className="m-0 font-gotham text-32 font-light leading-[1.1] text-near-black md:text-60 md:leading-60">
              {titulo}
            </h2>
          )}
        </div>
        {descripcion && (
          <div
            className={`mt-24 font-gotham text-16 leading-[1.5] text-near-black md:mt-40 md:text-24 md:leading-38 [&_p]:m-0 ${
              cambiar_lado ? "text-left" : "text-right"
            }`}
            dangerouslySetInnerHTML={{ __html: descripcion }}
          />
        )}
      </div>
    </div>
  );

  return (
    <section data-layout="descripcion_proyecto" className="w-full bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div
          className={`${cambiar_lado ? "order-2 md:order-2" : "order-2 md:order-1"} px-[calc(15*var(--fx))] pb-[calc(15*var(--fx))] md:px-0 md:pb-0`}
        >
          {imageCell}
        </div>
        <div
          className={`${cambiar_lado ? "order-1 md:order-1" : "order-1 md:order-2"} w-full items-center justify-center md:flex`}
        >
          {textCell}
        </div>
      </div>
    </section>
  );
}
