import { stripHtml } from "@/lib/utils";
import Image from "next/image";
import type { ACFImage } from "@/lib/types";

type CadaProyectoProps = {
  imagen_fondo?: ACFImage;
  titulo?: string;
};

export function CadaProyecto({ imagen_fondo, titulo }: CadaProyectoProps) {
  return (
    <section className="relative h-[calc(524*var(--fx))] w-full overflow-hidden md:h-[calc(768*var(--fx))]">
      {imagen_fondo?.url ? (
        <Image
          src={imagen_fondo.url}
          alt={stripHtml(imagen_fondo.alt || titulo) || ""}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-slate" />
      )}

      <div className="absolute inset-0 bg-black/50" />

      <div className="absolute inset-0 flex items-center justify-center px-16">
        {titulo && (
          <h2
            className="armando-project-title w-[calc(322*var(--fx))] max-w-full md:w-auto md:max-w-906"
            dangerouslySetInnerHTML={{ __html: titulo }}
          />
        )}
      </div>
    </section>
  );
}
