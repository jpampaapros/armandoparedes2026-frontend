"use client";

import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { useCf7Submit, type Cf7FormValues } from "@/hooks/useCf7Submit";
import { useIsClient } from "@/hooks/useIsClient";

type SeParteProps = {
  title?: string;
  form_id?: string | number;
};

type ReferidosFormValues = {
  "tu-nombre": string;
  "tu-apellido": string;
  "tu-email": string;
  "tu-telefono": string;
  "tu-dni": string;
  "referido-nombre": string;
  "referido-apellido": string;
  "referido-email": string;
  "referido-telefono": string;
  aceptoTerminos: boolean;
  autorizoMarketing: boolean;
};

type PhoneInputProps = {
  name: "tu-telefono" | "referido-telefono";
  placeholder: string;
  register: ReturnType<typeof useForm<ReferidosFormValues>>["register"];
};

function PhoneInput({ name, placeholder, register }: PhoneInputProps) {
  return (
    <div className="flex h-50">
      <div className="flex shrink-0 items-center gap-4 border border-r-0 border-white bg-transparent px-10">
        <Image
          unoptimized
          src="/images/referidos/icon-flag.svg"
          alt="Perú"
          width={20}
          height={15}
          className="pointer-events-none h-15 w-20"
        />
        <span className="font-poppins text-18 text-white">+51</span>
        <Image
          unoptimized
          src="/images/referidos/icon-dropdown.svg"
          alt=""
          width={24}
          height={24}
          className="h-18 w-18"
        />
      </div>
      <input
        type="tel"
        placeholder={placeholder}
        className="h-full min-w-0 flex-1 border border-white bg-transparent px-10 py-12 font-poppins text-18 text-white outline-none placeholder:text-white/60"
        {...register(name)}
      />
    </div>
  );
}

