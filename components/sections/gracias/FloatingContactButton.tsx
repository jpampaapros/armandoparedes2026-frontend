"use client";

import { useState } from "react";
import { ModalLeadForm } from "@/components/forms/ModalLeadForm";

type FloatingContactButtonProps = {
  formId?: string | number;
};

export function FloatingContactButton({ formId = 4 }: FloatingContactButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-16 left-1/2 z-50 flex h-54 w-382 -translate-x-1/2 items-center justify-center border border-white bg-black font-gotham text-18 font-bold uppercase tracking-[0.04em] text-white transition-opacity hover:opacity-90 md:hidden"
        aria-haspopup="dialog"
      >
        Contacto
      </button>
      <ModalLeadForm formId={formId} open={open} onOpenChange={setOpen} />
    </>
  );
}
