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
            return (
              <ContactoFormulario
                key={key}
                solicitar_informacion={section.solicitar_informacion}
                salas_de_ventas={section.salas_de_ventas}
                postventa={section.postventa}
                preguntas_frecuentes={section.preguntas_frecuentes}
                formulario={formulario}
                proyectos={proyectos}
                entregados={entregados}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
