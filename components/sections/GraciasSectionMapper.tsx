import { BannerGracias } from "@/components/sections/gracias/BannerGracias";
import { ProyectosVenta } from "@/components/sections/ProyectosVenta";
import { Blog } from "@/components/sections/Blog";
import type { GraciasPageSection, Project } from "@/lib/types";

type GraciasSectionMapperProps = {
  sections: GraciasPageSection[];
  proyectos?: Project[];
  proyectoSlug?: string;
};

export function GraciasSectionMapper({ sections, proyectos, proyectoSlug }: GraciasSectionMapperProps) {
  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.acf_fc_layout}-${index}`;
        switch (section.acf_fc_layout) {
          case "banner_gracias":
            return (
              <BannerGracias
                key={key}
                titulo={section.titulo}
                descripcion={section.descripcion}
                imagen_de_fondo={section.imagen_de_fondo}
                proyectoSlug={proyectoSlug}
              />
            );
          case "proyectos_venta":
            return (
              <ProyectosVenta
                key={key}
                titulo={section.titulo}
                proyectos={proyectos ?? []}
              />
            );
          case "blog":
            return <Blog key={key} titulo={section.titulo} boton={section.boton} />;
          default:
            return null;
        }
      })}
    </>
  );
}
