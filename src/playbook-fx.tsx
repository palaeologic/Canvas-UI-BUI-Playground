// Optional decorative effects only. All playbook content, navigation and controls live in semantic DOM.
import { createRoot } from "react-dom/client";
import { CellField } from "./fx/CellField";
import { ClickBurst } from "./fx/ClickBurst";
import { DnaLoader } from "./fx/DnaLoader";
import { ThemeToggle } from "./guide/ThemeToggle";

const host = document.createElement("div");
host.id = "fx-root";
document.body.prepend(host);
createRoot(host).render(<><CellField /><ClickBurst /><DnaLoader ready={document.fonts?.ready ?? Promise.resolve()} /><div className="pb-theme"><ThemeToggle /></div></>);
