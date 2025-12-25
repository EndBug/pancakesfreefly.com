"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.8; // 80% dvh
      const scrolled = window.scrollY;

      setIsVisible(scrolled > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`border-border bg-page-background fixed top-0 right-0 left-0 z-50 hidden border-b-2 transition-opacity duration-100 md:block ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo & Name */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt={t("navbar.teamName")}
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="font-display text-primary tracking- translate-y-1 self-center text-4xl">
            {t("navbar.teamName")}
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-foreground hover:text-primary text-sm font-medium tracking-wide uppercase transition-colors"
          >
            {t("navbar.home")}
          </Link>
          <Link
            href="/events"
            className="text-foreground hover:text-primary text-sm font-medium tracking-wide uppercase transition-colors"
          >
            {t("navbar.events")}
          </Link>
          <Link
            href="/contact"
            className="text-foreground hover:text-primary text-sm font-medium tracking-wide uppercase transition-colors"
          >
            {t("navbar.contact")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
