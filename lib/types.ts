export type ACFLink = {
  title?: string;
  url?: string;
  target?: string;
};

export type ACFImage = {
  ID?: number;
  id?: number;
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type ACFIndicator = {
  numero?: string;
  texto?: string;
  ubicacion?: string;
};

export type HomeSection =
  | { acf_fc_layout: "banner"; titulo?: string; imagen?: ACFImage }
  | { acf_fc_layout: "espacios"; titulo?: string; subtitulo?: string; indicadores?: ACFIndicator[] }
  | { acf_fc_layout: "proyectos_venta"; titulo?: string }
  | { acf_fc_layout: "quien_es_armando"; titulo?: string; imagen_fondo?: ACFImage; descripcion?: string; boton?: ACFLink }
  | { acf_fc_layout: "proyectos_entregados"; texto?: string; subtitulo?: string; boton?: ACFLink }
  | { acf_fc_layout: "amigos_beneficios"; titulo?: string; descripcion?: string; boton?: ACFLink }
  | { acf_fc_layout: "blog"; titulo?: string; boton?: ACFLink };

export type GraciasPageSection =
  | { acf_fc_layout: "banner_gracias"; titulo?: string; descripcion?: string; imagen_de_fondo?: ACFImage }
  | { acf_fc_layout: "proyectos_venta"; titulo?: string }
  | { acf_fc_layout: "blog"; titulo?: string; boton?: ACFLink };

export type EntregadosPageSection =
  | { acf_fc_layout: "banner"; titulo?: string; descripcion?: string; imagen?: ACFImage }
  | { acf_fc_layout: "proyectos_entregados"; titulo?: string };

export type EntregadosGaleriaImagen = {
  imagen?: ACFImage;
};

export type EntregadosSingleSection =
  | { acf_fc_layout: "banner"; titulo?: string; descripcion?: string; imagen?: ACFImage }
  | { acf_fc_layout: "galeria"; imagenes?: ACFImage[] }
  | {
      acf_fc_layout: "detalle";
      imagen?: ACFImage;
      direccion?: string;
      pisos?: string;
      area?: string;
      dormitorios?: string;
      fecha?: string;
    }
  | { acf_fc_layout: "proyectos_venta"; titulo?: string };

export type ProyectosPageSection =
  | { acf_fc_layout: "banner"; titulo?: string; imagen?: ACFImage }
  | { acf_fc_layout: "proyectos_lista"; titulo?: string };

export type ProjectSlide = {
  imagen?: ACFImage;
};

export type ProjectTipologia = {
  titulo?: string;
  imagen?: ACFImage;
  nombre?: string;
  descripcion?: string;
  area_techada?: string;
  area_libre?: string;
  area_total?: string;
  boton?: ACFLink;
};

export type ProjectDormitorio = {
  numero?: string;
  tipologias?: ProjectTipologia[];
};

export type ProjectGaleriaTab = {
  titulo?: string;
  imagenes?: { imagen?: ACFImage }[];
};

export type ProjectMapaUbicacion = {
  nombre?: string;
  icono?: ACFImage;
  minutos?: string;
};

export type ProjectLeyendaItem = {
  etiqueta?: string;
  valor?: string;
};

export type ProjectSection =
  | { acf_fc_layout: "banner_proyecto"; badge?: string; distrito?: string; logo?: ACFImage; slides?: ProjectSlide[] }
  | { acf_fc_layout: "descripcion_proyecto"; titulo?: string; descripcion?: string; imagen?: ACFImage; cambiar_lado?: boolean }
  | { acf_fc_layout: "ficha_tecnica"; titulo?: string; direccion?: string; pisos?: string; area?: string; dormitorios?: string; brochure?: ACFLink }
  | { acf_fc_layout: "ficha_tecnica_detallada"; imagen?: ACFImage; titulo?: string; info?: { icono?: ACFImage; texto?: string }[] }
  | { acf_fc_layout: "video"; titulo?: string; imagen_previa?: ACFImage; url_youtube?: string }
  | { acf_fc_layout: "galeria"; titulo?: string; descripcion?: string; tabs?: ProjectGaleriaTab[] }
  | { acf_fc_layout: "planos"; titulo?: string; dormitorios?: ProjectDormitorio[]; boton_mas_planos?: ACFLink; texto_adicional?: string; leyenda?: ProjectLeyendaItem[] }
  | { acf_fc_layout: "mapa"; titulo?: string; imagen?: ACFImage; ubicaciones?: ProjectMapaUbicacion[] }
  | { acf_fc_layout: "formulario_contacto"; titulo?: string; formulario_id?: string | number }
  | { acf_fc_layout: "quiero_mas_info"; titulo?: string; formulario_id?: string | number; imagen_fondo?: ACFImage; blog_titulo?: string; blog_boton?: ACFLink }
  | { acf_fc_layout: "banner_pre_lanzamiento"; badge?: string; slides?: { imagen_fondo?: ACFImage; titulo?: string; descripcion?: string }[] }
  | { acf_fc_layout: "mas_proyectos"; titulo?: string };

export type WPTerm = {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
};

export type WPMedia = {
  id: number;
  source_url: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
  };
};

