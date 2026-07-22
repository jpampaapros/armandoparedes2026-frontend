import Image from "next/image";
import type { ACFImage } from "@/lib/types";

type MapaProyectoProps = {
  titulo?: string;
  imagen?: ACFImage;
  ubicaciones?: { nombre?: string; icono?: ACFImage; minutos?: string }[];
};

export function MapaProyecto({ titulo, imagen, ubicaciones = [] }: MapaProyectoProps) {
  return (
    <section data-layout="mapa" className="w-full bg-peach md:pb-153 md:pt-110">
      <div className="mx-auto flex max-w-1440 flex-col px-16 md:flex-row md:px-80">
        <div className="relative h-273 w-full overflow-hidden rounded-15 md:h-730 md:w-875 md:rounded-35">
          {imagen?.url ? (
            <Image
              src={imagen.url}
              alt={imagen.alt || titulo || ""}
              fill
              sizes="(max-width: 768px) 100vw, 75vw"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-neutral-200" />
          )}
        </div>

        <div className="mt-27 w-full px-16 pt-34 pb-40 md:ml-16 md:mt-0 md:w-389 md:rounded-30 md:bg-near-black md:px-40 md:pt-53">
          {titulo && (
            <h2 className="m-0 font-gotham text-32 font-medium text-white">
              {titulo}
            </h2>
          )}

          <ul className="mt-24 flex flex-col md:mt-40">
            {ubicaciones.map((u, i) => (
              <li key={i} className="border-b border-white/20 py-12 first:pt-0 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-12">
                    {u.icono?.url && (
                      <Image
                        src={u.icono.url}
                        alt={u.icono.alt || ""}
                        width={17}
                        height={17}
                        className="h-17 w-17 object-contain"
                      />
                    )}
                    <span className="font-poppins text-13 font-medium uppercase text-white">
                      {u.nombre}
                    </span>
                  </div>
                  {u.minutos && (
                    <span className="font-poppins text-13 font-medium text-white">
                      {u.minutos}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
