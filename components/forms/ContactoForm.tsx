"use client";

import Image from "next/image";
import Link from "next/link";
import { Controller, useForm, type Control, type FieldError as RHFFieldError, type FieldPath, type FieldValues, type RegisterOptions } from "react-hook-form";
import { FieldError } from "@/components/forms/FieldError";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import { TERMS_MESSAGE, emailRules, nameRules, phoneRules, requiredRules } from "@/lib/form-validation";
import type { LeadContext, LeadFormValues } from "@/lib/lead";
import { useIsClient } from "@/hooks/useIsClient";
import type { ContactoPageFields, Project } from "@/lib/types";

const BORDER_COLOR = "#E3E4E2";
const ERROR_BORDER_COLOR = "#B91C1C";
export const fieldBorder = (invalid: unknown) => ({ border: `1px solid ${invalid ? ERROR_BORDER_COLOR : BORDER_COLOR}` });
/** Solo el color: para cajas cuyo grosor y lados ya vienen de las clases (p. ej. `border border-r-0`). */
export const fieldBorderColor = (invalid: unknown) => ({ borderColor: invalid ? ERROR_BORDER_COLOR : BORDER_COLOR });
export const fieldClass = "flex h-50 flex-col justify-center border border-light-gray px-10";
export const labelClass = "font-poppins text-10 font-semibold leading-none text-near-black md:text-12";
export const controlClass = "min-h-0 w-full border-0 bg-transparent p-0 font-poppins text-16 leading-[1.2] text-near-black outline-none md:text-18";

const DEFAULT_DISTRICTS = ["Miraflores", "San Isidro", "Barranco", "Surco", "San Borja", "Lima"];
const DEFAULT_SOURCES = ["Instagram", "Facebook", "Google", "TikTok", "YouTube", "Referido", "Otro"];

function options(value: string | string[] | undefined, fallback: string[]) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    const parsed = value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
    if (parsed.length) return parsed;
  }
  return fallback;
}

function districtFor(project: Project) {
  return project._embedded?.["wp:term"]?.flat().find((term) =>
    ["distrito", "distritos", "ubicacion"].includes(term.taxonomy),
  )?.name;
}

type Props = ContactoPageFields & { proyectos?: Project[]; lead?: LeadContext };

export function ContactoForm({
  titulo = "Quiero más información",
  formulario_id = "4298",
  distritos,
  medios,
  proyectos = [],
  lead,
}: Props) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<LeadFormValues>({
    defaultValues: {
      nombres: "", apellido: "", correo: "", celular: "", distrito: "",
      proyecto: "", medio: "", terminos: false, marketing: false,
    },
  });
  const { submit, isPending, status } = useLeadSubmit({
    ...lead,
    formSource: lead?.formSource || "Página de contacto",
    cf7FormId: formulario_id,
  });
  const isClient = useIsClient();
  const onSubmit = async (values: LeadFormValues) => {
    const ok = await submit(values);
    if (ok) reset();
  };

  return (
    <div className="mx-auto max-w-895">
      <h2 className="mb-0 mt-24 text-center font-gotham text-36 font-bold leading-tight text-slate md:mt-40 md:text-50">{titulo}</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-24 flex flex-col gap-16 md:mt-40 md:gap-24">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {([
            ["nombres", "Nombres*", "text", nameRules], ["apellido", "Apellido*", "text", nameRules],
            ["correo", "Correo electrónico*", "email", emailRules],
          ] as const).map(([name, label, type, rules]) => (
            <div key={name} className="flex flex-col gap-6">
              <label htmlFor={`contacto-${name}`} className={labelClass}>{label}</label>
              <div className={fieldClass} style={fieldBorder(errors[name])}>
              <input id={`contacto-${name}`} type={type} aria-invalid={errors[name] ? "true" : "false"} aria-describedby={`contacto-${name}-error`} className={controlClass} {...register(name, rules)} />
              </div>
              <FieldError id={`contacto-${name}-error`} error={errors[name]} />
            </div>
          ))}
          <div className="flex flex-col gap-6">
            <label htmlFor="contacto-celular" className={labelClass}>Celular*</label>
            <div className="flex h-50">
            <div className="flex shrink-0 items-center gap-5 border border-r-0 border-light-gray px-9" style={fieldBorderColor(errors.celular)} aria-label="Prefijo Perú +51">
              <Image unoptimized src="/images/formulario-modal/bandera-peru.svg" alt="Perú" width={20} height={15} />
              <span className="sr-only">+51</span>
            </div>
            <div className={`${fieldClass} min-w-0 flex-1`} style={fieldBorder(errors.celular)}>
              <input id="contacto-celular" type="tel" inputMode="numeric" maxLength={11} aria-invalid={errors.celular ? "true" : "false"} aria-describedby="contacto-celular-error" className={controlClass} {...register("celular", phoneRules)} />
            </div>
            </div>
            <FieldError id="contacto-celular-error" error={errors.celular} />
          </div>
          <SelectField label="Estoy buscando depa en" name="distrito" values={options(distritos, DEFAULT_DISTRICTS)} register={register} error={errors.distrito} classes={{ fieldClass, labelClass, controlClass }} />
          <SelectField label="Me interesa este proyecto" name="proyecto" values={proyectos.map((p) => `${p.title.rendered}${districtFor(p) ? ` - ${districtFor(p)}` : ""}`)} register={register} error={errors.proyecto} classes={{ fieldClass, labelClass, controlClass }} />
          <div className="md:col-span-2">
            <SelectField label="Me enteré del proyecto en" name="medio" values={options(medios, DEFAULT_SOURCES)} register={register} error={errors.medio} classes={{ fieldClass, labelClass, controlClass }} />
          </div>
        </div>

        <p className="m-0 font-poppins text-12 text-near-black">* Campos obligatorios</p>

        <div className="flex flex-col gap-14">
          <Consent name="terminos" required control={control}>He leído y acepto las <Link href="/politica-de-privacidad" className="form-legal-link">Políticas de Privacidad</Link>.</Consent>
          <Consent name="marketing" control={control}>Autorizo a Armando Paredes para que realice las actividades de prospección comercial y marketing descritas en las <Link href="/politica-de-privacidad" className="form-legal-link">Políticas de Privacidad</Link>.</Consent>
        </div>

        <button type="submit" disabled={isPending || !isClient} className="mx-auto mt-30 flex h-50 cursor-pointer w-full items-center justify-center bg-slate font-gotham text-16 font-bold uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-50 md:text-18">
          {isPending ? "Enviando..." : "Enviar"}
        </button>
        {status && <p role="status" className={`m-0 text-center text-14 ${status.ok ? "text-green-700" : "text-red-700"}`}>{status.message}</p>}
      </form>
    </div>
  );
}

