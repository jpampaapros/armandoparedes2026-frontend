import type { NextConfig } from "next";

const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL;

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
if (cmsUrl) {
  try {
    const parsed = new URL(cmsUrl);
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
};

export default nextConfig;
