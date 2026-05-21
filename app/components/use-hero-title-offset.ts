"use client";

import { useEffect, useRef, useState } from "react";

const MIN_LINES_FOR_EXTRA_OFFSET = 3;

const getRenderedLineCount = (element: Element) => {
  const styles = window.getComputedStyle(element);
  const parsedLineHeight = Number.parseFloat(styles.lineHeight);
  const parsedFontSize = Number.parseFloat(styles.fontSize);
  const lineHeight = !Number.isNaN(parsedLineHeight) && parsedLineHeight > 0
    ? parsedLineHeight
    : (!Number.isNaN(parsedFontSize) && parsedFontSize > 0 ? parsedFontSize * 1.2 : 0);

  if (!lineHeight || Number.isNaN(lineHeight)) {
    return 0;
  }

  return Math.ceil(element.getBoundingClientRect().height / lineHeight);
};

export const useHeroTitleOffset = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasTallTitle, setHasTallTitle] = useState(false);

  useEffect(() => {
    const updateOffset = () => {
      const title = document.querySelector(".nav-interna .prog-navbar h1");

      if (!title) {
        setHasTallTitle(false);
        return;
      }

      setHasTallTitle(getRenderedLineCount(title) >= MIN_LINES_FOR_EXTRA_OFFSET);
    };

    updateOffset();

    if (document.fonts?.ready) {
      document.fonts.ready.then(updateOffset).catch(() => undefined);
    }

    const title = document.querySelector(".nav-interna .prog-navbar h1");
    const resizeObserver = typeof ResizeObserver !== "undefined" && title
      ? new ResizeObserver(updateOffset)
      : null;

    if (title && resizeObserver) {
      resizeObserver.observe(title);
    }

    window.addEventListener("resize", updateOffset);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateOffset);
    };
  }, []);

  return {
    hasTallTitle,
    sectionRef,
  };
};
