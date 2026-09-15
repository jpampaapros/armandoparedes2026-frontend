"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const CURTAIN_DURATION = 2000;
const HERO_EXIT_DURATION = 1400;
const TYPEWRITER_COMPLETE_EVENT = "home-typewriter-revealed";

type HomeIntroProps = {
  src: string;
  width?: number;
  height?: number;
  children: React.ReactNode;
};

export function HomeIntro({ src, width, height, children }: HomeIntroProps) {
  const [isDone, setIsDone] = useState(false);
  const [isCurtainDone, setIsCurtainDone] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionTimer = window.setTimeout(() => {
        setIsCurtainDone(true);
        setIsDone(true);
      }, 0);
      return () => window.clearTimeout(reducedMotionTimer);
    }

    /* El scroll se libera al terminar la intro, no al desmontar: el componente
       envuelve a la pagina y sigue montado despues de que el telon se va. */
    const previousOverflow = document.body.style.overflow;
    const releaseScroll = () => {
      document.body.style.overflow = previousOverflow;
    };

    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const curtainTimer = window.setTimeout(() => {
      setIsCurtainDone(true);
    }, CURTAIN_DURATION);
    let finishTimer: number | undefined;

    const finishIntro = () => {
      setIsContentReady(true);
      releaseScroll();
      finishTimer = window.setTimeout(() => setIsDone(true), HERO_EXIT_DURATION);
    };

    window.addEventListener(TYPEWRITER_COMPLETE_EVENT, finishIntro, { once: true });

    return () => {
      window.clearTimeout(curtainTimer);
      if (finishTimer !== undefined) window.clearTimeout(finishTimer);
      window.removeEventListener(TYPEWRITER_COMPLETE_EVENT, finishIntro);
      releaseScroll();
    };
  }, []);

  return (
    <>
      {!isCurtainDone && (
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
      <div className={isDone ? undefined : "intro-start"} data-intro-ready={isContentReady || undefined}>{children}</div>
    </>
  );
}
