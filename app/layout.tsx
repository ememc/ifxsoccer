import Header from "./components/header";
import Footer from "./components/footer";

import Script from "next/script";

import "./globals.css";

export const metadata = {
  title: "IFX Soccer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />

        <main className="w-full min-h-screen">
          {/* cuerpo en blanco */}
          {children}
        </main>

        <Footer />

        <Script src="/assets/js/bundle.min.js" strategy="afterInteractive" />
        <Script src="/assets/js/app.js" strategy="afterInteractive" />

      </body>
    </html>
  );
}
