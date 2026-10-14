import { createRevalidationHandler } from "@/lib/revalidation";

export const POST = createRevalidationHandler({
  secret: process.env.REVALIDATE_SECRET,
  tags: ["wordpress-content", "wordpress-header", "wordpress-footer"],
  allowedPaths: ["/", "/armando", "/politica-de-privacidad", "/terminos-y-condiciones",/^\/proyectos(?:\/[^/]+)?$/, /^\/blog(?:\/[^/]+)?$/],
  maxPaths: 10,
});
