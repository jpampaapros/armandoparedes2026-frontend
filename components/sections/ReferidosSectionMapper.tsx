import { BannerReferidos } from "@/components/sections/referidos/BannerReferidos";
import { SeParte } from "@/components/sections/referidos/SeParte";
import type { ReferidosPageSection } from "@/lib/types";

type ReferidosSectionMapperProps = {
  sections?: ReferidosPageSection[];
};

export function ReferidosSectionMapper({ sections = [] }: ReferidosSectionMapperProps) {
  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.acf_fc_layout}-${index}`;
        switch (section.acf_fc_layout) {
          case "banner_referidos":
            return (
              <BannerReferidos
                key={key}
                background_image={section.background_image}
                title={section.title}
                phrase={section.phrase}
                cards={section.cards}
                legal_text={section.legal_text}
              />
            );
          case "se_parte":
            return (
              <SeParte
                key={key}
                title={section.title}
                form_id={section.form_id}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
}
