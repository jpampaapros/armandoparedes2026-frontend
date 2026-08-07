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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsDone(true);
      return;
    }

    /* El scroll se libera al terminar la intro, no al desmontar: el componente
       envuelve a la pagina y sigue montado despues de que el telon se va. */
    const previousOverflow = document.body.style.overflow;
    const releaseScroll = () => {
      document.body.style.overflow = previousOverflow;
    };

    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const timer = window.setTimeout(() => {
      releaseScroll();
      setIsDone(true);
    }, INTRO_DURATION);

    return () => {
      window.clearTimeout(timer);
      releaseScroll();
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
