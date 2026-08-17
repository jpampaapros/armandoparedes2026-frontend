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
  label: string;
  register: ReturnType<typeof useForm<ReferidosFormValues>>["register"];
};

function PhoneInput({ name, label, register }: PhoneInputProps) {
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
      <label className="flex min-w-0 flex-1 flex-col justify-center border border-white px-10">
        <span className="font-poppins text-10 font-semibold leading-none text-white">{label}</span>
        <input
          type="tel"
          className="min-h-0 w-full border-0 bg-transparent p-0 font-poppins text-18 leading-[1.2] text-white outline-none"
          {...register(name)}
        />
      </label>
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

  const fieldClass = "flex h-50 flex-col justify-center border border-white px-10";
  const fieldLabelClass = "font-poppins text-10 font-semibold leading-none text-white";
  const inputClass =
    "min-h-0 w-full border-0 bg-transparent p-0 font-poppins text-18 leading-[1.2] text-white outline-none";
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
              <div>
                <label className={fieldClass}>
                  <span className={fieldLabelClass}>Nombres*</span>
                  <input type="text" className={inputClass} {...register("tu-nombre", { required: true })} />
                </label>
                {errors["tu-nombre"] && <span className={errorClass} role="alert">Completa este campo</span>}
              </div>

              <div>
                <label className={fieldClass}>
                  <span className={fieldLabelClass}>Apellido*</span>
                  <input type="text" className={inputClass} {...register("tu-apellido", { required: true })} />
                </label>
                {errors["tu-apellido"] && <span className={errorClass} role="alert">Completa este campo</span>}
              </div>

              <div className="md:col-span-2">
                <label className={fieldClass}>
                  <span className={fieldLabelClass}>Correo electrónico*</span>
                  <input type="email" className={inputClass} {...register("tu-email", { required: true })} />
                </label>
                {errors["tu-email"] && <span className={errorClass} role="alert">Completa este campo</span>}
              </div>

              <div>
                <PhoneInput name="tu-telefono" label="Celular*" register={register} />
                {errors["tu-telefono"] && <span className={errorClass} role="alert">Completa este campo</span>}
              </div>

              <div>
                <label className={`${fieldClass} relative`}>
                  <span className={fieldLabelClass}>DNI*</span>
                  <input type="text" className={`${inputClass} pr-24`} {...register("tu-dni", { required: true })} />
                  <Image unoptimized src="/images/referidos/icon-dropdown.svg" alt="" width={24} height={24} className="pointer-events-none absolute right-10 top-1/2 h-18 w-18 -translate-y-1/2" />
                </label>
                {errors["tu-dni"] && <span className={errorClass} role="alert">Completa este campo</span>}
              </div>
            </div>
          </div>

          {/* Datos del referido */}
          <div className="flex flex-col gap-16">
            <p className="text-center font-gotham text-20 font-bold italic text-white md:text-24 md:font-medium md:not-italic">
              Ingresa los datos de tu referido:
            </p>

            <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-30">
              <div>
                <label className={fieldClass}>
                  <span className={fieldLabelClass}>Nombres*</span>
                  <input type="text" className={inputClass} {...register("referido-nombre", { required: true })} />
                </label>
                {errors["referido-nombre"] && <span className={errorClass} role="alert">Completa este campo</span>}
              </div>

              <div>
                <label className={fieldClass}>
                  <span className={fieldLabelClass}>Apellido*</span>
                  <input type="text" className={inputClass} {...register("referido-apellido", { required: true })} />
                </label>
                {errors["referido-apellido"] && <span className={errorClass} role="alert">Completa este campo</span>}
              </div>

              <div>
                <label className={fieldClass}>
                  <span className={fieldLabelClass}>Correo electrónico*</span>
                  <input type="email" className={inputClass} {...register("referido-email", { required: true })} />
                </label>
                {errors["referido-email"] && <span className={errorClass} role="alert">Completa este campo</span>}
              </div>

              <div>
                <PhoneInput name="referido-telefono" label="Celular*" register={register} />
                {errors["referido-telefono"] && <span className={errorClass} role="alert">Completa este campo</span>}
              </div>
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
