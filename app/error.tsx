"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-24 text-center">
      <h1 className="font-gotham text-36 font-bold text-near-black md:text-60">
        Algo salió mal
      </h1>
      <p className="mt-16 font-poppins text-16 text-warm-gray md:text-20">
        Hubo un error al cargar esta página. Inténtalo de nuevo.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-40 inline-flex h-50 items-center justify-center bg-peach px-24 font-poppins text-14 font-semibold uppercase text-white transition-opacity hover:opacity-90"
      >
        Reintentar
      </button>
    </main>
  );
}
