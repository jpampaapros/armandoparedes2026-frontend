import { Banner } from "@/components/sections/inicio/Banner";
import { Espacios } from "@/components/sections/inicio/Espacios";
import { ProyectosVenta } from "@/components/sections/ProyectosVenta";
import { QuienEsArmando } from "@/components/sections/inicio/QuienEsArmando";
import { ProyectosEntregados } from "@/components/sections/inicio/ProyectosEntregados";
import { AmigosBeneficios } from "@/components/sections/inicio/AmigosBeneficios";
import { Blog } from "@/components/sections/Blog";
import type { HomeSection, Project, Delivered } from "@/lib/types";

type HomeSectionMapperProps = {
  sections?: HomeSection[];
  proyectos?: Project[];
  entregados?: Delivered[];
};

export function HomeSectionMapper({
  sections = [],
  proyectos = [],
  entregados = [],
}: HomeSectionMapperProps) {
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
          case "espacios":
            return (
              <Espacios
                key={`${section.acf_fc_layout}-${index}`}
                titulo={section.titulo}
                subtitulo={section.subtitulo}
                indicadores={section.indicadores}
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
          case "quien_es_armando":
            return (
              <QuienEsArmando
                key={`${section.acf_fc_layout}-${index}`}
                titulo={section.titulo}
                imagen_fondo={section.imagen_fondo}
                descripcion={section.descripcion}
                boton={section.boton}
              />
            );
          case "proyectos_entregados":
            return (
              <ProyectosEntregados
                key={`${section.acf_fc_layout}-${index}`}
                texto={section.texto}
                subtitulo={section.subtitulo}
                boton={section.boton}
                entregados={entregados}
              />
            );
          case "amigos_beneficios":
            return (
              <AmigosBeneficios
                key={`${section.acf_fc_layout}-${index}`}
                titulo={section.titulo}
                descripcion={section.descripcion}
                boton={section.boton}
              />
            );
          case "blog":
            return (
              <Blog
                key={`${section.acf_fc_layout}-${index}`}
                titulo={section.titulo}
                boton={section.boton}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
