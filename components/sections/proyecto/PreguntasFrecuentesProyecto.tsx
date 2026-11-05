"use client";

import Image from "next/image";
import type { ContactoPregunta } from "@/lib/types";

export function PreguntasFrecuentesProyecto({ titulo = "Preguntas frecuentes", preguntas, color_titulo, ocultar_en_movil }:
  { titulo?: string; preguntas: ContactoPregunta[]; color_boton?: string; color_titulo?: string; ocultar_en_movil?: boolean }) {
  return (
    <section aria-labelledby="proyecto-faq" className={`mt-24 md:mt-40 ${ocultar_en_movil ? "hidden md:block" : ""}`}>
      <h2 id="proyecto-faq" className="m-0 text-center font-gotham text-36 font-bold leading-tight md:text-50"
      style={{ color: color_titulo || "rgb(116, 140, 164)" }}>
        {titulo}
      </h2>

      <div className="mx-auto mt-32 flex max-w-752 flex-col gap-16 md:mt-50 md:gap-21">
        {preguntas.map((pregunta, index) => (
          <details key={`${pregunta.titulo}-${index}`} className="group border border-peach px-16 py-14 md:px-20">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-16 font-poppins text-16 font-medium text-black md:text-18 [&::-webkit-details-marker]:hidden">
              {pregunta.titulo}
              <Image unoptimized src="/images/contacto/chevron.svg" alt="" width={24} height={24} className="size-24 shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            {pregunta.respuesta && (
              <div
                className="mt-13 font-poppins text-14 leading-[1.6] text-near-black md:text-16 [&_p]:m-0 [&_p+p]:mt-12 [&_ul]:mt-12 [&_ul]:list-disc [&_ul]:pl-24 [&_ol]:mt-12 [&_ol]:list-decimal [&_ol]:pl-24 [&_a]:text-peach [&_a]:underline [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: pregunta.respuesta }}
              />
            )}
          </details>
        ))}
      </div>
    </section>
  );
}
