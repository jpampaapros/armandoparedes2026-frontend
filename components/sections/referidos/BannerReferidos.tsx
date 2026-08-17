import Image from "next/image";
import type { ACFImage, ReferidosCard } from "@/lib/types";

type BannerReferidosProps = {
  background_image?: ACFImage;
  title?: string;
  phrase?: string;
  cards?: ReferidosCard[];
  legal_text?: string;
};

export function BannerReferidos({
  background_image,
  title,
  phrase,
  cards,
  legal_text,
}: BannerReferidosProps) {
  const titleWords = title?.trim().split(/\s+/) ?? [];
  const titleLastWord = titleWords.pop();
  const titleFirstLine = titleWords.join(" ");

  return (
    <section
      data-layout="banner_referidos"
      className="relative w-full overflow-hidden bg-white md:h-1139"
    >
      {/* Imagen de fondo: parte superior en mobile, cubre todo en desktop */}
      <div className="relative h-402 w-full md:absolute md:inset-0 md:h-full">
        {background_image?.url ? (
          <Image
            src={background_image.url}
            alt={background_image.alt || "Banner referidos"}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-near-black" />
        )}
      </div>

      {/* Contenido mobile: flujo normal debajo de la imagen */}
      <div className="relative z-10 mx-auto flex w-full max-w-1440 flex-col items-center bg-white px-16 py-24 md:hidden">
        {title && (
          <h1 className="mt-32 whitespace-pre-line text-center font-gotham-black text-36 uppercase leading-[1.1] text-near-black md:mt-256 md:text-76">
            {title}
          </h1>
        )}

        {phrase && (
          <div className="mt-16 rounded-15 bg-near-black px-24 py-24">
            <p className="max-w-257 text-center font-poppins text-20 leading-[1.25] text-white">
              {phrase}
            </p>
          </div>
        )}

        {cards && cards.length > 0 && (
          <div className="mt-24 w-full rounded-16 bg-peach p-16">
            <div className="flex flex-col gap-12">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-12 bg-white p-12"
                >
                  <div className="flex flex-col items-start">
                    {card.label && (
                      <span className="font-poppins text-20 font-semibold text-near-black">
                        {card.label}
                      </span>
                    )}
                    {card.subtitle && (
                      <span className="mt-2 font-poppins text-12 uppercase tracking-[0.09em] text-near-black">
                        {card.subtitle}
                      </span>
                    )}
                  </div>
                  {card.amount && (
                    <span className="font-gotham text-32 font-bold text-peach">
                      {card.amount}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {legal_text && (
              <div
                className="referral-legal mt-16 font-poppins text-12 leading-[1.2] text-black [&_a]:font-bold [&_a]:text-black"
                dangerouslySetInnerHTML={{ __html: legal_text }}
              />
            )}
          </div>
        )}
      </div>

      {/* Contenido desktop: posicionado sobre la imagen */}
      <div className="relative z-10 mx-auto hidden h-full w-full max-w-1440 flex-col items-center px-80 md:flex">
        {title && (
          <h1 className="mt-[calc(175*var(--fx))] text-center font-gotham-black text-[calc(76*var(--fx))] uppercase leading-[1.1] text-near-black">
            {titleFirstLine && <span className="block">{titleFirstLine}</span>}
            {titleLastWord && <span className="block">{titleLastWord}</span>}
          </h1>
        )}

        {phrase && (
          <div className="absolute top-[calc(500*var(--fx))] z-20 flex h-[calc(159*var(--fx))] w-[calc(375*var(--fx))] items-center justify-center rounded-[calc(15*var(--fx))] bg-near-black px-[calc(80*var(--fx))] py-[calc(24*var(--fx))]">
            <div
              className="whitespace-pre-line text-center font-poppins text-[calc(20*var(--fx))] font-light leading-[1.25] text-white [&_p]:m-0 [&_strong]:font-semibold [&_strong]:italic"
              dangerouslySetInnerHTML={{ __html: phrase }}
            />
          </div>
        )}

        {cards && cards.length > 0 && (
          <div className="absolute bottom-[calc(55*var(--fx))] left-1/2 h-[calc(454*var(--fx))] w-[calc(895*var(--fx))] -translate-x-[51%] rounded-[calc(25*var(--fx))] bg-peach px-[calc(92*var(--fx))] pt-[calc(94*var(--fx))] pb-[calc(50*var(--fx))]">
            <div className="flex flex-col gap-[calc(16*var(--fx))]">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="grid h-[calc(102*var(--fx))] grid-cols-[calc(180*var(--fx))_calc(72*var(--fx))_calc(110*var(--fx))_1fr] items-center rounded-[calc(22*var(--fx))] bg-white px-[calc(32*var(--fx))]"
                >
                  <span className="font-poppins text-[calc(20*var(--fx))] font-semibold text-near-black">
                    {card.label}
                  </span>
                  <span aria-hidden="true" className="font-poppins text-[calc(34*var(--fx))] font-light text-near-black">⟶</span>
                  <span className="font-poppins text-[calc(11*var(--fx))] uppercase leading-[1.2] tracking-[0.09em] text-near-black">
                    {card.subtitle}
                  </span>
                  {card.amount && (
                    <span className="text-right font-gotham text-[calc(47*var(--fx))] font-bold text-peach">
                      {card.amount}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {legal_text && (
              <div
                className="referral-legal mt-[calc(40*var(--fx))] text-center font-poppins text-[calc(13*var(--fx))] leading-[1.2] text-black [&_a]:font-bold [&_a]:text-black [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: legal_text }}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
