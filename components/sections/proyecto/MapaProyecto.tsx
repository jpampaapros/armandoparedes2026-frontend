import Image from "next/image";
import { getGoogleMapsCoordinateUrl, getGoogleMapsEmbedUrl } from "@/lib/google-maps-embed";
import type { ACFImage } from "@/lib/types";

type MapaProyectoProps = {
  titulo?: string;
  google_maps?: string;
  latitud?: number | string;
  longitud?: number | string;
  ubicaciones?: { nombre?: string; icono?: ACFImage; minutos?: string }[];
};

export function MapaProyecto({ titulo, google_maps, latitud, longitud, ubicaciones = [] }: MapaProyectoProps) {
  const mapUrl = getGoogleMapsCoordinateUrl(latitud, longitud) ?? getGoogleMapsEmbedUrl(google_maps);
  return (
    <section
      data-layout="mapa"
      className="w-full bg-peach pt-[calc(63*var(--fx))] md:pb-153 md:pt-110"
    >
      <div className="mx-auto flex max-w-1440 flex-col px-16 md:flex-row md:px-80">
        <div className="relative h-273 w-full overflow-hidden rounded-15 md:h-730 md:w-875 md:rounded-35">
          {mapUrl ? (
            <iframe
              src={mapUrl}
              title={titulo || "Ubicación del proyecto en Google Maps"}
              className="block h-full w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-200 px-24 text-center font-poppins text-16 text-near-black">
              Ubicación próximamente disponible
            </div>
          )}
        </div>

        <div className="mt-27 w-full bg-transparent px-0 pt-34 pb-40 md:ml-16 md:mt-0 md:w-389 md:rounded-30 md:px-40 md:pt-53">
          {titulo && (
            <h2 className="m-0 font-gotham text-32 font-medium text-white">
              {titulo}
            </h2>
          )}

          <ul className="mt-24 flex list-none flex-col p-0 md:mt-40">
            {ubicaciones.map((u, i) => (
              <li key={i} className="border-b border-white py-12 first:pt-0 last:border-b-0 md:border-white/20">
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
