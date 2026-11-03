import { Suspense } from "react";
import { ContactoFormulario } from "@/components/sections/contacto/ContactoFormulario";
import type { ContactoPageFields, ContactoPageSection, Delivered, Project } from "@/lib/types";

type ContactoSectionMapperProps = {
  sections: ContactoPageSection[];
  formulario: Omit<ContactoPageFields, "secciones">;
  proyectos: Project[];
  entregados: Delivered[];
};

export function ContactoSectionMapper({ sections, formulario, proyectos, entregados }: ContactoSectionMapperProps) {
  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.acf_fc_layout}-${index}`;
        switch (section.acf_fc_layout) {
          case "formulario":
            // Suspense: ContactoFormulario usa useSearchParams (`?tab=`) para deep-links.
            return (
              <Suspense key={key} fallback={<section className="w-full bg-white px-16 py-52 md:px-24 md:py-90" />}>
                <ContactoFormulario
                  solicitar_informacion={section.solicitar_informacion}
                  salas_de_ventas={section.salas_de_ventas}
                  postventa={section.postventa}
                  preguntas_frecuentes={section.preguntas_frecuentes}
                  formulario={formulario}
                  proyectos={proyectos}
                  entregados={entregados}
                />
              </Suspense>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
