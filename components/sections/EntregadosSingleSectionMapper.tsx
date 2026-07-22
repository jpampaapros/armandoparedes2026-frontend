import { Banner } from "@/components/sections/entregados/Banner";
import { Galeria } from "@/components/sections/entregados/Galeria";
import { Detalle } from "@/components/sections/entregados/Detalle";
import { Navegacion } from "@/components/sections/entregados/Navegacion";
import { ProyectosVenta } from "@/components/sections/ProyectosVenta";
import type { Delivered, EntregadosSingleSection, Project } from "@/lib/types";

type EntregadosSingleSectionMapperProps = {
  current: Delivered;
  entregados: Delivered[];
  sections: EntregadosSingleSection[];
  proyectos: Project[];
};

export function EntregadosSingleSectionMapper({
  current,
  entregados,
  sections,
  proyectos,
}: EntregadosSingleSectionMapperProps) {
  return (
    <>
      <Navegacion current={current} entregados={entregados} />
      {sections.map((section, index) => {
        switch (section.acf_fc_layout) {
          case "banner":
            return (
              <Banner
                key={`${section.acf_fc_layout}-${index}`}
                titulo={section.titulo}
                descripcion={section.descripcion}
                imagen={section.imagen}
              />
            );
          case "galeria":
            return (
              <Galeria
                key={`${section.acf_fc_layout}-${index}`}
                imagenes={section.imagenes}
              />
            );
          case "detalle":
            return (
              <Detalle
                key={`${section.acf_fc_layout}-${index}`}
                imagen={section.imagen}
                direccion={section.direccion}
                pisos={section.pisos}
                area={section.area}
                dormitorios={section.dormitorios}
                fecha={section.fecha}
              />
            );
          case "proyectos_venta":
            return (
              <ProyectosVenta
                key={`${section.acf_fc_layout}-${index}`}
                titulo={section.titulo}
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
