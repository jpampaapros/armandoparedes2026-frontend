"use client";

import Image from "next/image";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { useCf7Submit, type Cf7FormValues } from "@/hooks/useCf7Submit";
import { useIsClient } from "@/hooks/useIsClient";
import type { ContactoPageFields, Project } from "@/lib/types";

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

type Props = ContactoPageFields & { proyectos?: Project[] };

export function ContactoForm({
  titulo = "Quiero más información",
  formulario_id = "4",
  tabs,
  distritos,
  medios,
  proyectos = [],
}: Props) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<Cf7FormValues>({
    defaultValues: {
      nombres: "", apellido: "", correo: "", celular: "", distrito: "",
      proyecto: "", medio: "", terminos: false, marketing: false,
    },
  });
  const { submit, isPending, status } = useCf7Submit(formulario_id, { raw: true });
  const isClient = useIsClient();
  const nav = tabs?.length ? tabs : [
    { label: "Solicitar información" },
    { label: "Salas de ventas", url: "/salas-de-ventas" },
    { label: "Postventa", url: "/postventa" },
  ];

  const onSubmit = async (values: Cf7FormValues) => {
    const ok = await submit({
      ...values,
      terminos: values.terminos ? "1" : "",
      marketing: values.marketing ? "1" : "",
    });
    if (ok) reset();
  };

  const fieldClass = "flex h-50 flex-col justify-center border border-near-black px-10";
  const labelClass = "font-poppins text-10 font-semibold leading-none text-near-black md:text-12";
  const controlClass = "min-h-0 w-full border-0 bg-transparent p-0 font-poppins text-16 leading-[1.2] text-near-black outline-none md:text-18";

  return (
    <section className="w-full bg-white px-16 pb-80 pt-36 md:px-24 md:pb-100 md:pt-76">
      <div className="mx-auto max-w-895">
        <nav aria-label="Opciones de contacto" className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {nav.map((tab, index) => {
            const classes = `flex h-50 items-center justify-center border border-peach px-12 text-center font-gotham text-15 font-bold md:text-18 ${index === 0 ? "bg-peach text-white" : "bg-white text-peach"}`;
            return tab.url && index !== 0 ? <Link key={`${tab.label}-${index}`} href={tab.url} className={classes}>{tab.label}</Link> : <span key={`${tab.label}-${index}`} className={classes}>{tab.label}</span>;
          })}
        </nav>

        <h1 className="mb-0 mt-64 text-center font-gotham text-36 font-bold leading-tight text-slate md:mt-92 md:text-60">{titulo}</h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-40 flex flex-col gap-16 md:mt-70 md:gap-24">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            {[
              ["nombres", "Nombres*", "text"], ["apellido", "Apellido*", "text"],
              ["correo", "Correo electrónico*", "email"],
            ].map(([name, label, type]) => (
              <label key={name} className={fieldClass}>
                <span className={labelClass}>{label}</span>
                <input type={type} aria-invalid={errors[name] ? "true" : "false"} className={controlClass} {...register(name, { required: true })} />
              </label>
            ))}
            <div className="flex h-50">
              <div className="flex shrink-0 items-center gap-5 border border-r-0 border-near-black px-9" aria-label="Prefijo Perú +51">
                <Image unoptimized src="/images/formulario-modal/bandera-peru.svg" alt="Perú" width={20} height={15} />
                <span className="font-poppins text-16 md:text-18">+51</span>
              </div>
              <label className={`${fieldClass} min-w-0 flex-1`}>
                <span className={labelClass}>Celular*</span>
                <input type="tel" inputMode="numeric" aria-invalid={errors.celular ? "true" : "false"} className={controlClass} {...register("celular", { required: true })} />
              </label>
            </div>
            <SelectField label="Estoy buscando depa en" name="distrito" values={options(distritos, DEFAULT_DISTRICTS)} register={register} classes={{ fieldClass, labelClass, controlClass }} />
            <SelectField label="Me interesa este proyecto:" name="proyecto" values={proyectos.map((p) => `${p.title.rendered}${districtFor(p) ? ` - ${districtFor(p)}` : ""}`)} register={register} classes={{ fieldClass, labelClass, controlClass }} />
            <div className="md:col-span-2">
              <SelectField label="Me enteré del proyecto en:" name="medio" values={options(medios, DEFAULT_SOURCES)} register={register} classes={{ fieldClass, labelClass, controlClass }} />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-14">
            <Consent name="terminos" required control={control}>He leído y acepto las <Link href="/politicas-de-privacidad" className="form-legal-link">Políticas de Privacidad</Link>.</Consent>
            <Consent name="marketing" control={control}>Autorizo a Armando Paredes para que realice las actividades de prospección comercial y marketing descritas en las <Link href="/politicas-de-privacidad" className="form-legal-link">Políticas de Privacidad</Link>.</Consent>
          </div>

          <button type="submit" disabled={isPending || !isClient} className="mx-auto mt-30 flex h-50 w-full items-center justify-center bg-slate font-gotham text-16 font-bold uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-50 md:w-511 md:text-18">
            {isPending ? "Enviando..." : "Enviar"}
          </button>
          {status && <p role="status" className={`m-0 text-center text-14 ${status.ok ? "text-green-700" : "text-red-700"}`}>{status.message}</p>}
        </form>
      </div>
    </section>
  );
}

type SelectProps = {
  label: string; name: string; values: string[];
  register: ReturnType<typeof useForm<Cf7FormValues>>["register"];
  classes: { fieldClass: string; labelClass: string; controlClass: string };
};

function SelectField({ label, name, values, register, classes }: SelectProps) {
  return (
    <label className={`${classes.fieldClass} relative`}>
      <span className={classes.labelClass}>{label}</span>
      <select defaultValue="" className={`${classes.controlClass} appearance-none pr-28`} {...register(name, { required: true })}>
        <option value="" disabled hidden />
        {values.map((value) => <option key={value} value={value}>{value}</option>)}
      </select>
      <Image unoptimized src="/images/formulario-modal/chevron-down.svg" alt="" width={18} height={18} className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2" />
    </label>
  );
}

type ConsentProps = {
  name: "terminos" | "marketing"; required?: boolean;
  control: ReturnType<typeof useForm<Cf7FormValues>>["control"];
  children: React.ReactNode;
};

function Consent({ name, required, control, children }: ConsentProps) {
  return <Controller name={name} control={control} rules={required ? { required: true } : undefined} render={({ field }) => (
    <label className="flex cursor-pointer items-start gap-8 font-inter text-13 leading-20 text-near-black md:text-14">
      <span className="relative mt-1 flex h-18 w-18 shrink-0 items-center justify-center">
        <input ref={field.ref} name={field.name} type="checkbox" checked={Boolean(field.value)} onChange={(event) => field.onChange(event.target.checked)} className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" />
        {field.value ? <span className="flex h-18 w-18 items-center justify-center rounded-full bg-slate text-10 text-white">✓</span> : <Image unoptimized src="/images/formulario-modal/termino-unchecked.svg" alt="" width={18} height={18} />}
      </span>
      <span>{children}</span>
    </label>
  )} />;
}
