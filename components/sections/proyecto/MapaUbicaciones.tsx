"use client";

import { useEffect } from "react";
import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  APIProvider,
  Circle,
  ControlPosition,
  Map,
  useMap,
} from "@vis.gl/react-google-maps";
import { getGoogleMapsPlaceUrl, type LatLng } from "@/lib/google-maps-embed";
import { cn } from "@/lib/utils";
import { mismoPunto, mostrarMapa, useMapaSeleccion } from "./MapaSeleccion";

export type MapaPunto = LatLng & {
  nombre?: string;
  icono?: string;
  /** El propio proyecto: marcador destacado. */
  principal?: boolean;
  /** Logo del proyecto (sólo en el principal); sin él se usa el pin. */
  logo?: { url: string; width?: number; height?: number };
};

type MapaUbicacionesProps = {
  apiKey: string;
  puntos: MapaPunto[];
  titulo?: string;
};

// Los AdvancedMarker exigen un Map ID; DEMO_MAP_ID sirve mientras no se cree uno propio en Google Cloud.
const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID";

function getBounds(puntos: MapaPunto[]) {
  const lats = puntos.map((p) => p.lat);
  const lngs = puntos.map((p) => p.lng);
  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs),
    padding: 40,
  };
}

function abrirEnGoogleMaps(punto: MapaPunto) {
  window.open(getGoogleMapsPlaceUrl(punto), "_blank", "noopener,noreferrer");
}

// Pin de 43×53: la silueta y, aparte, el agujero de la cabeza (centro en 21.11, 21.11).
const PIN_SILUETA =
  "M16.6883 48.8125C18.1097 49.9852 19.5921 51.0571 21.1096 52.1032C22.6304 51.071 24.1056 49.973 25.5309 48.8125C27.9069 46.8615 30.143 44.7461 32.2227 42.4819C37.0169 37.2397 42.2192 29.6403 42.2192 21.1096C42.2192 18.3375 41.6732 15.5925 40.6124 13.0313C39.5515 10.4702 37.9966 8.14307 36.0364 6.18286C34.0762 4.22265 31.7491 2.66773 29.1879 1.60687C26.6268 0.546016 23.8818 0 21.1096 0C18.3375 0 15.5925 0.546016 13.0313 1.60687C10.4702 2.66773 8.14307 4.22265 6.18286 6.18286C4.22266 8.14307 2.66773 10.4702 1.60687 13.0313C0.546016 15.5925 -4.13083e-08 18.3375 0 21.1096C0 29.6403 5.20235 37.2374 9.99658 42.4819C12.0762 44.747 14.3122 46.8608 16.6883 48.8125Z";
const PIN_HUECO =
  "M21.1096 28.7325C19.0879 28.7325 17.149 27.9294 15.7194 26.4998C14.2898 25.0703 13.4867 23.1313 13.4867 21.1096C13.4867 19.0879 14.2898 17.149 15.7194 15.7194C17.149 14.2898 19.0879 13.4867 21.1096 13.4867C23.1313 13.4867 25.0703 14.2898 26.4998 15.7194C27.9294 17.149 28.7325 19.0879 28.7325 21.1096C28.7325 23.1313 27.9294 25.0703 26.4998 26.4998C25.0703 27.9294 23.1313 28.7325 21.1096 28.7325Z";

/**
 * Marcador en forma de pin. El color sale de `currentColor` y el ancho de `className`.
 * Con `icono`, la cabeza va sólida y el ícono ocupa el lugar del agujero.
 * Medidas en px reales: el marcador no sigue la escala --fx del sitio.
 */
function Pin({ className, icono }: { className?: string; icono?: string }) {
  return (
    <span className={cn("relative block origin-bottom drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]", className)}>
      <svg viewBox="0 0 43 53" fill="none" aria-hidden="true" className="block h-auto w-full">
        <path fill="currentColor" d={icono ? PIN_SILUETA : PIN_SILUETA + PIN_HUECO} />
      </svg>
      {icono && (
        // brightness-0 + invert: el ícono se ve blanco sobre el pin, sea cual sea su color original.
        // eslint-disable-next-line @next/next/no-img-element -- contenido del marcador, fuera del flujo de next/image
        <img
          src={icono}
          alt=""
          className="absolute left-1/2 top-[39.8%] block size-[45%] -translate-x-1/2 -translate-y-1/2 object-contain brightness-0 invert"
        />
      )}
    </span>
  );
}

