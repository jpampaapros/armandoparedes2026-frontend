import { Banner } from "@/components/sections/inicio/Banner";
import { Espacios } from "@/components/sections/inicio/Espacios";
import { ProyectosVenta } from "@/components/sections/ProyectosVenta";
import { QuienEsArmando } from "@/components/sections/inicio/QuienEsArmando";
import { ProyectosEntregados } from "@/components/sections/inicio/ProyectosEntregados";
import { AmigosBeneficios } from "@/components/sections/inicio/AmigosBeneficios";
import { Blog } from "@/components/sections/Blog";
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
              />
            );
          case "espacios":
            if (isAcfTrue(section.ocultar_seccion)) return null;
            return (
              <Espacios
                key={`${section.acf_fc_layout}-${index}`}
                titulo={section.titulo}
                subtitulo={section.subtitulo}
                indicadores={toArray(section.indicadores)}
              />
            );
          case "proyectos_venta":
            return (
              <ProyectosVenta
                key={`${section.acf_fc_layout}-${index}`}
                titulo={section.titulo}
                proyectos={selectByPostObject(proyectos, section.post)}
              />
            );
          case "quien_es_armando":
            if (isAcfTrue(section.ocultar_seccion)) return null;
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
            if (isAcfTrue(section.ocultar_seccion)) return null;
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
            if (isAcfTrue(section.ocultar_seccion)) return null;
            return (
              <AmigosBeneficios
                key={`${section.acf_fc_layout}-${index}`}
                color_fondo={section.color_fondo}
                titulo={section.titulo}
                descripcion={section.descripcion}
                boton={section.boton}
              />
            );
          case "blog":
            if (isAcfTrue(section.ocultar_seccion)) return null;
            return (
              <Blog
                key={`${section.acf_fc_layout}-${index}`}
                titulo={section.titulo}
                boton={section.boton}
              />
            );
          case "quiero_mas_informacion":
            // ACF solo manda `titulo`; el form usa defaults (CF7 4298, distritos/medios) + proyectos del home.
            return (
              <section
                key={`${section.acf_fc_layout}-${index}`}
                data-layout="quiero_mas_informacion"
                className="w-full bg-white px-16 py-52 md:px-24 md:py-90"
              >
                <ContactoForm
                  titulo={section.titulo}
                  proyectos={proyectos}
                  lead={{ formSource: "Home - Quiero más información" }}
                />
              </section>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
