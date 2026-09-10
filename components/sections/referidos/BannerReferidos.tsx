import Image from "next/image";
import type { ACFImage, ReferidosCard } from "@/lib/types";

type BannerReferidosProps = {
  background_image?: ACFImage;
  title?: string;
  phrase?: string;
  cards?: ReferidosCard[];
  legal_text?: string;
};

function formatPhrase(phrase: string) {
  return phrase.replace(
    /(?:<strong[^>]*>)?se recomiendan(?:<\/strong>)?/gi,
    "<br><strong>se recomiendan</strong>",
  );
}

function BenefitCards({ cards }: { cards: ReferidosCard[] }) {
  return (
    <div className="flex flex-col gap-12 [container-type:inline-size] md:gap-16">
      {cards.map((card, index) => (
        <div
          key={index}
          className="grid min-h-[18.6cqw] grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-[2.25cqw] rounded-[3.25cqw] bg-white px-[4.2cqw] md:h-[calc(102*var(--fx))] md:min-h-0 md:grid-cols-[calc(196*var(--fx))_calc(122*var(--fx))_calc(90*var(--fx))_minmax(0,1fr)] md:gap-0 md:rounded-[calc(22*var(--fx))] md:px-[calc(32*var(--fx))]"
        >
          <span className="font-poppins text-[5.18cqw] font-semibold leading-[1.2] text-near-black md:text-center md:text-[calc(22*var(--fx))]">
            {card.label}
          </span>
          <svg
            width="74"
            height="15"
            viewBox="0 0 74 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="hidden md:block md:h-[calc(15*var(--fx))] md:w-[calc(74*var(--fx))] md:justify-self-center"
          >
            <path
              d="M73.7071 8.07039C74.0976 7.67986 74.0976 7.0467 73.7071 6.65617L67.3431 0.292213C66.9526 -0.0983109 66.3195 -0.0983109 65.9289 0.292213C65.5384 0.682738 65.5384 1.3159 65.9289 1.70643L71.5858 7.36328L65.9289 13.0201C65.5384 13.4107 65.5384 14.0438 65.9289 14.4343C66.3195 14.8249 66.9526 14.8249 67.3431 14.4343L73.7071 8.07039ZM0 7.36328V8.36328H73V7.36328V6.36328H0V7.36328Z"
              fill="#1D1D1B"
            />
          </svg>
          <span className="font-poppins text-[3.24cqw] uppercase leading-[1.4] tracking-[0.09em] text-near-black md:text-[calc(13*var(--fx))] md:leading-[1.2]">
            {card.subtitle?.trim().split(/^un\s+bono\b/i.test(card.subtitle.trim()) ? /\s+(?=hasta\b)/i : /\s+(?=de\s+hasta\b)/i).map((line, lineIndex) => (
              <span key={lineIndex} className="block whitespace-nowrap">{line}</span>
            ))}
          </span>
          {card.amount && (
            <span className="whitespace-nowrap font-gotham text-[8.42cqw] font-bold leading-none tracking-[-0.03em] text-peach md:ml-[calc(15*var(--fx))] md:text-center md:text-[calc(42*var(--fx))] md:leading-[normal]">
              {card.amount}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

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

        {title && (
          <h1 className="absolute bottom-[calc(52*var(--fx))] left-1/2 z-10 m-0 w-full -translate-x-1/2 px-24 text-center font-gotham-black text-[calc(36*var(--fx))] uppercase leading-[1.1] text-near-black md:hidden">
            {titleFirstLine && <span className="block">{titleFirstLine}</span>}
            {titleLastWord && <span className="block">{titleLastWord}</span>}
          </h1>
        )}
      </div>

      {/* Contenido mobile: flujo normal debajo de la imagen */}
      <div className="relative z-10 mx-auto flex w-full max-w-1440 flex-col items-center bg-white px-16 pb-48 md:hidden">
        {phrase && (
          <div className="relative z-20 mt-[calc(16*var(--fx))] flex min-h-[calc(132*var(--fx))] w-[calc(256*var(--fx))] max-w-full items-center justify-center rounded-[calc(15*var(--fx))] bg-near-black px-[calc(24*var(--fx))] py-[calc(24*var(--fx))]">
            <div
              className="max-w-257 text-center font-poppins text-[calc(22*var(--fx))] leading-[1.25] text-white [&_p]:m-0 [&_strong]:font-semibold [&_strong]:italic"
              dangerouslySetInnerHTML={{ __html: formatPhrase(phrase) }}
            />
          </div>
        )}

        {cards && cards.length > 0 && (
          <div className="relative z-10 -mt-[calc(55*var(--fx))] w-full rounded-[calc(16*var(--fx))] bg-peach px-16 pb-40 pt-[calc(95*var(--fx))]">
            <BenefitCards cards={cards} />

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
              className="whitespace-pre-line text-center font-poppins text-[calc(22*var(--fx))] font-light leading-[1.25] text-white [&_p]:m-0 [&_strong]:font-semibold [&_strong]:italic"
              dangerouslySetInnerHTML={{ __html: formatPhrase(phrase) }}
            />
          </div>
        )}

        {cards && cards.length > 0 && (
          <div className="absolute bottom-[calc(55*var(--fx))] left-1/2 w-[calc(895*var(--fx))] -translate-x-[51%] rounded-[calc(25*var(--fx))] bg-peach px-[calc(92*var(--fx))] pt-[calc(94*var(--fx))] pb-[calc(50*var(--fx))]">
            <BenefitCards cards={cards} />

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
