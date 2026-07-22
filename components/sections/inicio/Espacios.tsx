import type { ACFIndicator } from "@/lib/types";

type EspaciosProps = {
  titulo?: string;
  subtitulo?: string;
  indicadores?: ACFIndicator[];
};

export function Espacios({ titulo, subtitulo, indicadores }: EspaciosProps) {
  const items = indicadores?.filter(Boolean) ?? [];

  return (
    <section className="w-full bg-white px-4 py-60 md:pt-60 md:pb-120">
      <div className="mx-auto max-w-1440 px-4 md:px-80">
        <div className="mx-auto mb-60 max-w-799 text-center md:mb-100">
          {subtitulo && (
            <p className="mb-27 font-poppins text-14 font-light uppercase tracking-[0.05em] text-near-black md:text-18" /* tracking-[0.05em] no tiene utilidad proporcional; se mantiene como em de diseño */>
              {subtitulo}
            </p>
          )}
          {titulo && (
            <h2 className="font-gotham text-36 font-medium leading-[1.1] text-near-black md:text-60" /* leading-[1.1] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */>
              {titulo}
            </h2>
          )}
        </div>

        <div className="border-t border-b border-near-black py-24 md:py-40">
          <div className="flex flex-col gap-24 md:flex-row md:items-center md:justify-center md:gap-107">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-24 md:gap-0">
                <div className="flex flex-col items-center gap-10 md:w-277">
                  <span className="font-gotham text-52 font-bold leading-[1] text-peach md:text-100" /* leading-[1] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */>
                    {item.numero}
                  </span>
                  <div className="text-center">
                    <p className="font-poppins text-22 font-light leading-[1.3] text-black" /* leading-[1.3] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */>
                      {item.texto}
                    </p>
                    {item.ubicacion && (
                      <p className="font-poppins text-14 font-medium leading-[1.3] text-black" /* leading-[1.3] no tiene utilidad proporcional; se mantiene como multiplicador de diseño */>
                        {item.ubicacion}
                      </p>
                    )}
                  </div>
                </div>
                {i < items.length - 1 && (
                  <div className="hidden h-250 w-px bg-near-black md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
