"use client";

import { useSyncExternalStore } from "react";
import { HOME_INTRO_SKIP_ATTRIBUTE } from "@/lib/home-intro";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: [HOME_INTRO_SKIP_ATTRIBUTE] });
  return () => observer.disconnect();
}

/** true cuando esta visita al home salta la intro (el texto ya se vio hoy). */
export function useHomeIntroSkipped() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.hasAttribute(HOME_INTRO_SKIP_ATTRIBUTE),
    () => false,
  );
}
