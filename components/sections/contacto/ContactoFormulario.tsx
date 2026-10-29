"use client";

import { useState } from "react";
import { ContactoForm } from "@/components/forms/ContactoForm";
import { Postventa } from "@/components/sections/contacto/Postventa";
import { SalasDeVentas } from "@/components/sections/contacto/SalasDeVentas";
import type { ContactoFormularioSection, ContactoPageFields, Delivered, Project } from "@/lib/types";
import { toArray } from "@/lib/utils";

const TABS = [
  { id: "solicitar-informacion", label: "Solicitar información" },
  { id: "salas-de-ventas", label: "Salas de ventas" },
  { id: "postventa", label: "Postventa" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type ContactoFormularioProps = Omit<ContactoFormularioSection, "acf_fc_layout"> & {
  /** Campos del formulario de leads (ids de CF7, opciones de los selects) que no viven en el layout. */
  formulario: Omit<ContactoPageFields, "secciones">;
  proyectos: Project[];
  entregados: Delivered[];
};

export function ContactoFormulario({
  solicitar_informacion,
  salas_de_ventas,
  postventa,
  preguntas_frecuentes,
  formulario,
  proyectos,
  entregados,
}: ContactoFormularioProps) {
  const [activo, setActivo] = useState<TabId>("solicitar-informacion");
  // Postventa atiende a propietarios: también de edificios ya entregados.
  const proyectosPostventa = [...new Set([...proyectos, ...entregados].map((p) => p.title.rendered))];

  return (
    <section data-layout="formulario" className="w-full bg-white px-16 md:px-24 py-52 md:py-90">
      <div role="tablist" aria-label="Opciones de contacto" className="mx-auto grid max-w-895 grid-cols-1 gap-10 sm:flex sm:justify-center">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            type="button"
            role="tab"
            aria-selected={activo === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActivo(tab.id)}
            className={`flex h-50 cursor-pointer items-center justify-center border border-peach px-12 text-center font-gotham text-15 font-bold sm:w-250 md:text-18 ${activo === tab.id ? "bg-peach text-white" : "bg-white text-peach"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Los paneles quedan montados para no perder lo escrito en el formulario al cambiar de pestaña. */}
      <div id="panel-solicitar-informacion" role="tabpanel" aria-labelledby="tab-solicitar-informacion" hidden={activo !== "solicitar-informacion"}>
        <ContactoForm {...formulario} titulo={solicitar_informacion?.titulo || formulario.titulo} formulario_id={solicitar_informacion?.formulario_id || formulario.formulario_id || undefined} proyectos={proyectos} />
      </div>
      <div id="panel-salas-de-ventas" role="tabpanel" aria-labelledby="tab-salas-de-ventas" hidden={activo !== "salas-de-ventas"}>
        <SalasDeVentas titulo={salas_de_ventas?.titulo || undefined} cards={toArray(salas_de_ventas?.cards)} />
      </div>
      <div id="panel-postventa" role="tabpanel" aria-labelledby="tab-postventa" hidden={activo !== "postventa"}>
        <Postventa
          titulo={postventa?.titulo || undefined}
          titulo_secundario={postventa?.titulo_secundario}
          subtitulo_secundario={postventa?.subtitulo_secundario}
          formulario_id={postventa?.formulario_id || undefined}
          preguntas={{ titulo: preguntas_frecuentes?.titulo || undefined, grupos: toArray(preguntas_frecuentes?.grupos) }}
          proyectos={proyectosPostventa}
        />
      </div>
    </section>
  );
}
