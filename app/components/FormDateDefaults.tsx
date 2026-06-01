"use client";

import { useEffect } from "react";

const DATE_PLACEHOLDER_PATTERN = /\bdd\s*\/\s*mm\s*\/\s*(?:yyyy|aaaa)\b/i;
const initializedInputs = new WeakSet<HTMLInputElement>();

const getTodayInputValue = () => {
  const today = new Date();
  const offsetDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
};

const applyDateDefaults = () => {
  const today = getTodayInputValue();
  const inputs = document.querySelectorAll<HTMLInputElement>("input");

  inputs.forEach((input) => {
    const placeholder = input.getAttribute("placeholder")?.trim() ?? "";

    if (input.type !== "date" && !DATE_PLACEHOLDER_PATTERN.test(placeholder)) {
      return;
    }

    input.type = "date";
    input.classList.add("form-date-input");
    input.placeholder = "";

    if (!input.value) {
      input.value = today;
    }

    if (initializedInputs.has(input)) {
      return;
    }

    input.addEventListener("focus", () => {
      input.showPicker?.();
    });

    input.addEventListener("click", () => {
      input.showPicker?.();
    });

    initializedInputs.add(input);
  });
};

export default function FormDateDefaults() {
  useEffect(() => {
    applyDateDefaults();

    const observer = new MutationObserver(() => {
      applyDateDefaults();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
