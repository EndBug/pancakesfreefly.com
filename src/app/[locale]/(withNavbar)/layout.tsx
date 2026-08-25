import { setRequestLocale } from "next-intl/server";
import { Navbar } from "~/components/navbar";

export default async function WithNavbarLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
