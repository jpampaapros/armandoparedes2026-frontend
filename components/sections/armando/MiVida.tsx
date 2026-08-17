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
            className="armando-life-title text-center font-gotham font-normal leading-[1.1] text-near-black [&_strong]:font-medium"
            dangerouslySetInnerHTML={{ __html: titulo }}
          />
        )}

        <div className="mt-40 md:mt-60">
          <div className="border-y border-near-black py-24 md:py-[calc(31*var(--fx))]">
            <div className="flex flex-col divide-y divide-near-black md:flex-row md:divide-y-0 md:divide-x">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center gap-10 py-24 first:pt-0 last:pb-0 md:h-[calc(201*var(--fx))] md:justify-center md:px-[calc(50*var(--fx))] md:py-0 md:first:pt-0 md:last:pb-0"
                >
                  <span className="font-gotham text-52 font-bold leading-[1] text-peach md:text-[calc(76*var(--fx))]">
                    {item.numero}
                  </span>
                  <p className="armando-life-label text-center font-poppins font-light leading-[1.3] text-near-black">
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
