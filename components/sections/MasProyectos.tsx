"use client";

import { useEffect, useState } from "react";
import { ProyectosVenta } from "@/components/sections/ProyectosVenta";
import { getPublicCmsUrl } from "@/lib/urls";
import type { Project } from "@/lib/types";

type MasProyectosProps = {
  titulo?: string;
  color_titulo?: string;
  proyectos?: Project[];
  ocultar_en_movil?: boolean;
};

export function MasProyectos({ titulo, color_titulo, proyectos: proyectosProp, ocultar_en_movil = false }: MasProyectosProps) {
  const [proyectosFetch, setProyectosFetch] = useState<Project[]>(proyectosProp ?? []);
  const proyectos = proyectosProp ?? proyectosFetch;

  useEffect(() => {
    if (proyectosProp) return;
    let canceled = false;
    fetch(`${getPublicCmsUrl()}/wp-json/wp/v2/proyectos?per_page=100&acf_format=standard&_embed=1`)
      .then((r) => r.json())
      .then((data) => {
        if (!canceled) setProyectosFetch(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!canceled) setProyectosFetch([]);
      });
    return () => {
      canceled = true;
    };
  }, [proyectosProp]);

  return (
    <section className={`${ocultar_en_movil ? "hidden md:block" : ""}`}>
    <ProyectosVenta
      titulo={titulo}
      color_titulo={color_titulo}
      proyectos={proyectos}
      dataLayout="mas_proyectos"
      mobileSlider
    />
    </section>
  );
}
