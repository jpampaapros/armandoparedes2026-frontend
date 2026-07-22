import type { ArmandoIndicator } from "@/lib/types";

type MiVidaProps = {
  titulo?: string;
  indicadores?: ArmandoIndicator[];
};

export function MiVida({ titulo, indicadores }: MiVidaProps) {
  const items = indicadores?.filter(Boolean) ?? [];

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-1440 px-16 py-80 md:px-80 md:py-120">
        {titulo && (
          <h2
            className="text-center font-gotham text-36 font-medium leading-[1.1] text-near-black md:text-60"
            dangerouslySetInnerHTML={{ __html: titulo }}
          />
        )}

        <div className="mt-40 md:mt-60">
          <div className="border-t border-near-black py-24 md:py-40">
            <div className="flex flex-col divide-y divide-near-black md:flex-row md:divide-y-0 md:divide-x">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center gap-10 py-24 first:pt-0 last:pb-0 md:py-0 md:px-24"
                >
                  <span className="font-gotham text-52 font-bold leading-[1] text-peach md:text-100">
                    {item.numero}
                  </span>
                  <p className="text-center font-poppins text-18 font-light leading-[1.3] text-near-black md:text-22">
                    {item.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
