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
import { PreguntasFrecuentes } from "@/components/sections/contacto/PreguntasFrecuentes";
import type { LeadContext } from "@/lib/lead";
import type { Project, ProjectSection } from "@/lib/types";
import { isAcfTrue, toArray } from "@/lib/utils";

/** Template de WordPress que usan las páginas de gracias de cada proyecto. */
const GRACIAS_TEMPLATE =
  "page-templates/template-proyectos-interna-gracias.php";

type ProjectSectionMapperProps = {
  sections: ProjectSection[];
  proyectos?: Project[];
  /** Datos del proyecto que acompañan a los leads enviados a Sperant. */
  lead?: LeadContext;
  /** Opciones del select de presupuesto, desde ACF cotizador. */
  presupuestos?: string[];
};

export function ProjectSectionMapper({
  sections,
  proyectos,
  lead,
  presupuestos,
}: ProjectSectionMapperProps) {
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
                badge_color={section.badget_color_fondo}
                distrito={section.distrito}
                slides={toArray(section.slides)}
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
              />
            );
          case "banner_pre_lanzamiento":
            return (
              <BannerPreLanzamiento
                key={key}
                badge={section.badge}
                slides={toArray(section.slides)}
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
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
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
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
                planos={section.planos}
                color_fondo={section.color_fondo}
                color_titulo={section.color_titulo}
                color_iconos={section.color_iconos}
                color_botones={section.color_botones}
                icono_direccion={section.icono_direccion}
                icono_pisos={section.icono_pisos}
                icono_area={section.icono_area}
                icono_dormitorios={section.icono_dormitorios}
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
              />
            );
          case "ficha_tecnica_detallada":
            return (
              <FichaTecnicaDetallada
                key={key}
                imagen={section.imagen}
                titulo={section.titulo}
                info={toArray(section.info)}
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
              />
            );
          case "video":
            // Video también tiene `desactivar_seccion` (legacy ACF).
            return (
              <VideoProyecto
                key={key}
                titulo={section.titulo}
                imagen_previa={section.imagen_previa}
                url_youtube={section.url_youtube}
                desactivar_seccion={section.desactivar_seccion}
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
              />
            );
          case "galeria":
            return (
              <GaleriaProyecto
                key={key}
                titulo={section.titulo}
                descripcion={section.descripcion}
                tabs={toArray(section.tabs)}
                color_fondo={section.color_fondo}
                color_activo={section.color_activo}
                color_barra_tabs_movil={section.color_barra_tabs_movil}
                color_active_tab_movil={section.color_active_tab_movil}
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
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
                color_botones={section.color_botones}
                color_boton_quiero_este_depa={section.color_boton_quiero_este_depa}
                color_titulo={section.color_titulo}
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
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
                color_tarjeta={section.color_tarjeta}
                color_box_alrededores={section.color_box_alrededores}
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
              />
            );
          case "formulario_contacto":
            return (
              <FormularioContacto
                key={key}
                titulo={section.titulo}
                formulario_id={section.formulario_id}
                color_titulo={section.color_titulo}
                color_boton={section.color_boton}
                lead={lead}
                presupuestos={presupuestos}
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
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
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
              />
            );
          case "preguntas_frecuentes": {
            const grupos = toArray(section.grupos).filter(
              (grupo) => toArray(grupo.preguntas).length > 0,
            );
            if (grupos.length === 0) return null;
            return (
              <PreguntasFrecuentes
                key={key}
                titulo={section.titulo}
                grupos={grupos}
                color_boton={section.color_boton}
                color_titulo={section.color_titulo}
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
              />
            );
          }
          case "mas_proyectos":
            return (
              <MasProyectos
                key={key}
                titulo="Otros Proyectos"
                color_titulo={section.color_titulo}
                proyectos={proyectos?.filter(
                  (p) => p.template !== GRACIAS_TEMPLATE,
                )}
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
              />
            );

          case "blog":
            return null;
          default:
            return null;
        }
      })}
    </>
  );
}
