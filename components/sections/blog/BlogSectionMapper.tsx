import { BlogTextSection } from "./BlogTextSection";
import { BlogImageSection } from "./BlogImageSection";
import { BlogGallerySection } from "./BlogGallerySection";
import { BlogDondeSection } from "./BlogDondeSection";
import { BlogCitaSection } from "./BlogCitaSection";
import type { BlogPostSection } from "@/lib/types";

type BlogSectionMapperProps = {
  sections: BlogPostSection[];
};

export function BlogSectionMapper({ sections }: BlogSectionMapperProps) {
  return (
    <div className="flex flex-col gap-32 md:gap-48">
      {sections.map((section, index) => {
        const key = `${section.acf_fc_layout}-${index}`;
        switch (section.acf_fc_layout) {
          case "texto":
            return <BlogTextSection key={key} contenido={section.contenido} />;
          case "imagen":
            return <BlogImageSection key={key} imagen={section.imagen} />;
          case "galeria":
            return <BlogGallerySection key={key} imagenes={section.imagenes} />;
          case "donde":
            return (
              <BlogDondeSection
                key={key}
                titulo={section.titulo}
                direccion={section.direccion}
              />
            );
          case "cita":
            return <BlogCitaSection key={key} contenido={section.contenido} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
