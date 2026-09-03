import Image from "next/image";
import type { ACFImage } from "@/lib/types";

type BannerProps = {
  titulo?: string;
  descripcion?: string;
  imagen_fondo?: ACFImage;
  imagen_decorativa?: ACFImage;
};

function renderTitle(titulo?: string) {
  if (!titulo) return null;

  const separator = " / ";
  const index = titulo.indexOf(separator);
  if (index === -1) {
    return <h1 className="m-0 font-gotham text-48 font-medium leading-[1] text-near-black md:text-[calc(100*var(--fx))]">{titulo}</h1>;
  }

  const first = titulo.slice(0, index); // "Armando"
  const second = titulo.slice(index + separator.length); // "el Arquitecto"

  return (
    <h1 className="m-0 font-gotham text-48 leading-[normal] text-near-black md:text-[calc(100*var(--fx))]">
      <span className="block font-medium">{first}</span>
      <span className="block w-fit border-b-2 border-near-black pb-[calc(4*var(--fx))] font-light">
        {second}
      </span>
    </h1>
  );
}

export function Banner({ titulo, descripcion }: BannerProps) {
  return (
    <section className="relative w-full overflow-hidden bg-white pt-[calc(52*var(--fx))] md:h-[calc(700*var(--fx))] md:pt-0">
      <div className="pointer-events-none mx-auto w-fit md:hidden">
        <div className="relative h-[min(calc(154*var(--fx)),154px)] w-[min(calc(151*var(--fx)),151px)] max-w-full">
          <Image
            src="/images/armando/banner-superior-derecha.png"
            alt=""
            fill
            className="object-contain brightness-0"
            sizes="151px"
            priority
          />
        </div>
      </div>

      <div className="relative mx-auto flex max-w-1440 flex-col px-16 pb-60 pt-[calc(28*var(--fx))] md:h-full md:min-h-0 md:px-[calc(80*var(--fx))] md:pb-[calc(90*var(--fx))] md:pt-[calc(210*var(--fx))]">
        <div className="relative z-10 grid flex-1 gap-40 md:grid-cols-2 md:grid-rows-2 md:gap-0">
          <div className="md:col-start-1 md:row-start-1">
            {renderTitle(titulo)}
          </div>

          {descripcion && (
            <div
              className="font-poppins text-16 font-light leading-[1.45] text-near-black md:col-start-2 md:row-start-2 md:max-w-[calc(650*var(--fx))] md:self-center md:text-[calc(20*var(--fx))] [&_p]:m-0 [&_p+p]:mt-[calc(24*var(--fx))] [&_strong]:font-semibold [&_strong]:italic"
              dangerouslySetInnerHTML={{ __html: descripcion }}
            />
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute right-0 top-0 z-20 hidden h-[calc(355*var(--fx))] w-[calc(349*var(--fx))] md:block">
        <Image
          src="/images/armando/banner-superior-derecha.png"
          alt=""
          fill
          className="object-contain object-right-top brightness-0"
          sizes="349px"
          priority
        />
      </div>
    </section>
  );
}
