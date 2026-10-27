import { Banner } from "@/components/sections/entregados/Banner";
import { Galeria } from "@/components/sections/entregados/Galeria";
import { Detalle } from "@/components/sections/entregados/Detalle";
import { Navegacion } from "@/components/sections/entregados/Navegacion";
import { ProyectosVenta } from "@/components/sections/ProyectosVenta";
import type { Delivered, EntregadosSingleSection, Project } from "@/lib/types";
import { selectByPostObject, stripHtml, toArray } from "@/lib/utils";

function withoutGracias(projects: Project[]) {
  return projects.filter((project) => {
    const title = stripHtml(project.title?.rendered);
    const name = project.slug.replace(/-/g, " ");
    return !/\bgracias\b/i.test(`${title} ${name}`);
  });
}

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
                imagenes={toArray(section.imagenes)}
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
                icono_direccion={section.icono_direccion}
                icono_pisos={section.icono_pisos}
                icono_area={section.icono_area}
                icono_dormitorios={section.icono_dormitorios}
                icono_fecha={section.icono_fecha}
              />
            );
          case "proyectos_venta":
            return (
              <ProyectosVenta
                key={`${section.acf_fc_layout}-${index}`}
                titulo={section.titulo}
                proyectos={withoutGracias(selectByPostObject(proyectos, section.post))}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
