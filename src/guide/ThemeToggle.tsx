import { setTheme, useTheme } from "../theme";

/** Sun/moon switch. The icon morphs (the moon's "bite" slides in) and the new theme grows from the button. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className={`icon-btn theme-toggle ${className}`}
      data-theme-now={theme}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTheme(next, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <mask id="moon-bite">
          <rect x="0" y="0" width="24" height="24" fill="#fff" />
          <circle className="bite" cx="24" cy="4" r="7" fill="#000" />
        </mask>
        <circle className="core" cx="12" cy="12" r="5" fill="currentColor" mask="url(#moon-bite)" />
        <g className="rays" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 1.5v2.2M12 20.3v2.2M1.5 12h2.2M20.3 12h2.2M4.6 4.6l1.5 1.5M17.9 17.9l1.5 1.5M4.6 19.4l1.5-1.5M17.9 6.1l1.5-1.5" />
        </g>
      </svg>
    </button>
  );
}
