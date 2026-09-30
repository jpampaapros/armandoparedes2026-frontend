"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "@/components/icons/ChevronDown";

export type FilterMultiSelectStyles = {
  /** Ancho del filtro (por defecto `w-full`). */
  className?: string;
  /** Alto, padding, tipografía y colores de texto/borde del botón; la base no los fija para no pisarlos. */
  buttonClassName?: string;
  /** Padding y separación del panel desplegable. */
  panelClassName?: string;
  /** Tipografía y color de cada opción. */
  optionClassName?: string;
  /** Tamaño y color de borde del cuadro de check. */
  checkboxClassName?: string;
  /** Reemplaza al chevron por defecto; rota igual al abrir. */
  icon?: ReactNode;
};

export function FilterMultiSelect({
  values,
  onChange,
  options,
  placeholder,
  className = "w-full",
  buttonClassName = "",
  panelClassName = "gap-12 p-16",
  optionClassName = "gap-12 text-14 text-warm-gray",
  checkboxClassName = "h-24 w-24 border-warm-gray",
  icon,
}: FilterMultiSelectStyles & {
  values: string[];
  onChange: (values: string[]) => void;
  options: string[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = (opt: string) =>
    onChange(values.includes(opt) ? values.filter((v) => v !== opt) : [...values, opt]);

  const label =
    values.length === 0 ? placeholder : values.length === 1 ? values[0] : `${placeholder} (${values.length})`;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        data-active={values.length > 0 || undefined}
        className={`flex w-full cursor-pointer items-center justify-between border-0 border-b border-solid bg-transparent p-0 text-left font-poppins outline-none ${buttonClassName}`}
      >
        <span className="truncate pr-8">{label}</span>
        <span className={`flex shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>
          {icon ?? <ChevronDown className="h-24 w-24" />}
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-multiselectable="true"
          className={`absolute left-0 top-full z-20 m-0 flex w-max min-w-full list-none flex-col bg-white shadow-md ${panelClassName}`}
        >
          {options.map((opt) => {
            const checked = values.includes(opt);
            return (
              <li key={opt} role="option" aria-selected={checked}>
                <label className={`flex cursor-pointer items-center whitespace-nowrap font-poppins uppercase ${optionClassName}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(opt)}
                    className="peer sr-only"
                  />
                  <span className={`flex shrink-0 items-center justify-center border border-solid text-white peer-checked:border-slate peer-checked:bg-slate peer-focus-visible:outline peer-focus-visible:outline-slate ${checkboxClassName}`}>
                    {checked && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-2/3 w-2/3" aria-hidden="true">
                        <path d="M5 12l5 5 9-10" />
                      </svg>
                    )}
                  </span>
                  {opt}
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
