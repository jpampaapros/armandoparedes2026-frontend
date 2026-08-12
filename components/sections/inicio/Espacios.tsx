import type { ACFIndicator } from "@/lib/types";
import { CountUpNumber } from "@/components/CountUpNumber";

type EspaciosProps = {
  titulo?: string;
  subtitulo?: string;
  indicadores?: ACFIndicator[];
};

export function Espacios({ titulo, subtitulo, indicadores }: EspaciosProps) {
  const items = indicadores?.filter(Boolean) ?? [];

  return (
    <section className="w-full bg-white px-4 pt-49 md:pt-60">
      <div className="mx-auto max-w-1440 px-4 md:px-80">
        <div className="mx-auto mb-60 max-w-799 text-center md:mb-100">
          {subtitulo && (
            <p className="mb-27 font-poppins text-14 font-light uppercase tracking-[0.05em] text-near-black md:text-18">
              {subtitulo}
            </p>
          )}
          {titulo && (
            <h2 className="my-0  font-gotham text-36 font-normal leading-[1.1] md:text-60 [&_strong]:font-medium" dangerouslySetInnerHTML={{ __html: titulo }} />
          )}
        </div>

        <div className="border-t border-b border-near-black py-24 md:py-40">
          <div className="flex flex-col md:grid md:grid-cols-3 gap-24 md:gap-0">
            {items.map((item, i) => (
              <div key={i} className={`flex items-center justify-center gap-24 md:gap-0 ${i !== items.length - 1 && 'border-r-2'}`}>
                <div className="flex flex-col items-center md:gap-10">
                  <CountUpNumber
                    value={item.numero}
                    className="font-gotham text-52 font-bold leading-75 tabular-nums md:leading-120 text-peach md:text-100"
                  />
                  <div className="text-center">
                    <div className="font-poppins text-22 font-light leading-30 text-black">
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
