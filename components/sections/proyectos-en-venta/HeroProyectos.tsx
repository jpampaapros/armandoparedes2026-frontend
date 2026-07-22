import Image from "next/image";
import type { ACFImage } from "@/lib/types";

type HeroProyectosProps = {
  titulo?: string;
  imagen?: ACFImage;
  dataSection?: string;
};

function plainTextFromHtml(html = ""): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function HeroProyectos({ titulo, imagen, dataSection = "hero_proyectos" }: HeroProyectosProps) {
  const texto = plainTextFromHtml(titulo);
  const match = texto.match(/^(.+?)\s+(Armando)$/i);

  return (
    <section
      data-section={dataSection}
      className="relative h-323 w-full overflow-hidden md:h-525"
    >
      {imagen?.url ? (
        <Image
          src={imagen.url}
          alt={imagen.alt || texto}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-800" />
      )}

      <div className="absolute inset-0 bg-black/50" />

      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="max-w-232 text-center md:max-w-906">
          <h1 className="font-gotham text-36 leading-[1.2] text-white md:text-80 md:leading-[1.05]" /* leading-[1.2] y leading-[1.05] no tienen utilidad proporcional; se mantienen como multiplicadores de diseño */>
            {match ? (
              <>
                <span className="font-light">{match[1]}</span>{" "}
                <span className="font-medium">{match[2]}</span>
              </>
            ) : (
              <span className="font-light">{texto}</span>
            )}
          </h1>
        </div>
      </div>
    </section>
  );
}
