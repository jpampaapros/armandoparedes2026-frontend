import { SmartLink } from "@/components/SmartLink";
import type { ACFLink } from "@/lib/types";

type EncuentraTuArmandoProps = {
  titulo?: string;
  texto?: string;
  boton?: ACFLink;
};

export function EncuentraTuArmando({
  titulo,
  texto,
  boton,
}: EncuentraTuArmandoProps) {
  return (
    <section className="w-full bg-slate">
      <div className="mx-auto flex max-w-1440 flex-col items-center px-16 py-80 text-center md:px-80 md:py-120">
        {titulo && (
          <h2 className="font-gotham text-36 font-medium leading-[1.1] text-white md:text-60">
            {titulo}
          </h2>
        )}
        {texto && (
          <div
            className="mt-24 max-w-685 font-poppins text-16 font-light leading-[1.5] text-white md:text-22 [&_p]:text-[calc(24*var(--fx))] md:[&_p]:text-22"
            dangerouslySetInnerHTML={{ __html: texto }}
          />
        )}
        {boton?.url && (
          <SmartLink
            link={boton}
            className="mt-40 inline-flex h-50 min-w-250 items-center justify-center bg-peach px-24 font-gotham text-18 font-bold text-white transition-opacity hover:opacity-90 md:mt-60"
          />
        )}
      </div>
    </section>
  );
}
