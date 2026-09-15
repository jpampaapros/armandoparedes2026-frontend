/**
 * Convert internal WordPress links (or relative paths) into frontend-safe URLs.
 * External links are returned unchanged.
 */
export function resolveWordPressUrl(url?: string): string {
  if (!url) return "";

  // Already relative.
  if (url.startsWith("/") || url.startsWith("#")) {
    return url;
  }

  // External absolute URL: keep as-is unless it matches a known internal origin.
  if (/^https?:\/\//.test(url)) {
    try {
      const parsed = new URL(url);
      const publicBase = process.env.NEXT_PUBLIC_SITE_URL
        ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname
        : "";
      const publicCms = process.env.NEXT_PUBLIC_CMS_URL
        ? new URL(process.env.NEXT_PUBLIC_CMS_URL).hostname
        : "";
      if (publicBase && parsed.hostname === publicBase) {
        return parsed.pathname + parsed.search + parsed.hash;
      }
      if (publicCms && parsed.hostname === publicCms) {
        return parsed.pathname + parsed.search + parsed.hash;
      }
    } catch {
      // fallthrough
    }
    return url;
  }

  return url;
}

export function isExternalUrl(url?: string): boolean {
  if (!url) return false;
  return /^https?:\/\//.test(url);
}

export function getPublicCmsUrl(): string {
  const url = process.env.NEXT_PUBLIC_CMS_URL?.trim().replace(/\/$/, "");
  if (!url) {
    throw new Error("NEXT_PUBLIC_CMS_URL must be configured for browser requests to the CMS.");
  }
  return url;
}

export function getPublicFormsUrl(): string {
  const configured = process.env.NEXT_PUBLIC_FORMS_URL?.trim();
  if (!configured) return getPublicCmsUrl();

  const url = new URL(configured);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error("NEXT_PUBLIC_FORMS_URL must be a public HTTP(S) WordPress URL.");
  }
  if (url.search || url.hash || /\/(?:wp-admin|wp-json)(?:\/|$)/.test(url.pathname)) {
    throw new Error("NEXT_PUBLIC_FORMS_URL must point to the WordPress installation root.");
  }

  return url.href.replace(/\/+$/, "");
}
