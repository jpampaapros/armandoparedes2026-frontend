"use client";

import { useRouter } from "next/navigation";
import { BackArrow } from "@/components/icons/BackArrow";

type BackButtonProps = {
  fallbackHref: string;
  children?: React.ReactNode;
};

export function BackButton({ fallbackHref, children }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
        } else {
          router.push(fallbackHref);
        }
      }}
      className="inline-flex items-center gap-8 border-0 bg-transparent p-0 font-poppins text-18 font-normal text-white transition-opacity hover:opacity-80"
    >
      <BackArrow className="h-24 w-24" />
      {children}
    </button>
  );
}
