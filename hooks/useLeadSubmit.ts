"use client";

import { useCallback, useState } from "react";
import {
  LEAD_ENDPOINT,
  buildLeadPayload,
  createEventId,
  notifyCf7,
  type LeadContext,
  type LeadFormValues,
} from "@/lib/lead";
import { getPublicCmsUrl } from "@/lib/urls";

export type { LeadFormValues } from "@/lib/lead";

export type LeadStatus = { ok: boolean; message: string } | null;

const MENSAJE_OK = "¡Gracias! Un asesor se comunicará contigo pronto.";
const MENSAJE_ERROR = "No se pudo enviar el formulario. Inténtalo de nuevo.";

type LeadResponse = {
  success?: boolean;
  client_id?: string | number | null;
  event_id?: string;
};

/** Dispara el evento del pixel con el mismo id que usó el servidor. */
function trackMetaLead(eventId: string): void {
  if (typeof window === "undefined") return;

  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;

  if (typeof fbq === "function") {
    fbq("track", "Lead", {}, { eventID: eventId });
  }
}

function mensajeDeError(httpStatus: number): string {
  if (httpStatus === 400) {
    return "Revisa tus datos: el correo, el nombre o el celular no son válidos.";
  }

  if (httpStatus === 403) {
    return "Este formulario no está autorizado desde esta dirección.";
  }

  return MENSAJE_ERROR;
}

/**
 * Envía el lead al endpoint de Sperant del tema de WordPress.
 *
 * Sustituye a useCf7Submit en los formularios comerciales: además de registrar
 * al cliente en el CRM, el endpoint dispara el evento Lead de Meta desde el
 * servidor y, si está configurado, el webhook externo.
 */
export function useLeadSubmit(context: LeadContext = {}) {
  const [status, setStatus] = useState<LeadStatus>(null);
  const [isPending, setIsPending] = useState(false);
  const { projectId, formSource, cf7FormId } = context;

  const submit = useCallback(
    async (values: LeadFormValues) => {
      setIsPending(true);
      setStatus(null);

      const eventId = createEventId();

      // El aviso por correo sale en paralelo; no condiciona el resultado.
      if (cf7FormId !== undefined && `${cf7FormId}`.trim() !== "") {
        void notifyCf7(cf7FormId, values);
      }

      try {
        const response = await fetch(`${getPublicCmsUrl()}${LEAD_ENDPOINT}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildLeadPayload(values, { projectId, formSource }, eventId)),
        });

        const data = (await response.json().catch(() => null)) as LeadResponse | null;
        const ok = response.ok && data?.success === true;

        if (ok) {
          trackMetaLead(data?.event_id || eventId);
        }

        setStatus({ ok, message: ok ? MENSAJE_OK : mensajeDeError(response.status) });

        return ok;
      } catch {
        setStatus({ ok: false, message: "Error de conexión. Inténtalo de nuevo." });
        return false;
      } finally {
        setIsPending(false);
      }
    },
    [projectId, formSource, cf7FormId],
  );

  return { submit, status, isPending };
}
