import { BannerProyecto } from "@/components/sections/proyecto/BannerProyecto";
import { BannerPreLanzamiento } from "@/components/sections/proyecto/BannerPreLanzamiento";
import { DescripcionProyecto } from "@/components/sections/proyecto/DescripcionProyecto";
import { FichaTecnica } from "@/components/sections/proyecto/FichaTecnica";
import { FichaTecnicaDetallada } from "@/components/sections/proyecto/FichaTecnicaDetallada";
import { QuieroMasInfo } from "@/components/sections/proyecto/QuieroMasInfo";
import { VideoProyecto } from "@/components/sections/proyecto/VideoProyecto";
import { GaleriaProyecto } from "@/components/sections/proyecto/GaleriaProyecto";
import { PlanosProyecto } from "@/components/sections/proyecto/PlanosProyecto";
import { MapaProyecto } from "@/components/sections/proyecto/MapaProyecto";
import { FormularioContacto } from "@/components/sections/FormularioContacto";
import { MasProyectos } from "@/components/sections/MasProyectos";
import { Blog } from "@/components/sections/Blog";
import type { LeadContext } from "@/lib/lead";
import type { Project, ProjectSection } from "@/lib/types";
import { toArray } from "@/lib/utils";

/** Template de WordPress que usan las páginas de gracias de cada proyecto. */
const GRACIAS_TEMPLATE = "page-templates/template-proyectos-interna-gracias.php";

type ProjectSectionMapperProps = {
  sections: ProjectSection[];
  proyectos?: Project[];
  /** Datos del proyecto que acompañan a los leads enviados a Sperant. */
  lead?: LeadContext;
  /** Opciones del select de presupuesto, desde ACF cotizador. */
  presupuestos?: string[];
};

export function ProjectSectionMapper({ sections, proyectos, lead, presupuestos }: ProjectSectionMapperProps) {
  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.acf_fc_layout}-${index}`;
        switch (section.acf_fc_layout) {
          case "banner_proyecto":
            return (
              <BannerProyecto
                key={key}
                badge={section.badge}
                distrito={section.distrito}
                logo={section.logo}
                slides={toArray(section.slides)}
              />
            );
          case "banner_pre_lanzamiento":
            return (
              <BannerPreLanzamiento
                key={key}
                badge={section.badge}
                slides={toArray(section.slides)}
              />
            );
          case "descripcion_proyecto":
            return (
              <DescripcionProyecto
                key={key}
                titulo={section.titulo}
                descripcion={section.descripcion}
                imagen={section.imagen}
                cambiar_lado={section.cambiar_lado}
              />
            );
          case "ficha_tecnica":
            return (
              <FichaTecnica
                key={key}
                titulo={section.titulo}
                direccion={section.direccion}
                pisos={section.pisos}
                area={section.area}
                dormitorios={section.dormitorios}
                brochure={section.brochure}
              />
            );
          case "ficha_tecnica_detallada":
            return (
              <FichaTecnicaDetallada
                key={key}
                imagen={section.imagen}
                titulo={section.titulo}
                info={toArray(section.info)}
              />
            );
          case "video":
            return (
              <VideoProyecto
                key={key}
                titulo={section.titulo}
                imagen_previa={section.imagen_previa}
                url_youtube={section.url_youtube}
              />
            );
          case "galeria":
            return (
              <GaleriaProyecto
                key={key}
                titulo={section.titulo}
                descripcion={section.descripcion}
                tabs={toArray(section.tabs)}
              />
            );
          case "planos":
            return (
              <PlanosProyecto
                key={key}
                titulo={section.titulo}
                dormitorios={toArray(section.dormitorios)}
                boton_mas_planos={section.boton_mas_planos}
                texto_adicional={section.texto_adicional}
                leyenda={toArray(section.leyenda)}
              />
            );
          case "mapa":
            return (
              <MapaProyecto
                key={key}
                titulo={section.titulo}
                google_maps={section.google_maps}
                imagen={section.imagen}
                latitud={section.latitud}
                longitud={section.longitud}
                ubicaciones={toArray(section.ubicaciones)}
              />
            );
          case "formulario_contacto":
            return (
              <FormularioContacto
                key={key}
                titulo={section.titulo}
                formulario_id={section.formulario_id}
                lead={lead}
                presupuestos={presupuestos}
              />
            );
          case "quiero_mas_info":
            return (
              <QuieroMasInfo
                key={key}
                titulo={section.titulo}
                formulario_id={section.formulario_id}
                imagen_fondo={section.imagen_fondo}
                blog_titulo={section.blog_titulo}
                blog_boton={section.blog_boton}
                lead={lead}
                presupuestos={presupuestos}
              />
            );
          case "mas_proyectos":
            return (
              <MasProyectos
                key={key}
                titulo={section.titulo}
                proyectos={proyectos?.filter((p) => p.template !== GRACIAS_TEMPLATE)}
              />
            );
          case "blog":
            return (
              <Blog
                key={key}
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
