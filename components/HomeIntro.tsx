"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/* Debe coincidir con --intro-duration en globals.css. */
const INTRO_DURATION = 3600;

type HomeIntroProps = {
  src: string;
  width?: number;
  height?: number;
  children: React.ReactNode;
};

export function HomeIntro({ src, width, height, children }: HomeIntroProps) {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const previousOverflow = document.body.style.overflow;

    if (!reduceMotion) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    }

    const timer = window.setTimeout(() => setIsDone(true), reduceMotion ? 0 : INTRO_DURATION);

    return () => {
      window.clearTimeout(timer);
      if (!reduceMotion) document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <>
      {!isDone && (
        <div
          className="intro-curtain fixed inset-0 z-200 flex items-center justify-center bg-black"
          aria-hidden="true"
        >
          <Image
            src={src}
            alt=""
            className="block h-auto w-264 md:w-400"
            width={width ?? 264}
            height={height ?? 100}
            priority
          />
        </div>
      )}

      {/* El wrapper es el ancla de las reglas .intro-start: su primer hijo es el banner. */}
      <div className={isDone ? undefined : "intro-start"}>{children}</div>
    </>
  );
}
