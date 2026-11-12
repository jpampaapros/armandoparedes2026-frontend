import { Banner } from "@/components/sections/inicio/Banner";
import { Espacios } from "@/components/sections/inicio/Espacios";
import { ProyectosVenta } from "@/components/sections/ProyectosVenta";
import { QuienEsArmando } from "@/components/sections/inicio/QuienEsArmando";
import { ProyectosEntregados } from "@/components/sections/inicio/ProyectosEntregados";
import { AmigosBeneficios } from "@/components/sections/inicio/AmigosBeneficios";
import { Blog } from "@/components/sections/Blog";
import { PreguntasFrecuentesProyecto } from "@/components/sections/proyecto/PreguntasFrecuentesProyecto";
import { ContactoForm } from "@/components/forms/ContactoForm";
import type { HomeSection, Project, Delivered } from "@/lib/types";
import { isAcfTrue, selectByPostObject, toArray } from "@/lib/utils";

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
  const bannerSections = sections.filter(
    (section) => section.acf_fc_layout === "banner",
  );
  const firstBannerIndex = sections.findIndex(
    (section) => section.acf_fc_layout === "banner",
  );

  return (
    <>
      {sections.map((section, index) => {
        switch (section.acf_fc_layout) {
          case "banner":
            if (index !== firstBannerIndex) return null;
            return (

              <Banner
                key={`${section.acf_fc_layout}-${index}`}
                titleSlides={bannerSections.some((banner) => toArray(banner.banner_titulos).length > 0)
                  ? bannerSections.flatMap((banner) => toArray(banner.banner_titulos))
                  : bannerSections}
                imageSlides={bannerSections.some((banner) => toArray(banner.banner_imagenes).length > 0)
                  ? bannerSections.flatMap((banner) => toArray(banner.banner_imagenes))
                  : bannerSections}
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
              />

            );
          case "espacios":
            return (
              <Espacios
                key={`${section.acf_fc_layout}-${index}`}
                titulo={section.titulo}
                subtitulo={section.subtitulo}
                indicadores={toArray(section.indicadores)}
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
              />
            );
          case "proyectos_venta":
            return (
              <ProyectosVenta
                key={`${section.acf_fc_layout}-${index}`}
                titulo={section.titulo}
                proyectos={selectByPostObject(proyectos, section.post)}
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
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
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
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
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
              />
            );
          case "amigos_beneficios":
            return (
              <AmigosBeneficios
                key={`${section.acf_fc_layout}-${index}`}
                color_fondo={section.color_fondo}
                titulo={section.titulo}
                descripcion={section.descripcion}
                boton={section.boton}
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
              />
            );
          case "blog":
            return (
              <Blog
                key={`${section.acf_fc_layout}-${index}`}
                titulo={section.titulo}
                boton={section.boton}
                ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
              />
            );
          case "quiero_mas_informacion":
            // ACF solo manda `titulo`; el form usa defaults (CF7 4298, distritos/medios) + proyectos del home.
            return (
              <section
                key={`${section.acf_fc_layout}-${index}`}
                data-layout="quiero_mas_informacion"
                className={`w-full bg-white px-24 py-52 md:px-24 md:py-90 ${isAcfTrue(section.ocultar_seccion) ? "hidden md:block" : ""}`}
              >
                <ContactoForm
                  titulo={section.titulo}
                  proyectos={proyectos}
                  lead={{ formSource: "Home - Quiero más información" }}
                />
              </section>
            );
            case "preguntas_frecuentes": {
              // Repetidor ACF `preguntas`: cada fila es { titulo, respuesta }, no un grupo.
              const preguntas = toArray(section.preguntas).filter(
                (pregunta) => Boolean(pregunta.titulo?.trim() || pregunta.respuesta?.trim()),
              );
              if (preguntas.length === 0) return null;
              return (
                <PreguntasFrecuentesProyecto
                  key={`${section.acf_fc_layout}-${index}`}
                  titulo={section.titulo}
                  preguntas={preguntas}
                  color_boton={section.color_boton}
                  color_titulo={section.color_titulo}
                  ocultar_en_movil={isAcfTrue(section.ocultar_seccion)}
                  color_borde={section.color_borde}
                  margin={'md:mb-90 md-52'}
                />
              );
            }
          default:
            return null;
        }
      })}
    </>
  );
}
