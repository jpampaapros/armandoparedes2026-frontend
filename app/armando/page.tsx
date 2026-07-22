import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createWordPressRestClient } from "@/lib/wordpress-rest-client";
import { stripHtml } from "@/lib/utils";
import { ArmandoSectionMapper } from "@/components/sections/ArmandoSectionMapper";
import type { ArmandoSection } from "@/lib/types";

type WordPressArmandoPage = {
  id: number;
  title: { rendered: string };
  acf_full: {
    sections?: ArmandoSection[];
  };
};

const DEFAULT_SECTIONS: ArmandoSection[] = [
  {
    acf_fc_layout: "banner",
    titulo: "Armando / el Arquitecto",
    descripcion:
      "Más de 18 años creando espacios donde las personas quieren vivir.",
  },
  {
    acf_fc_layout: "somos_uno",
    frase: "“Somos uno con quienes sueñan en grande”",
    titulo: "Una visión humana",
    texto:
      "Cada proyecto nace de escuchar, imaginar y construir junto a quienes habitarán el espacio.",
  },
  {
    acf_fc_layout: "mi_vida",
    titulo: "Mi vida <strong>en números</strong>",
    indicadores: [
      { numero: "25", texto: "años de experiencia" },
      { numero: "40+", texto: "proyectos entregados" },
      { numero: "3", texto: "ciudades" },
      { numero: "+600", texto: "familias felices" },
    ],
  },
  {
    acf_fc_layout: "cada_proyecto",
    titulo:
      "Cada proyecto está influenciado por lo que <strong>vemos</strong>, <strong>sentimos</strong> y <strong>vivimos</strong>",
  },
  {
    acf_fc_layout: "encuentra_tu_armando",
    titulo: "Encuentra tu Armando",
    texto: "Descubre el espacio que se ajusta a tu historia.",
    boton: {
      title: "Ver proyectos",
      url: "/proyectos-en-venta",
      target: "",
    },
  },
];

async function getArmandoPage(): Promise<WordPressArmandoPage | null> {
  try {
    const wordpress = createWordPressRestClient({
      cache: { revalidate: 3600, tags: ["wordpress-content"] },
    });
    return await wordpress.request<WordPressArmandoPage>(
      "/wp-json/wp/v2/pages/12?_fields=acf_full",
    );
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getArmandoPage();
  const title = stripHtml(page?.title?.rendered);

  return {
    title: title ? `${title} | Armando Paredes` : "Armando | Armando Paredes",
  };
}

export default async function ArmandoPage() {
  const page = await getArmandoPage();

  if (!page) {
    notFound();
  }

  const sections =
    page.acf_full?.sections && page.acf_full.sections.length > 0
      ? page.acf_full.sections
      : DEFAULT_SECTIONS;

  return (
    <main className="w-full max-w-none p-0">
      <ArmandoSectionMapper sections={sections} />
    </main>
  );
}
