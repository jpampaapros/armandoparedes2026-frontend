"use client";

import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { useCf7Submit, type Cf7FormValues } from "@/hooks/useCf7Submit";
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

type FormularioContactoProps = {
  titulo?: string;
  formulario_id?: string | number;
};

export function FormularioContacto({
  titulo,
  formulario_id,
}: FormularioContactoProps) {
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

  return (
    <section data-layout="formulario_contacto" className="w-full bg-white">
      <div className="mx-auto max-w-895 px-16 pt-60 pb-0 md:px-24 md:pt-100">
        {titulo && (
          <h2 className="m-0 text-center font-gotham text-36 font-bold text-slate md:text-60">
            {titulo}
          </h2>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-24 flex flex-col gap-16 md:mt-40 md:gap-30"
        >
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-30">
            <div className="flex flex-col gap-8">
              <label className="flex h-50 flex-col justify-center border border-near-black px-10">
                <span className="font-poppins text-10 font-semibold leading-none text-near-black">Nombres*</span>
                <input
                  type="text"
                  aria-invalid={errors.nombres ? "true" : "false"}
                  className="min-h-0 w-full border-0 bg-transparent p-0 font-poppins text-18 leading-[1.2] text-near-black outline-none placeholder:text-near-black/60"
                  {...register("nombres", { required: true })}
                />
              </label>
              {errors.nombres && (
                <span className="text-12 text-red-700" role="alert">
                  Completa este campo
                </span>
              )}
            </div>

            <div className="flex flex-col gap-8">
              <label className="flex h-50 flex-col justify-center border border-near-black px-10">
                <span className="font-poppins text-10 font-semibold leading-none text-near-black">Apellido*</span>
                <input
                  type="text"
                  aria-invalid={errors.apellido ? "true" : "false"}
                  className="min-h-0 w-full border-0 bg-transparent p-0 font-poppins text-18 leading-[1.2] text-near-black outline-none placeholder:text-near-black/60"
                  {...register("apellido", { required: true })}
                />
              </label>
              {errors.apellido && (
                <span className="text-12 text-red-700" role="alert">
                  Completa este campo
                </span>
              )}
            </div>

            <div className="flex flex-col gap-8">
              <label className="flex h-50 flex-col justify-center border border-near-black px-10">
                <span className="font-poppins text-10 font-semibold leading-none text-near-black">Correo electrónico*</span>
                <input
                  type="email"
                  aria-invalid={errors.correo ? "true" : "false"}
                  className="min-h-0 w-full border-0 bg-transparent p-0 font-poppins text-18 leading-[1.2] text-near-black outline-none placeholder:text-near-black/60"
                  {...register("correo", { required: true })}
                />
              </label>
              {errors.correo && (
                <span className="text-12 text-red-700" role="alert">
                  Completa este campo
                </span>
              )}
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex h-50">
                <div className="flex shrink-0 items-center gap-4 border border-r-0 border-near-black px-10" aria-label="Prefijo Perú +51">
                  <Image
                    unoptimized
                    src="/images/formulario-modal/bandera-peru.svg"
                    alt="Perú"
                    width={20}
                    height={15}
                    className="pointer-events-none h-15 w-20"
                  />
                  <span className="font-poppins text-18 text-near-black">+51</span>
                </div>
                <label className="flex min-w-0 flex-1 flex-col justify-center border border-near-black px-10">
                  <span className="font-poppins text-10 font-semibold leading-none text-near-black">Celular*</span>
                  <input
                    type="tel"
                    aria-invalid={errors.celular ? "true" : "false"}
                    className="min-h-0 w-full border-0 bg-transparent p-0 font-poppins text-18 leading-[1.2] text-near-black outline-none placeholder:text-near-black/60"
                    {...register("celular", { required: true })}
                  />
                </label>
              </div>
              {errors.celular && (
                <span className="text-12 text-red-700" role="alert">
                  Completa este campo
                </span>
              )}
            </div>

            <div className="flex flex-col gap-8">
              <label className="relative flex h-50 flex-col justify-center border border-near-black px-10">
                <span className="font-poppins text-10 font-semibold leading-none text-near-black">Distrito de residencia</span>
                <select
                  className="min-h-0 w-full appearance-none border-0 bg-transparent p-0 pr-28 font-poppins text-18 leading-[1.2] text-near-black outline-none"
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
                  className="pointer-events-none absolute right-10 top-1/2 h-18 w-18 -translate-y-1/2"
                />
              </label>
              {errors.distrito && (
                <span className="text-12 text-red-700" role="alert">
                  Completa este campo
                </span>
              )}
            </div>

            <div className="flex flex-col gap-8">
              <label className="relative flex h-50 flex-col justify-center border border-near-black px-10">
                <span className="font-poppins text-10 font-semibold leading-none text-near-black">Presupuesto</span>
                <select
                  className="min-h-0 w-full appearance-none border-0 bg-transparent p-0 pr-28 font-poppins text-18 leading-[1.2] text-near-black outline-none"
                  aria-invalid={errors.presupuesto ? "true" : "false"}
                  {...register("presupuesto", { required: true })}
                >
                  <option value="" disabled hidden aria-label="Sin selección" />
                  {PRESUPUESTOS.map((p) => (
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
                  className="pointer-events-none absolute right-10 top-1/2 h-18 w-18 -translate-y-1/2"
                />
              </label>
              {errors.presupuesto && (
                <span className="text-12 text-red-700" role="alert">
                  Completa este campo
                </span>
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
                  <span className="relative flex h-18 w-18 shrink-0 items-center justify-center">
                    <input
                      ref={ref}
                      name={name}
                      type="checkbox"
                      checked={Boolean(value)}
                      onChange={(e) => onChange(e.target.checked)}
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                      aria-checked={Boolean(value)}
                    />
                    {!value ? (
                      <Image
                        unoptimized
                        src="/images/formulario-modal/termino-unchecked.svg"
                        alt=""
                        width={18}
                        height={18}
                        className="h-18 w-18"
                      />
                    ) : (
                      <span className="flex h-18 w-18 items-center justify-center rounded-full bg-slate text-10 text-white">
                        ✓
                      </span>
                    )}
                  </span>
                  <span className="font-inter text-14 text-near-black">
                    He leído y acepto las{" "}
                    <a href="/politicas-de-privacidad" className="underline">
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
                  <span className="relative flex h-18 w-18 shrink-0 items-center justify-center">
                    <input
                      ref={ref}
                      name={name}
                      type="checkbox"
                      checked={Boolean(value)}
                      onChange={(e) => onChange(e.target.checked)}
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                      aria-checked={Boolean(value)}
                    />
                    {!value ? (
                      <Image
                        unoptimized
                        src="/images/formulario-modal/termino-unchecked.svg"
                        alt=""
                        width={18}
                        height={18}
                        className="h-18 w-18"
                      />
                    ) : (
                      <span className="flex h-18 w-18 items-center justify-center rounded-full bg-slate text-10 text-white">
                        ✓
                      </span>
                    )}
                  </span>
                  <span className="font-inter text-14 text-near-black">
                    Autorizo a Armando Paredes para que realice las actividades de
                    prospección comercial y marketing descritas en las{" "}
                    <a href="/politicas-de-privacidad" className="underline">
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
            className="mx-auto inline-flex h-50 w-full items-center justify-center bg-slate font-gotham text-14 font-bold uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-50 md:w-511 md:text-18"
          >
            {isPending ? "Enviando..." : "ENVIAR"}
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
