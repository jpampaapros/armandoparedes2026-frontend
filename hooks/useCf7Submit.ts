"use client";

import { useCallback, useState } from "react";
import { getPublicCmsUrl } from "@/lib/urls";

export type Cf7FormValues = Record<string, string | boolean | undefined>;

type Cf7SubmitStatus = { ok?: boolean; message?: string } | null;

export function useCf7Submit(
  formId: string | number,
  options: { raw?: boolean } = {},
) {
  const id = String(formId);
  const { raw = false } = options;
  const [status, setStatus] = useState<Cf7SubmitStatus>(null);
  const [isPending, setIsPending] = useState(false);

  const submit = useCallback(
    async (values: Cf7FormValues) => {
      setIsPending(true);
      setStatus(null);

      try {
        const cmsUrl = getPublicCmsUrl();
        const forward = new FormData();
        forward.append("_wpcf7_unit_tag", `wpcf7-f${id}-p1-o1`);

        if (raw) {
          Object.entries(values).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            if (typeof value === "boolean") {
              forward.append(key, value ? "1" : "");
            } else {
              forward.append(key, String(value));
            }
          });
        } else {
          forward.append("your-name", String(values.nombre ?? ""));
          forward.append("your-email", String(values.email ?? ""));
          if (values.telefono !== undefined) {
            forward.append("your-tel", String(values.telefono));
          }
          forward.append("your-message", String(values.mensaje ?? ""));
          if (values.asunto !== undefined) {
            forward.append("your-subject", String(values.asunto));
          }
        }

        const res = await fetch(
          `${cmsUrl}/wp-json/contact-form-7/v1/contact-forms/${id}/feedback`,
          { method: "POST", body: forward },
        );
        const data = (await res.json()) as { status?: string; message?: string };
        const ok = data.status === "mail_sent";
        setStatus({
          ok,
          message: data.message || "Gracias por contactarnos",
        });
        return ok;
      } catch {
        setStatus({ ok: false, message: "Error de conexión. Inténtalo de nuevo." });
        return false;
      } finally {
        setIsPending(false);
      }
    },
    [id, raw],
  );

  return { submit, status, isPending };
}
