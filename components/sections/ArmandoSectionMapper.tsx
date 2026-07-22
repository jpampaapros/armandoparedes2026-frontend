import { Banner } from "@/components/sections/armando/Banner";
import { SomosUno } from "@/components/sections/armando/SomosUno";
import { MiVida } from "@/components/sections/armando/MiVida";
import { CadaProyecto } from "@/components/sections/armando/CadaProyecto";
import { EncuentraTuArmando } from "@/components/sections/armando/EncuentraTuArmando";
import type { ArmandoSection } from "@/lib/types";

type ArmandoSectionMapperProps = {
  sections: ArmandoSection[];
};

export function ArmandoSectionMapper({ sections }: ArmandoSectionMapperProps) {
  return (
    <>
      {sections.map((section, index) => {
        const key = `${section.acf_fc_layout}-${index}`;
        switch (section.acf_fc_layout) {
          case "banner":
            return (
              <Banner
                key={key}
                titulo={section.titulo}
                descripcion={section.descripcion}
                imagen_fondo={section.imagen_fondo}
                imagen_decorativa={section.imagen_decorativa}
              />
            );
          case "somos_uno":
            return <SomosUno key={key} {...section} />;
          case "mi_vida":
            return (
              <MiVida
                key={key}
                titulo={section.titulo}
                indicadores={section.indicadores}
              />
            );
          case "cada_proyecto":
            return (
              <CadaProyecto
                key={key}
                imagen_fondo={section.imagen_fondo}
                titulo={section.titulo}
              />
            );
          case "encuentra_tu_armando":
            return (
              <EncuentraTuArmando
                key={key}
                titulo={section.titulo}
                texto={section.texto}
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
