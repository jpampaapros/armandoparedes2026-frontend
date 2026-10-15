"use client";

import Image from "next/image";
import { useState } from "react";
import type { ACFImage, ACFLink, ContactoSalaCard } from "@/lib/types";

type SalasDeVentasProps = {
  titulo?: string;
  cards: ContactoSalaCard[];
};

export function SalasDeVentas({ titulo = "Visítanos en nuestra sala de ventas", cards }: SalasDeVentasProps) {
  return (
    <div className="mx-auto max-w-1280">
      <h2 className="mb-0 mt-24 text-center font-gotham text-36 font-bold leading-tight text-slate md:mt-80 md:text-60">{titulo}</h2>
      {cards.length > 0 && (
        <div className="mt-24 grid grid-cols-1 gap-20 md:mt-45 md:grid-cols-2 md:gap-x-10 md:gap-y-28">
          {cards.map((card, index) => <SalaCard key={`${card.titulo}-${index}`} {...card} />)}
        </div>
      )}
    </div>
  );
}

function SalaCard({ titulo, telefono, direccion, horario, google_maps, waze, imagen }: ContactoSalaCard) {
  return (
    <article className="flex flex-col-reverse overflow-hidden border border-near-black bg-white md:min-h-382 md:flex-row">
      <div className="flex flex-col px-24 pb-24 pt-24 md:w-1/2 md:shrink-0 md:pb-30 md:pl-39 md:pr-20 md:pt-30">
        {titulo && <h3 className="m-0 font-gotham text-22 font-bold leading-[1.2] text-near-black md:max-w-234 md:text-26">{titulo}</h3>}
        <ul className="m-0 mt-20 flex list-none flex-col gap-10 p-0 font-poppins text-15 text-near-black md:mt-26 md:text-16">
          {telefono && (
            <InfoItem icon="telefono">
              <a href={`tel:${telefono.replace(/\s+/g, "")}`} className="text-inherit no-underline hover:underline">{telefono}</a>
            </InfoItem>
          )}
          {direccion && <InfoItem icon="ubicacion">{direccion}</InfoItem>}
          {horario && <InfoItem icon="horario">{horario}</InfoItem>}
        </ul>
        {(google_maps || waze) && (
          <div className="mt-24 flex flex-col gap-10 md:mt-26 md:w-213">
            <MapLink link={google_maps} label="Ir con Google Maps" className="bg-peach text-white" />
            <MapLink link={waze} label="Ir con Waze" className="border border-peach text-peach" />
          </div>
        )}
      </div>
      <div className="relative h-220 w-full md:h-auto md:w-1/2">
        {imagen && <SalaImagen imagen={imagen} alt={imagen.alt || titulo || ""} />}
        <div aria-hidden="true" className="absolute inset-0 bg-black/50" />
      </div>
    </article>
  );
}

function SalaImagen({ imagen, alt }: { imagen: ACFImage; alt: string }) {
  // Recorte de WP antes que el original: el optimizador de Next corta la descarga externa a
  // los 7s y los originales de varios MB terminan en 500 (mismo criterio que ProjectCard).
  const src = [imagen.sizes?.medium_large, imagen.sizes?.large, imagen.url].find((s): s is string => typeof s === "string" && s !== "");
  // Si aun así el optimizador falla, el navegador la descarga directo, sin ese límite.
  const [directo, setDirecto] = useState(false);
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 768px) 22vw, 100vw"
      unoptimized={directo}
      onError={() => setDirecto(true)}
      className="object-cover"
    />
  );
}

function InfoItem({ icon, children }: { icon: "telefono" | "ubicacion" | "horario"; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-17">
      <Image unoptimized src={`/images/contacto/${icon}.svg`} alt="" width={24} height={24} className="size-24 shrink-0" />
      <span className="min-w-0 pt-2">{children}</span>
    </li>
  );
}

function MapLink({ link, label, className }: { link?: ACFLink | false; label: string; className: string }) {
  if (!link || !link.url) return null;
  return (
    <a
      href={link.url}
      target={link.target || "_blank"}
      rel="noopener noreferrer"
      className={`flex h-40 items-center justify-center px-10 text-center font-gotham text-16 font-bold no-underline transition-opacity hover:opacity-85 ${className}`}
    >
      {label}
    </a>
  );
}
