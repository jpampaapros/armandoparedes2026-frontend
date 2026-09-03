import Image from "next/image";
import { SmartLink } from "@/components/SmartLink";
import type { BlogOptions } from "@/lib/types";

type EncuentraArmandoSectionProps = {
  options: BlogOptions | null;
};

export function EncuentraArmandoSection({ options }: EncuentraArmandoSectionProps) {
  const titulo = options?.blog_encuentra_titulo;
  const texto = options?.blog_encuentra_texto;
  const boton = options?.blog_encuentra_boton;
  const fondo = options?.blog_encuentra_imagen_fondo;

  return (
    <section className="relative w-full overflow-hidden bg-near-black">
      {fondo?.url && (
        <div className="absolute inset-0 z-0">
          <Image
            src={fondo.url}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-[rgba(29,29,27,0.7)]" />
        </div>
      )}

      <div className="relative z-10 mx-auto flex max-w-1440 flex-col items-center px-16 py-80 text-center md:items-start md:px-80 md:pb-120 md:pt-[calc(66*var(--fx))] md:text-left">
        {titulo && (
          <h2 className="m-0 max-w-696 font-gotham text-32 font-medium leading-[1.1] text-white md:text-60">
            {titulo}
          </h2>
        )}
        {texto && (
          <div
            className="mt-16 max-w-694 font-poppins text-16 font-normal leading-[1.5] text-white md:mt-24 md:text-24"
            dangerouslySetInnerHTML={{ __html: texto }}
          />
        )}
        {boton?.url && (
          <SmartLink
            link={boton}
            className="mt-32 inline-flex h-50 min-w-276 items-center justify-center bg-peach px-24 font-gotham text-18 font-bold text-white transition-opacity hover:opacity-90 md:mt-48 md:min-w-375"
          />
        )}
      </div>
    </section>
  );
}
