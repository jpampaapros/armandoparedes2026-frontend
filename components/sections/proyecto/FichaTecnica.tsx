import Image from "next/image";
import { SmartLink } from "@/components/SmartLink";
import { LocationIcon } from "@/components/icons/LocationIcon";
import { BuildingIcon } from "@/components/icons/BuildingIcon";
import { AreaIcon } from "@/components/icons/AreaIcon";
import { BedIcon } from "@/components/icons/BedIcon";
import type { ACFLink, ACFImage } from "@/lib/types";

type FichaTecnicaProps = {
  titulo?: string;
  color_fondo?: string;
  color_titulo?: string;
  direccion?: string;
  pisos?: string;
  area?: string;
  dormitorios?: string;
  brochure?: ACFLink;
  icono_direccion?: ACFImage;
  icono_pisos?: ACFImage;
  icono_area?: ACFImage;
  icono_dormitorios?: ACFImage;
};

export function FichaTecnica({ titulo, direccion, pisos, area, dormitorios, brochure, icono_direccion, icono_pisos, icono_area, icono_dormitorios, color_fondo, color_titulo }: FichaTecnicaProps) {
  return (
    <section data-layout="ficha_tecnica" className="w-full bg-slate" style={{ backgroundColor: color_fondo || undefined }}>
      <div className="mx-auto max-w-1440 px-24 pt-90 pb-80 md:px-80 md:pt-90 md:pb-80">
        {titulo && (
          <h2 style={{ color: color_titulo || undefined }} className="m-0 text-center font-gotham text-32 font-bold leading-[1.2] text-white md:text-60 md:leading-66">
            {titulo.replace(/ficha\s+técnica/gi, "Ficha técnica")}
          </h2>
        )}

        <div className="mt-16 flex flex-col items-center md:mt-58 md:gap-30">
          {direccion && (
            <div className="flex items-center gap-14">
              {icono_direccion?.url ? (
                  <Image src={icono_direccion.url} alt="" width={40} height={40} className="h-32 w-32 text-white md:h-40 md:w-40 shrink-0 object-contain" />
                ) : (
                  <LocationIcon className="h-32 w-32 text-white md:h-40 md:w-40" />
                )}
              <span className="font-poppins text-18 text-black md:text-24">
                {direccion}
              </span>
            </div>
          )}

          <div
            className={`${direccion ? "mt-70 md:mt-0" : ""} flex flex-col flex-wrap items-center justify-center gap-24 md:gap-90 ${pisos && area && dormitorios ? "md:grid md:w-full md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]" : "md:flex-row"}`}
          >
            {pisos && (
              <div className="flex items-center gap-14 md:justify-self-end">
                {icono_pisos?.url ? (
                  <Image src={icono_pisos.url} alt="" width={40} height={40} className="h-28 w-28 text-white md:h-30 md:w-30 shrink-0 object-contain" />
                ) : (
                  <BuildingIcon className="h-28 w-28 text-white md:h-30 md:w-30" />
                )}
                <span className="font-poppins text-18 text-black md:text-24">
                  {pisos} pisos
                </span>
              </div>
            )}
            {area && (
              <div className="flex items-center justify-center gap-14 text-center">
                {icono_area?.url ? (
                  <Image src={icono_area.url} alt="" width={40} height={40} className="h-28 w-28 shrink-0 text-white md:h-36 md:w-36 shrink-0 object-contain" />
                ) : (
                  <AreaIcon className="h-28 w-28 shrink-0 text-white md:h-36 md:w-36" />
                )}
                <span className="font-poppins text-18 text-black md:text-24">
                  {area} m²
                </span>
              </div>
            )}
            {dormitorios && (
              <div className="flex items-center gap-14 md:justify-self-start">
                {icono_dormitorios?.url ? (
                  <Image src={icono_dormitorios.url} alt="" width={40} height={40} className="h-28 w-28 text-white md:h-36 md:w-36 shrink-0 object-contain" />
                ) : (
                  <BedIcon className="h-28 w-28 text-white md:h-36 md:w-36" />
                )}
                <span className="font-poppins text-18 text-black md:text-24">
                  {dormitorios} dormitorios
                </span>
              </div>
            )}
          </div>
        </div>

        {brochure?.url && brochure.url !== "#" && (
          <div className="mt-80 flex justify-center md:mt-60">
            <SmartLink
              link={brochure}
              className="inline-flex h-50 w-380 max-w-full items-center justify-center bg-peach px-40 font-gotham text-14 font-bold uppercase text-white transition-opacity hover:opacity-90 md:h-60 md:w-429 md:text-18"
            >
              {brochure.title || "REVISA NUESTRO BROCHURE"}
            </SmartLink>
          </div>
        )}
      </div>
    </section>
  );
}
