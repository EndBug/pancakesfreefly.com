"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export function MobileNav() {
  const t = useTranslations("navbar");
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button - Mobile Only */}
      <button
        onClick={toggleMenu}
        className="border-border bg-page-background text-foreground hover:border-primary hover:text-primary fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center border-2 transition-colors md:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="bg-page-background/95 fixed inset-0 z-40 backdrop-blur-sm md:hidden"
            onClick={closeMenu}
          />

          {/* Menu Panel */}
          <nav className="bg-page-background fixed inset-0 z-40 flex flex-col items-center justify-center gap-12 md:hidden">
            {/* Logo & Name */}
            <Link
              href="/"
              onClick={closeMenu}
              className="flex flex-col items-center gap-4"
            >
              <div className="border-primary bg-card h-20 w-20 border-2" />
              <span className="text-foreground text-2xl font-bold tracking-tight">
                {t("teamName")}
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex flex-col items-center gap-8">
              <Link
                href="/"
                onClick={closeMenu}
                className="text-foreground hover:text-primary text-lg font-medium tracking-wide uppercase transition-colors"
              >
                {t("home")}
              </Link>
              <Link
                href="/events"
                onClick={closeMenu}
                className="text-foreground hover:text-primary text-lg font-medium tracking-wide uppercase transition-colors"
              >
                {t("events")}
              </Link>
              <Link
                href="/contact"
                onClick={closeMenu}
                className="text-foreground hover:text-primary text-lg font-medium tracking-wide uppercase transition-colors"
              >
                {t("contact")}
              </Link>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
