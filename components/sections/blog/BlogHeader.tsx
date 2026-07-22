"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import type { BlogPost } from "@/lib/types";

type BlogHeaderProps = {
  post: BlogPost;
};

export function formatBlogDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = date
    .toLocaleDateString("es-PE", { month: "short" })
    .toLowerCase()
    .replace(/\.$/, "");
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

export function getBlogCategory(post: BlogPost): string | undefined {
  return post._embedded?.["wp:term"]
    ?.flat()
    .find((t) => t.taxonomy === "categoria_blog")?.name;
}

export function BlogHeader({ post }: BlogHeaderProps) {
  const router = useRouter();
  const category = getBlogCategory(post);
  const date = formatBlogDate(post.date);

  return (
    <header className="flex flex-col gap-16 md:gap-24">
      <button
        type="button"
        onClick={() => router.back()}
        className="group inline-flex items-center gap-12 self-start font-poppins text-18 font-normal text-near-black transition-opacity hover:opacity-70"
      >
        <Image
          src="/icons/arrow-back.svg"
          alt=""
          width={24}
          height={24}
          className="h-24 w-24 shrink-0"
          aria-hidden="true"
        />
        <span>Volver</span>
      </button>

      <div className="flex flex-wrap items-center gap-10">
        {category && (
          <span className="inline-block border border-near-black px-10 py-8 font-poppins text-14 font-medium text-near-black md:text-18">
            {category}
          </span>
        )}
        {date && (
          <time className="font-poppins text-16 font-light text-near-black" dateTime={post.date}>
            {date}
          </time>
        )}
      </div>

      <h1
        className="m-0 font-gotham text-28 font-medium leading-[1.15] text-near-black md:text-40"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />
    </header>
  );
}
