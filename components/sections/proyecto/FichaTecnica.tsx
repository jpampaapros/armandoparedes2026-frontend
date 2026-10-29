import Image from "next/image";
import type { ReactNode } from "react";
import { resolveWordPressUrl } from "@/lib/urls";
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
  color_iconos?: string;
  direccion?: string;
  pisos?: string;
  area?: string;
  dormitorios?: string;
  brochure?: ACFLink;
  planos?: ACFLink;
  icono_direccion?: ACFImage;
  icono_pisos?: ACFImage;
  icono_area?: ACFImage;
  icono_dormitorios?: ACFImage;
};

function TechnicalIcon({ image, color, className, fallback }: {
  image?: ACFImage;
  color?: string;
  className: string;
  fallback: ReactNode;
}) {
  if (image?.url && color) {
    // Usa el rewrite de uploads del CMS para servir la máscara desde el mismo origen.
    const mask = `url(${JSON.stringify(resolveWordPressUrl(image.url))}) center / contain no-repeat`;
    return <span aria-hidden="true" className={`block shrink-0 ${className}`} style={{ backgroundColor: color, mask, WebkitMask: mask }} />;
  }
  if (image?.url) {
    return <Image src={image.url} alt="" width={40} height={40} className={`shrink-0 object-contain ${className}`} />;
  }
  return <span aria-hidden="true" className={`block shrink-0 text-white [&>svg]:h-full [&>svg]:w-full ${className}`} style={{ color: color || undefined }}>{fallback}</span>;
}

export function FichaTecnica({ titulo, direccion, pisos, area, dormitorios, brochure, planos, icono_direccion, icono_pisos, icono_area, icono_dormitorios, color_fondo, color_titulo, color_iconos }: FichaTecnicaProps) {
  return (
    <section data-layout="ficha_tecnica" className="w-full bg-slate" style={{ backgroundColor: color_fondo || undefined }}>
      <div className="mx-auto max-w-1440 px-24 md:px-80 py-52 md:py-90">
        {titulo && (
          <h2 style={{ color: color_titulo || undefined }} className="m-0 text-center font-gotham text-32 font-bold leading-[1.2] text-white md:text-60 md:leading-66">
            {titulo.replace(/ficha\s+técnica/gi, "Ficha técnica")}
          </h2>
        )}

        <div className="mt-16 flex flex-col items-center md:mt-58 md:gap-30">
          {direccion && (
            <div className="flex items-center gap-14">
              <TechnicalIcon image={icono_direccion} color={color_iconos} className="h-32 w-32 md:h-40 md:w-40" fallback={<LocationIcon />} />
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
                <TechnicalIcon image={icono_pisos} color={color_iconos} className="h-28 w-28 md:h-30 md:w-30" fallback={<BuildingIcon />} />
                <span className="font-poppins text-18 text-black md:text-24">
                  {pisos} pisos
                </span>
              </div>
            )}
            {area && (
              <div className="flex items-center justify-center gap-14 text-center">
                <TechnicalIcon image={icono_area} color={color_iconos} className="h-28 w-28 md:h-36 md:w-36" fallback={<AreaIcon />} />
                <span className="font-poppins text-18 text-black md:text-24">
                  {area} m²
                </span>
              </div>
            )}
            {dormitorios && (
              <div className="flex items-center gap-14 md:justify-self-start">
                <TechnicalIcon image={icono_dormitorios} color={color_iconos} className="h-28 w-28 md:h-36 md:w-36" fallback={<BedIcon />} />
                <span className="font-poppins text-18 text-black md:text-24">
                  {dormitorios} dormitorios
                </span>
              </div>
            )}
          </div>
        </div>

<div className="flex md:flex-row flex-col items-center justify-center gap-24 md:gap-80 mt-80 md:mt-60">
        {brochure?.url && brochure.url !== "#" && (
          <div className="flex justify-center ">
            <SmartLink
              link={brochure}
              className="inline-flex h-50 w-380 max-w-full items-center justify-center bg-peach px-40 font-gotham text-14 font-bold uppercase text-white transition-opacity hover:opacity-90 md:h-60 md:w-429 md:text-18"
            >
              {brochure.title || "REVISA NUESTRO BROCHURE"}
            </SmartLink>
          </div>
        )}
        {planos?.url && planos.url !== "#" && (
          <div className="flex justify-center">
            <SmartLink
              link={planos}
              className="inline-flex h-50 w-380 max-w-full items-center justify-center bg-peach px-40 font-gotham text-14 font-bold uppercase text-white transition-opacity hover:opacity-90 md:h-60 md:w-429 md:text-18"
            >
              {planos.title || "REVISA NUESTRO PLANOS"}
            </SmartLink>
          </div>
        )}
</div>

      </div>
    </section>
  );
}
