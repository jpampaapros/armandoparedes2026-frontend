# armando-paredes-frontend

Frontend Next.js 16 (App Router) del sitio público de Armando Paredes. Consume WordPress como CMS headless por REST del lado servidor y se revalida por ISR.

- **Framework:** Next.js 16.2 · React 19.2 · TypeScript 5.9
- **Estilos:** Tailwind CSS v4 (`@theme inline` en `app/globals.css`) + `tailwindcss-calc`
- **Datos:** WordPress REST (`/wp-json/...`) con ACF Flexible Content
- **Build:** `output: "standalone"` (pensado para contenedor)

## Contexto

Se ejecuta dentro del stack Docker del repo `armando-paredes` (server): se clona en `./frontend` y su `compose.yaml` lo construye (prod) o lo monta con hot reload (dev, `compose.dev.yaml`). No está pensado para correr suelto fuera de ese stack.

## Scripts

| Comando | Uso |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (standalone) |
| `npm start` | Sirve el build |
| `npm run lint` | ESLint (`eslint-config-next`) |
| `npm run typecheck` | `tsc --noEmit` |

## Variables de entorno

| Var | Uso |
|---|---|
| `WORDPRESS_API_URL` | Base REST de WordPress, solo lado servidor (p. ej. `http://litespeed`) |
| `NEXT_PUBLIC_CMS_URL` | URL pública del CMS para assets/enlaces y envíos de formularios (CF7) |
| `NEXT_PUBLIC_SITE_URL` | URL pública del propio frontend |
| `REVALIDATE_SECRET` | Bearer que valida `POST /api/revalidate` |

Las define el `.env` del repo server; ver su `.env.example`.

`NEXT_PUBLIC_CMS_URL` además alimenta `images.remotePatterns` en `next.config.ts`: sin ella, `next/image` rechaza las imágenes del CMS.

## Estructura de carpetas

```
app/                      Rutas (App Router). Todas Server Components salvo indicación
├── layout.tsx            Layout raíz: fuentes Google, <Header/>, <Footer/>
├── globals.css           Tailwind v4 + tokens de diseño (--fx, colores, fuentes)
├── page.tsx              Home (/)
├── error.tsx             Error boundary global
├── not-found.tsx         404
├── api/revalidate/       Route handler POST para ISR on-demand
├── armando/              /armando
├── proyectos-en-venta/   /proyectos-en-venta
├── proyectos-entregados/ /proyectos-entregados
├── referidos/            /referidos
├── proyectos/[slug]/     Ficha de proyecto + /gracias
├── entregados/[slug]/    Ficha de proyecto entregado
└── blog/                 Listado + /blog/[slug]

components/
├── Header.tsx            Server: fetch a options/header
├── HeaderClient.tsx      Client: menú modal, interacción
├── Footer.tsx            Server: fetch a options/footer
├── SmartLink.tsx         Link interno/externo según resolveWordPressUrl
├── EmblaSlider.tsx       Wrapper de embla-carousel-react
├── ProjectCard.tsx       Card de proyecto en venta
├── DeliveredCard.tsx     Card de proyecto entregado
├── FloatingButtons.tsx   WhatsApp + formulario flotantes
├── forms/                ModalLeadForm, ProyectoLeadForm (Contact Form 7)
├── blog/                 BlogPage, filtro de categorías, paginación, card
├── icons/                Iconos SVG como componentes React
└── sections/             Bloques ACF + un *SectionMapper por plantilla
    ├── *SectionMapper.tsx    Switch sobre acf_fc_layout → componente
    ├── inicio/               Secciones exclusivas del home
    ├── armando/              Secciones de /armando
    ├── proyecto/             Secciones de /proyectos/[slug]
    ├── proyectos-en-venta/   Secciones de /proyectos-en-venta
    ├── entregados/           Secciones de entregados (listado y detalle)
    ├── referidos/            Secciones de /referidos
    ├── gracias/              Secciones de la página de agradecimiento
    ├── blog/                 Bloques del post + BlogSectionMapper
    └── (raíz)                Secciones compartidas: ProyectosVenta, Blog,
                              MasProyectos, FormularioContacto

lib/
├── wordpress-rest-client.ts  Cliente REST + helpers de blog + control de caché
├── revalidation.ts           Factory del handler de revalidación (auth, allowlist)
├── urls.ts                   resolveWordPressUrl, isExternalUrl, getPublicCmsUrl
├── types.ts                  Tipos ACF/WP compartidos
└── utils.ts                  cn() (clsx + tailwind-merge), stripHtml()

hooks/
├── useCf7Submit.ts       POST a Contact Form 7 desde el cliente
├── use-breakpoint.ts     Breakpoint actual (mobile/desktop)
└── useIsClient.ts        Evita mismatches de hidratación

public/                   Fuentes Gotham (woff2), imágenes y SVG estáticos
```

