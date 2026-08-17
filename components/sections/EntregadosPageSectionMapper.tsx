import { BannerEntregadosPage } from "@/components/sections/entregados/BannerEntregadosPage";
import { ProyectosEntregados } from "@/components/sections/entregados/ProyectosEntregados";
import type { EntregadosPageSection, Delivered } from "@/lib/types";

type EntregadosPageSectionMapperProps = {
  sections: EntregadosPageSection[];
  entregados: Delivered[];
};

export function EntregadosPageSectionMapper({
  sections,
  entregados,
}: EntregadosPageSectionMapperProps) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section.acf_fc_layout) {
          case "banner":
            return (
              <BannerEntregadosPage
                key={`${section.acf_fc_layout}-${index}`}
                titulo={section.titulo}
                descripcion={section.descripcion}
                imagen={section.imagen}
              />
            );
          case "proyectos_entregados":
            return (
              <ProyectosEntregados
                key={`${section.acf_fc_layout}-${index}`}
                titulo={section.titulo}
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
