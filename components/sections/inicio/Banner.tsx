import Image from "next/image";
import type { ACFImage } from "@/lib/types";

type BannerProps = {
  titulo?: string;
  imagen?: ACFImage;
};

function processTitle(html?: string) {
  if (!html) return "";
  return html
    .replace(/<strong>/gi, '<span class="text-slate font-medium">')
    .replace(/<\/strong>/gi, "</span>");
}

export function Banner({ titulo, imagen }: BannerProps) {
  return (
    <section className="relative flex w-full flex-col items-center bg-white pt-57 md:pt-185">
      <div className="mx-auto w-full max-w-382 px-4 text-center md:max-w-760 md:px-0 [&_p]:m-0">
        {titulo ? (
          <div
            className="font-gotham font-light text-36 leading-[1.11] text-black md:text-80 md:leading-[1.14]"
            dangerouslySetInnerHTML={{ __html: processTitle(titulo) }}
          />
        ) : null}
      </div>

      <div className="mt-57 flex gap-3 md:mt-153">
        <div className="h-6 w-91 rounded-full bg-dots-active" />
        <div className="h-6 w-27 rounded-full bg-dots-inactive" />
        <div className="h-6 w-27 rounded-full bg-dots-inactive" />
      </div>

      {imagen?.url && (
        <div className="relative mt-61 h-494 w-full md:mt-34 md:h-817">
          <Image
            src={imagen.url}
            alt={imagen.alt || ""}
            fill
            className="object-cover md:object-fill"
            sizes="100vw"
            priority
          />
        </div>
      )}
    </section>
  );
}
