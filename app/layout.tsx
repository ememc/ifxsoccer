import Header from "./components/header";
import Footer from "./components/footer";
import Hero from "./components/hero";
import Container from "./components/container";
import Category from "./components/category";
import Instagram from "./components/instagram";
import News from "./components/news";
import Subscribe from "./components/subscribe";
import Video from "./components/video";
import Gallery from "./components/gallery";
import Destination from "./components/destination";
import More from "./components/more";
import Partner from "./components/partner";

import Script from "next/script";

import "./globals.css";

export const metadata = {
  title: "IFX Soccer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>
        <Header />

        <main className="w-full min-h-screen">
          <Hero />
          <Container />
          <Category />
          <Instagram />
          <News />
          <Subscribe />
          <Video />
          <Gallery />
          <Destination />
          <More />
          <Partner />
          {children}
        </main>

        <Footer />

        <Script src="/assets/js/bundle.min.js" strategy="afterInteractive" />

      </body>
    </html>
  );
}