/**
 * Marcador del proyecto con su logo: tarjeta blanca con punta y, debajo, un punto negro.
 * El margen negativo del punto deja el borde inferior en su centro, que es el que marca la coordenada.
 */
function LogoMarcador({ logo }: { logo: NonNullable<MapaPunto["logo"]> }) {
  return (
    <span className="flex flex-col items-center">
      <span className="flex flex-col items-center drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
        <span className="block rounded-[10px] bg-white p-[6px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- contenido del marcador, fuera del flujo de next/image */}
          <img
            src={logo.url}
            alt=""
            width={logo.width}
            height={logo.height}
            className="block h-[48px] w-auto max-w-[150px] rounded-[6px] object-contain"
          />
        </span>
        <span aria-hidden="true" className="block size-0 border-x-[9px] border-t-[10px] border-x-transparent border-t-white" />
      </span>
      <span aria-hidden="true" className="-mb-[12.5px] mt-[4px] block size-[25px] rounded-full bg-near-black" />
    </span>
  );
}

// Anillos concéntricos alrededor del proyecto, en metros: al superponerse, el centro queda más oscuro.
// Con el punto negro del marcador suman los 4 círculos del diseño.
const RADIOS_PROYECTO = [110, 280, 480];

function AnillosProyecto({ centro }: { centro: LatLng }) {
  return RADIOS_PROYECTO.map((radio) => (
    <Circle
      key={radio}
      center={centro}
      radius={radio}
      fillColor="#1d1d1b"
      fillOpacity={0.12}
      strokeWeight={0}
      clickable={false}
    />
  ));
}

// Vista inicial cercana al proyecto (radio de ~1 km, lo que se recorre "a pasos").
const ZOOM_INICIAL = 16;
const ZOOM_SELECCION = 17;

/** Centra el mapa en la ubicación elegida desde la lista. */
function CentrarSeleccion() {
  const map = useMap();
  const { seleccion } = useMapaSeleccion();

  useEffect(() => {
    if (!map || !seleccion) return;
    map.panTo(seleccion);
    map.setZoom(ZOOM_SELECCION);
    mostrarMapa(map.getDiv());
  }, [map, seleccion]);

  return null;
}

export function MapaUbicaciones({ apiKey, puntos, titulo }: MapaUbicacionesProps) {
  const { seleccion } = useMapaSeleccion();
  const proyecto = puntos.find((p) => p.principal);
  // Centrado en el proyecto; si no tiene coordenadas, se encuadran las ubicaciones.
  const centro = proyecto ?? (puntos.length === 1 ? puntos[0] : null);
  const vista = centro
    ? { defaultCenter: centro, defaultZoom: ZOOM_INICIAL }
    : { defaultBounds: getBounds(puntos) };

  return (
    <div role="region" aria-label={titulo || "Mapa de ubicaciones del proyecto"} className="h-full w-full">
      <APIProvider apiKey={apiKey} language="es" region="PE">
        <Map
          {...vista}
          mapId={MAP_ID}
          className="h-full w-full"
          gestureHandling="cooperative"
          // Explícito: por defecto Google lo oculta en pantallas táctiles y mapas pequeños.
          zoomControl
          zoomControlOptions={{ position: ControlPosition.RIGHT_BOTTOM }}
          streetViewControl={false}
          mapTypeControl={false}
          fullscreenControl={false}
          clickableIcons={false}
        >
          <CentrarSeleccion />
          {proyecto && <AnillosProyecto centro={proyecto} />}
          {puntos.map((punto, i) => {
            const activo = mismoPunto(seleccion, punto);
            return (
              <AdvancedMarker
                key={i}
                position={punto}
                title={punto.nombre}
                // La punta del pin marca la coordenada.
                anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM_CENTER}
                // El proyecto siempre queda por encima de las ubicaciones, incluso de la seleccionada.
                zIndex={punto.principal ? 2000 : activo ? 1000 : undefined}
                onClick={() => abrirEnGoogleMaps(punto)}
              >
                {punto.principal ? (
                  punto.logo ? <LogoMarcador logo={punto.logo} /> : <Pin className="w-[43px] text-peach" />
                ) : (
                  <Pin
                    icono={punto.icono}
                    className={cn(
                      "w-[36px] text-near-black transition-transform duration-200 hover:scale-110",
                      activo && "scale-125 hover:scale-125",
                    )}
                  />
                )}
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>
    </div>
  );
}
