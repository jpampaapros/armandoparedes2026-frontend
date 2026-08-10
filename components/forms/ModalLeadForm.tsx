"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

type ModalLeadFormProps = {
  formId: string | number;
  title?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ModalLeadForm({
  formId,
  title,
  defaultOpen = false,
  open,
  onOpenChange,
}: ModalLeadFormProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange],
  );
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();
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
  const { submit, isPending, status } = useCf7Submit(formId, { raw: true });

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const modal = modalRef.current;
    if (!modal) return;
    const focusable = Array.from(
      modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || focusable.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  const onSubmit = async (values: Cf7FormValues) => {
    const payload = {
      ...values,
      terminos: values.terminos ? "1" : "",
      marketing: values.marketing ? "1" : "",
    };
    const ok = await submit(payload);
    if (ok) reset();
  };

  if (!isOpen) {
    if (isControlled) {
      return null;
    }
    return (
      <div data-layout="formulario_contacto" className="flex items-center justify-center py-24">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex h-36 items-center justify-center bg-slate px-24 font-gotham text-13 font-bold uppercase text-white transition-opacity hover:opacity-90 md:px-44"
          aria-haspopup="dialog"
        >
          {title || "Quiero más información"}
        </button>
      </div>
    );
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      setIsOpen(false);
    }
  };

  return (
    <section
      data-layout="formulario_contacto"
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-modal-overlay p-24"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="relative h-auto w-full max-w-full bg-white p-24 shadow-[0_--spacing(4)_--spacing(4)_rgba(0,0,0,0.25)] md:h-auto md:min-h-443 md:w-737 md:px-44 md:pb-18 md:pt-20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-20 top-20 font-gotham text-24 text-black md:right-44"
          aria-label="Cerrar"
        >
          ×
        </button>

        <h2 className="text-center font-gotham text-28 font-bold text-slate md:text-44">
          {title || "Quiero más información"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return handleSubmit(onSubmit)(e);
          }}
          noValidate
          className="mt-20 flex flex-col gap-16 md:mt-20 md:gap-22"
        >
          <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2 md:gap-y-22">
            <div className="flex flex-col gap-4">
              <label className="font-poppins text-9 font-semibold text-near-black">
                Nombres
              </label>
              <input
                type="text"
                placeholder="Ingresa tus nombres"
                aria-invalid={errors.nombres ? "true" : "false"}
                className="h-36 w-full border border-near-black px-7 py-4 font-poppins text-13 text-near-black outline-none placeholder:text-near-black"
                {...register("nombres", { required: true })}
              />
              {errors.nombres && (
                <span className="text-10 text-red-700" role="alert">
                  Completa este campo
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <label className="font-poppins text-9 font-semibold text-near-black">
                Apellido
              </label>
              <input
                type="text"
                placeholder="Ingresa tu apellido"
                aria-invalid={errors.apellido ? "true" : "false"}
                className="h-36 w-full border border-near-black px-7 py-4 font-poppins text-13 text-near-black outline-none placeholder:text-near-black"
                {...register("apellido", { required: true })}
              />
              {errors.apellido && (
                <span className="text-10 text-red-700" role="alert">
                  Completa este campo
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <label className="font-poppins text-9 font-semibold text-near-black">
                Correo
              </label>
              <input
                type="email"
                placeholder="Ingresa tu correo"
                aria-invalid={errors.correo ? "true" : "false"}
                className="h-36 w-full border border-near-black px-7 py-4 font-poppins text-13 text-near-black outline-none placeholder:text-near-black"
                {...register("correo", { required: true })}
              />
              {errors.correo && (
                <span className="text-10 text-red-700" role="alert">
                  Completa este campo
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <label className="font-poppins text-9 font-semibold text-near-black">
                Celular
              </label>
              <div className="flex h-36">
                <div className="flex shrink-0 items-center gap-4 border border-r-0 border-near-black px-8" aria-label="Prefijo Perú +51">
                  <Image unoptimized
                    src="/images/formulario-modal/bandera-peru.svg"
                    alt="Perú"
                    width={20}
                    height={15}
                    className="pointer-events-none h-15 w-20"
                  />
                  <span className="font-poppins text-13 text-near-black">+51</span>
                </div>
                <input
                  type="tel"
                  placeholder="Ingresa tu celular"
                  aria-invalid={errors.celular ? "true" : "false"}
                  className="h-full flex-1 border border-near-black px-7 py-4 font-poppins text-13 text-near-black outline-none placeholder:text-near-black"
                  {...register("celular", { required: true })}
                />
              </div>
              {errors.celular && (
                <span className="text-10 text-red-700" role="alert">
                  Completa este campo
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <label className="font-poppins text-9 font-semibold text-near-black">
                Distrito
              </label>
              <div className="relative">
                <select
                  className="h-36 w-full appearance-none border border-near-black bg-white px-7 py-4 font-poppins text-13 text-near-black outline-none"
                  aria-invalid={errors.distrito ? "true" : "false"}
                  {...register("distrito", { required: true })}
                >
                  <option value="" disabled>
                    Selecciona tu distrito
                  </option>
                  {DISTRITOS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <Image unoptimized
                  src="/images/formulario-modal/chevron-down.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="absolute right-8 top-1/2 h-18 w-18 -translate-y-1/2 pointer-events-none"
                />
              </div>
              {errors.distrito && (
                <span className="text-10 text-red-700" role="alert">
                  Completa este campo
                </span>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <label className="font-poppins text-9 font-semibold text-near-black">
                Presupuesto
              </label>
              <div className="relative">
                <select
                  className="h-36 w-full appearance-none border border-near-black bg-white px-7 py-4 font-poppins text-13 text-near-black outline-none"
                  aria-invalid={errors.presupuesto ? "true" : "false"}
                  {...register("presupuesto", { required: true })}
                >
                  <option value="" disabled>
                    Selecciona tu presupuesto
                  </option>
                  {PRESUPUESTOS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <Image unoptimized
                  src="/images/formulario-modal/chevron-down.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="absolute right-8 top-1/2 h-18 w-18 -translate-y-1/2 pointer-events-none"
                />
              </div>
              {errors.presupuesto && (
                <span className="text-10 text-red-700" role="alert">
                  Completa este campo
                </span>
              )}
            </div>
          </div>

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
                <span className="font-inter text-10 text-near-black">
                  Acepto las{" "}
                  <a
                    href="/politicas-de-privacidad"
                    className="underline"
                  >
                    Políticas de Privacidad
                  </a>{" "}
                  y los{" "}
                  <a
                    href="/terminos-y-condiciones"
                    className="underline"
                  >
                    Términos y Condiciones
                  </a>
                  .
                </span>
              </label>
            )}
          />
          {errors.terminos && (
            <span className="text-10 text-red-700" role="alert">
              Debes aceptar las políticas para continuar.
            </span>
          )}

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
                <span className="font-inter text-10 text-near-black">
                  Autorizo el envío de comunicaciones comerciales.
                </span>
              </label>
            )}
          />

          <button
            type="submit"
            disabled={isPending || !isClient}
            className="mx-auto inline-flex h-36 w-full items-center justify-center bg-slate font-gotham text-13 font-bold uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-50 md:w-371"
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
