import { useEffect } from "react";
import type { Answers } from "./picker";

const EVENT = "pyc:try-in-picker";

/** Load a set of answers into the picker and scroll to it. Used by "Try in the picker" on role examples. */
export function tryInPicker(answers: Answers) {
  window.dispatchEvent(new CustomEvent<Answers>(EVENT, { detail: answers }));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("picker")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

/** Call inside the picker with its state setter so "Try in the picker" can fill it in. */
export function useTryInPicker(setAnswers: (a: Answers) => void) {
  useEffect(() => {
    const on = (e: Event) => setAnswers((e as CustomEvent<Answers>).detail);
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, [setAnswers]);
}
