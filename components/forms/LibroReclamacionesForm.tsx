"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useForm, useWatch, type FieldError as RHFFieldError, type FieldPath, type RegisterOptions, type UseFormRegisterReturn } from "react-hook-form";
import { Consent, controlClass, fieldBorder, fieldClass, labelClass } from "@/components/forms/ContactoForm";
import { FieldError } from "@/components/forms/FieldError";
import { useCf7Submit } from "@/hooks/useCf7Submit";
import { useIsClient } from "@/hooks/useIsClient";
import { REQUIRED_MESSAGE } from "@/lib/form-validation";
import {
  LIBRO_RECLAMACIONES_FORM_ID, departamentos, distritosDe, fetchSiguienteCorrelativo, proyectoLabel,
  proyectosReclamo, provinciasDe, validarAdjunto,
} from "@/lib/libro-reclamaciones";

const ID = "reclamo";
const TIME_ZONE = "America/Lima";
const CHECK_MESSAGE = "Debes marcar esta casilla para continuar.";
const PLAZO = "El proveedor debe dar respuesta al reclamo o queja en un plazo no mayor a quince (15) días hábiles, el cual es improrrogable.";
const DESCRIPCION_PROVEEDOR = "Al ser un reclamo o queja virtual, su caso será derivado al área encargada a fin de dar respuesta dentro del plazo legalmente establecido";

const TIPOS_DOCUMENTO = [
  { value: "DNI", label: "DNI" },
  { value: "PASAPORTE", label: "Pasaporte" },
  { value: "RUC", label: "RUC" },
  { value: "CARNET EXTRANJERIA", label: "Carnet de Extranjería" },
];

/** El valor es el texto completo porque así llega al correo de CF7, igual que en el sitio anterior. */
const TIPOS_RECLAMO = [
  { titulo: "Queja", texto: "Disconformidad no relacionada a los productos o servicios; o, malestar o descontento respecto a la atención al público." },
  { titulo: "Reclamo", texto: "Disconformidad relacionada a los productos y servicios." },
].map((tipo) => ({ ...tipo, value: `${tipo.titulo}: ${tipo.texto}` }));

type ReclamoFormValues = {
  nombres: string; apellidos: string; tipoDocumento: string; nroDocumento: string; direccion: string;
  departamento: string; provincia: string; distrito: string; telefono: string; email: string; proyecto: string;
  tipoServicio: string; tieneMonto: string; montoReclamado: string; descripcionReclamo: string;
  quejaReclamo: string; detalleReclamo: string; pedido: string; adjunto?: FileList;
  conformidad: boolean; privacidad: boolean; transferencia: boolean;
};
type TextFieldName = { [K in keyof ReclamoFormValues]-?: ReclamoFormValues[K] extends string ? K : never }[keyof ReclamoFormValues];
type Rules = RegisterOptions<ReclamoFormValues, TextFieldName>;

const DEFAULT_VALUES: ReclamoFormValues = {
  nombres: "", apellidos: "", tipoDocumento: "", nroDocumento: "", direccion: "",
  departamento: "", provincia: "", distrito: "", telefono: "", email: "", proyecto: "",
  tipoServicio: "", tieneMonto: "", montoReclamado: "", descripcionReclamo: "",
  quejaReclamo: "", detalleReclamo: "", pedido: "", adjunto: undefined,
  conformidad: false, privacidad: false, transferencia: false,
};

const STEPS: { titulo: string; campos: FieldPath<ReclamoFormValues>[] }[] = [
  {
    titulo: "Datos del Reclamante",
    campos: ["nombres", "apellidos", "tipoDocumento", "nroDocumento", "direccion", "departamento", "provincia", "distrito", "telefono", "email", "proyecto"],
  },
  { titulo: "Identificación del Reclamo/Queja", campos: ["tipoServicio", "tieneMonto", "montoReclamado", "descripcionReclamo"] },
  { titulo: "Detalle del Reclamo/Queja", campos: ["quejaReclamo", "detalleReclamo", "pedido", "adjunto", "conformidad", "privacidad", "transferencia"] },
];

