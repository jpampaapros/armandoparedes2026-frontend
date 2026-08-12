"use client";

import { useEffect, useMemo, useRef } from "react";

type CountUpNumberProps = {
  value?: string;
  duration?: number;
  className?: string;
};

type ParsedNumber = {
  prefix: string;
  suffix: string;
  target: number;
  decimals: number;
  decimalSeparator: string;
  groupingSeparator: string;
};

function parseNumber(value: string): ParsedNumber | null {
  const match = value.match(/\d[\d.,]*/);
  if (!match || match.index === undefined) return null;

  const token = match[0];
  const lastComma = token.lastIndexOf(",");
  const lastDot = token.lastIndexOf(".");
  const lastSeparator = Math.max(lastComma, lastDot);
  const digitsAfterSeparator = lastSeparator >= 0 ? token.length - lastSeparator - 1 : 0;
  const hasDecimal = lastSeparator >= 0 && digitsAfterSeparator > 0 && digitsAfterSeparator < 3;
  const decimalSeparator = hasDecimal ? token[lastSeparator] : "";
  const groupingSeparator = hasDecimal
    ? token.slice(0, lastSeparator).includes(",")
      ? ","
      : token.slice(0, lastSeparator).includes(".")
        ? "."
        : ""
    : token.includes(",")
      ? ","
      : token.includes(".")
        ? "."
        : "";
  const normalized = hasDecimal
    ? `${token.slice(0, lastSeparator).replace(/[.,]/g, "")}.${token.slice(lastSeparator + 1)}`
    : token.replace(/[.,]/g, "");
  const target = Number(normalized);

  if (!Number.isFinite(target)) return null;

  return {
    prefix: value.slice(0, match.index),
    suffix: value.slice(match.index + token.length),
    target,
    decimals: hasDecimal ? digitsAfterSeparator : 0,
    decimalSeparator,
    groupingSeparator,
  };
}

function formatNumber(value: number, parsed: ParsedNumber) {
  const fixed = value.toFixed(parsed.decimals);
  const [integer, decimal] = fixed.split(".");
  const grouped = parsed.groupingSeparator
    ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, parsed.groupingSeparator)
    : integer;
  const numericValue = decimal
    ? `${grouped}${parsed.decimalSeparator}${decimal}`
    : grouped;

  return `${parsed.prefix}${numericValue}${parsed.suffix}`;
}

export function CountUpNumber({ value = "", duration = 2500, className }: CountUpNumberProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const parsed = useMemo(() => parseNumber(value), [value]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !parsed) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let animationFrame = 0;
    let hasAnimated = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated) return;
        hasAnimated = true;
        observer.disconnect();
        element.textContent = formatNumber(0, parsed);

        const startedAt = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          element.textContent = formatNumber(parsed.target * easedProgress, parsed);

          if (progress < 1) animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);
      },
      { threshold: 0.01 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [duration, parsed, value]);

  return (
    <span ref={elementRef} className={className} aria-label={value}>
      {value}
    </span>
  );
}
