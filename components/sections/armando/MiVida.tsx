import type { CSSProperties } from "react";
import type { ArmandoIndicator } from "@/lib/types";

type MiVidaProps = {
  titulo?: string;
  indicadores?: ArmandoIndicator[];
};

export function MiVida({ titulo, indicadores }: MiVidaProps) {
  const items = indicadores?.filter(Boolean) ?? [];
  const marqueeStyle = {
    "--armando-life-duration": `${Math.max(items.length * 6, 12)}s`,
  } as CSSProperties;

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
            <div className="h-[calc(201*var(--fx))] overflow-hidden">
              <div
                className={items.length > 1 ? "armando-life-marquee flex h-full w-max" : "flex h-full"}
                style={marqueeStyle}
              >
                {(items.length > 1 ? [false, true] : [false]).map((duplicate) => (
                  <div
                    key={String(duplicate)}
                    className="flex h-full shrink-0"
                    aria-hidden={duplicate || undefined}
                  >
                    {items.map((item, index) => (
                      <div
                        key={`${duplicate ? "duplicate" : "original"}-${index}`}
                        className="flex h-full w-[calc(382*var(--fx))] shrink-0 flex-col items-center justify-center gap-10 border-r border-near-black px-[calc(24*var(--fx))] md:w-[calc(426.667*var(--fx))] md:px-[calc(50*var(--fx))]"
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
