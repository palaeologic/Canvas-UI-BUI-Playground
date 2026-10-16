import { Eyebrow, NextLink } from "./Chapters";

const SIGNS = [
  ["The answer stops halfway, or ignores a sheet, slide or paper you gave it", "It may need more effort after context is checked", "First confirm the task and files are complete. If they are, step up one setting or say \"check every sheet before answering\""],
  ["It had all the information and is still confidently wrong", "The task may need a more capable model", "If the context is complete, move to a stronger model: Standard → Expert"],
  ["A simple question gets a long, slow answer full of extras", "Too much effort for the task", "Step down a setting"],
  ["Thorough still struggles", "The request is too vague or too big", "Add context (the file, the audience, the goal) or split it into smaller questions"],
  ["The answer is fine on Quick", "You picked well", "Stay there. It's the fastest and cheapest."],
] as const;

const HABITS = [
  ["Give it the material", "Attach the file or paste the table. Say who the answer is for and what decision it supports. Context beats a higher setting."],
  ["Ask it to show the working", "For calculations, dilutions and formulas, ask for the steps so you can spot-check one line."],
  ["Keep a human in the loop", "Contracts, patents, clinical and regulatory text, and board material always get expert review. Anything for a GMP record goes through normal review and document control."],
  ["Follow the data policy", "Don't paste patient-identifiable data, employee records, unfiled inventions or confidential partner data unless the company's data policy allows it for this tool."],
  ["Say what format you want", "\"An Excel formula for cell D2\", \"10 slides with speaker notes\" or \"a table with one row per clause\"."],
  ["Escalate, don't restart", "If an answer falls short, rerun it on the next setting up rather than starting a new chat from scratch."],
] as const;

export function Signs() {
  return (
    <section id="signs">
      <div className="sec-head" data-reveal>
        <Eyebrow id="signs">Troubleshooting</Eyebrow>
        <h2>Signs you picked the wrong setting</h2>
      </div>
      <div className="tablewrap" data-reveal>
        <table>
          <thead><tr><th>What you see</th><th>What it means</th><th>What to do</th></tr></thead>
          <tbody>
            {SIGNS.map(([a, b, c]) => (
              <tr key={a}>
                <td data-label="What you see">{a}</td>
                <td data-label="What it means">{b}</td>
                <td data-label="What to do">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <NextLink from="signs" />
    </section>
  );
}

export function Habits() {
  return (
    <section id="habits">
      <div className="sec-head" data-reveal>
        <Eyebrow id="habits">Good habits</Eyebrow>
        <h2>Get better answers on any setting</h2>
      </div>
      <div className="habits" data-reveal data-stagger>
        {HABITS.map(([h, t]) => <div className="habit" key={h}><h3>{h}</h3><p>{t}</p></div>)}
      </div>
      <div className="split" data-reveal data-stagger>
        <div className="callout">
          <h3>When Claude declines a biology question</h3>
          <p>Claude has safety filters for biology. Legitimate immunology and oncology requests can occasionally trigger a biology safety classifier.</p>
          <ol>
            <li>The app may automatically retry on another model. If it does, you'll see the answer as usual.</li>
            <li>If it still declines, report it to the platform team with the time and what you asked.</li>
            <li>Please don't reword the question to get around the filter. Reports help us fix real false alarms with Anthropic.</li>
          </ol>
        </div>
        <div className="habit">
          <h3>Contact IT directly for</h3>
          <ul className="list">
            <li>Account access, passwords, MFA and locked accounts</li>
            <li>Anything that looks like phishing or a security incident</li>
            <li>Software licences, installs and hardware</li>
            <li>Access to OpenChamber, GxP systems or new data sources</li>
          </ul>
          <p className="sub small">Claude is great for "how do I…" questions, but it can't see or change your accounts.</p>
        </div>
      </div>
      <NextLink from="habits" />
    </section>
  );
}

export function Footer() {
  const showFx = typeof location !== "undefined" && new URLSearchParams(location.search).has("debug");
  return (
    <footer>
      <p>Based on Anthropic's guidance on choosing a model and effort level. Current as of October 2026. Re-check when new models arrive.</p>
      {showFx && <p className="fx-status" title="Canvas is used only for optional decorative effects; all learning content remains normal HTML.">
        <span className="led on" />
        Decorative Canvas effects enabled; essential UI stays in semantic HTML
      </p>}
      <p className="done-note">That's the whole guide. <a href="#picker">Try the picker again</a> whenever you start a new kind of task.</p>
    </footer>
  );
}
