import type { ACFIndicator } from "@/lib/types";
import { CountUpNumber } from "@/components/CountUpNumber";

type EspaciosProps = {
  titulo?: string;
  subtitulo?: string;
  indicadores?: ACFIndicator[];
  ocultar_en_movil?: boolean;
};

export function Espacios({ titulo, subtitulo, indicadores, ocultar_en_movil = false }: EspaciosProps) {
  const items = indicadores?.filter(Boolean) ?? [];

  return (
    <section className={`w-full bg-white px-4 pt-52 md:pt-90 ${ocultar_en_movil ? "hidden md:block" : ""}`}>
      <div className="mx-auto max-w-1440 px-4 md:px-80">
        <div className="mx-auto mb-0 max-w-799 text-center md:mb-60">
          {subtitulo && (
            <p className="md:hidden blockmb-5 font-poppins text-14 font-light uppercase tracking-[0.05em] text-near-black md:mb-27 md:text-18">
              {subtitulo}
            </p>
          )}
          {titulo && (
            <h2 className="my-0  font-gotham text-30 font-normal leading-[1.1] md:text-60 [&_strong]:font-medium" dangerouslySetInnerHTML={{ __html: titulo }} />
          )}
        </div>

        <div className="border-t border-b border-near-black pt-32 pb-40 md:py-40 hidden md:block">
          <div className="flex flex-col md:grid md:grid-cols-3 gap-24 md:gap-0">
            {items.map((item, i) => (
              <div key={i} className={`flex items-center justify-center gap-24 md:gap-0 ${i !== items.length - 1 && 'md:border-r-1'}`}>
                <div className="flex flex-col items-center md:gap-10">
                  <CountUpNumber
                    value={item.numero}
                    className="font-gotham text-52 font-bold leading-52 tabular-nums text-peach md:text-100 md:leading-120"
                  />
                  <div className="text-center">
                    <div className="font-poppins text-16 font-light leading-30 text-black md:text-22">
                      {item.texto}
                    </div>
                    {item.ubicacion && (
                      <div className="font-poppins text-14 font-medium leading-20 text-black">
                        {item.ubicacion}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
