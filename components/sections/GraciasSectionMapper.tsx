import { BannerGracias } from "@/components/sections/gracias/BannerGracias";
import { ProyectosVenta } from "@/components/sections/ProyectosVenta";
import { Blog } from "@/components/sections/Blog";
import type { ACFLink, GraciasPageSection, Project } from "@/lib/types";
import { selectByPostObject } from "@/lib/utils";

type GraciasSectionMapperProps = {
  sections: GraciasPageSection[];
  /** Proyectos para la sección `proyectos_venta` (gracias de proyecto). */
  proyectos?: Project[];
  /** Slug del proyecto: "Volver" y contexto de la gracias de cotizador. */
  proyectoSlug?: string;
  /** Destino del botón Volver cuando no hay proyecto (p. ej. `/contacto`). */
  fallbackHref?: string;
  /**
   * CTA del banner_gracias. No viene de ACF: lo inyecta la página
   * (p. ej. postventa → FAQ en `/contacto?tab=postventa`).
   */
  bannerBoton?: ACFLink;
};

/** Mapea layouts ACF de páginas de gracias (proyecto, contacto, postventa). */
export function GraciasSectionMapper({
  sections,
  proyectos,
  proyectoSlug,
  fallbackHref,
  bannerBoton,
}: GraciasSectionMapperProps) {
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
                fallbackHref={fallbackHref}
                boton={bannerBoton}
              />
            );
          case "proyectos_venta":
            return (
              <ProyectosVenta
                key={key}
                titulo={section.titulo}
                proyectos={selectByPostObject(proyectos ?? [], section.post)}
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
