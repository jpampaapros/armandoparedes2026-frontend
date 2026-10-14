"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { getGoogleMapsCoordinateUrl, type LatLng } from "@/lib/google-maps-embed";
import { cn } from "@/lib/utils";

type MapaSeleccion = {
  seleccion: LatLng | null;
  seleccionar: (punto: LatLng) => void;
  /** Cambia cada vez que se pide "Ver todos": el mapa vuelve a su vista inicial. */
  reinicio: number;
  verTodos: () => void;
};

const MapaSeleccionContext = createContext<MapaSeleccion>({
  seleccion: null,
  seleccionar: () => {},
  reinicio: 0,
  verTodos: () => {},
});

export function useMapaSeleccion() {
  return useContext(MapaSeleccionContext);
}

export function mismoPunto(a: LatLng | null | undefined, b: LatLng | null | undefined) {
  return !!a && !!b && a.lat === b.lat && a.lng === b.lng;
}

/** Comparte la ubicación elegida en la lista con el mapa (interactivo o iframe). */
export function MapaSeleccionProvider({ children }: { children: ReactNode }) {
  const [seleccion, setSeleccion] = useState<LatLng | null>(null);
  // Copia nueva en cada clic: volver a elegir la misma ubicación re-centra el mapa aunque se haya movido.
  const seleccionar = (punto: LatLng) => setSeleccion({ lat: punto.lat, lng: punto.lng });
  const [reinicio, setReinicio] = useState(0);
  const verTodos = () => {
    setSeleccion(null);
    setReinicio((n) => n + 1);
  };
  return (
    <MapaSeleccionContext.Provider value={{ seleccion, seleccionar, reinicio, verTodos }}>
      {children}
    </MapaSeleccionContext.Provider>
  );
}

/** Si el mapa quedó fuera de la vista al elegir una ubicación, se lo lleva a la vista. */
export function mostrarMapa(el: HTMLElement | null) {
  if (!el) return;
  const { top, bottom } = el.getBoundingClientRect();
  if (top < 0 || bottom > window.innerHeight) el.scrollIntoView({ behavior: "smooth", block: "center" });
}

type UbicacionItemProps = {
  punto: LatLng | null;
  className?: string;
  children: ReactNode;
};

export function UbicacionItem({ punto, className, children }: UbicacionItemProps) {
  const { seleccion, seleccionar } = useMapaSeleccion();

  if (!punto) return <div className={className}>{children}</div>;

  const activo = mismoPunto(seleccion, punto);
  return (
    <button
      type="button"
      aria-pressed={activo}
      onClick={() => seleccionar(punto)}
      className={cn(
        "w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-left font-[inherit] transition-opacity hover:opacity-70",
        activo && "underline underline-offset-4",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Quita la selección y devuelve el mapa a la vista inicial, con todos los marcadores. */
export function VerTodos({ className }: { className?: string }) {
  const { verTodos } = useMapaSeleccion();
  return (
    <button
      type="button"
      onClick={verTodos}
      className={cn(
        "cursor-pointer appearance-none border-0 bg-transparent p-0 font-poppins text-13 font-medium text-white underline underline-offset-4 transition-opacity hover:opacity-70",
        className,
      )}
    >
      Ver todos
    </button>
  );
}

type MapaIframeProps = {
  src: string;
  title: string;
};

/** Mapa embebido (sin API key): al elegir una ubicación, el iframe se centra en ella. */
export function MapaIframe({ src, title }: MapaIframeProps) {
  const { seleccion } = useMapaSeleccion();
  const ref = useRef<HTMLIFrameElement>(null);
  const seleccionSrc = seleccion && getGoogleMapsCoordinateUrl(seleccion.lat, seleccion.lng);

  useEffect(() => {
    if (seleccion) mostrarMapa(ref.current);
  }, [seleccion]);

  return (
    <iframe
      ref={ref}
      src={seleccionSrc || src}
      title={title}
      className="block h-full w-full border-0"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
