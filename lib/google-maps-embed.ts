export function getGoogleMapsCoordinateUrl(
  latitude?: number | string,
  longitude?: number | string,
): string | null {
  const parse = (value: number | string | undefined, limit: number) => {
    if (typeof value !== "number" && typeof value !== "string") return null;
    if (typeof value === "string" && !value.trim()) return null;
    const number = Number(value);
    return Number.isFinite(number) && Math.abs(number) <= limit ? number : null;
  };

  const lat = parse(latitude, 90);
  const lng = parse(longitude, 180);
  if (lat === null || lng === null) return null;

  const url = new URL("https://www.google.com/maps");
  url.searchParams.set("q", `${lat},${lng}`);
  url.searchParams.set("z", "16");
  url.searchParams.set("hl", "es");
  url.searchParams.set("output", "embed");
  return url.href;
}

export function getGoogleMapsEmbedUrl(value?: string): string | null {
  if (!value?.trim()) return null;

  const input = value.trim();
  const source = input.startsWith("<")
    ? input.match(/<iframe\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i)?.[1]
    : input;

  if (!source) return null;

  try {
    const url = new URL(source.replace(/&amp;/gi, "&"));
    if (
      url.protocol !== "https:"
      || !["www.google.com", "maps.google.com", "google.com"].includes(url.hostname)
      || !/^\/maps\/embed(?:\/|$)/.test(url.pathname)
      || url.username || url.password || url.port
    ) return null;

    return url.href;
  } catch {
    return null;
  }
}
