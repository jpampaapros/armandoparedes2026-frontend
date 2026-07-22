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
      <div className="absolute inset-0 bg-slate/79" />

      <div className="relative z-10 mx-auto flex max-w-372 flex-col items-center gap-16 px-4 py-80 text-center md:max-w-685 md:gap-31">
        {titulo && (
          <h2 className="font-gotham text-36 font-medium leading-[1.1] text-white md:text-65" /* leading-[1.1] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */>
            {titulo}
          </h2>
        )}
        {descripcion && (
          <div
            className="whitespace-pre-line font-poppins text-16 font-light leading-[1.4] text-white md:text-26 md:leading-35"
            dangerouslySetInnerHTML={{ __html: descripcion }}
          />
        )}
        {boton && (
          <SmartLink
            link={boton}
            className="inline-flex h-50 min-w-250 items-center justify-center bg-peach px-24 font-gotham text-18 font-bold text-white transition-opacity hover:opacity-90 md:h-50"
          />
        )}
      </div>
    </section>
  );
}
