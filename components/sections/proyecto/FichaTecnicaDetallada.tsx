import Image from "next/image";
import type { ACFImage } from "@/lib/types";

type FichaItem = {
  icono?: ACFImage;
  texto?: string;
};

type FichaTecnicaDetalladaProps = {
  imagen?: ACFImage;
  titulo?: string;
  info?: FichaItem[];
};

export function FichaTecnicaDetallada({
  imagen,
  titulo,
  info = [],
}: FichaTecnicaDetalladaProps) {
  if (info.length === 0 && !imagen && !titulo) return null;

  return (
    <section
      data-layout="ficha_tecnica_detallada"
      className="w-full bg-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-2">
        {imagen?.url && (
          <div className="relative h-475 w-full md:h-763">
            <Image
              src={imagen.url}
              alt={imagen.alt || titulo || ""}
              fill
              className="object-cover md:object-fill"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
        <div className="flex flex-col justify-center px-16 py-48 md:px-80 md:py-60">
          {titulo && (
            <h2 className="font-gotham text-36 font-bold text-slate md:text-45">
              {titulo}
            </h2>
          )}
          <div className="mt-24 flex flex-col gap-24 md:mt-40">
            {info.map((item, index) => (
              <div key={index} className="flex items-center gap-14">
                {item.icono?.url ? (
                  <div className="relative h-30 w-30 shrink-0">
                    <Image
                      src={item.icono.url}
                      alt={item.icono.alt || ""}
                      fill
                      className="object-contain"
                      sizes="30px"
                    />
                  </div>
                ) : (
                  <div className="h-30 w-30 shrink-0 rounded-full bg-slate" />
                )}
                {item.texto && (
                  <div
                    className="font-poppins text-16 font-medium text-near-black md:text-24 [&_p]:m-0"
                    dangerouslySetInnerHTML={{ __html: item.texto }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
