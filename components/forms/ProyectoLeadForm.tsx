"use client";

import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { useCf7Submit, type Cf7FormValues } from "@/hooks/useCf7Submit";
import { useIsClient } from "@/hooks/useIsClient";
import type { ACFImage } from "@/lib/types";

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
  "$ 175,000 a $340,000",
  "$ 340,000 a $500,000",
  "$ 500,000 a $750,000",
  "Más de $ 750,000",
];

type ProyectoLeadFormProps = {
  titulo?: string;
  formulario_id?: string | number;
  imagen_fondo?: ACFImage;
};

export function ProyectoLeadForm({
  titulo,
  formulario_id,
  imagen_fondo,
}: ProyectoLeadFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Cf7FormValues>({
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

  const { submit, isPending, status } = useCf7Submit(formulario_id || "4", { raw: true });
  const isClient = useIsClient();

  const onSubmit = async (values: Cf7FormValues) => {
    const payload = {
      ...values,
      terminos: values.terminos ? "1" : "",
      marketing: values.marketing ? "1" : "",
    };
    const ok = await submit(payload);
    if (ok) reset();
  };

  const inputWrap = "flex flex-col gap-4 px-10 py-8 border border-white";
  const labelClass = "font-poppins text-12 font-semibold text-white";
  const inputClass = "w-full bg-transparent font-poppins text-18 text-white outline-none placeholder:text-white/60";

  return (
    <section data-layout="proyecto_lead_form" className="relative w-full bg-slate">
      {imagen_fondo?.url && (
        <Image
          src={imagen_fondo.url}
          alt={imagen_fondo.alt || ""}
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
      )}
      <div className="absolute inset-0 bg-slate/75" />
      <div className="relative mx-auto max-w-895 px-16 py-60 md:px-24 md:py-91">
        {titulo && (
          <h2 className="text-center font-gotham text-36 font-bold text-white md:text-60">
            {titulo}
          </h2>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-24 flex flex-col gap-16 md:mt-70 md:gap-30"
        >
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-16">
            <div className={inputWrap}>
              <label className={labelClass}>Nombres*</label>
              <input
                type="text"
                placeholder="Ingresa tus nombres"
                className={inputClass}
                aria-invalid={errors.nombres ? "true" : "false"}
                {...register("nombres", { required: true })}
              />
              {errors.nombres && (
                <span className="text-12 text-white" role="alert">Completa este campo</span>
              )}
            </div>

            <div className={inputWrap}>
              <label className={labelClass}>Apellido*</label>
              <input
                type="text"
                placeholder="Ingresa tu apellido"
                className={inputClass}
                aria-invalid={errors.apellido ? "true" : "false"}
                {...register("apellido", { required: true })}
              />
              {errors.apellido && (
                <span className="text-12 text-white" role="alert">Completa este campo</span>
              )}
            </div>

            <div className={inputWrap}>
              <label className={labelClass}>Correo electrónico*</label>
              <input
                type="email"
                placeholder="Ingresa tu correo"
                className={inputClass}
                aria-invalid={errors.correo ? "true" : "false"}
                {...register("correo", { required: true })}
              />
              {errors.correo && (
                <span className="text-12 text-white" role="alert">Completa este campo</span>
              )}
            </div>

            <div>
              <label className={labelClass}>Celular*</label>
              <div className="mt-4 flex h-50 items-center border border-white" aria-label="Prefijo Perú +51">
                <div className="flex h-full shrink-0 items-center gap-4 border border-r-0 border-white px-8">
                  <Image
                    unoptimized
                    src="/images/formulario-modal/bandera-peru.svg"
                    alt="Perú"
                    width={20}
                    height={15}
                    className="pointer-events-none h-15 w-20"
                  />
                  <span className="font-poppins text-18 text-white">+51</span>
                </div>
                <input
                  type="tel"
                  placeholder="Ingresa tu celular"
                  className={`${inputClass} h-full border border-l-0 border-white px-10`}
                  aria-invalid={errors.celular ? "true" : "false"}
                  {...register("celular", { required: true })}
                />
              </div>
              {errors.celular && (
                <span className="text-12 text-white" role="alert">Completa este campo</span>
              )}
            </div>

            <div className={inputWrap}>
              <label className={labelClass}>Distrito de residencia</label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-transparent font-poppins text-18 text-white outline-none"
                  aria-invalid={errors.distrito ? "true" : "false"}
                  {...register("distrito", { required: true })}
                >
                  <option value="" disabled className="text-near-black">
                    Selecciona tu distrito
                  </option>
                  {DISTRITOS.map((d) => (
                    <option key={d} value={d} className="text-near-black">
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
                  className="pointer-events-none absolute right-0 top-1/2 h-18 w-18 -translate-y-1/2"
                />
              </div>
              {errors.distrito && (
                <span className="text-12 text-white" role="alert">Completa este campo</span>
              )}
            </div>

            <div className={inputWrap}>
              <label className={labelClass}>Presupuesto</label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-transparent font-poppins text-18 text-white outline-none"
                  aria-invalid={errors.presupuesto ? "true" : "false"}
                  {...register("presupuesto", { required: true })}
                >
                  <option value="" disabled className="text-near-black">
                    $ 175,000 a $340,000
                  </option>
                  {PRESUPUESTOS.map((p) => (
                    <option key={p} value={p} className="text-near-black">
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
                  className="pointer-events-none absolute right-0 top-1/2 h-18 w-18 -translate-y-1/2"
                />
              </div>
              {errors.presupuesto && (
                <span className="text-12 text-white" role="alert">Completa este campo</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <Controller
              name="terminos"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, ref, name } }) => (
                <label className="flex cursor-pointer items-start gap-8">
                  <span className="relative flex h-24 w-24 shrink-0 items-center justify-center border border-white">
                    <input
                      ref={ref}
                      name={name}
                      type="checkbox"
                      checked={Boolean(value)}
                      onChange={(e) => onChange(e.target.checked)}
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                      aria-checked={Boolean(value)}
                    />
                    {value && (
                      <span className="flex h-24 w-24 items-center justify-center text-14 text-white">✓</span>
                    )}
                  </span>
                  <span className="font-inter text-14 text-white">
                    He leído y acepto las{" "}
                    <a href="/politicas-de-privacidad" className="form-legal-link">
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
                <label className="flex cursor-pointer items-start gap-8">
                  <span className="relative flex h-24 w-24 shrink-0 items-center justify-center border border-white">
                    <input
                      ref={ref}
                      name={name}
                      type="checkbox"
                      checked={Boolean(value)}
                      onChange={(e) => onChange(e.target.checked)}
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                      aria-checked={Boolean(value)}
                    />
                    {value && (
                      <span className="flex h-24 w-24 items-center justify-center text-14 text-white">✓</span>
                    )}
                  </span>
                  <span className="font-inter text-14 text-white">
                    Autorizo a Armando Paredes para que realice las actividades de
                    prospección comercial y marketing descritas en las{" "}
                    <a href="/politicas-de-privacidad" className="form-legal-link">
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
            className="mx-auto inline-flex h-50 w-full items-center justify-center bg-slate font-gotham text-14 font-bold uppercase text-white transition-opacity hover:opacity-90 md:w-459 md:bg-peach md:text-18"
          >
            {isPending ? "Enviando..." : "ENVIAR"}
          </button>

          {status && (
            <p
              className={`text-center font-poppins text-14 ${
                status.ok ? "text-white" : "text-white"
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