Alias de imports: `@/*` → raíz del repo (`tsconfig.json`).

## Páginas y su origen de datos

| Ruta | Archivo | Fuente en WordPress |
|---|---|---|
| `/` | `app/page.tsx` | Página ID **9** (`acf_full.sections`) + CPT `proyectos` + CPT `entregados` |
| `/armando` | `app/armando/page.tsx` | Página ID **12** |
| `/proyectos-en-venta` | `app/proyectos-en-venta/page.tsx` | Página ID **10** + CPT `proyectos` |
| `/proyectos-entregados` | `app/proyectos-entregados/page.tsx` | Página ID **11** + CPT `entregados` |
| `/proyectos/[slug]` | `app/proyectos/[slug]/page.tsx` | CPT `proyectos` por slug (`generateStaticParams`) |
| `/proyectos/[slug]/gracias` | `app/proyectos/[slug]/gracias/page.tsx` | Página ID **18** + CPT `proyectos` |
| `/entregados/[slug]` | `app/entregados/[slug]/page.tsx` | CPT `entregados` por slug (`generateStaticParams`) |
| `/referidos` | `app/referidos/page.tsx` | Página por slug `referidos` |
| `/blog` | `app/blog/page.tsx` | Página por slug `blog` + `posts` + `categories` (paginado y filtro por categoría) |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | `posts` por slug (`generateStaticParams`) |
| `POST /api/revalidate` | `app/api/revalidate/route.ts` | — |

Header y Footer no dependen de la página: se resuelven en `app/layout.tsx` contra los endpoints de opciones del plugin.

## Cómo se arma una página

Todas las plantillas siguen el mismo patrón:

1. La página (Server Component) pide a WordPress el campo ACF Flexible Content `acf_full.sections` (o `acf.sections`).
2. Pasa el array a su `*SectionMapper`.
3. El mapper hace `switch` sobre `acf_fc_layout` y renderiza el componente correspondiente.
4. Un layout desconocido devuelve `null` — el orden de las secciones lo decide el editor en WP.

Layouts registrados por mapper:

| Mapper | `acf_fc_layout` soportados |
|---|---|
| `HomeSectionMapper` | `banner`, `espacios`, `proyectos_venta`, `quien_es_armando`, `proyectos_entregados`, `amigos_beneficios`, `blog` |
| `ArmandoSectionMapper` | `banner`, `somos_uno`, `mi_vida`, `cada_proyecto`, `encuentra_tu_armando` |
| `ProyectosPageSectionMapper` | `banner`, `proyectos_lista` |
| `ProjectSectionMapper` | `banner_proyecto`, `banner_pre_lanzamiento`, `descripcion_proyecto`, `ficha_tecnica`, `ficha_tecnica_detallada`, `video`, `galeria`, `planos`, `mapa`, `formulario_contacto`, `quiero_mas_info`, `mas_proyectos` |
| `EntregadosPageSectionMapper` | `banner`, `proyectos_entregados` |
| `EntregadosSingleSectionMapper` | `banner`, `galeria`, `detalle`, `proyectos_venta` |
| `ReferidosSectionMapper` | `banner_referidos`, `se_parte` |
| `GraciasSectionMapper` | `banner_gracias`, `proyectos_venta`, `blog` |
| `BlogSectionMapper` | `texto`, `imagen`, `galeria`, `donde`, `cita` |

