"use client";

import { useEffect, useRef } from "react";

type TypewriterTitleProps = {
  html: string;
  className?: string;
};

const INTRO_TITLE_DELAY = 2000;
const TITLE_DELAY = 400;
const CHARACTER_DELAY = 85;
const TITLE_HOLD_DELAY = 3000;
const TYPEWRITER_COMPLETE_EVENT = "home-typewriter-complete";

export function TypewriterTitle({ html, className }: TypewriterTitleProps) {
  const animatedTitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animatedTitle = animatedTitleRef.current;
    if (!animatedTitle) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animatedTitle.style.visibility = "visible";
      window.dispatchEvent(new CustomEvent("home-typewriter-progress", { detail: 1 }));
      return;
    }

    const walker = document.createTreeWalker(animatedTitle, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let currentNode = walker.nextNode();

    while (currentNode) {
      textNodes.push(currentNode as Text);
      currentNode = walker.nextNode();
    }

    const characters: HTMLSpanElement[] = [];

    textNodes.forEach((textNode) => {
      const fragment = document.createDocumentFragment();
      const tokens = textNode.data.split(/(\s+)/);

      tokens.forEach((token) => {
        if (!token) return;

        if (/^\s+$/.test(token)) {
          fragment.append(token);
          return;
        }

        const word = document.createElement("span");
        word.className = "typewriter-word";

        Array.from(token).forEach((character) => {
          const characterElement = document.createElement("span");
          characterElement.className = "typewriter-character";
          characterElement.textContent = character;
          word.append(characterElement);
          characters.push(characterElement);
        });

        fragment.append(word);
      });

      textNode.replaceWith(fragment);
    });

    let characterIndex = 0;
    let characterTimer: number | undefined;
    const typingDuration = characters.length * CHARACTER_DELAY;
    const totalDuration = typingDuration + TITLE_HOLD_DELAY;

    const holdTitle = (started: number) => {
      const elapsed = Math.min(performance.now() - started, TITLE_HOLD_DELAY);
      window.dispatchEvent(new CustomEvent("home-typewriter-progress", {
        detail: (typingDuration + elapsed) / totalDuration,
      }));
      if (elapsed >= TITLE_HOLD_DELAY) {
        window.dispatchEvent(new CustomEvent(TYPEWRITER_COMPLETE_EVENT));
      } else {
        characterTimer = window.setTimeout(() => holdTitle(started), Math.min(CHARACTER_DELAY, TITLE_HOLD_DELAY - elapsed));
      }
    };

    const typeNextCharacter = () => {
      characters.forEach((character) => character.classList.remove("typewriter-current"));

      if (characterIndex >= characters.length) {
        const banner = animatedTitle.closest<HTMLElement>("[data-intro-banner]");
        banner?.setAttribute("data-typewriter-complete", "true");
        window.dispatchEvent(new CustomEvent("home-typewriter-revealed"));
        holdTitle(performance.now());
        return;
      }

      const character = characters[characterIndex];
      character.classList.add("typewriter-visible", "typewriter-current");
      characterIndex += 1;
      window.dispatchEvent(new CustomEvent("home-typewriter-progress", {
        detail: (characterIndex * CHARACTER_DELAY) / totalDuration,
      }));
      characterTimer = window.setTimeout(typeNextCharacter, CHARACTER_DELAY);
    };

    const hasHomeIntro = animatedTitle.closest(".intro-start") !== null;
    const startTimer = window.setTimeout(() => {
      animatedTitle.style.visibility = "visible";
      typeNextCharacter();
    }, hasHomeIntro ? INTRO_TITLE_DELAY : TITLE_DELAY);

    return () => {
      window.clearTimeout(startTimer);
      if (characterTimer !== undefined) window.clearTimeout(characterTimer);
      animatedTitle.closest("[data-intro-banner]")?.removeAttribute("data-typewriter-complete");
      animatedTitle.innerHTML = html;
    };
  }, [html]);

  return (
    <div className={`relative ${className ?? ""}`}>
      <div aria-hidden="true" className="invisible" dangerouslySetInnerHTML={{ __html: html }} />
      <div
        ref={animatedTitleRef}
        aria-hidden="true"
        className="absolute inset-0 invisible"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="sr-only" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
