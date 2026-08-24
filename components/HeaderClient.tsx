"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { resolveWordPressUrl, isExternalUrl } from "@/lib/urls";
import type { HeaderData } from "./Header";
import type { ACFLink, ACFImage } from "@/lib/types";

function HeaderLink({ link, className, onClick }: { link?: ACFLink; className?: string; onClick?: () => void }) {
  if (!link?.url) return null;

  const children = link.title || link.url;

  if (isExternalUrl(link.url)) {
    return (
      <a
        href={link.url}
        className={className}
        target={link.target || "_blank"}
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={resolveWordPressUrl(link.url)}
      className={className}
      target={link.target || undefined}
      prefetch={false}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

function HeaderImage({ image, className, priority }: { image?: ACFImage; className?: string; priority?: boolean }) {
  if (!image?.url) return null;
  return (
    <Image
      src={image.url}
      alt={image.alt || ""}
      className={className}
      width={image.width ?? 100}
      height={image.height ?? 100}
      priority={priority}
    />
  );
}

export function HeaderClient({ data }: { data: HeaderData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    let previousScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = Math.max(window.scrollY, 0);
      const distance = currentScrollY - previousScrollY;

      if (currentScrollY <= 20 || isOpenRef.current) {
        setIsHeaderVisible(true);
      } else if (distance > 6) {
        setIsHeaderVisible(false);
      } else if (distance < -6) {
        setIsHeaderVisible(true);
      }

      previousScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateHeader);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openMenu = () => {
    isOpenRef.current = true;
    setIsHeaderVisible(true);
    setIsOpen(true);
  };

  const closeMenu = () => {
    isOpenRef.current = false;
    setIsOpen(false);
  };

  const menuItems = data.modal_menu?.menu?.filter((item) => item.link?.url) ?? [];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-[var(--header-height)] min-h-[56px] bg-header-bg font-gotham text-header-text backdrop-blur-md transition-transform duration-500 ease-in-out motion-reduce:transition-none ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="relative flex h-full items-center justify-center px-16 md:justify-between md:px-80">
          <button
            type="button"
            className="absolute left-16 top-1/2 flex h-20 w-29 -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-inherit md:hidden"
            onClick={openMenu}
            aria-label="Abrir menú"
          >
            <Image
              src="/images/menu-icon.svg"
              alt=""
              className="h-auto w-full"
              width={29}
              height={20}
            />
          </button>

          <Link href="/" className="block w-264">
            <HeaderImage image={data.logo} className="block h-auto w-full" priority />
          </Link>

          <div className="hidden items-center gap-12 md:flex">
            <HeaderLink
              link={data.main_menu?.contact_link}
              className="inline-flex h-30 items-center text-18 leading-none uppercase tracking-[0.04em] text-inherit no-underline" /* tracking-[0.04em] no tiene utilidad proporcional; se mantiene como em de diseño */
            />
            <button
              type="button"
              className="flex h-20 w-29 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-inherit"
              onClick={openMenu}
              aria-label="Abrir menú"
            >
              <Image
                src="/images/menu-icon.svg"
                alt=""
                className="h-auto w-full"
                width={29}
                height={20}
              />
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex h-full w-full bg-black md:bg-modal-bg"
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeMenu();
          }}
        >
          <button
            type="button"
            className="absolute left-20 top-33 z-20 flex h-20 w-20 cursor-pointer items-center justify-center border-0 bg-transparent p-0 md:left-auto md:right-57 md:top-33 md:h-24 md:w-24"
            onClick={closeMenu}
            aria-label="Cerrar menú"
          >
            <Image
              src="/images/close-icon.svg"
              alt=""
              className="h-auto w-full"
              width={20}
              height={20}
            />
          </button>

          <div className="relative flex h-full w-full shrink-0 flex-col items-center bg-black px-16 pt-31 md:w-721 md:items-start md:bg-modal-bg md:px-80 md:pb-122">
            <Link href="/" className="block w-264" onClick={closeMenu}>
              <HeaderImage image={data.modal_menu?.logo} className="block h-auto w-full" priority />
            </Link>

            <ul className="header-menu-list flex w-256 list-none flex-col items-stretch gap-46 p-0 md:gap-30">
              {menuItems.map((item, index) => (
                <li key={index} className="text-center md:text-left">
                  <HeaderLink
                    link={item.link}
                    className="header-menu-link block w-full font-light leading-[1.2] text-header-text no-underline md:inline-block"
                    onClick={closeMenu}
                  />
                </li>
              ))}
            </ul>
          </div>

          {data.modal_menu?.image?.url && (
            <div
              className="relative hidden min-w-0 flex-1 bg-black bg-cover bg-center before:absolute before:inset-0 before:bg-modal-overlay before:content-[''] md:block"
              style={{ backgroundImage: `url(${data.modal_menu.image.url})` }}
            />
          )}
        </div>
      )}
    </>
  );
}
