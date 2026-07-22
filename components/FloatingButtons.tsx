"use client";

import { useState } from "react";
import Image from "next/image";
import { ModalLeadForm } from "@/components/forms/ModalLeadForm";

type FloatingButtonsProps = {
  whatsapp?: string;
  formId?: string | number;
};

function buildWhatsAppUrl(value: string): string {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const digits = trimmed.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function FloatingButtons({ whatsapp, formId }: FloatingButtonsProps) {
  const [formOpen, setFormOpen] = useState(false);

  const hasWhatsApp = Boolean(whatsapp?.trim());
  const hasForm = formId !== undefined;

  return (
    <>
      <div
        className="fixed bottom-24 right-24 z-40 flex flex-col md:bottom-auto md:right-0 md:top-334"
        aria-label="Acciones rápidas"
      >
        {hasWhatsApp && (
          <a
            href={buildWhatsAppUrl(whatsapp!)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-79 w-77 items-center justify-center rounded-l-7 bg-whatsapp transition-opacity hover:opacity-90"
            aria-label="Contactar por WhatsApp"
          >
            <Image
              unoptimized
              src="/images/floating-buttons/whatsapp-icon.svg"
              alt="WhatsApp"
              width={40}
              height={40}
              className="h-40 w-40"
            />
          </a>
        )}
        {hasForm && (
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="flex h-78 w-77 items-center justify-center rounded-l-7 bg-near-black transition-opacity hover:opacity-90"
            aria-haspopup="dialog"
            aria-label="Abrir formulario de contacto"
          >
            <Image
              unoptimized
              src="/images/floating-buttons/form-icon.svg"
              alt="Formulario"
              width={40}
              height={40}
              className="h-40 w-40"
            />
          </button>
        )}
      </div>

      <ModalLeadForm
        formId={formId ?? "4"}
        open={formOpen}
        onOpenChange={setFormOpen}
      />
    </>
  );
}
