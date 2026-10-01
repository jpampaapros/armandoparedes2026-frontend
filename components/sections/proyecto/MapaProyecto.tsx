import Image from "next/image";
import { getGoogleMapsCoordinateUrl, getGoogleMapsEmbedUrl, parseLatLng } from "@/lib/google-maps-embed";
import type { ACFImage, ProjectMapaUbicacion } from "@/lib/types";
import { MapaIframe, MapaSeleccionProvider, UbicacionItem } from "./MapaSeleccion";
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
    <section
      data-layout="mapa"
      className="w-full bg-peach pt-63 md:pb-153 md:pt-110"
    >
      <MapaSeleccionProvider>
        <div className="mx-auto flex max-w-1440 flex-col px-16 md:flex-row md:px-80">
          <div className="relative h-273 w-full overflow-hidden rounded-15 md:h-730 md:w-875 md:rounded-35">
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

          <div className="mt-27 w-full bg-transparent px-0 pt-34 pb-40 md:ml-16 md:mt-0 md:w-389 md:rounded-30 md:px-40 md:pt-53">
            {titulo && (
              <h2 className="m-0 font-gotham text-32 font-medium text-white">
                {titulo}
              </h2>
            )}

            <ul className="mt-24 flex list-none flex-col p-0 md:mt-40">
              {ubicaciones.map((u, i) => (
                <li key={i} className="border-b border-white py-12 first:pt-0 last:border-b-0 md:border-white/20">
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
      </MapaSeleccionProvider>
    </section>
  );
}
