"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { usePathname, Link } from "~/i18n/navigation";
import { routing } from "~/i18n/routing";

export function MobileNav() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params?.locale as string) || routing.defaultLocale;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button - Mobile Only */}
      <button
        onClick={toggleMenu}
          className="border-border bg-page-background text-foreground hover:border-primary hover:text-primary fixed top-4 right-4 z-100 flex h-10 w-10 cursor-pointer items-center justify-center border-2 transition-colors md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`bg-page-background/95 fixed inset-0 z-90 backdrop-blur-sm transition-opacity duration-100 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
      />

      {/* Menu Panel */}
      <nav
        className={`bg-page-background fixed inset-0 z-90 flex flex-col items-center justify-center gap-12 transition-opacity duration-100 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Logo & Name */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex cursor-pointer flex-col items-center"
        >
          <Image
            src="/logo.svg"
            alt={t("navbar.teamName")}
            width={80}
            height={80}
            className="h-40 w-40"
          />
          <span className="font-display text-primary text-center text-8xl/14 tracking-tight">
            {t("navbar.teamName")
              .split(" ")
              .map((word, index) => (
                <span key={index} className="block">
                  {word}
                </span>
              ))}
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-col items-center gap-8">
          <Link
            href="/"
            onClick={closeMenu}
            className="text-foreground hover:text-primary cursor-pointer text-lg font-medium tracking-wide uppercase transition-colors"
          >
            {t("navbar.home")}
          </Link>
          <Link
            href="/events"
            onClick={closeMenu}
            className="text-foreground hover:text-primary cursor-pointer text-lg font-medium tracking-wide uppercase transition-colors"
          >
            {t("navbar.events")}
          </Link>
          <Link
            href="/contact"
            onClick={closeMenu}
            className="text-foreground hover:text-primary cursor-pointer text-lg font-medium tracking-wide uppercase transition-colors"
          >
            {t("navbar.contact")}
          </Link>
          {/* Language Switcher */}
          <div className="flex items-center gap-1 text-lg font-medium uppercase">
            {routing.locales.map((locale, index) => {
              const isActive = locale === currentLocale;
              return (
                <span key={locale} className="flex items-center gap-1">
                  {index > 0 && <span className="text-foreground/30">|</span>}
                  <Link
                    href={pathname}
                    locale={locale}
                    onClick={closeMenu}
                    className={`cursor-pointer transition-colors ${
                      isActive
                        ? "text-foreground"
                        : "text-foreground/50 hover:text-foreground"
                    }`}
                  >
                    {locale.toUpperCase()}
                  </Link>
                </span>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
