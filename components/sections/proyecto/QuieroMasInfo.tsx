import { ProyectoLeadForm } from "@/components/forms/ProyectoLeadForm";
import { Blog } from "@/components/sections/Blog";
import type { LeadContext } from "@/lib/lead";
import type { ACFImage, ACFLink } from "@/lib/types";

type QuieroMasInfoProps = {
  titulo?: string;
  formulario_id?: string | number;
  imagen_fondo?: ACFImage;
  blog_titulo?: string;
  blog_boton?: ACFLink;
  lead?: LeadContext;
  presupuestos?: string[];
};

export function QuieroMasInfo({
  titulo,
  formulario_id,
  imagen_fondo,
  blog_titulo,
  blog_boton,
  lead,
  presupuestos,
}: QuieroMasInfoProps) {
  return (
    <div data-layout="quiero_mas_info">
      <ProyectoLeadForm
        titulo={titulo}
        formulario_id={formulario_id}
        imagen_fondo={imagen_fondo}
        lead={lead}
        presupuestos={presupuestos}
      />
      <Blog titulo={blog_titulo} boton={blog_boton} variant="light" />
    </div>
  );
}
