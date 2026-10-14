import Image from "next/image";
import { getGoogleMapsCoordinateUrl, getGoogleMapsEmbedUrl, parseLatLng } from "@/lib/google-maps-embed";
import type { ACFImage, ProjectMapaUbicacion } from "@/lib/types";
import { MapaIframe, MapaSeleccionProvider, UbicacionItem, VerTodos } from "./MapaSeleccion";
import { MapaUbicaciones, type MapaPunto } from "./MapaUbicaciones";

// El original puede pesar varios MB; el marcador mide ~150px, basta con el recorte "medium".
function getLogo(imagen?: ACFImage): MapaPunto["logo"] {
  if (!imagen?.url) return undefined;
  const medium = imagen.sizes?.medium;
  if (typeof medium === "string") {
    return { url: medium, width: Number(imagen.sizes?.["medium-width"]) || undefined, height: Number(imagen.sizes?.["medium-height"]) || undefined };
  }
  return { url: imagen.url, width: imagen.width, height: imagen.height };
}

type MapaProyectoProps = {
  titulo?: string;
  google_maps?: string;
  /** Logo del proyecto: se muestra como marcador en su latitud/longitud. */
  imagen?: ACFImage;
  latitud?: number | string;
  longitud?: number | string;
  ubicaciones?: ProjectMapaUbicacion[];
};

export function MapaProyecto({ titulo, google_maps, imagen, latitud, longitud, ubicaciones = [] }: MapaProyectoProps) {
  const proyecto = parseLatLng(latitud, longitud);
  const puntos: MapaPunto[] = [
    ...(proyecto ? [{ ...proyecto, nombre: imagen?.alt || "Ubicación del proyecto", principal: true, logo: getLogo(imagen) }] : []),
    ...ubicaciones.flatMap((u) => {
      const punto = parseLatLng(u.latitud, u.longitud);
      return punto ? [{ ...punto, nombre: u.nombre, icono: u.icono?.url }] : [];
    }),
  ];
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  // Sin API key o sin coordenadas se mantiene el iframe embebido (un solo punto).
  const mapUrl = getGoogleMapsCoordinateUrl(latitud, longitud) ?? getGoogleMapsEmbedUrl(google_maps);
  return (
    <section data-layout="mapa" className="relative w-full bg-peach">
      <MapaSeleccionProvider>
        <div className="relative h-600 w-full overflow-hidden md:h-730">
          {apiKey && puntos.length > 0 ? (
            <MapaUbicaciones apiKey={apiKey} puntos={puntos} titulo={titulo} />
          ) : mapUrl ? (
            <MapaIframe src={mapUrl} title={titulo || "Ubicación del proyecto en Google Maps"} />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-200 px-24 text-center font-poppins text-16 text-near-black">
              Ubicación próximamente disponible
            </div>
          )}
        </div>

        {/* La lista flota encima del mapa (abajo en mobile, a la izquierda desde md). pointer-events-none deja arrastrar el mapa fuera de la tarjeta. */}
        <div className="pointer-events-none absolute inset-0">
          <div className="flex h-full items-end px-32 pb-32 md:items-center md:px-80 md:pb-0">
            <div className="pointer-events-auto flex max-h-[45%] w-full flex-col overflow-hidden rounded-15 bg-peach/90 px-20 pt-24 pb-24 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-sm md:max-h-[calc(100%-80px)] md:w-389 md:rounded-30 md:px-40 md:pt-53 md:pb-40">
              {titulo && (
                <h2 className="m-0 font-gotham text-24 font-medium text-white md:text-32">
                  {titulo}
                </h2>
              )}

              {ubicaciones.length > 0 && <VerTodos className="mt-16 self-start md:mt-32" />}

              {/* Solo las opciones hacen scroll; el título queda fijo arriba de la tarjeta. */}
              <ul className="scrollbar-suave mt-16 flex min-h-0 list-none flex-col overflow-y-auto p-0 pr-12 md:mt-24">
                {ubicaciones.map((u, i) => (
                  <li key={i} className="border-b border-white/20 py-12 first:pt-0 last:border-b-0">
                    <UbicacionItem punto={parseLatLng(u.latitud, u.longitud)} className="flex items-center justify-between text-white">
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
                    </UbicacionItem>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </MapaSeleccionProvider>
    </section>
  );
}
