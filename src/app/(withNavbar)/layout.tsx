import { MobileNav } from "~/components/mobile-nav";
import { Navbar } from "~/components/navbar";

export default function WithNavbarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <MobileNav />
      <Navbar />
      {children}
    </>
  );
}