**Para añadir una sección nueva:** crear el componente en `components/sections/<plantilla>/`, tiparlo en `lib/types.ts` y añadir su `case` en el mapper correspondiente.

## Acceso a WordPress

`lib/wordpress-rest-client.ts` expone `createWordPressRestClient({ cache })` con:

- `request<T>(path)` — respuesta JSON simple.
- `collection<T>(path)` — devuelve `{ data, total, totalPages }` leyendo `X-WP-Total` / `X-WP-TotalPages`.
- Helpers de blog: `getBlogPostBySlug`, `getBlogPosts`, `getBlogOptions`, `getBlogCategories`.

La caché se pasa por llamada: hoy todas usan `{ revalidate: 3600, tags: [...] }`. El cliente también admite `{ dynamic: true }` para forzar `no-store` cuando una respuesta no deba cachearse (sin uso actualmente).

Los fetches de página van envueltos en `try/catch` y devuelven `null`/`[]`: si el CMS falla, la página renderiza sin esa sección en vez de romper.

Endpoints propios del plugin `wp-next-headless`:

- `/wp-json/armando-paredes/v1/options/header`
- `/wp-json/armando-paredes/v1/options/footer`
- `/wp-json/armando-paredes/v1/options/blog`

## Revalidación (ISR)

El plugin `wp-next-headless` (repo server) hace `POST` a `/api/revalidate` con `Authorization: Bearer $REVALIDATE_SECRET`.

El handler (`lib/revalidation.ts`) valida el bearer, limita el payload (16 KB) y acepta como máximo 10 paths, todos contra una allowlist declarada en `app/api/revalidate/route.ts`: `/`, `/armando`, `/proyectos` y `/proyectos/{slug}`, `/blog` y `/blog/{slug}`. Luego invalida los tags `wordpress-content`, `wordpress-header` y `wordpress-footer`, y los paths recibidos.

> La allowlist no cubre `/proyectos-en-venta`, `/proyectos-entregados`, `/entregados/{slug}`, `/referidos` ni `/proyectos/{slug}/gracias`: esas rutas solo se refrescan por tag (`wordpress-content`) o al expirar el `revalidate` de 1 h. Si se necesita invalidarlas por path, hay que ampliar `allowedPaths`.

Tags en uso:

| Tag | Qué invalida |
|---|---|
| `wordpress-content` | Contenido de páginas, proyectos, entregados y posts |
| `wordpress-header` | Datos del header |
| `wordpress-footer` | Datos del footer |

## Formularios

Se envían desde el cliente directo a Contact Form 7 en el CMS (`hooks/useCf7Submit.ts` → `POST {NEXT_PUBLIC_CMS_URL}/wp-json/contact-form-7/v1/contact-forms/{id}/feedback`). El ID del formulario viene de ACF cuando existe, con fallback a `4` (contacto general) y `976` (referidos).

## Estilos

Tailwind v4 sin preflight. `app/globals.css` define un sistema proporcional: `--fx` escala el diseño según el frame (414 mobile / 1440 desktop), y con `--spacing: var(--fx)` las utilidades numéricas (`w-264`, `pt-31`, `text-16`) equivalen a los px del diseño en cualquier viewport. El switch de escala ocurre en el breakpoint `md`.

Fuentes: Poppins, Ga Maamli e Inter vía `next/font/google` (variables CSS en `app/layout.tsx`); Gotham autoalojada desde `public/fonts/gotham/`.
