import Image from "next/image";
import { SmartLink } from "@/components/SmartLink";
import type { ACFImage, ACFLink } from "@/lib/types";

type QuienEsArmandoProps = {
  titulo?: string;
  imagen_fondo?: ACFImage;
  descripcion?: string;
  boton?: ACFLink;
};

export function QuienEsArmando({ titulo, imagen_fondo, descripcion, boton }: QuienEsArmandoProps) {
  return (
    <section className="relative flex min-h-369 w-full items-center justify-center overflow-hidden md:min-h-613">
      {imagen_fondo?.url && (
        <Image
          src={imagen_fondo.url}
          alt={imagen_fondo.alt || ""}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      )}
      <div className="absolute inset-0 bg-slate/50" />

      <div className="relative z-10 mx-auto md:block max-w-372 gap-16 px-4 py-80 md:max-w-1280 md:gap-31 w-full text-center md:text-left">
        {titulo && (
          <h2 className="font-gotham text-36 leading-[1.1] mb-15 text-white md:text-65" dangerouslySetInnerHTML={{__html: titulo}} />
        )}
        {descripcion && (
          <div
            className="whitespace-pre-line font-poppins text-16 font-light leading-[1.4] text-white md:text-26 md:leading-35 [&_p]:my-0 max-w-430"
            dangerouslySetInnerHTML={{ __html: descripcion }}
          />
        )}
        {boton && (
          <SmartLink
            link={boton}
            className="flex md:inline-flex h-50 min-w-250 items-center justify-center bg-peach px-24 font-gotham text-18 font-bold text-white transition-opacity hover:opacity-90 md:h-50"
          />
        )}
      </div>
    </section>
  );
}
