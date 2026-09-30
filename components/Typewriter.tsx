"use client";

import { useEffect, useRef } from "react";

type TypewriterProps = {
  text: string;
  className?: string;
  characterDelay?: number;
  startDelay?: number;
};

export function Typewriter({ text, className, characterDelay = 85, startDelay = 200 }: TypewriterProps) {
  const animatedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const animated = animatedRef.current;
    if (!animated) return;

    const characters = Array.from(animated.querySelectorAll<HTMLSpanElement>(".typewriter-character"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      characters.forEach((character) => character.classList.add("typewriter-visible"));
      return;
    }

    let characterIndex = 0;
    let characterTimer: number | undefined;

    const typeNextCharacter = () => {
      characters[characterIndex - 1]?.classList.remove("typewriter-current");
      if (characterIndex >= characters.length) return;

      characters[characterIndex].classList.add("typewriter-visible", "typewriter-current");
      characterIndex += 1;
      characterTimer = window.setTimeout(typeNextCharacter, characterDelay);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        characterTimer = window.setTimeout(typeNextCharacter, startDelay);
      },
      { threshold: 0.5 },
    );

    observer.observe(animated);

    return () => {
      observer.disconnect();
      window.clearTimeout(characterTimer);
      characters.forEach((character) => character.classList.remove("typewriter-visible", "typewriter-current"));
    };
  }, [text, characterDelay, startDelay]);

  const tokens = text.split(/(\s+)/).filter(Boolean);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={animatedRef} aria-hidden="true">
        {tokens.map((token, tokenIndex) =>
          /^\s+$/.test(token) ? (
            token
          ) : (
            <span key={tokenIndex} className="typewriter-word">
              {Array.from(token).map((character, characterIndex) => (
                <span key={characterIndex} className="typewriter-character">
                  {character}
                </span>
              ))}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