export function SeParte({ title, form_id }: SeParteProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ReferidosFormValues>({
    defaultValues: {
      "tu-nombre": "",
      "tu-apellido": "",
      "tu-email": "",
      "tu-telefono": "",
      "tu-dni": "",
      "referido-nombre": "",
      "referido-apellido": "",
      "referido-email": "",
      "referido-telefono": "",
      aceptoTerminos: false,
      autorizoMarketing: false,
    },
  });
  const { submit, isPending, status } = useCf7Submit(form_id || "976", { raw: true });
  const isClient = useIsClient();

  const onSubmit = async (values: ReferidosFormValues) => {
    const payload: Cf7FormValues = {
      "tu-nombre": values["tu-nombre"],
      "tu-apellido": values["tu-apellido"],
      "tu-email": values["tu-email"],
      "tu-telefono": values["tu-telefono"],
      "tu-dni": values["tu-dni"],
      "referido-nombre": values["referido-nombre"],
      "referido-apellido": values["referido-apellido"],
      "referido-email": values["referido-email"],
      "referido-telefono": values["referido-telefono"],
    };
    const ok = await submit(payload);
    if (ok) reset();
  };

  const inputClass =
    "h-50 w-full border border-white bg-transparent px-10 py-12 font-poppins text-18 text-white outline-none placeholder:text-white";
  const errorClass = "text-12 text-red-300";

  return (
    <section data-layout="se_parte" className="w-full bg-slate px-16 py-60 md:px-24 md:py-100">
      <div className="mx-auto max-w-1025">
        {title && (
          <h2 className="m-0 whitespace-pre-line text-center font-gotham-black text-36 text-white md:text-60">
            {title}
          </h2>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-24 flex flex-col gap-16 md:mt-40 md:gap-30"
        >
          {/* Tus datos */}
          <div className="flex flex-col gap-16">
            <p className="text-center font-gotham text-20 font-bold italic text-white md:text-24 md:font-medium md:not-italic">
              Ingresa tus datos:
            </p>

            <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-30">
              <input
                type="text"
                placeholder="Nombres*"
                aria-label="Nombres"
                className={inputClass}
                {...register("tu-nombre", { required: true })}
              />
              {errors["tu-nombre"] && (
                <span className={errorClass} role="alert">
                  Completa este campo
                </span>
              )}

              <input
                type="text"
                placeholder="Apellido*"
                aria-label="Apellido"
                className={inputClass}
                {...register("tu-apellido", { required: true })}
              />
              {errors["tu-apellido"] && (
                <span className={errorClass} role="alert">
                  Completa este campo
                </span>
              )}

              <input
                type="email"
                placeholder="Email*"
                aria-label="Email"
                className={`${inputClass} md:col-span-2`}
                {...register("tu-email", { required: true })}
              />
              {errors["tu-email"] && (
                <span className={errorClass} role="alert">
                  Completa este campo
                </span>
              )}

              <PhoneInput name="tu-telefono" placeholder="Celular*" register={register} />
              {errors["tu-telefono"] && (
                <span className={errorClass} role="alert">
                  Completa este campo
                </span>
              )}

              <div className="relative">
                <input
                  type="text"
                  placeholder="DNI*"
                  aria-label="DNI"
                  className={inputClass}
                  {...register("tu-dni", { required: true })}
                />
                <Image
                  unoptimized
                  src="/images/referidos/icon-dropdown.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="pointer-events-none absolute right-10 top-1/2 h-18 w-18 -translate-y-1/2"
                />
              </div>
              {errors["tu-dni"] && (
                <span className={errorClass} role="alert">
                  Completa este campo
                </span>
              )}
            </div>
          </div>

          {/* Datos del referido */}
          <div className="flex flex-col gap-16">
            <p className="text-center font-gotham text-20 font-bold italic text-white md:text-24 md:font-medium md:not-italic">
              Ingresa los datos de tu referido:
            </p>

            <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-30">
              <input
                type="text"
                placeholder="Nombres*"
                aria-label="Nombres de tu referido"
                className={inputClass}
                {...register("referido-nombre", { required: true })}
              />
              {errors["referido-nombre"] && (
                <span className={errorClass} role="alert">
                  Completa este campo
                </span>
              )}

              <input
                type="text"
                placeholder="Apellido*"
                aria-label="Apellido de tu referido"
                className={inputClass}
                {...register("referido-apellido", { required: true })}
              />
              {errors["referido-apellido"] && (
                <span className={errorClass} role="alert">
                  Completa este campo
                </span>
              )}

              <input
                type="email"
                placeholder="Email*"
                aria-label="Email de tu referido"
                className={inputClass}
                {...register("referido-email", { required: true })}
              />
              {errors["referido-email"] && (
                <span className={errorClass} role="alert">
                  Completa este campo
                </span>
              )}

              <PhoneInput
                name="referido-telefono"
                placeholder="Celular*"
                register={register}
              />
              {errors["referido-telefono"] && (
                <span className={errorClass} role="alert">
                  Completa este campo
                </span>
              )}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-col gap-12">
            <Controller
              name="aceptoTerminos"
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
                    <Image
                      unoptimized
                      src={
                        value
                          ? "/images/referidos/icon-check-note.svg"
                          : "/images/referidos/icon-checkbox.svg"
                      }
                      alt=""
                      width={18}
                      height={18}
                      className="h-18 w-18"
                    />
                  </span>
                  <span className="font-inter text-14 text-white [&_a]:underline">
                    He leído y acepto las{" "}
                    <a href="/terminos-y-condiciones" className="text-white">
                      Políticas de Privacidad
                    </a>
                    .
                  </span>
                </label>
              )}
            />

            <Controller
              name="autorizoMarketing"
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
                    <Image
                      unoptimized
                      src={
                        value
                          ? "/images/referidos/icon-check-note.svg"
                          : "/images/referidos/icon-checkbox.svg"
                      }
                      alt=""
                      width={18}
                      height={18}
                      className="h-18 w-18"
                    />
                  </span>
                  <span className="font-inter text-14 text-white">
                    Autorizo a Armando Paredes para que realice las actividades de
                    prospección comercial y marketing descritas en las{" "}
                    <a href="/terminos-y-condiciones" className="underline">
                      Políticas de Privacidad
                    </a>
                    .
                  </span>
                </label>
              )}
            />

            <label className="flex cursor-pointer items-start gap-8">
              <Image
                unoptimized
                src="/images/referidos/icon-check-note.svg"
                alt=""
                width={20}
                height={14}
                className="mt-2 h-14 w-20"
              />
              <span className="font-inter text-14 text-white">
                He recibido la autorización de mi referido para compartir sus datos
                personales.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending || !isClient}
            className="mx-auto inline-flex h-50 w-full items-center justify-center bg-peach font-gotham text-18 font-bold uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-50 md:w-372"
          >
            {isPending ? "Enviando..." : "ENVIAR"}
          </button>

          {status && (
            <p
              className={`text-center font-poppins text-14 ${
                status.ok ? "text-green-300" : "text-red-300"
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
