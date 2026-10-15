"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Consent, FIELD_BORDER_STYLE, SelectField, controlClass, fieldClass, labelClass } from "@/components/forms/ContactoForm";
import { useCf7Submit } from "@/hooks/useCf7Submit";
import { useIsClient } from "@/hooks/useIsClient";
import type { LeadFormValues } from "@/lib/lead";

const ID = "postventa";

type PostventaFormProps = {
  titulo?: string;
  subtitulo?: string;
  /** Formulario de Contact Form 7 que recibe las consultas de postventa. */
  formularioId?: string | number;
  proyectos: string[];
  /** Proyecto elegido en el selector superior; precarga "Proyecto adquirido". */
  proyecto: string;
  onProyectoChange: (proyecto: string) => void;
};

export function PostventaForm({
  titulo = "Déjanos tu consulta",
  subtitulo = "Uno de nuestros asesores se comunicará contigo",
  formularioId = "4299",
  proyectos,
  proyecto,
  onProyectoChange,
}: PostventaFormProps) {
  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<LeadFormValues>({
    defaultValues: {
      proyecto, departamento: "", nombres: "", apellido: "", correo: "", celular: "", consulta: "", terminos: false,
    },
  });
  // Las consultas de postventa no son leads comerciales: van a CF7 y no a Sperant.
  const { submit, isPending, status } = useCf7Submit(formularioId, { raw: true });
  const isClient = useIsClient();

  useEffect(() => {
    setValue("proyecto", proyecto);
  }, [proyecto, setValue]);

  const onSubmit = async (values: LeadFormValues) => {
    const ok = await submit(values);
    if (ok) reset({ proyecto, departamento: "", nombres: "", apellido: "", correo: "", celular: "", consulta: "", terminos: false });
  };

  return (
    <div className="mt-48 md:mt-64">
      <h3 className="m-0 text-center font-gotham text-28 font-bold leading-tight text-slate md:text-40">{titulo}</h3>
      {subtitulo && <p className="m-0 mt-8 text-center font-poppins text-14 text-near-black md:text-16">{subtitulo}</p>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-24 flex flex-col gap-16 md:mt-40 md:gap-24">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          <SelectField idPrefix={ID} label="Proyecto adquirido*" name="proyecto" values={proyectos} register={register} classes={{ fieldClass, labelClass, controlClass }} onChange={onProyectoChange} />
          {[
            ["departamento", "Departamento*", "text"],
            ["nombres", "Nombres*", "text"], ["apellido", "Apellido*", "text"],
            ["correo", "Correo electrónico*", "email"],
          ].map(([name, label, type]) => (
            <div key={name} className="flex flex-col gap-6">
              <label htmlFor={`${ID}-${name}`} className={labelClass}>{label}</label>
              <div className={fieldClass} style={FIELD_BORDER_STYLE}>
                <input id={`${ID}-${name}`} type={type} aria-invalid={errors[name] ? "true" : "false"} className={controlClass} {...register(name, { required: true })} />
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-6">
            <label htmlFor={`${ID}-celular`} className={labelClass}>Celular*</label>
            <div className="flex h-50">
              <div className="flex shrink-0 items-center gap-5 border border-r-0 border-light-gray px-9" style={{ ...FIELD_BORDER_STYLE, borderRightWidth: 0 }} aria-label="Prefijo Perú +51">
                <Image unoptimized src="/images/formulario-modal/bandera-peru.svg" alt="Perú" width={20} height={15} />
                <span className="font-poppins text-16 md:text-18">+51</span>
              </div>
              <div className={`${fieldClass} min-w-0 flex-1`} style={FIELD_BORDER_STYLE}>
                <input id={`${ID}-celular`} type="tel" inputMode="numeric" aria-invalid={errors.celular ? "true" : "false"} className={controlClass} {...register("celular", { required: true })} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 md:col-span-2">
            <label htmlFor={`${ID}-consulta`} className={labelClass}>Consulta*</label>
            <div className="border border-light-gray px-10 py-8" style={FIELD_BORDER_STYLE}>
              <textarea id={`${ID}-consulta`} rows={3} aria-invalid={errors.consulta ? "true" : "false"} className={`${controlClass} block h-62 resize-none`} {...register("consulta", { required: true })} />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Consent idPrefix={ID} name="terminos" required control={control}>He leído y acepto las <Link href="/politica-de-privacidad" className="form-legal-link">Políticas de Privacidad</Link>.</Consent>
        </div>

        <button type="submit" disabled={isPending || !isClient} className="mx-auto mt-30 flex h-50 w-full items-center justify-center bg-slate font-gotham text-16 font-bold uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-50 md:w-511 md:text-18">
          {isPending ? "Enviando..." : "Enviar"}
        </button>
        {status && <p role="status" className={`m-0 text-center text-14 ${status.ok ? "text-green-700" : "text-red-700"}`}>{status.message}</p>}
      </form>
    </div>
  );
}
