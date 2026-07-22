import { SmartLink } from "@/components/SmartLink";
import type { ACFLink } from "@/lib/types";

type AmigosBeneficiosProps = {
  titulo?: string;
  descripcion?: string;
  boton?: ACFLink;
};

export function AmigosBeneficios({ titulo, descripcion, boton }: AmigosBeneficiosProps) {
  return (
    <section className="flex w-full items-center justify-center bg-dark px-4 py-61 md:py-120">
      <div className="mx-auto flex max-w-381 flex-col items-center gap-25 text-center md:max-w-685">
        {titulo && (
          <h2 className="font-gotham text-36 font-bold leading-[1.1] text-white md:font-gotham-black md:text-95 md:font-medium md:leading-100" /* leading-[1.1] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */>
            {titulo}
          </h2>
        )}
        {descripcion && (
          <div
            className="whitespace-pre-line font-poppins text-16 font-light leading-[1.2] text-white [&_p]:m-0 [&_em]:font-semibold [&_em]:italic"
            dangerouslySetInnerHTML={{ __html: descripcion }}
          />
        )}
        {boton && (
          <SmartLink
            link={boton}
            className="inline-flex h-60 w-339 items-center justify-center bg-slate px-24 font-gotham text-26 font-bold text-white transition-opacity hover:opacity-90 md:w-429"
          />
        )}
      </div>
    </section>
  );
}
