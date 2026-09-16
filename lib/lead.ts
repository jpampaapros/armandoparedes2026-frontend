/**
 * Envío de leads al CRM Sperant a través del endpoint del tema de WordPress.
 *
 * El endpoint vive en theme-nuevo-function.php y está documentado en
 * docs/sperant-cotizador.md. Este módulo traduce los campos en español de los
 * formularios al contrato de Sperant y reúne los datos de atribución.
 */

import { getPublicFormsUrl } from "@/lib/urls";

/** Ruta del endpoint, relativa a NEXT_PUBLIC_CMS_URL. */
export const LEAD_ENDPOINT = "/wp-json/armando-paredes/v1/sperant/clients";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/** Los UTM llegan en la URL de aterrizaje, pero el envío ocurre páginas después. */
const TRACKING_STORAGE_KEY = "ap_lead_tracking";

type UtmKey = (typeof UTM_KEYS)[number];

export type LeadTracking = Partial<Record<UtmKey, string>> & {
  gclid?: string;
};

/**
 * Valores tal como los entrega react-hook-form. Se mantiene el índice abierto
 * porque los formularios registran sus campos por nombre en español.
 */
export type LeadFormValues = Record<string, string | boolean | undefined>;

export type LeadContext = {
  /** ID del proyecto en Sperant. No es el ID del formulario de Contact Form 7. */
  projectId?: string | number;
  /** Etiqueta con la que el lead se identifica en Meta y en los logs. */
  formSource?: string;
  /**
   * ID del formulario de Contact Form 7. Si se indica, el lead también se envía
   * ahí para que el equipo comercial siga recibiendo el correo de aviso.
   */
  cf7FormId?: string | number;
};

function text(value: string | boolean | undefined): string {
  if (typeof value === "string") return value.trim();
  return "";
}

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";

  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`));

  return match ? decodeURIComponent(match[1]) : "";
}

function readStoredTracking(): LeadTracking {
  try {
    const raw = window.sessionStorage.getItem(TRACKING_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LeadTracking) : {};
  } catch {
    return {};
  }
}

/**
 * Lee los UTM y el gclid de la URL actual, los guarda en sessionStorage y los
 * combina con lo que ya hubiera guardado. Así el lead conserva la atribución
 * aunque el visitante navegue antes de enviar el formulario.
 */
export function captureTracking(): LeadTracking {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const fresh: LeadTracking = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) fresh[key] = value;
  }

  const gclid = params.get("gclid");
  if (gclid) fresh.gclid = gclid;

  const merged = { ...readStoredTracking(), ...fresh };

  if (Object.keys(fresh).length > 0) {
    try {
      window.sessionStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // Modo incógnito o almacenamiento bloqueado: se sigue sin persistir.
    }
  }

  return merged;
}

/**
 * Cookies que deja el pixel de Meta. Si `_fbc` no existe pero la URL trae
 * `fbclid`, se arma con el formato que espera la API de Conversiones.
 */
function readMetaCookies(): { fbc: string; fbp: string } {
  const fbp = readCookie("_fbp");
  let fbc = readCookie("_fbc");

  if (!fbc && typeof window !== "undefined") {
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  }

  return { fbc, fbp };
}

/** Identificador compartido entre el pixel del navegador y el evento del servidor. */
export function createEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Traduce los campos del formulario al contrato de Sperant.
 *
 * Los campos que Sperant no tiene como propios (distrito, presupuesto, proyecto
 * de interés y medio) viajan dentro de `extra_fields`.
 */
export function buildLeadPayload(
  values: LeadFormValues,
  context: LeadContext,
  eventId: string,
): Record<string, unknown> {
  const tracking = captureTracking();
  const { fbc, fbp } = readMetaCookies();

  const extraFields: Record<string, string> = {};
  const opcionales: Array<[string, string]> = [
    ["distrito", text(values.distrito)],
    ["presupuesto", text(values.presupuesto)],
    ["proyecto", text(values.proyecto)],
    ["medio", text(values.medio)],
  ];

  for (const [clave, valor] of opcionales) {
    if (valor) extraFields[clave] = valor;
  }

  extraFields.acepta_marketing = values.marketing ? "1" : "0";

  const payload: Record<string, unknown> = {
    ...tracking,
    email: text(values.correo),
    fname: text(values.nombres),
    lname: text(values.apellido),
    phone: text(values.celular),
    event_id: eventId,
    form_source: context.formSource || "Formulario web",
    extra_fields: extraFields,
  };

  if (typeof window !== "undefined") {
    payload.event_source_url = window.location.href;
  }

  if (typeof navigator !== "undefined") {
    payload.client_user_agent = navigator.userAgent;
  }

  if (context.projectId !== undefined && `${context.projectId}`.trim() !== "") {
    payload.project_id = context.projectId;
  }

  if (fbc) payload.fbc = fbc;
  if (fbp) payload.fbp = fbp;

  return payload;
}

/**
 * Envía una copia del lead a Contact Form 7, que sigue encargándose del correo
 * al equipo comercial. Es best-effort: su resultado no decide si el formulario
 * se considera enviado, eso lo determina Sperant.
 */
export async function notifyCf7(
  formId: string | number,
  values: LeadFormValues,
): Promise<boolean> {
  const forward = new FormData();
  forward.append("_wpcf7_unit_tag", `wpcf7-f${formId}-p1-o1`);

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) continue;
    forward.append(key, typeof value === "boolean" ? (value ? "1" : "") : String(value));
  }

  try {
    const response = await fetch(
      `${getPublicFormsUrl()}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`,
      { method: "POST", body: forward },
    );
    const data = (await response.json().catch(() => null)) as { status?: string } | null;

    return response.ok && data?.status === "mail_sent";
  } catch {
    return false;
  }
}