const required = { value: true, message: REQUIRED_MESSAGE };
const nameRules: Rules = { required, pattern: { value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s'.-]+$/, message: "Ingresa solo letras." } };
const emailRules: Rules = { required, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: "Ingresa un correo electrónico válido." } };
const phoneRules: Rules = {
  required,
  setValueAs: (value: unknown) => (typeof value === "string" ? value.replace(/[\s-]/g, "") : value),
  pattern: { value: /^\d{7,12}$/, message: "Ingresa un teléfono fijo o celular válido (solo números)." },
};
const documentoRules: Rules = {
  required,
  validate: (value, { tipoDocumento }) => {
    const nro = String(value).trim();
    if (tipoDocumento === "DNI") return /^\d{8}$/.test(nro) || "El DNI debe tener 8 dígitos.";
    if (tipoDocumento === "RUC") return /^\d{11}$/.test(nro) || "El RUC debe tener 11 dígitos.";
    return /^[A-Za-z0-9]{6,12}$/.test(nro) || "Ingresa entre 6 y 12 letras o números.";
  },
};
const montoRules: Rules = {
  validate: (value, { tieneMonto }) => tieneMonto !== "SI" || String(value).trim() !== "" || REQUIRED_MESSAGE,
  pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Ingresa un monto válido (p. ej. 1500.00)." },
};

const formatFecha = (date: Date) => date.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: TIME_ZONE });
const formatHora = (date: Date) => date.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23", timeZone: TIME_ZONE });
const yearLima = () => new Date().toLocaleDateString("es-PE", { year: "numeric", timeZone: TIME_ZONE });

/** Reloj por segundos; en el servidor es `null` para no desajustar la hidratación. */
const subscribeClock = (callback: () => void) => {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
};
const useNow = () => {
  const seconds = useSyncExternalStore(subscribeClock, () => Math.floor(Date.now() / 1000), () => null);
  return seconds === null ? null : new Date(seconds * 1000);
};

