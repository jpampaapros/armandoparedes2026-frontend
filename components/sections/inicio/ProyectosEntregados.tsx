import { SmartLink } from "@/components/SmartLink";
import { DeliveredCard } from "@/components/DeliveredCard";
import type { ACFLink, Delivered } from "@/lib/types";

type ProyectosEntregadosProps = {
  texto?: string;
  subtitulo?: string;
  boton?: ACFLink;
  entregados: Delivered[];
};

export function ProyectosEntregados({ texto, subtitulo, boton, entregados }: ProyectosEntregadosProps) {
  const sorted = [...entregados].sort((a, b) => {
    const aYear = a.acf?.ano || "";
    const bYear = b.acf?.ano || "";
    return String(bYear).localeCompare(String(aYear));
  });
  const [first, ...rest] = sorted.slice(0, 5);

  return (
    <section className="w-full bg-white px-4 py-60 md:py-120">
      <div className="mx-auto max-w-1440 px-4 md:px-80">
        <div className="mb-40 flex flex-col items-center gap-24 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-center gap-13 md:items-start">
            {texto && (
              <h2 className="font-gotham text-36 font-bold leading-[1.1] text-slate md:text-55" /* leading-[1.1] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */>
                {texto}
              </h2>
            )}
            <p className="font-poppins text-16 font-light text-black md:text-24">
              {subtitulo ?? "Muchas formas de habitar."}
            </p>
          </div>
          {boton && (
            <SmartLink
              link={boton}
              className="inline-flex h-50 w-250 items-center justify-center bg-peach px-10 font-gotham text-16 font-bold text-white transition-opacity hover:opacity-90 md:text-18"
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-16 md:h-630 md:grid-cols-[calc(630*var(--fx))_1fr] md:gap-25">
          {first && (
            <div className="h-391 md:h-full">
              <DeliveredCard project={first} size="large" priority />
            </div>
          )}
          <div className="grid grid-cols-1 gap-16 md:h-full md:grid-cols-2 md:grid-rows-2 md:gap-25">
            {rest.map((project) => (
              <div key={project.id} className="h-full">
                <DeliveredCard project={project} size="small" priority />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
