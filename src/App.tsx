import { useState } from "react";
import { CellField } from "./fx/CellField";
import { ClickBurst } from "./fx/ClickBurst";
import { DnaLoader } from "./fx/DnaLoader";
import { fxOff } from "./fx/support";
import { useReveal } from "./fx/useReveal";
import { TopBar, BackToTop } from "./guide/TopBar";
import { Hero } from "./guide/Hero";
import { Settings, Rules } from "./guide/Settings";
import { Picker } from "./guide/Picker";
import { Roles } from "./guide/Roles";
import { Signs, Habits, Footer } from "./guide/Help";
import { Learn } from "./guide/Learn";

// The loader waits for web fonts (so the page doesn't reflow under it), capped inside DnaLoader.
const ready = document.fonts?.ready ?? Promise.resolve();

export function App() {
  const loader = !fxOff("loader");
  const [intro, setIntro] = useState(!loader);
  useReveal(intro);

  return (
    <>
      {!fxOff("cells") && <CellField />}
      <span id="top" />
      <TopBar />
      <main id="main" className="page" tabIndex={-1}>
        <Hero />
        <Settings />
        <Rules />
        <Picker />
        <Roles />
        <Signs />
        <Habits />
        <Learn />
        <Footer />
      </main>
      <BackToTop />
      {!fxOff("burst") && <ClickBurst />}
      {loader && <DnaLoader ready={ready} onDone={() => setIntro(true)} />}
    </>
  );
}
