/**
 * Reglas de react-hook-form compartidas por los formularios de leads y postventa.
 * Cada regla lleva su mensaje para que el formulario pueda mostrarlo debajo del campo.
 */

import type { RegisterOptions } from "react-hook-form";
import type { LeadFormValues } from "@/lib/lead";

type Rules = RegisterOptions<LeadFormValues, string>;

export const REQUIRED_MESSAGE = "Este campo es obligatorio.";
export const TERMS_MESSAGE = "Debes aceptar las Políticas de Privacidad para continuar.";

const required = { value: true, message: REQUIRED_MESSAGE };

export const requiredRules: Rules = { required };

export const nameRules: Rules = {
  required,
  pattern: { value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'.-]+$/, message: "Ingresa solo letras." },
};

export const emailRules: Rules = {
  required,
  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: "Ingresa un correo electrónico válido." },
};

/** Celular peruano: 9 dígitos que empiezan con 9. Se guardan sin espacios ni guiones. */
export const phoneRules: Rules = {
  required,
  setValueAs: (value: unknown) => (typeof value === "string" ? value.replace(/[\s-]/g, "") : value),
  pattern: { value: /^9\d{8}$/, message: "Ingresa un celular de 9 dígitos que empiece con 9." },
};
