"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { SmartLink } from "@/components/SmartLink";
import { useCf7Submit, type Cf7FormValues } from "@/hooks/useCf7Submit";
import type { ACFLink, ProjectDormitorio } from "@/lib/types";

type PlanosProyectoProps = {
  titulo?: string;
  dormitorios?: ProjectDormitorio[];
  boton_mas_planos?: ACFLink;
  texto_adicional?: string;
  leyenda?: { etiqueta?: string; valor?: string }[];
};

function abbreviateDormitorios(value?: string) {
  return value?.replace(/\bdormitorios?\b/gi, "dorm.");
}

export function PlanosProyecto({
  titulo,
  dormitorios = [],
  boton_mas_planos,
  texto_adicional,
}: PlanosProyectoProps) {
  const [activeDorm, setActiveDorm] = useState(0);
  const [activeTipo, setActiveTipo] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipologia, setModalTipologia] = useState("");
  const { register, handleSubmit, reset } = useForm<Cf7FormValues>();
  const { submit, isPending, status } = useCf7Submit("4");

  const dormitorio = dormitorios[activeDorm];
  const tipologias = dormitorio?.tipologias ?? [];
  const tipologia = tipologias[activeTipo] ?? tipologias[0];

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  useEffect(() => {
    if (modalOpen) {
      reset({
        nombre: "",
        email: "",
        asunto: `Interés en ${modalTipologia}`,
        mensaje: `Me interesa el departamento ${modalTipologia}`,
      });
    }
  }, [modalOpen, modalTipologia, reset]);

  const openModal = (nombre?: string) => {
    setModalTipologia(nombre || "");
    setModalOpen(true);
  };

  const onSubmit = async (values: Cf7FormValues) => {
    const ok = await submit(values);
    if (ok) reset();
  };

  return (
    <section data-layout="planos" className="w-full bg-white">
      <div className="mx-auto max-w-1440 px-0 py-60 md:px-80 md:py-100">
        {titulo && (
          <h2 className="mb-30 mt-0 text-center font-gotham text-36 font-bold text-slate md:mb-50 md:text-60">
            {titulo}
          </h2>
        )}

        <div className={`flex flex-wrap justify-center gap-12 ${titulo ? "" : "mt-30 md:mt-50"} ${tipologias.length > 1 ? "" : "mb-40 md:mb-60"}`}>
          {dormitorios.map((d, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setActiveDorm(i);
              setActiveTipo(0);
            }}
            className={`min-w-120 border px-20 py-12 font-gotham text-14 font-bold transition-colors md:text-18 ${
              i === activeDorm
                ? "border-peach bg-peach text-white"
                : "border-peach text-near-black hover:bg-peach/10"
            }`}
          >
              <span className="md:hidden">{abbreviateDormitorios(d.numero)}</span>
              <span className="hidden md:inline">{d.numero}</span>
            </button>
          ))}
        </div>

        {tipologias.length > 1 && (
          <div className="mb-40 mt-16 flex flex-wrap justify-center gap-[calc(15*var(--fx))] px-[calc(15*var(--fx))] md:mb-60 md:gap-12 md:px-0">
            {tipologias.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveTipo(i)}
                className={`min-w-0 flex-1 border px-20 py-10 font-gotham text-14 font-bold transition-colors md:flex-none md:text-18 ${
                  i === activeTipo
                    ? "border-peach bg-peach text-white"
                    : "border-peach text-near-black hover:bg-peach/10"
                }`}
              >
                {t.titulo || t.nombre}
              </button>
            ))}
          </div>
        )}

        {tipologia && (
          <div className="grid grid-cols-1 gap-24 md:grid-cols-[minmax(0,1fr)_calc(382*var(--fx))] md:gap-[calc(109*var(--fx))]">
            <div className="relative">
              <div className="relative h-304 w-full md:h-470">
                {tipologia.imagen?.url ? (
                  <Image
                    src={tipologia.imagen.url}
                    alt={tipologia.imagen.alt || tipologia.titulo || ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                  />
                ) : (
                  <div className="h-full w-full bg-neutral-100" />
                )}
              </div>

            </div>

            <div className="mx-auto flex w-[calc(382*var(--fx))] max-w-full flex-col justify-center gap-18">
              <h3 className="font-gotham text-40 font-bold text-near-black md:text-60">
                {tipologia.nombre}
              </h3>
              <p className="font-gotham text-24 font-bold text-near-black md:text-32">
                <span className="md:hidden">{abbreviateDormitorios(dormitorio?.numero)}</span>
                <span className="hidden md:inline">{dormitorio?.numero}</span>
              </p>

              <hr className="h-px w-full border-0 bg-near-black m-0" />

              <div className="flex flex-col gap-9">
                {tipologia.area_techada && (
                  <span className="font-poppins text-16 text-near-black md:text-18">
                    Área techada: {tipologia.area_techada}
                  </span>
                )}
                {tipologia.area_libre && (
                  <span className="font-poppins text-16 text-near-black md:text-18">
                    Área libre: {tipologia.area_libre}
                  </span>
                )}
                {tipologia.area_total && (
                  <span className="font-poppins text-16 text-near-black md:text-18">
                    Área total: {tipologia.area_total}
                  </span>
                )}
                {tipologia.descripcion && (
                  <div
                    className="font-poppins text-16 text-near-black md:text-18 [&_p]:m-0"
                    dangerouslySetInnerHTML={{ __html: tipologia.descripcion }}
                  />
                )}
              </div>

              <div className="mt-[calc(26*var(--fx))] flex flex-col gap-16">
                <button
                  type="button"
                  onClick={() => openModal(tipologia.nombre)}
                  className="inline-flex h-50 w-full items-center justify-center bg-slate px-20 font-gotham text-14 font-bold uppercase text-white transition-colors hover:bg-slate/90 md:text-18"
                >
                  QUIERO ESTE DEPA
                </button>
                {boton_mas_planos?.url && boton_mas_planos.url !== "#" && (
                <SmartLink
                  link={boton_mas_planos}
                  className="inline-flex h-50 w-full items-center justify-center border border-slate px-20 font-gotham text-14 font-bold uppercase text-slate transition-colors hover:bg-slate hover:text-white md:text-18"
                >
                  {boton_mas_planos.title || "MÁS PLANOS"}
                </SmartLink>
                )}
              </div>
            </div>
          </div>
        )}

        {texto_adicional && (
          <div
            className="mt-24 text-center font-poppins text-12 text-near-black md:text-14 [&_p]:m-0"
            dangerouslySetInnerHTML={{ __html: texto_adicional }}
          />
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-24"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-520 bg-white p-24 md:p-40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-24 flex items-center justify-between">
              <h3 className="font-gotham text-24 font-bold text-near-black md:text-32">
                Quiero este departamento
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="font-poppins text-16 text-near-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-16">
              <input
                type="hidden"
                {...register("asunto")}
              />
              <input
                type="text"
                placeholder="Nombre"
                required
                className="w-full border border-light-gray px-16 py-12 font-poppins text-14 text-near-black outline-none focus:border-peach"
                {...register("nombre", { required: true })}
              />
              <input
                type="email"
                placeholder="Correo"
                required
                className="w-full border border-light-gray px-16 py-12 font-poppins text-14 text-near-black outline-none focus:border-peach"
                {...register("email", { required: true })}
              />
              <textarea
                placeholder="Mensaje"
                rows={4}
                className="w-full border border-light-gray px-16 py-12 font-poppins text-14 text-near-black outline-none focus:border-peach"
                {...register("mensaje")}
              />
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-50 items-center justify-center bg-peach px-24 font-poppins text-14 font-semibold uppercase text-white disabled:opacity-50 md:text-16"
              >
                {isPending ? "Enviando..." : "Enviar"}
              </button>
              {status && (
                <p
                  className={`text-center font-poppins text-14 ${
                    status.ok ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
