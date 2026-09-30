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
  if (!whatsapp?.trim()) return null;

  return (
    <div
      className="floating-whatsapp fixed bottom-10 right-10 z-40 flex flex-col"
      aria-label="Acciones rápidas"
    >
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
    </div>
  );
}
