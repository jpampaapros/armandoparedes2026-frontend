import { createRevalidationHandler } from "@/lib/revalidation";

export const POST = createRevalidationHandler({
  secret: process.env.REVALIDATE_SECRET,
  tags: ["wordpress-content", "wordpress-header", "wordpress-footer"],
  // Incluye gracias de contacto (4823) y postventa (4826) para purgar al publicar en WP.
  allowedPaths: ["/", "/armando", "/contacto", "/contacto/gracias", "/contacto/gracias-postventa", "/politica-de-privacidad", "/terminos-y-condiciones",/^\/proyectos(?:\/[^/]+)?$/, /^\/blog(?:\/[^/]+)?$/],
  maxPaths: 10,
});
