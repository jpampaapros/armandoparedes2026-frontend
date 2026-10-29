"use client";

import Image from "next/image";
import type { Ref } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLeadSubmit } from "@/hooks/useLeadSubmit";
import type { LeadContext, LeadFormValues } from "@/lib/lead";
import { useIsClient } from "@/hooks/useIsClient";

const DISTRITOS = [
  "Lima",
  "Miraflores",
  "San Isidro",
  "Surco",
  "La Molina",
  "San Borja",
  "Ate",
  "Comas",
  "Independencia",
  "Los Olivos",
];

const PRESUPUESTOS = [
  "Hasta S/ 200,000",
  "S/ 200,000 - S/ 300,000",
  "S/ 300,000 - S/ 400,000",
  "S/ 400,000 - S/ 500,000",
  "Más de S/ 500,000",
];

const CAMPO_CLASS =
  "h-44 w-full min-w-0 border border-[#d9d9d9] bg-white px-12 font-poppins text-16 text-near-black outline-none focus:border-slate aria-[invalid=true]:border-red-700 md:h-50";
const LABEL_CLASS = "font-poppins text-12 font-medium leading-none text-near-black";
const ERROR_CLASS = "font-poppins text-12 text-red-700";

type FormularioContactoProps = {
  titulo?: string;
  formulario_id?: string | number;
  lead?: LeadContext;
  /** Opciones del select de presupuesto; si falta, se usa la lista por defecto. */
  presupuestos?: string[];
};

