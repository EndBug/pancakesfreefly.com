"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePathname, Link } from "~/i18n/navigation";
import { routing } from "~/i18n/routing";

interface NavbarProps {
  enableScrollBehavior?: boolean;
}

export function Navbar({ enableScrollBehavior = false }: NavbarProps) {
  const t = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params?.locale as string) || routing.defaultLocale;

  useEffect(() => {
    if (!enableScrollBehavior) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.8; // 80% dvh
      const scrolled = window.scrollY;

      setIsVisible(scrolled > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, [enableScrollBehavior]);

  return (
    <nav
      className={`border-border bg-page-background fixed top-0 right-0 left-0 z-110 hidden border-b-2 transition-all duration-300 md:block ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-full opacity-0"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo & Name */}
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-clip">
            <Image
              src="/logo.svg"
              alt={t("navbar.teamName")}
              width={40}
              height={40}
              className="h-10 w-10 scale-120"
            />
          </div>
          <span className="font-display text-primary tracking- translate-y-1 self-center text-5xl">
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
          {/* Language Switcher */}
          <div className="flex items-center gap-1 text-sm font-medium uppercase">
            {routing.locales.map((locale, index) => {
              const isActive = locale === currentLocale;
              return (
                <span key={locale} className="flex items-center gap-1">
                  {index > 0 && (
                    <span className="text-foreground/30">|</span>
                  )}
                  <Link
                    href={pathname}
                    locale={locale}
                    className={`transition-colors ${
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
      </div>
    </nav>
  );
}