export function LibroReclamacionesForm() {
  const {
    register, handleSubmit, trigger, reset, setValue, control, formState: { errors, isSubmitting },
  } = useForm<ReclamoFormValues>({ defaultValues: DEFAULT_VALUES });
  const { submit, isPending, status } = useCf7Submit(LIBRO_RECLAMACIONES_FORM_ID, { raw: true });
  const isClient = useIsClient();
  const now = useNow();
  const topRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [correlativo, setCorrelativo] = useState<string | null>(null);
  const [correlativoError, setCorrelativoError] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [registrado, setRegistrado] = useState<{ codigo: string; email: string } | null>(null);

  const [departamento, provincia, proyectoKey, tieneMonto] = useWatch({ control, name: ["departamento", "provincia", "proyecto", "tieneMonto"] });
  const proyecto = proyectosReclamo.find((p) => p.key === proyectoKey);

  // Vista previa del número; el definitivo se vuelve a pedir al registrar.
  useEffect(() => {
    if (registrado) return;
    let active = true;
    fetchSiguienteCorrelativo()
      .then((next) => { if (active) { setCorrelativo(next); setCorrelativoError(false); } })
      .catch(() => { if (active) setCorrelativoError(true); });
    return () => { active = false; };
  }, [registrado]);

  const goTo = (next: number) => {
    setStep(next);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const nextStep = async () => {
    if (await trigger(STEPS[step].campos, { shouldFocus: true })) goTo(step + 1);
  };

  const onSubmit = async (values: ReclamoFormValues) => {
    setSubmitError("");
    const seleccionado = proyectosReclamo.find((p) => p.key === values.proyecto);
    let siguiente: string;
    try {
      siguiente = await fetchSiguienteCorrelativo();
    } catch {
      setSubmitError("No se pudo generar el número de reclamo. Inténtalo de nuevo.");
      return;
    }
    const fecha = new Date();
    const codigo = `${siguiente}-${yearLima()}-${seleccionado?.codigo ?? ""}`;
    const ok = await submit({
      CodReclamo: codigo,
      FechaReclamo: formatFecha(fecha),
      HoraReclamo: formatHora(fecha),
      Nombre: values.nombres.trim(),
      Apellido: values.apellidos.trim(),
      TipoDocumento: values.tipoDocumento,
      NroDocumento: values.nroDocumento.trim(),
      Direccion: values.direccion.trim(),
      Departamento: departamentos.find((d) => d.id === values.departamento)?.nombre ?? "",
      Provincia: provinciasDe(values.departamento).find((p) => p.id === values.provincia)?.nombre ?? "",
      Distrito: distritosDe(values.provincia).find((d) => d.id === values.distrito)?.nombre ?? "",
      Telefono: values.telefono,
      Email: values.email.trim(),
      Proyecto: seleccionado ? proyectoLabel(seleccionado) : "",
      NombreProyecto: seleccionado?.codigo ?? "",
      CorreoProyecto: seleccionado?.correo ?? "",
      QuejaReclamo: values.quejaReclamo,
      TipoServicio: values.tipoServicio,
      MontoReclamado: values.tieneMonto === "SI" ? values.montoReclamado : "No aplica",
      DescripcionReclamo: values.descripcionReclamo.trim(),
      DetalleReclamo: values.detalleReclamo.trim(),
      Pedido: values.pedido.trim(),
      DescripcionProveedor: DESCRIPCION_PROVEEDOR,
      ArchivosAdjuntos: values.adjunto?.[0],
    });
    if (!ok) return;
    setRegistrado({ codigo, email: values.email.trim() });
    setCorrelativo(null);
    reset(DEFAULT_VALUES);
    goTo(0);
  };

  const sending = isSubmitting || isPending;
  const nroReclamo = correlativo
    ? `${correlativo}-${yearLima()}${proyecto ? `-${proyecto.codigo}` : ""}`
    : correlativoError ? "Se asignará al registrar" : "(Cargando...)";

  if (registrado) {
    return (
      <div ref={topRef} role="status" className="mt-32 flex flex-col items-center gap-16 border border-light-gray px-20 py-40 text-center md:mt-48 md:px-60 md:py-64">
        <h2 className="m-0 font-gotham text-24 font-bold leading-tight text-slate md:text-32">¡Tu reclamo fue registrado!</h2>
        <p className="m-0 font-poppins text-14 text-near-black md:text-16">Número de reclamo</p>
        <p className="m-0 font-gotham text-20 font-bold text-near-black md:text-24">{registrado.codigo}</p>
        <p className="m-0 max-w-640 font-poppins text-14 leading-[1.6] text-near-black md:text-16">
          Te enviaremos la constancia de tu reclamo o queja a <strong>{registrado.email}</strong>. {PLAZO}
        </p>
        <button type="button" onClick={() => setRegistrado(null)} className={`${secondaryButton} mt-16`}>Registrar otro reclamo</button>
      </div>
    );
  }

  return (
    <div ref={topRef} className="mt-32 scroll-mt-120 md:mt-48">
      <ol className="m-0 grid list-none grid-cols-3 gap-8 border-y border-light-gray p-0 py-16 md:gap-30 md:py-20">
        {STEPS.map(({ titulo }, index) => (
          <li key={titulo} aria-current={index === step ? "step" : undefined} className="flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
            <span className={`flex h-32 w-32 shrink-0 items-center justify-center rounded-full font-poppins text-13 font-semibold md:h-40 md:w-40 md:text-14 ${index <= step ? "bg-slate text-white" : "bg-light-gray text-near-black"}`}>{index + 1}</span>
            <span className={`font-poppins text-11 leading-tight md:text-16 ${index === step ? "font-semibold text-near-black" : "text-text-muted"}`}>{titulo}</span>
          </li>
        ))}
      </ol>

      <form
        onSubmit={(event) => {
          // Enter en un paso intermedio avanza en lugar de validar todo el formulario.
          if (step < STEPS.length - 1) {
            event.preventDefault();
            void nextStep();
            return;
          }
          void handleSubmit(onSubmit)(event);
        }}
        noValidate
        className="mt-24 md:mt-32"
      >
        <div hidden={step !== 0}>
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <dl className="m-0 grid grid-cols-3 gap-12 bg-[#f5f5f5] p-12 md:col-span-2 md:gap-16 md:p-16">
              {([["Nro Reclamo", nroReclamo], ["Fecha", now ? formatFecha(now) : ""], ["Hora", now ? formatHora(now) : ""]] as const).map(([dt, dd]) => (
                <div key={dt} className="flex min-w-0 flex-col gap-6">
                  <dt className={labelClass}>{dt}</dt>
                  <dd className="m-0 min-h-38 break-words bg-white px-10 py-10 font-poppins text-12 font-medium text-near-black md:text-16">{dd}</dd>
                </div>
              ))}
            </dl>
            <TextField name="nombres" label="Nombres*" error={errors.nombres} field={register("nombres", nameRules)} />
            <TextField name="apellidos" label="Apellidos*" error={errors.apellidos} field={register("apellidos", nameRules)} />
            <SelectBox name="tipoDocumento" label="Tipo de documento*" error={errors.tipoDocumento} field={register("tipoDocumento", { required, deps: ["nroDocumento"] })}>
              {TIPOS_DOCUMENTO.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
            </SelectBox>
            <TextField name="nroDocumento" label="Nro de documento*" error={errors.nroDocumento} field={register("nroDocumento", documentoRules)} />
            <div className="md:col-span-2">
              <TextField name="direccion" label="Dirección*" error={errors.direccion} field={register("direccion", { required })} />
            </div>
            <div className="grid grid-cols-1 gap-16 md:col-span-2 md:grid-cols-3">
              <SelectBox
                name="departamento" label="Departamento*" error={errors.departamento}
                field={register("departamento", { required, onChange: () => { setValue("provincia", ""); setValue("distrito", ""); } })}
              >
                {departamentos.map(({ id, nombre }) => <option key={id} value={id}>{nombre}</option>)}
              </SelectBox>
              <SelectBox
                name="provincia" label="Provincia*" error={errors.provincia} disabled={!departamento}
                field={register("provincia", { required, onChange: () => setValue("distrito", "") })}
              >
                {provinciasDe(departamento).map(({ id, nombre }) => <option key={id} value={id}>{nombre}</option>)}
              </SelectBox>
              <SelectBox name="distrito" label="Distrito*" error={errors.distrito} disabled={!provincia} field={register("distrito", { required })}>
                {distritosDe(provincia).map(({ id, nombre }) => <option key={id} value={id}>{nombre}</option>)}
              </SelectBox>
            </div>
            <TextField name="telefono" label="Teléfono fijo / Móvil*" type="tel" inputMode="numeric" maxLength={14} error={errors.telefono} field={register("telefono", phoneRules)} />
            <TextField name="email" label="Correo electrónico*" type="email" error={errors.email} field={register("email", emailRules)} />
            <div className="md:col-span-2">
              <SelectBox name="proyecto" label="Proyecto*" error={errors.proyecto} field={register("proyecto", { required })}>
                {proyectosReclamo.map((p) => <option key={p.key} value={p.key}>{proyectoLabel(p)}</option>)}
              </SelectBox>
            </div>
          </div>
          <p className="m-0 mt-16 font-poppins text-12 text-near-black">* Campos obligatorios</p>
          <StepButtons>
            <button type="submit" className={primaryButton}>Siguiente</button>
          </StepButtons>
        </div>

        <div hidden={step !== 1}>
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
            <SelectBox name="tipoServicio" label="Tipo de servicio*" error={errors.tipoServicio} field={register("tipoServicio", { required })}>
              <option value="Producto">Producto</option>
              <option value="Servicio">Servicio</option>
            </SelectBox>
            <SelectBox
              name="tieneMonto" label="¿Tiene monto reclamado?*" error={errors.tieneMonto}
              field={register("tieneMonto", { required, onChange: (event) => { if (event.target.value !== "SI") setValue("montoReclamado", ""); } })}
            >
              <option value="SI">Sí</option>
              <option value="NO">No</option>
            </SelectBox>
            {tieneMonto === "SI" && (
              <TextField name="montoReclamado" label="Monto reclamado (S/)*" inputMode="decimal" error={errors.montoReclamado} field={register("montoReclamado", montoRules)} />
            )}
            <div className="md:col-span-2">
              <TextAreaField name="descripcionReclamo" label="Descripción del reclamo*" error={errors.descripcionReclamo} field={register("descripcionReclamo", { required })} />
            </div>
          </div>
          <p className="m-0 mt-16 font-poppins text-12 leading-[1.5] text-near-black md:text-14">*{PLAZO}</p>
          <StepButtons>
            <button type="button" onClick={() => goTo(0)} className={secondaryButton}>Anterior</button>
            <button type="submit" className={primaryButton}>Siguiente</button>
          </StepButtons>
        </div>

        <div hidden={step !== 2}>
          <div className="flex flex-col gap-16 md:gap-24">
            <fieldset className="m-0 flex flex-col gap-12 border-0 p-0" aria-describedby={`${ID}-quejaReclamo-error`}>
              <legend className={`${labelClass} mb-12`}>Tipo*</legend>
              {TIPOS_RECLAMO.map(({ titulo, texto, value }) => (
                <label key={titulo} className="flex cursor-pointer items-start gap-10 border border-light-gray p-12 font-poppins text-13 leading-[1.5] text-near-black has-[:checked]:border-slate md:p-16 md:text-15" style={errors.quejaReclamo ? fieldBorder(true) : undefined}>
                  <input type="radio" value={value} className="mt-3 h-16 w-16 shrink-0 accent-slate" {...register("quejaReclamo", { required })} />
                  <span><strong className="font-semibold">{titulo}:</strong> {texto}</span>
                </label>
              ))}
              <FieldError id={`${ID}-quejaReclamo-error`} error={errors.quejaReclamo} />
            </fieldset>
            <TextAreaField name="detalleReclamo" label="Detalle del reclamo o queja*" error={errors.detalleReclamo} field={register("detalleReclamo", { required })} />
            <TextAreaField name="pedido" label="Pedido del reclamo o queja*" error={errors.pedido} field={register("pedido", { required })} />

            <div className="flex flex-col gap-6">
              <label htmlFor={`${ID}-adjunto`} className={labelClass}>Archivo adjunto (PDF, PNG, JPG - Máximo 4MB)</label>
              <input
                id={`${ID}-adjunto`} type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                aria-invalid={errors.adjunto ? "true" : "false"} aria-describedby={`${ID}-adjunto-error`}
                className="w-full border border-light-gray p-10 font-poppins text-13 text-near-black file:mr-12 file:cursor-pointer file:border-0 file:bg-slate file:px-12 file:py-6 file:font-poppins file:text-13 file:text-white md:text-14"
                style={fieldBorder(errors.adjunto)}
                {...register("adjunto", { validate: (files) => validarAdjunto(files?.[0]) })}
              />
              <FieldError id={`${ID}-adjunto-error`} error={errors.adjunto as RHFFieldError | undefined} />
            </div>

            <div className="flex flex-col gap-6">
              <p className={`${labelClass} m-0`}>Observaciones y acciones adoptadas por el proveedor</p>
              <p className="m-0 bg-[#f5f5f5] p-12 font-poppins text-13 italic leading-[1.5] text-near-black md:p-16 md:text-15">{DESCRIPCION_PROVEEDOR}</p>
            </div>

            <div className="flex flex-col gap-14">
              <Consent idPrefix={ID} name="conformidad" required requiredMessage={CHECK_MESSAGE} control={control}>Al enviar este reclamo / queja usted está conforme con los datos consignados.</Consent>
              <Consent idPrefix={ID} name="privacidad" required control={control}>He leído y acepto la <Link href="/politica-de-privacidad" target="_blank" className="form-legal-link">Política de privacidad</Link>.</Consent>
              <Consent idPrefix={ID} name="transferencia" required requiredMessage={CHECK_MESSAGE} control={control}>He leído y acepto la transferencia de mis datos a las empresas del grupo empresarial Armando Paredes.</Consent>
            </div>
          </div>
          <StepButtons>
            <button type="button" onClick={() => goTo(1)} disabled={sending} className={secondaryButton}>Anterior</button>
            <button type="submit" disabled={sending || !isClient} className={primaryButton}>{sending ? "Registrando..." : "Registrar"}</button>
          </StepButtons>
          {(submitError || (status && !status.ok)) && (
            <p role="status" className="m-0 mt-16 text-center text-14 text-red-700">{submitError || status?.message}</p>
          )}
        </div>
      </form>

      <div className="mt-40 flex flex-col gap-12 font-poppins text-12 leading-[1.6] text-near-black md:mt-56 md:text-14">
        <p className="m-0">(i) El tratamiento de sus datos personales en este portal tiene como finalidad atender y gestionar adecuadamente su reclamo o queja, de acuerdo con las disposiciones legales vigentes sobre la materia.</p>
        <p className="m-0">(ii) {PLAZO}</p>
        <p className="m-0">(iii) Te enviaremos la constancia de tu reclamo o queja por correo electrónico.</p>
        <p className="m-0">En cumplimiento de lo señalado en la Ley N° 29571 (Código de Protección y Defensa del Consumidor), así como en el Decreto Supremo N° 011-2011-PCM y sus modificatorias, este establecimiento cuenta con un Libro de Reclamaciones Virtual a su disposición.</p>
      </div>
    </div>
  );
}

const primaryButton = "flex h-50 w-full items-center justify-center bg-slate px-24 font-gotham text-16 font-bold uppercase text-white transition-opacity hover:opacity-90 disabled:opacity-50 md:w-auto md:min-w-240 md:text-18";
const secondaryButton = "flex h-50 w-full items-center justify-center border border-slate bg-white px-24 font-gotham text-16 font-bold uppercase text-slate transition-colors hover:bg-slate hover:text-white disabled:opacity-50 md:w-auto md:min-w-240 md:text-18";

function StepButtons({ children }: { children: ReactNode }) {
  return <div className="mt-32 flex flex-col-reverse gap-12 md:mt-40 md:flex-row md:justify-end md:gap-20">{children}</div>;
}

type FieldProps = {
  name: FieldPath<ReclamoFormValues>;
  label: string;
  error?: RHFFieldError;
  field: UseFormRegisterReturn;
};

function TextField({ name, label, error, field, type = "text", inputMode, maxLength }: FieldProps & {
  type?: string; inputMode?: "numeric" | "decimal"; maxLength?: number;
}) {
  return (
    <div className="flex flex-col gap-6">
      <label htmlFor={`${ID}-${name}`} className={labelClass}>{label}</label>
      <div className={fieldClass} style={fieldBorder(error)}>
        <input id={`${ID}-${name}`} type={type} inputMode={inputMode} maxLength={maxLength} aria-invalid={error ? "true" : "false"} aria-describedby={`${ID}-${name}-error`} className={controlClass} {...field} />
      </div>
      <FieldError id={`${ID}-${name}-error`} error={error} />
    </div>
  );
}

function TextAreaField({ name, label, error, field }: FieldProps) {
  return (
    <div className="flex flex-col gap-6">
      <label htmlFor={`${ID}-${name}`} className={labelClass}>{label}</label>
      <div className="border border-light-gray px-10 py-8" style={fieldBorder(error)}>
        <textarea id={`${ID}-${name}`} rows={4} maxLength={1000} aria-invalid={error ? "true" : "false"} aria-describedby={`${ID}-${name}-error`} className={`${controlClass} block h-100 resize-none`} {...field} />
      </div>
      <FieldError id={`${ID}-${name}-error`} error={error} />
    </div>
  );
}

function SelectBox({ name, label, error, field, disabled, children }: FieldProps & { disabled?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <label htmlFor={`${ID}-${name}`} className={labelClass}>{label}</label>
      <div className={`${fieldClass} relative ${disabled ? "opacity-50" : ""}`} style={fieldBorder(error)}>
        <select id={`${ID}-${name}`} disabled={disabled} aria-invalid={error ? "true" : "false"} aria-describedby={`${ID}-${name}-error`} className={`${controlClass} appearance-none truncate pr-28`} {...field}>
          <option value="">Seleccionar</option>
          {children}
        </select>
        <Image unoptimized src="/images/formulario-modal/chevron-down.svg" alt="" width={18} height={18} className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2" />
      </div>
      <FieldError id={`${ID}-${name}-error`} error={error} />
    </div>
  );
}
