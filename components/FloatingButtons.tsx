"use client";

import { useState } from "react";
import Image from "next/image";

type FloatingButtonsProps = {
  whatsapp?: string;
};

function buildWhatsAppUrl(value: string): string {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const digits = trimmed.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function FloatingButtons({ whatsapp }: FloatingButtonsProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!whatsapp?.trim() || dismissed) return null;

  return (
    <div
      className="floating-whatsapp fixed bottom-10 right-10 z-40 flex flex-col"
      aria-label="Acciones rápidas"
    >
      <div className="relative">
        <a
          href={buildWhatsAppUrl(whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-70 w-70 items-center justify-center rounded-20 bg-whatsapp transition-opacity hover:opacity-90"
          aria-label="Contactar por WhatsApp"
        >
          <Image
            unoptimized
            src="/images/floating-buttons/whatsapp-icon.svg"
            alt="WhatsApp"
            width={50}
            height={50}
            className="h-50 w-50"
          />
        </a>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="absolute right-4 top-4 flex h-18 w-18 cursor-pointer appearance-none items-center justify-center border-0 bg-transparent p-0 text-white transition-opacity hover:opacity-70"
          aria-label="Cerrar botón de WhatsApp"
        >
          <svg
            viewBox="0 0 10 10"
            fill="none"
            className="h-10 w-10 shrink-0"
            aria-hidden="true"
          >
            <path
              d="M1 1l8 8M9 1l-8 8"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
