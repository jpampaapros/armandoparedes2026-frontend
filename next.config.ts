import type { NextConfig } from "next";

const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL;

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
let cmsOrigin: string | null = null;
if (cmsUrl) {
  try {
    const parsed = new URL(cmsUrl);
    cmsOrigin = parsed.origin;
    remotePatterns.push({
      protocol: parsed.protocol === "http:" ? "http" : "https",
      hostname: parsed.hostname,
    });
  } catch {
    // URL inválida; se ignora.
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns,
  },
  // Los archivos subidos al CMS (brochures, PDFs) se sirven bajo el dominio del frontend:
  // resolveWordPressUrl convierte sus URLs en rutas relativas y aquí se reenvían al CMS.
  async rewrites() {
    if (!cmsOrigin) return [];
    return [
      {
        source: "/wp-content/uploads/:path*",
        destination: `${cmsOrigin}/wp-content/uploads/:path*`,
      },
      {
        source: "/:site/wp-content/uploads/:path*",
        destination: `${cmsOrigin}/:site/wp-content/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
