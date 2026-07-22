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
  return (
    <section
      data-layout="banner_referidos"
      className="relative w-full overflow-hidden bg-white md:h-[calc(1139*var(--fx))]"
    >
      {/* Imagen de fondo: parte superior en mobile, cubre todo en desktop */}
      <div className="relative h-[calc(402*var(--fx))] w-full md:absolute md:inset-0 md:h-full">
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
          <h1 className="mt-32 whitespace-pre-line text-center font-gotham-black text-36 uppercase leading-[1.1] text-near-black md:mt-[calc(256*var(--fx))] md:text-76">
            {title}
          </h1>
        )}

        {phrase && (
          <div className="mt-16 rounded-15 bg-near-black px-24 py-24">
            <p className="max-w-[calc(257*var(--fx))] text-center font-poppins text-20 leading-[1.25] text-white">
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
                className="mt-16 font-poppins text-12 leading-[1.2] text-black [&_a]:font-semibold [&_a]:italic [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: legal_text }}
              />
            )}
          </div>
        )}
      </div>

      {/* Contenido desktop: posicionado sobre la imagen */}
      <div className="relative z-10 mx-auto hidden h-full w-full max-w-1440 flex-col items-center px-80 md:flex">
        {title && (
          <h1 className="mt-[calc(256*var(--fx))] whitespace-pre-line text-center font-gotham-black text-76 uppercase leading-[1.1] text-near-black">
            {title}
          </h1>
        )}

        {phrase && (
          <div className="mt-[calc(80*var(--fx))] rounded-15 bg-near-black px-40 py-40">
            <p className="max-w-[calc(644*var(--fx))] text-center font-poppins text-24 leading-[1.25] text-white">
              {phrase}
            </p>
          </div>
        )}

        {cards && cards.length > 0 && (
          <div className="absolute bottom-[calc(80*var(--fx))] left-[calc(286*var(--fx))] w-[calc(868*var(--fx))] rounded-25 bg-peach p-24">
            <div className="flex flex-col gap-16">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="flex h-[calc(102*var(--fx))] items-center justify-between rounded-22 bg-white px-32"
                >
                  <div className="flex flex-col items-start">
                    {card.label && (
                      <span className="font-poppins text-22 font-semibold text-near-black">
                        {card.label}
                      </span>
                    )}
                    {card.subtitle && (
                      <span className="mt-4 font-poppins text-14 uppercase tracking-[0.09em] text-near-black">
                        {card.subtitle}
                      </span>
                    )}
                  </div>
                  {card.amount && (
                    <span className="font-gotham text-[calc(47*var(--fx))] font-bold text-peach">
                      {card.amount}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {legal_text && (
              <div
                className="mt-16 font-poppins text-15 leading-[1.2] text-black [&_a]:font-semibold [&_a]:italic [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: legal_text }}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
