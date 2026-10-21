import type { Metadata } from "next";
import { LibroReclamacionesForm } from "@/components/forms/LibroReclamacionesForm";

export const metadata: Metadata = {
  title: "Libro de reclamaciones | Armando Paredes",
  description: "Conforme a lo establecido contamos con un Libro de Reclamaciones Virtual a su disposición. Solicítelo aquí.",
};

export default function LibroDeReclamacionesPage() {
  return (
    <main className="w-full bg-white">
      <section className="mx-auto min-w-0 w-382 py-40 md:w-full md:px-355 md:py-80">
        <h1 className="m-0 w-full font-gotham-medium text-28 font-medium leading-28 text-near-black md:text-40 md:leading-40">Libro de reclamaciones</h1>
        <LibroReclamacionesForm />
      </section>
    </main>
  );
}
