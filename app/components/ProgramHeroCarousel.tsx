"use client";

import type { KeyboardEvent } from "react";
import { useState } from "react";
import type { ProgramHero } from "../lib/programs";

type ProgramHeroCarouselProps = {
  applyUrl: string;
  fallbackTitle: string;
  heroes?: ProgramHero[];
};

const FALLBACK_HERO_IMAGE =
  "https://s3.us-west-1.amazonaws.com/static.ifxsoccer.com/sliderPROYEARGERMANY.jpg";

const getVisibleHeroes = (heroes: ProgramHero[] | undefined, fallbackTitle: string) => {
  const validHeroes = (heroes ?? []).filter((hero) => hero.image_url);

  if (validHeroes.length > 0) {
    return validHeroes;
  }

  return [
    {
      image_text: fallbackTitle,
      image_url: FALLBACK_HERO_IMAGE,
    },
  ];
};

export default function ProgramHeroCarousel({
  applyUrl,
  fallbackTitle,
  heroes,
}: ProgramHeroCarouselProps) {
  const visibleHeroes = getVisibleHeroes(heroes, fallbackTitle);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeHero = visibleHeroes[activeIndex];

  const handlePrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? visibleHeroes.length - 1 : currentIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % visibleHeroes.length);
  };

  const handlePreviousKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handlePrevious();
    }
  };

  const handleNextKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNext();
    }
  };

  return (
    <section
      className="hero header-img"
      style={{ backgroundImage: `url(${activeHero.image_url})` }}
    >
      <div className="contenido-hero contenedor">
        <div
          className="flecha-izquierda"
          onClick={handlePrevious}
          onKeyDown={handlePreviousKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Previous hero image"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </div>
        <div className="contenido_title">
          <p>{activeHero.image_text || fallbackTitle}</p>
          <a className="boton" href={applyUrl}>
            Apply Now
          </a>
        </div>
        <div
          className="flecha-derecha"
          onClick={handleNext}
          onKeyDown={handleNextKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Next hero image"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </div>
      </div>
    </section>
  );
}