export type Project = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    descripcion?: string;
    metros?: string | number;
    dormitorios?: string | number;
    tipo?: string;
    whatsapp_numero?: string;
    sections?: ProjectSection[];
  };
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPTerm[][];
  };
};

export type Delivered = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    ano?: string;
    distrito?: string;
    navegacion_anterior?: ACFLink;
    navegacion_posterior?: ACFLink;
    sections?: EntregadosSingleSection[];
  };
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
  };
};

export type WPCategory = {
  id: number;
  name: string;
  slug: string;
};

export type WPPost = {
  id: number;
  slug: string;
  sticky?: boolean;
  title: { rendered: string };
  excerpt: { rendered: string };
  link: string;
  date: string;
  featured_media: number;
  _embedded?: {
    author?: { id: number; name: string }[];
    "wp:featuredmedia"?: {
      source_url: string;
      alt_text?: string;
      media_details?: { width?: number; height?: number };
    }[];
    "wp:term"?: { taxonomy: string; name: string }[][];
  };
};

export type BlogPageSection = {
  acf_fc_layout: "banner_blog";
  banner_title?: string;
  banner_description?: string;
  featured_post?: { ID?: number; id?: number; post_title?: string; post_type?: string };
};

export type BlogPage = {
  id: number;
  title: { rendered: string };
  acf_full?: {
    sections?: BlogPageSection[];
  };
};

export type ArmandoIndicator = {
  numero?: string;
  texto?: string;
};

export type ArmandoSection =
  | { acf_fc_layout: "banner"; titulo?: string; descripcion?: string; imagen_fondo?: ACFImage; imagen_decorativa?: ACFImage }
  | { acf_fc_layout: "somos_uno"; imagen_primaria?: ACFImage; imagen_secundaria?: ACFImage; frase?: string; titulo?: string; texto?: string }
  | { acf_fc_layout: "mi_vida"; titulo?: string; indicadores?: ArmandoIndicator[] }
  | { acf_fc_layout: "cada_proyecto"; imagen_fondo?: ACFImage; titulo?: string }
  | { acf_fc_layout: "encuentra_tu_armando"; titulo?: string; texto?: string; boton?: ACFLink };

export type ReferidosCard = {
  label?: string;
  subtitle?: string;
  amount?: string;
};

export type ReferidosPageSection =
  | {
      acf_fc_layout: "banner_referidos";
      background_image?: ACFImage;
      title?: string;
      phrase?: string;
      cards?: ReferidosCard[];
      legal_text?: string;
    }
  | { acf_fc_layout: "se_parte"; title?: string; form_id?: string | number };

export type ContactoTab = {
  label?: string;
  url?: string;
};

export type ContactoPageFields = {
  titulo?: string;
  formulario_id?: string | number;
  tabs?: ContactoTab[];
  distritos?: string | string[];
  medios?: string | string[];
};

export type BlogPostSection =
  | { acf_fc_layout: "texto"; contenido?: string }
  | { acf_fc_layout: "imagen"; imagen?: ACFImage }
  | { acf_fc_layout: "galeria"; imagenes?: { imagen?: ACFImage }[] }
  | { acf_fc_layout: "donde"; titulo?: string; direccion?: string }
  | { acf_fc_layout: "cita"; contenido?: string };

export type BlogPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  featured_media: number;
  acf: {
    sections?: BlogPostSection[];
  };
  _embedded?: {
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPTerm[][];
  };
};

export type BlogOptions = {
  blog_encuentra_titulo?: string;
  blog_encuentra_texto?: string;
  blog_encuentra_boton?: ACFLink;
  blog_encuentra_imagen_fondo?: ACFImage;
};
