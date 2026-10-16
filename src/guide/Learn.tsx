import { Eyebrow } from "./Chapters";
import { Disclosure } from "../components/ui/Disclosure";

const LINKS = [
  {
    href: "https://academy.claude.com/tutorials/choosing-the-right-effort-level-in-claude-code",
    src: "Claude Academy · tutorial", title: "Choosing the right effort level",
    text: "The short tutorial this guide is based on. It shows what effort changes and when to turn it up or down.",
  },
  {
    href: "https://claude.com/blog/claude-model-and-effort-level-in-claude-code",
    src: "Claude blog", title: "Model or effort: which one to change",
    text: "Why a stronger model knows more, while more effort only means more time spent checking.",
  },
  {
    href: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview",
    src: "Anthropic docs · guide", title: "Write better prompts",
    text: "Clear instructions, examples and the right context. A good prompt usually beats a higher setting.",
  },
  {
    href: "/playbook", src: "For developers and admins", title: "Model & Effort Playbook",
    text: "The full routing table, prices, OpenChamber settings and how biology refusals are handled.",
  },
];

export function Learn() {
  return (
    <section id="learn">
      <div className="sec-head" data-reveal>
        <Eyebrow id="learn">Keep learning</Eyebrow>
        <h2>Get a feel for the models</h2>
        <p className="sub">The fastest way to learn which model fits your work is to compare them on your own tasks.</p>
      </div>
      <div className="learn" data-reveal data-stagger>
        <div className="lcard practice">
          <h3>Build your own rule of thumb</h3>
          <ol>
            <li>Pick a task you do every week.</li>
            <li>Run it on Quick and on Standard, with the same prompt and files.</li>
            <li>Compare the answers. Keep the lowest setting whose answer you'd accept.</li>
            <li>If neither is good enough, try Expert. If Expert still misses things, try Thorough.</li>
          </ol>
          <p>Ten minutes of this teaches more than any table. You'll learn where each model shines for your own work.</p>
        </div>
        <Disclosure className="resource-details" label="Additional resources">
          <div className="learn-resources">
            {LINKS.map((l) => (
              <a key={l.href} className="lcard" href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
                <span className="src">{l.src}</span>
                <h3>{l.title}</h3>
                <p>{l.text}</p>
              </a>
            ))}
          </div>
        </Disclosure>
      </div>
    </section>
  );
}
