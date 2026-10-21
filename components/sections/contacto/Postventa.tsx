"use client";

import Image from "next/image";
import { useState } from "react";
import { controlClass, fieldBorder, fieldClass, labelClass } from "@/components/forms/ContactoForm";
import { PostventaForm } from "@/components/forms/PostventaForm";
import type { ContactoFaqGrupo, ContactoFormularioSection } from "@/lib/types";
import { toArray } from "@/lib/utils";

type PostventaProps = NonNullable<ContactoFormularioSection["postventa"]> & {
  preguntas?: { titulo?: string; grupos: ContactoFaqGrupo[] };
  /** Nombres de los proyectos (en venta y entregados) entre los que elige el propietario. */
  proyectos: string[];
};

export function Postventa({
  titulo = "Acá seguimos para lo que necesites",
  titulo_secundario,
  subtitulo_secundario,
  formulario_id,
  preguntas,
  proyectos,
}: PostventaProps) {
  const [proyecto, setProyecto] = useState("");
  const grupos = (preguntas?.grupos ?? []).filter((grupo) => toArray(grupo.preguntas).length > 0);

  return (
    <div className="mx-auto max-w-895">
      <h2 className="mb-0 mt-24 text-center font-gotham text-36 font-bold leading-tight text-slate md:mt-80 md:text-60">{titulo}</h2>

      <div className="mx-auto mt-24 flex max-w-796 flex-col gap-6 md:mt-50">
        <label htmlFor="postventa-proyecto" className={labelClass}>Proyecto*</label>
        <div className={`${fieldClass} relative`} style={fieldBorder(false)}>
          <select
            id="postventa-proyecto"
            value={proyecto}
            onChange={(event) => setProyecto(event.target.value)}
            className={`${controlClass} appearance-none pr-28`}
          >
            <option value="" disabled>Seleccionar proyecto</option>
            {proyectos.map((nombre) => <option key={nombre} value={nombre}>{nombre}</option>)}
          </select>
          <Image unoptimized src="/images/formulario-modal/chevron-down.svg" alt="" width={18} height={18} className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {proyecto && (
        <PostventaForm
          titulo={titulo_secundario || undefined}
          subtitulo={subtitulo_secundario || undefined}
          formularioId={formulario_id}
          proyectos={proyectos}
          proyecto={proyecto}
          onProyectoChange={setProyecto}
        />
      )}

      {grupos.length > 0 && <PreguntasFrecuentes titulo={preguntas?.titulo} grupos={grupos} />}
    </div>
  );
}

function PreguntasFrecuentes({ titulo = "Preguntas frecuentes", grupos }: { titulo?: string; grupos: ContactoFaqGrupo[] }) {
  const [activo, setActivo] = useState(0);
  const grupo = grupos[Math.min(activo, grupos.length - 1)];

  return (
    <section aria-labelledby="postventa-faq" className="mt-64 md:mt-104">
      <h3 id="postventa-faq" className="m-0 text-center font-gotham text-28 font-bold leading-tight text-slate md:text-40">{titulo}</h3>

      <div aria-label="Categorías" role="group" className="mt-20 flex flex-wrap justify-center gap-10 md:mt-25">
        {grupos.map((g, index) => (
          <button
            key={`${g.categoria}-${index}`}
            type="button"
            aria-pressed={index === activo}
            onClick={() => setActivo(index)}
            className={`flex h-44 cursor-pointer items-center justify-center border border-peach px-14 font-gotham text-15 font-bold md:h-50 md:text-18 ${index === activo ? "bg-peach text-white" : "bg-white text-peach"}`}
          >
            {g.categoria}
          </button>
        ))}
      </div>

      <div key={activo} className="mx-auto mt-32 flex max-w-752 flex-col gap-16 md:mt-50 md:gap-21">
        {toArray(grupo.preguntas).map((pregunta, index) => (
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
