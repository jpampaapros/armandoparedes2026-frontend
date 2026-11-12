"use client";

import Image from "next/image";
import type { ContactoPregunta } from "@/lib/types";

export function PreguntasFrecuentesProyecto({ titulo = "Preguntas frecuentes", preguntas, color_titulo, ocultar_en_movil, color_borde, margin = "mt-52 md:mt-90" }:
  { titulo?: string; preguntas: ContactoPregunta[]; color_boton?: string; color_titulo?: string; ocultar_en_movil?: boolean; color_borde?: string; margin?: string }) {
  return (
    <section
      aria-labelledby="proyecto-faq"
      className={`grid md:grid-cols-2 px-24 md:px-80 ${ocultar_en_movil ? "hidden md:block" : ""} ${margin}`}
    >
      <div className="w-full h-full flex flex-col justify-center items-start">
        <div className="md:w-310">
        <p className="font-gotham text-start text-14 font-normal leading-tight text-near-black text-20">
          Preguntas frecuentes
        </p>
        <h2
          id="proyecto-faq"
          className="m-0 font-gotham text-36 font-medium leading-tight md:text-46"
          style={{ color: color_titulo || "rgb(116, 140, 164)" }}
        >
          {titulo}
        </h2>
        </div>
      </div>
      <div className="mx-auto mt-32 flex w-full flex-col gap-16 md:mt-0 md:gap-21 border-l border-l-solid border-l-near-black/25 md:pl-105">
        {preguntas.map((pregunta, index) => (
          <details
            key={`${pregunta.titulo}-${index}`}
            className="group border-b border-b-solid px-16 py-14 md:px-20"
            style={{ borderColor: color_borde || "rgb(221, 167, 131)" }}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-16 font-poppins text-16 font-regular text-black md:text-18 [&::-webkit-details-marker]:hidden">
              {pregunta.titulo}
              <Image
                unoptimized
                src="/images/contacto/chevron.svg"
                alt=""
                width={24}
                height={24}
                className="size-24 shrink-0 transition-transform group-open:rotate-180"
              />
            </summary>
            {pregunta.respuesta && (
              <div
                className="mt-13 font-poppins text-14 leading-[1.6] text-near-black md:text-16 [&_p]:font-light [&_p]:m-0 [&_p+p]:mt-12 [&_ul]:mt-12 [&_ul]:list-disc [&_ul]:pl-24 [&_ol]:mt-12 [&_ol]:list-decimal [&_ol]:pl-24 [&_a]:text-peach [&_a]:underline [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: pregunta.respuesta }}
              />
            )}
          </details>
        ))}
      </div>
    </section>
  );
}
