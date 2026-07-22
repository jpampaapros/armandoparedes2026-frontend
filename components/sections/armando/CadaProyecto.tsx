import { stripHtml } from "@/lib/utils";
import Image from "next/image";
import type { ACFImage } from "@/lib/types";

type CadaProyectoProps = {
  imagen_fondo?: ACFImage;
  titulo?: string;
};

export function CadaProyecto({ imagen_fondo, titulo }: CadaProyectoProps) {
  return (
    <section className="relative h-400 w-full overflow-hidden md:h-600">
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
            className="max-w-906 text-center font-gotham text-30 font-light leading-[1.2] text-white md:text-72"
            dangerouslySetInnerHTML={{ __html: titulo }}
          />
        )}
      </div>
    </section>
  );
}
