import { useEffect } from "react";
import { PlaybookHero } from "./components/PlaybookHero";
import { SectionNav } from "./components/SectionNav";
import { SectionRail } from "./components/SectionRail";
import { Sources } from "./components/Sources";
import { Concepts } from "./sections/Concepts";
import { EffortExplorer } from "./sections/EffortExplorer";
import { Tuning } from "./sections/Tuning";
import { Diagnosis } from "./sections/Diagnosis";
import { Defaults } from "./sections/Defaults";
import { RoutingMatrix } from "./sections/RoutingMatrix";
import { ChatPresets } from "./sections/ChatPresets";
import { OpenChamber } from "./sections/OpenChamber";
import { BiologyRefusals } from "./sections/BiologyRefusals";
import { Bedrock } from "./sections/Bedrock";
import { Sweep } from "./sections/Sweep";
import { Governance } from "./sections/Governance";
import { usePlaybookNavigation } from "./usePlaybookNavigation";

export function Playbook() {
  const nav = usePlaybookNavigation();
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const button = (event.target as Element | null)?.closest<HTMLButtonElement>("button.copy[data-copy]");
      if (!button) return;
      const target = document.getElementById(button.dataset.copy ?? "");
      if (!target) return;
      const text = target.innerText;
      const done = () => { button.textContent = "Copied"; setTimeout(() => { button.textContent = "Copy"; }, 1600); };
      const fallback = () => { const range = document.createRange(); range.selectNodeContents(target); const selection = getSelection(); selection?.removeAllRanges(); selection?.addRange(range); button.textContent = "Selected"; };
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, fallback).catch(fallback);
      else fallback();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <div className="page">
    <PlaybookHero />
    <SectionNav {...nav} />
    <div className="playbook-shell">
      <SectionRail activeSection={nav.activeSection} />
      <main className="playbook-content">
        <Concepts />
        <EffortExplorer />
        <Tuning />
        <Diagnosis />
        <Defaults />
        <RoutingMatrix />
        <ChatPresets />
        <OpenChamber />
        <BiologyRefusals />
        <Bedrock />
        <Sweep />
        <Governance />
        <Sources />
      </main>
    </div>
  </div>;
}
