import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-24 text-center">
      <h1 className="font-gotham text-60 font-bold text-near-black md:text-100">
        404
      </h1>
      <p className="mt-16 font-poppins text-18 text-warm-gray md:text-24">
        Página no encontrada
      </p>
      <Link
        href="/"
        className="mt-40 inline-flex h-50 items-center justify-center bg-peach px-24 font-poppins text-14 font-semibold uppercase text-white transition-opacity hover:opacity-90"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
