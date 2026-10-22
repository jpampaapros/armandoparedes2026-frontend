/**
 * Datos del Libro de Reclamaciones: proyectos con su razón social, ubigeo y correlativo.
 * Los proyectos y el ubigeo vienen del formulario del sitio anterior; el correo de cada
 * proyecto se envía a CF7 para que derive el reclamo al área de postventa correspondiente.
 */

import ubigeo from "@/lib/ubigeo-peru.json";
import { getPublicFormsUrl } from "@/lib/urls";

/** Formulario de Contact Form 7 del libro (`wp-admin/admin.php?page=wpcf7&post=4446`). */
export const LIBRO_RECLAMACIONES_FORM_ID = 4446;

export type UbigeoItem = { id: string; nombre: string };

export const departamentos: UbigeoItem[] = ubigeo.departamentos;
const provincias: Record<string, UbigeoItem[]> = ubigeo.provincias;
const distritos: Record<string, UbigeoItem[]> = ubigeo.distritos;

export const provinciasDe = (departamentoId: string) => provincias[departamentoId] ?? [];
export const distritosDe = (provinciaId: string) => distritos[provinciaId] ?? [];

export type ProyectoReclamo = {
  key: string;
  nombre: string;
  /** Sufijo del código de reclamo (p. ej. `001-2026-Libertad`). */
  codigo: string;
  razonSocial: string;
  ruc: string;
  correo: string;
};

export const proyectosReclamo: ProyectoReclamo[] = [
  { key: "saenz-pena-1", nombre: "Sáenz Peña 1", codigo: "SaenzPena1", razonSocial: "HEXAGRAMA 1 SAC", ruc: "20511107734", correo: "" },
  { key: "vanderghen", nombre: "Vanderghen", codigo: "Vanderghen", razonSocial: "HEXAGRAMA 1 SAC", ruc: "20511107734", correo: "postventa@armandoparedes.com" },
  { key: "basadre", nombre: "Basadre", codigo: "Basadre", razonSocial: "HEXAGRAMA 1 SAC", ruc: "20511107734", correo: "postventa@armandoparedes.com" },
  { key: "nogales", nombre: "Nogales", codigo: "Nogales", razonSocial: "HEXAGRAMA 1 SAC", ruc: "20511107734", correo: "postventa@armandoparedes.com" },
  { key: "el-sol", nombre: "El Sol", codigo: "ElSol", razonSocial: "Faro Capital Fondo de Inversión Inmobiliario I", ruc: "20553014418", correo: "postventa@armandoparedes.com" },
  { key: "tamayo", nombre: "Tamayo", codigo: "Tamayo", razonSocial: "INVERSIONES 4X SAC", ruc: "20600594207", correo: "postventa@armandoparedes.com" },
  { key: "marca-quispe", nombre: "Marca Quispe", codigo: "MarcaQuispe", razonSocial: "INVERSIONES 4X SAC", ruc: "20600594207", correo: "postventa@armandoparedes.com" },
  { key: "saenz-pena-212", nombre: "Sáenz Peña 212", codigo: "SaenzPena212", razonSocial: "HEXAGRAMA 17 SAC", ruc: "20604207844", correo: "postventa@armandoparedes.com" },
  { key: "machaypuito", nombre: "Machaypuito", codigo: "Machaypuito", razonSocial: "INVERSIONES GP3 SAC", ruc: "20604500797", correo: "postventa@armandoparedes.com" },
  { key: "ugarte-y-moscoso", nombre: "Ugarte y Moscoso", codigo: "UgarteyMoscoso", razonSocial: "PROMO INMUEBLE PERU SAC", ruc: "20552986025", correo: "postventa@armandoparedes.com" },
  { key: "pasaje-laureles", nombre: "Pasaje Laureles", codigo: "PasajeLaureles", razonSocial: "INVERSIONES GP5 SAC", ruc: "20605493042", correo: "postventa@armandoparedes.com" },
  { key: "dos-de-mayo", nombre: "Dos de Mayo", codigo: "DosDeMayo", razonSocial: "INVERSIONES GP5 SAC", ruc: "20605493042", correo: "postventa@armandoparedes.com" },
  { key: "pasaje-los-pinos", nombre: "Pasaje Los Pinos", codigo: "PasajeLosPinos", razonSocial: "RENTANDO PAREDES SAC", ruc: "20604072787", correo: "postventa.lau@armandoparedes.com" },
  { key: "toribio-polo", nombre: "Toribio Polo", codigo: "ToribioPolo", razonSocial: "INVERSIONES GP4 SAC", ruc: "20604774447", correo: "postventa.tor@armandoparedes.com" },
  { key: "parque-incario", nombre: "Parque Incario", codigo: "ParqueIncario", razonSocial: "INVERSIONES GP8 SAC", ruc: "20607734225", correo: "postventa.inc@armandoparedes.com" },
  { key: "libertad", nombre: "Libertad", codigo: "Libertad", razonSocial: "INVERSIONES GP7 SAC", ruc: "20605741518", correo: "postventa.lau@armandoparedes.com" },
  { key: "pasaje-ugarte-y-moscoso", nombre: "Pasaje Ugarte y Moscoso", codigo: "PasajeUgarteyMoscoso", razonSocial: "INVERSIONES GP6 SAC", ruc: "20605567712", correo: "postventa.pum@armandoparedes.com" },
  { key: "pasaje-santa-cruz", nombre: "Pasaje Santa Cruz", codigo: "PasajeSantaCruz", razonSocial: "INVERSIONES GP11 SAC", ruc: "20613717642", correo: "" },
  { key: "meliton-porras", nombre: "Melitón Porras", codigo: "MelitonPorras", razonSocial: "INVERSIONES GP12 SAC", ruc: "20613718118", correo: "" },
];

