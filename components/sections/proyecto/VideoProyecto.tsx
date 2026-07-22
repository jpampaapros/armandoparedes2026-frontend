"use client";

import { useState } from "react";
import Image from "next/image";
import type { ACFImage } from "@/lib/types";

type VideoProyectoProps = {
  titulo?: string;
  imagen_previa?: ACFImage;
  url_youtube?: string;
};

function getYouTubeId(url = ""): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
    return u.searchParams.get("v");
  } catch {
    return null;
  }
}

export function VideoProyecto({ titulo, imagen_previa, url_youtube }: VideoProyectoProps) {
  const [open, setOpen] = useState(false);
  const videoId = getYouTubeId(url_youtube || "");

  return (
    <section
      data-layout="video"
      className="relative h-500 w-full overflow-hidden md:h-800"
    >
      {imagen_previa?.url ? (
        <Image
          src={imagen_previa.url}
          alt={titulo || ""}
          fill
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="h-full w-full bg-neutral-800" />
      )}

      <div className="absolute inset-0 bg-black/30" />

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Reproducir video"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white transition-transform hover:scale-105"
      >
        <div className="relative h-72 w-72 md:h-204 md:w-204">
          <Image
            src="/images/proyecto/play-outline.svg"
            alt="Reproducir video"
            fill
            className="object-contain"
          />
        </div>
      </button>

      <div className="absolute bottom-47 left-16 md:bottom-104 md:left-80">
         <h2 className="m-0 font-ga-maamli text-32 leading-[1.1] text-white md:text-80 md:leading-80" /* leading-[1.1] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */>
          {titulo}
        </h2>
      </div>

      {open && videoId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-24"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl" /* max-w-5xl = 64rem (1024px); no hay token proporcional equivalente para este contenedor de video */
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -top-40 right-0 text-16 text-white"
            >
              Cerrar
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={titulo || "Video"}
                className="h-full w-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
