import Hero from "./components/hero";
import Category from "./components/category";
import News from "./components/news";
import Subscribe from "./components/subscribe";
import Video from "./components/video";
import Gallery from "./components/gallery";
import Destination from "./components/destination";
import Partner from "./components/partner";

export default function Page() {
  return (
    <>
      <Hero />
      <Category />
      <News />
      <Subscribe />
      <Video />
      <Gallery />
      <Destination />
      <Partner />
    </>
  );
}
