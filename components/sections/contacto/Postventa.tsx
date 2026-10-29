"use client";

import Image from "next/image";
import { useState } from "react";
import { controlClass, fieldBorder, fieldClass, labelClass } from "@/components/forms/ContactoForm";
import { PostventaForm } from "@/components/forms/PostventaForm";
import type { ContactoFaqGrupo, ContactoFormularioSection } from "@/lib/types";
import { toArray } from "@/lib/utils";
import { PreguntasFrecuentes } from "./PreguntasFrecuentes";

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
      {grupos.length > 0 && <PreguntasFrecuentes titulo={preguntas?.titulo} grupos={grupos} />}

      <h2 className={`mb-0 ${grupos.length > 0 ? "mt-64 md:mt-104" : "mt-24 md:mt-80"} text-center font-gotham text-36 font-bold leading-tight text-slate md:text-50`}>{titulo}</h2>

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
    </div>
  );
}
