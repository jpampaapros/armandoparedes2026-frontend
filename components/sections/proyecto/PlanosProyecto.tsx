"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import Viewer from "viewerjs";
import { SmartLink } from "@/components/SmartLink";
import "viewerjs/dist/viewer.css";
import { useCf7Submit, type Cf7FormValues } from "@/hooks/useCf7Submit";
import type { ACFLink, ProjectDormitorio } from "@/lib/types";
import { toArray } from "@/lib/utils";

type PlanosProyectoProps = {
  titulo?: string;
  dormitorios?: ProjectDormitorio[];
  boton_mas_planos?: ACFLink;
  texto_adicional?: string;
  leyenda?: { etiqueta?: string; valor?: string }[];
  color_botones?: string;
  color_boton_quiero_este_depa?: string;
  color_titulo?: string;
  ocultar_en_movil?: boolean;
};

function abbreviateDormitorios(value?: string) {
  return value?.replace(/\bdormitorios?\b/gi, "dorm.");
}

const ETIQUETAS_VISOR: Record<string, string> = {
  "viewer-zoom-in": "Acercar",
  "viewer-zoom-out": "Alejar",
  "viewer-one-to-one": "Tamaño real",
  "viewer-reset": "Restablecer",
  "viewer-button": "Cerrar",
};

/** Abre el plano a tamaño real para poder acercarlo, alejarlo y moverlo. */
function abrirPlano(url: string, alt: string, visorActual: { current: Viewer | null }) {
  visorActual.current?.destroy();
  const imagen = document.createElement("img");
  imagen.src = url;
  imagen.alt = alt;
  const visor = new Viewer(imagen, {
    navbar: false,
    title: false,
    toolbar: {
      zoomIn: 1,
      zoomOut: 1,
      oneToOne: 1,
      reset: 1,
      prev: 0,
      play: 0,
      next: 0,
      rotateLeft: 0,
      rotateRight: 0,
      flipHorizontal: 0,
      flipVertical: 0,
    },
    shown() {
      const raiz = document.querySelector(".viewer-container");
      if (!raiz) return;
      for (const [clase, etiqueta] of Object.entries(ETIQUETAS_VISOR)) {
        const control = raiz.querySelector(`.${clase}`);
        control?.setAttribute("aria-label", etiqueta);
        control?.removeAttribute("aria-hidden");
      }
    },
    hidden() {
      visor.destroy();
      if (visorActual.current === visor) visorActual.current = null;
    },
  });
  visorActual.current = visor;
  visor.show();
}

export function PlanosProyecto({
  titulo,
  dormitorios = [],
  boton_mas_planos,
  texto_adicional,
  color_botones,
  color_boton_quiero_este_depa,
  color_titulo,
  ocultar_en_movil = false,
}: PlanosProyectoProps) {
  const [activeDorm, setActiveDorm] = useState(0);
  const [activeTipo, setActiveTipo] = useState(0);
  const visorRef = useRef<Viewer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipologia, setModalTipologia] = useState("");
  const { register, handleSubmit, reset } = useForm<Cf7FormValues>();
  const { submit, isPending, status } = useCf7Submit("4");

  const dormitorio = dormitorios[activeDorm];
  const tipologias = toArray(dormitorio?.tipologias);
  const tipologia = tipologias[activeTipo] ?? tipologias[0];
  const buttonColor = color_botones?.trim() || "#dda783";

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("keydown", onEsc);
      visorRef.current?.destroy();
    };
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
    <section data-layout="planos" className={`w-full bg-white ${ocultar_en_movil ? "hidden md:block" : ""}`}>
      <div className="mx-auto max-w-1440 px-24 py-52 md:px-80 md:py-90">
        {titulo && (
          <h2 className="mb-30 mt-0 ml-12 md:ml-0 text-left md:text-center font-gotham text-30 font-semibold md:font-bold md:mb-50 md:text-60"
          style={{
            color: color_titulo?.trim() || "#748ca4",
          }}
          >
            {titulo}
          </h2>
        )}

        <div className={`flex flex-wrap justify-center gap-15 ${titulo ? "" : "mt-30 md:mt-50"} ${tipologias.length > 1 ? "" : "mb-40 md:mb-60"}`}>
          {dormitorios.map((d, i) => {
            const active = i === activeDorm;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setActiveDorm(i);
                  setActiveTipo(0);
                }}
                className={`min-w-120 h-50 border px-20 py-12 font-gotham text-14 transition-colors md:h-50 md:w-212 md:p-10 md:text-18 ${
                  active ? "font-bold text-white" : "font-normal text-near-black"
                }`}
                style={{
                  borderColor: buttonColor,
                  backgroundColor: active ? buttonColor : "transparent",
                }}
              >
                <span className="md:hidden">{abbreviateDormitorios(d.numero)}</span>
                <span className="hidden md:inline">{d.numero}</span>
              </button>
            );
          })}
        </div>

        {tipologias.length > 1 && (
          <div className="mb-40 mt-16 flex flex-wrap justify-center gap-15 px-15 md:mx-auto md:mb-60 md:mt-30 md:w-682 md:max-w-full md:px-0">
            {tipologias.map((t, i) => {
              const active = i === activeTipo;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveTipo(i)}
                  className={`min-w-0 flex-1 border px-20 py-10 font-gotham text-14 transition-colors cursor-pointer h-50 md:p-10 md:text-18 ${
                    active ? "font-normal text-white" : "font-normal text-near-black"
                  }`}
                  style={{
                    borderColor: buttonColor,
                    backgroundColor: active ? buttonColor : "transparent",
                  }}
                >
                  {t.titulo || t.nombre}
                </button>
              );
            })}
          </div>
        )}

        {tipologia && (
          <div className="grid grid-cols-1 gap-24 md:grid-cols-[minmax(0,1fr)_calc(382*var(--fx))] md:gap-109">
            <div className="relative order-2 md:order-1">
              {tipologia.imagen?.url ? (
                <button
                  type="button"
                  aria-label="Ampliar plano"
                  onClick={() =>
                    abrirPlano(
                      tipologia.imagen?.url || "",
                      tipologia.imagen?.alt || tipologia.titulo || tipologia.nombre || "Plano",
                      visorRef,
                    )
                  }
                  className="relative block h-304 w-full cursor-zoom-in border-0 bg-transparent p-0 md:h-470"
                >
                  <Image
                    src={tipologia.imagen.url}
                    alt={tipologia.imagen.alt || tipologia.titulo || ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                  />
                </button>
              ) : (
                <div className="relative h-304 w-full bg-neutral-100 md:h-470" />
              )}
            </div>

            <div className="contents md:order-2 md:mx-auto md:flex md:w-382 md:max-w-full md:flex-col md:justify-center md:gap-18">
              <div className="order-1 mx-auto flex w-382 max-w-full flex-col gap-18 md:contents">
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
              </div>

              <div className="order-3 mx-auto flex w-382 max-w-full flex-col gap-16 md:mt-26">
                <button
                  type="button"
                  onClick={() => openModal(tipologia.nombre)}
                  className="inline-flex h-50 w-full cursor-pointer items-center justify-center bg-slate px-20 font-gotham text-14 font-bold uppercase text-white transition-opacity hover:opacity-90 md:text-18"
                  style={{ backgroundColor: color_boton_quiero_este_depa?.trim() || undefined }}
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
