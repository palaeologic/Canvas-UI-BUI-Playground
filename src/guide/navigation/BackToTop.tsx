import { useEffect, useState } from "react";

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.9);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <a className={`to-top${show ? " is-on" : ""}`} href="#top" aria-label="Back to top" tabIndex={show ? 0 : -1}>
      <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
        <circle className="ring-bg" cx="22" cy="22" r="20" />
        <circle className="ring" cx="22" cy="22" r="20" pathLength="1" />
        <path d="M22 29V15M16 20l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
