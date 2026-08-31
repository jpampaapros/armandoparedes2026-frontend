import { SmartLink } from "@/components/SmartLink";
import { LocationIcon } from "@/components/icons/LocationIcon";
import { BuildingIcon } from "@/components/icons/BuildingIcon";
import { AreaIcon } from "@/components/icons/AreaIcon";
import { BedIcon } from "@/components/icons/BedIcon";
import type { ACFLink } from "@/lib/types";

type FichaTecnicaProps = {
  titulo?: string;
  direccion?: string;
  pisos?: string;
  area?: string;
  dormitorios?: string;
  brochure?: ACFLink;
};

export function FichaTecnica({ titulo, direccion, pisos, area, dormitorios, brochure }: FichaTecnicaProps) {
  return (
    <section data-layout="ficha_tecnica" className="w-full bg-slate">
      <div className="mx-auto max-w-1440 px-24 pt-90 pb-80 md:px-80 md:pt-90 md:pb-80">
        {titulo && (
          <h2 className="m-0 text-center font-gotham text-32 font-bold leading-[1.2] text-white md:text-60 md:leading-66" /* leading-[1.2] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */>
            {titulo}
          </h2>
        )}

        <div className="mt-16 flex flex-col items-center md:mt-58 md:gap-30">
          {direccion && (
            <div className="flex items-center gap-14">
              <LocationIcon className="h-32 w-32 text-white md:h-40 md:w-40" />
              <span className="font-poppins text-18 text-white md:text-24">
                {direccion}
              </span>
            </div>
          )}

          <div
            className={`${direccion ? "mt-[calc(70*var(--fx))] md:mt-0" : ""} flex flex-col flex-wrap items-center justify-center gap-24 md:flex-row md:gap-60`}
          >
            {pisos && (
              <div className="flex items-center gap-14">
                <BuildingIcon className="h-28 w-28 text-white md:h-30 md:w-30" />
                <span className="font-poppins text-18 text-white md:text-24">
                  {pisos} pisos
                </span>
              </div>
            )}
            {area && (
              <div className="flex items-center gap-14">
                <AreaIcon className="h-28 w-28 text-white md:h-36 md:w-36" />
                <span className="font-poppins text-18 text-white md:text-24">
                  {area} m2
                </span>
              </div>
            )}
            {dormitorios && (
              <div className="flex items-center gap-14">
                <BedIcon className="h-28 w-28 text-white md:h-36 md:w-36" />
                <span className="font-poppins text-18 text-white md:text-24">
                  {dormitorios} dormitorios
                </span>
              </div>
            )}
          </div>
        </div>

        {brochure?.url && brochure.url !== "#" && (
          <div className="mt-[calc(80*var(--fx))] flex justify-center md:mt-60">
            <SmartLink
              link={brochure}
              className="inline-flex h-50 w-[calc(380*var(--fx))] max-w-full items-center justify-center bg-peach px-40 font-gotham text-14 font-bold uppercase text-white transition-opacity hover:opacity-90 md:h-60 md:w-429 md:text-18"
            >
              {brochure.title || "REVISA NUESTRO BROCHURE"}
            </SmartLink>
          </div>
        )}
      </div>
    </section>
  );
}