export const proyectoLabel = (p: ProyectoReclamo) => `${p.nombre} - ${p.razonSocial} - RUC ${p.ruc}`;

/**
 * Siguiente correlativo con tres dígitos (`001`). WordPress lo incrementa recién cuando
 * CF7 envía el correo, así que se vuelve a pedir al registrar para no repetir números.
 */
export async function fetchSiguienteCorrelativo(): Promise<string> {
  const res = await fetch(`${getPublicFormsUrl()}/wp-json/armando-paredes/v1/libro-reclamaciones/counter`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Correlativo no disponible (${res.status})`);
  const data = (await res.json()) as { next?: string };
  if (!data.next) throw new Error("Correlativo no disponible");
  return data.next;
}

/**
 * Genera la constancia del reclamo (plugin `pdf-libro` de WordPress) y devuelve su URL.
 * Recibe los mismos campos que el correo de CF7, sin el adjunto ni el correo del proyecto.
 */
export async function generarConstanciaPdf(datos: Record<string, string>): Promise<string | null> {
  const res = await fetch(`${getPublicFormsUrl()}/wp-json/pdf-libro/v1/generar-pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  if (!res.ok) throw new Error(`Constancia no disponible (${res.status})`);
  const data = (await res.json()) as { url_pdf?: string };
  return data.url_pdf || null;
}

/** Mismas reglas que el campo `ArchivosAdjuntos` del formulario de CF7: un archivo PDF, PNG o JPG de hasta 4MB. */
export const ARCHIVO_EXTENSIONES = ["pdf", "png", "jpg", "jpeg"];
const ARCHIVO_TIPOS = ["application/pdf", "image/png", "image/jpeg", "image/pjpeg"];
export const ARCHIVO_MAX_BYTES = 4 * 1024 * 1024;

/** Devuelve el mensaje de error del adjunto o `true` si es válido (formato de `validate`). */
export function validarAdjunto(file?: File): true | string {
  if (!file) return true;
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ARCHIVO_EXTENSIONES.includes(extension)) return "El archivo debe ser PDF, PNG o JPG.";
  if (file.type && !ARCHIVO_TIPOS.includes(file.type)) return "El archivo debe ser PDF, PNG o JPG.";
  if (file.size > ARCHIVO_MAX_BYTES) return "El archivo no debe superar 4MB.";
  return true;
}
