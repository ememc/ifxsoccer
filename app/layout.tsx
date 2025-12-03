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

import 'bootstrap/dist/css/bootstrap.min.css';

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
        {/* <Script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossOrigin="anonymous" />
        <Script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossOrigin="anonymous" />
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossOrigin="anonymous" /> */}

      </body>
    </html>
  );
}
