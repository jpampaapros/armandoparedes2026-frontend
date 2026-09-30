"use client";

import { useMemo, useState } from "react";
import { FilterMultiSelect, type FilterMultiSelectStyles } from "@/components/FilterMultiSelect";
import { getProjectFilterTags, formatAreaFilter, AREA_FILTER_LABELS } from "@/components/ProjectCard";
import type { Project } from "@/lib/types";

function uniqueSorted(values: (string | undefined)[]) {
  return Array.from(new Set(values.filter((v): v is string => !!v))).sort();
}

/**
 * Estado de los filtros Distrito / Tipo / m² de proyectos. Cada filtro es multiselección:
 * dentro de un filtro basta con coincidir con una opción; entre filtros deben cumplirse todos.
 */
export function useProjectFilters(proyectos: Project[]) {
  const [distritos, setDistritos] = useState<string[]>([]);
  const [tipos, setTipos] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);

  const tags = useMemo(() => proyectos.map((p) => getProjectFilterTags(p)), [proyectos]);
  const distritoOptions = useMemo(() => uniqueSorted(tags.map((t) => t.distrito)), [tags]);
  const tipoOptions = useMemo(() => uniqueSorted(tags.map((t) => t.tipo)), [tags]);

  const filtered = useMemo(
    () =>
      proyectos.filter((_, i) => {
        const t = tags[i];
        if (distritos.length && !distritos.includes(t.distrito ?? "")) return false;
        if (tipos.length && !tipos.includes(t.tipo ?? "")) return false;
        if (areas.length && !areas.includes(formatAreaFilter(t.area))) return false;
        return true;
      }),
    [proyectos, tags, distritos, tipos, areas]
  );

  return {
    filtered,
    filters: { distritos, setDistritos, tipos, setTipos, areas, setAreas, distritoOptions, tipoOptions },
  };
}

export type ProjectFiltersState = ReturnType<typeof useProjectFilters>["filters"];

/** Estilo de /proyectos-en-venta; lo comparten las secciones que no pasan `styles`. */
const DEFAULT_STYLES: FilterMultiSelectStyles = {
  className: "w-full md:w-205",
  buttonClassName: "py-20 px-8 text-16 font-extralight text-text-muted border-text",
  optionClassName: "gap-12 text-14 text-text-muted",
  checkboxClassName: "h-24 w-24 border-text-muted",
};

type ProjectFiltersProps = {
  filters: ProjectFiltersState;
  /** Contenedor de los tres filtros. */
  className?: string;
  /** Estilos de cada filtro (botón, panel, opciones, check). Por defecto, los de /proyectos-en-venta. */
  styles?: FilterMultiSelectStyles;
};

export function ProjectFilters({ filters, className, styles = DEFAULT_STYLES }: ProjectFiltersProps) {
  return (
    <div className={className}>
      <FilterMultiSelect
        {...styles}
        placeholder="Distrito"
        values={filters.distritos}
        onChange={filters.setDistritos}
        options={filters.distritoOptions}
      />
      <FilterMultiSelect
        {...styles}
        placeholder="Tipo"
        values={filters.tipos}
        onChange={filters.setTipos}
        options={filters.tipoOptions}
      />
      <FilterMultiSelect
        {...styles}
        placeholder="m²"
        values={filters.areas}
        onChange={filters.setAreas}
        options={AREA_FILTER_LABELS}
      />
    </div>
  );
}