type SelectProps = {
  label: string; name: string; values: string[];
  register: ReturnType<typeof useForm<LeadFormValues>>["register"];
  error?: RHFFieldError;
  /** Por defecto es obligatorio; si no hay opciones no se exige para no bloquear el envío. */
  required?: boolean;
  classes: { fieldClass: string; labelClass: string; controlClass: string };
  /** Prefijo de los ids: la página de contacto monta varios formularios a la vez. */
  idPrefix?: string;
  onChange?: (value: string) => void;
};

export function SelectField({ label, name, values, register, error, required = true, classes, idPrefix = "contacto", onChange }: SelectProps) {
  const isRequired = required && values.length > 0;
  const rules: RegisterOptions<LeadFormValues, string> = {
    ...(isRequired ? requiredRules : {}),
    onChange: onChange && ((event) => onChange(event.target.value)),
  };
  return (
    <div className="flex flex-col gap-6">
      <label htmlFor={`${idPrefix}-${name}`} className={classes.labelClass}>{label}{isRequired && "*"}</label>
      <div className={`${classes.fieldClass} relative`} style={fieldBorder(error)}>
      <select id={`${idPrefix}-${name}`} defaultValue="" aria-invalid={error ? "true" : "false"} aria-describedby={`${idPrefix}-${name}-error`} className={`${classes.controlClass} appearance-none pr-28`} {...register(name, rules)}>
        <option value="" disabled hidden />
        {values.map((value) => <option key={value} value={value}>{value}</option>)}
      </select>
      <Image unoptimized src="/images/formulario-modal/chevron-down.svg" alt="" width={18} height={18} className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2" />
      </div>
      <FieldError id={`${idPrefix}-${name}-error`} error={error} />
    </div>
  );
}

type ConsentProps<T extends FieldValues> = {
  /** El formulario debe declarar el valor inicial (`false`) en `defaultValues`. */
  name: FieldPath<T>; required?: boolean;
  control: Control<T>;
  children: React.ReactNode;
  idPrefix?: string;
  /** Mensaje cuando falta marcarlo; por defecto el de las Políticas de Privacidad. */
  requiredMessage?: string;
};

export function Consent<T extends FieldValues>({ name, required, control, children, idPrefix = "contacto", requiredMessage = TERMS_MESSAGE }: ConsentProps<T>) {
  return <Controller name={name} control={control} rules={required ? { required: requiredMessage } : undefined} render={({ field, fieldState }) => (
    <div className="flex flex-col gap-6">
    <div className="flex items-start gap-8 font-inter text-13 leading-20 text-near-black md:text-14">
      <div className="relative mt-1 h-18 w-30 shrink-0">
        <input id={`${idPrefix}-${name}`} aria-labelledby={`${idPrefix}-${name}-texto`} ref={field.ref} name={field.name} type="checkbox" aria-invalid={fieldState.error ? "true" : "false"} aria-describedby={`${idPrefix}-${name}-error`} checked={Boolean(field.value)} onBlur={field.onBlur} onChange={(event) => field.onChange(event.target.checked)} className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" />
        <label htmlFor={`${idPrefix}-${name}`} className={`flex h-full w-full cursor-pointer items-center overflow-hidden rounded-full px-3 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-slate ${field.value ? "justify-end bg-slate" : "justify-start bg-light-gray"}`}>
          <span aria-hidden="true" className="h-12 w-12 shrink-0 rounded-full bg-white" />
        </label>
      </div>
      <span id={`${idPrefix}-${name}-texto`}>{children}{required && "*"}</span>
    </div>
    <FieldError id={`${idPrefix}-${name}-error`} error={fieldState.error} />
    </div>
  )} />;
}
