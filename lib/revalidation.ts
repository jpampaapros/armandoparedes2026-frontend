import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type RevalidationConfig = {
  secret: string | undefined;
  tags: string | string[];
  allowedPaths: readonly (string | RegExp)[];
  maxPaths?: number;
  maxPayloadBytes?: number;
};

type RevalidateBody = { paths?: unknown };

function isAuthorized(request: NextRequest, secret: string | undefined): boolean {
  const authorization = request.headers.get("authorization");
  return Boolean(secret && authorization === `Bearer ${secret}`);
}

function isAllowedPath(path: string, allowedPaths: readonly (string | RegExp)[]): boolean {
  return allowedPaths.some((allowed) => {
    if (typeof allowed === "string") return allowed === path;
    return allowed.test(path);
  });
}

export function createRevalidationHandler(config: RevalidationConfig) {
  const allowedPaths = config.allowedPaths;
  const maxPaths = config.maxPaths ?? 25;
  const maxPayloadBytes = config.maxPayloadBytes ?? 16_384;

  return async function POST(request: NextRequest) {
    if (!isAuthorized(request, config.secret)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > maxPayloadBytes) {
      return NextResponse.json({ message: "Payload too large" }, { status: 413 });
    }

    let body: RevalidateBody;
    try {
      const text = await request.text();
      if (text.length > maxPayloadBytes) {
        return NextResponse.json({ message: "Payload too large" }, { status: 413 });
      }
      const parsed = text ? JSON.parse(text) : {};
      body = typeof parsed === "object" && parsed !== null ? (parsed as RevalidateBody) : {};
    } catch {
      return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
    }

    const paths = Array.isArray(body.paths) ? body.paths : [];
    if (
      paths.length > maxPaths ||
      paths.some((path) => typeof path !== "string" || !isAllowedPath(path, allowedPaths))
    ) {
      return NextResponse.json({ message: "Requested paths are not allowed" }, { status: 400 });
    }

    const tags = Array.isArray(config.tags) ? config.tags : [config.tags];
    for (const tag of tags) revalidateTag(tag, "max");
    for (const path of paths) revalidatePath(path);

    return NextResponse.json({ revalidated: true, tags, paths });
  };
}