export function FormularioContacto({
  titulo,
  formulario_id,
  lead,
  presupuestos,
}: FormularioContactoProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LeadFormValues>({
    defaultValues: {
      nombres: "",
      apellido: "",
      correo: "",
      celular: "",
      distrito: "",
      presupuesto: "",
      terminos: false,
      marketing: false,
    },
  });
  const { submit, isPending, status } = useLeadSubmit({
    ...lead,
    formSource: lead?.formSource || "Formulario de contacto",
    // El correo de aviso sigue saliendo por el formulario 4 si ACF no define otro.
    cf7FormId: formulario_id || "4",
  });
  const isClient = useIsClient();
  const opcionesPresupuesto = presupuestos?.length ? presupuestos : PRESUPUESTOS;

  const onSubmit = async (values: LeadFormValues) => {
    const ok = await submit(values);
    if (ok) reset();
  };

  return (
    <section data-layout="formulario_contacto" className="w-full bg-white">
      <div className="mx-auto max-w-895 px-16 pt-52 pb-0 md:px-24 md:pt-90">
        {titulo && (
          <h2 className="m-0 font-gotham text-32 font-bold text-slate md:text-48 text-center">
            {titulo}
          </h2>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-24 flex flex-col gap-20 md:mt-52 md:gap-24"
        >
          <div className="grid grid-cols-1 gap-x-30 gap-y-20 md:grid-cols-2">
            <div className="flex flex-col gap-8">
              <label className="flex flex-col gap-8">
                <span className={LABEL_CLASS}>Nombres*</span>
                <input
                  type="text"
                  aria-invalid={errors.nombres ? "true" : "false"}
                  className={CAMPO_CLASS}
                  {...register("nombres", { required: true })}
                />
              </label>
              {errors.nombres && (
                <span className={ERROR_CLASS} role="alert">
                  Completa este campo
                </span>
              )}
            </div>

            <div className="flex flex-col gap-8">
              <label className="flex flex-col gap-8">
                <span className={LABEL_CLASS}>Apellido*</span>
                <input
                  type="text"
                  aria-invalid={errors.apellido ? "true" : "false"}
                  className={CAMPO_CLASS}
                  {...register("apellido", { required: true })}
                />
              </label>
              {errors.apellido && (
                <span className={ERROR_CLASS} role="alert">
                  Completa este campo
                </span>
              )}
            </div>

            <div className="flex flex-col gap-8">
              <label className="flex flex-col gap-8">
                <span className={LABEL_CLASS}>Correo electrónico*</span>
                <input
                  type="email"
                  aria-invalid={errors.correo ? "true" : "false"}
                  className={CAMPO_CLASS}
                  {...register("correo", { required: true })}
                />
              </label>
              {errors.correo && (
                <span className={ERROR_CLASS} role="alert">
                  Completa este campo
                </span>
              )}
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-8">
                <span className={LABEL_CLASS}>Celular*</span>
                <div className="flex h-44 md:h-50">
                  <div
                    className="flex shrink-0 items-center gap-6 border border-r-0 border-[#d9d9d9] bg-white px-10"
                    aria-label="Prefijo Perú +51"
                  >
                    <Image
                      unoptimized
                      src="/images/formulario-modal/bandera-peru.svg"
                      alt="Perú"
                      width={20}
                      height={15}
                      className="pointer-events-none h-15 w-20"
                    />
                    <Image
                      unoptimized
                      src="/images/formulario-modal/chevron-down.svg"
                      alt=""
                      width={14}
                      height={14}
                      className="pointer-events-none h-14 w-14"
                    />
                  </div>
                  <input
                    type="tel"
                    aria-label="Celular"
                    aria-invalid={errors.celular ? "true" : "false"}
                    className={`${CAMPO_CLASS} h-full`}
                    {...register("celular", { required: true })}
                  />
                </div>
              </div>
              {errors.celular && (
                <span className={ERROR_CLASS} role="alert">
                  Completa este campo
                </span>
              )}
            </div>

            <div className="flex flex-col gap-8">
              <label className="flex flex-col gap-8">
                <span className={LABEL_CLASS}>Distrito de residencia*</span>
                <span className="relative block">
                  <select
                    className={`${CAMPO_CLASS} appearance-none pr-36`}
                    aria-invalid={errors.distrito ? "true" : "false"}
                    {...register("distrito", { required: true })}
                  >
                    <option value="" disabled hidden aria-label="Sin selección" />
                    {DISTRITOS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <Image
                    unoptimized
                    src="/images/formulario-modal/chevron-down.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="pointer-events-none absolute right-12 top-1/2 h-18 w-18 -translate-y-1/2"
                  />
                </span>
              </label>
              {errors.distrito && (
                <span className={ERROR_CLASS} role="alert">
                  Completa este campo
                </span>
              )}
            </div>

            <div className="flex flex-col gap-8">
              <label className="flex flex-col gap-8">
                <span className={LABEL_CLASS}>Presupuesto*</span>
                <span className="relative block">
                  <select
                    className={`${CAMPO_CLASS} appearance-none pr-36`}
                    aria-invalid={errors.presupuesto ? "true" : "false"}
                    {...register("presupuesto", { required: true })}
                  >
                    <option value="" disabled hidden aria-label="Sin selección" />
                    {opcionesPresupuesto.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <Image
                    unoptimized
                    src="/images/formulario-modal/chevron-down.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="pointer-events-none absolute right-12 top-1/2 h-18 w-18 -translate-y-1/2"
                  />
                </span>
              </label>
              {errors.presupuesto && (
                <span className={ERROR_CLASS} role="alert">
                  Completa este campo
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-14">
            <Controller
              name="terminos"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, ref, name } }) => (
                <label className="flex cursor-pointer items-start gap-12">
                  <Switch
                    inputRef={ref}
                    name={name}
                    checked={Boolean(value)}
                    onChange={(checked) => onChange(checked)}
                  />
                  <span className="font-poppins text-14 leading-[1.4] text-near-black">
                    He leído y acepto las{" "}
                    <a href="/politica-de-privacidad" className="form-legal-link">
                      Políticas de Privacidad
                    </a>
                    .
                  </span>
                </label>
              )}
            />

            <Controller
              name="marketing"
              control={control}
              render={({ field: { value, onChange, ref, name } }) => (
                <label className="flex cursor-pointer items-start gap-12">
                  <Switch
                    inputRef={ref}
                    name={name}
                    checked={Boolean(value)}
                    onChange={(checked) => onChange(checked)}
                  />
                  <span className="font-poppins text-14 leading-[1.4] text-near-black">
                    Autorizo a Armando Paredes para que realice las actividades de
                    prospección comercial y marketing descritas en las{" "}
                    <a href="/politica-de-privacidad" className="form-legal-link">
                      Políticas de Privacidad
                    </a>
                    .
                  </span>
                </label>
              )}
            />
          </div>

          <button
            type="submit"
            disabled={isPending || !isClient}
            className="mx-auto cursor-pointer mt-26 inline-flex h-50 w-full items-center justify-center bg-slate font-gotham text-14 font-bold uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-50 md:mt-30 md:h-50 md:text-16"
          >
            {isPending ? "Enviando..." : "Enviar"}
          </button>

          {status && (
            <p
              className={`text-center font-poppins text-14 ${
                status.ok ? "text-green-700" : "text-red-700"
              }`}
            >
              {status.message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

type SwitchProps = {
  checked: boolean;
  name: string;
  inputRef: Ref<HTMLInputElement>;
  onChange: (checked: boolean) => void;
};

/** Interruptor tipo switch; el input nativo queda oculto pero accesible. */
function Switch({ checked, name, inputRef, onChange }: SwitchProps) {
  return (
    <span className="relative mt-2 inline-flex h-18 w-32 shrink-0 items-center">
      <input
        ref={inputRef}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0"
      />
      <span
        aria-hidden
        className="absolute inset-0 rounded-full bg-[#c4c4c4] transition-colors peer-checked:bg-slate peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-slate"
      />
      <span
        aria-hidden
        className="absolute left-2 h-14 w-14 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-[14px]"
      />
    </span>
  );
}
