"use client";

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

function getPlainText(html = "") {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function VideoProyecto({ titulo, url_youtube }: VideoProyectoProps) {
  const videoId = getYouTubeId(url_youtube || "");
  const plainTitle = getPlainText(titulo);

  return (
    <section
      data-layout="video"
      className="relative h-500 w-full overflow-hidden md:h-800"
    >
      {videoId ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${videoId}&rel=0`}
          title={plainTitle || "Video del proyecto"}
          className="absolute inset-0 h-full w-full border-0"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <div className="h-full w-full bg-neutral-800" />
      )}

      <div className="pointer-events-none absolute bottom-47 left-16 md:bottom-104 md:left-80">
        {titulo && (
          <div
            className="font-gotham text-32 leading-[1.1] text-white md:text-80 md:leading-80 [&_em]:font-gotham [&_em]:font-medium [&_em]:not-italic [&_em]:text-peach md:[&_em]:text-[calc(80*var(--fx))] md:[&_em]:leading-[calc(80*var(--fx))] [&_h1]:m-0 [&_h2]:m-0 [&_h3]:m-0 [&_p]:m-0" /* leading-[1.1] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */
            dangerouslySetInnerHTML={{ __html: titulo }}
          />
        )}
      </div>

    </section>
  );
}
