import { Banner } from "@/components/sections/proyectos-en-venta/Banner";
import { ProyectosLista } from "@/components/sections/proyectos-en-venta/ProyectosLista";
import type { ProyectosPageSection, Project } from "@/lib/types";

type ProyectosPageSectionMapperProps = {
  sections?: ProyectosPageSection[];
  proyectos?: Project[];
  /* Respaldo cuando la sección no trae Título en ACF: el título de la página. */
  tituloPagina?: string;
};

export function ProyectosPageSectionMapper({
  sections = [],
  proyectos = [],
  tituloPagina,
}: ProyectosPageSectionMapperProps) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section.acf_fc_layout) {
           case "banner":
             return (
               <Banner
                 key={`${section.acf_fc_layout}-${index}`}
                 titulo={section.titulo}
                 imagen={section.imagen}
               />
             );
          case "proyectos_lista":
            return (
              <ProyectosLista
                key={`${section.acf_fc_layout}-${index}`}
                titulo={section.titulo || tituloPagina}
                proyectos={proyectos}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
