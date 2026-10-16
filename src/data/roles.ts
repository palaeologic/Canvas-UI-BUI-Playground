import type { PresetKey } from "./presets";
import type { ModelKey } from "./models";
import type { Answers, Level } from "./picker";

export type CodeSetting = "c-sonnet-medium" | "c-sonnet-high" | "c-opus-medium" | "c-opus-high" | "c-opus-xhigh" | "c-haiku-low";
export type SettingKey = PresetKey | CodeSetting;

/** Label and model colour for every setting a card can show. */
export const SETTINGS: Record<SettingKey, { label: string; model: ModelKey }> = {
  quick: { label: "Quick", model: "haiku" },
  standard: { label: "Standard", model: "sonnet" },
  expert: { label: "Expert", model: "opus" },
  thorough: { label: "Thorough", model: "opus" },
  "c-sonnet-medium": { label: "Sonnet · medium", model: "sonnet" },
  "c-sonnet-high": { label: "Sonnet · high", model: "sonnet" },
  "c-opus-medium": { label: "Opus · medium", model: "opus" },
  "c-opus-high": { label: "Opus · high", model: "opus" },
  "c-opus-xhigh": { label: "Opus · xhigh", model: "opus" },
  "c-haiku-low": { label: "Haiku · low", model: "haiku" },
};

export const isCodeSetting = (s: SettingKey): s is CodeSetting => s.startsWith("c-");

/**
 * One example. Chat examples carry the three picker answers (size, checkability, stakes) that lead
 * to their setting; roles.test.ts checks that recommend() agrees. OpenChamber examples have none.
 */
export interface RoleCard { area: string; setting: SettingKey; prompt: string; tip: string; bio?: boolean; answers?: [Level, Level, Level] }
export interface Role { key: RoleKey; label: string; intro: string; cards: RoleCard[] }

export type RoleKey = "lead" | "lab" | "clin" | "mfg" | "qa" | "tech" | "biz";

export const toAnswers = ([time, check, stakes]: [Level, Level, Level]): Answers => ({ time, check, stakes });

/** Tab keys from earlier versions, so saved tabs and old #links still land somewhere sensible. */
export const ROLE_ALIASES: Record<string, RoleKey> = { leadership: "lead", pm: "lead", clinical: "clin", gmp: "mfg", dev: "tech", it: "tech" };

/**
 * Seven kinds of work, not one tab per job title. Every company title and team maps to one
 * (sometimes two) of these in TITLES and TEAMS below.
 */
export const ROLES: Role[] = [
  { key: "lead", label: "Leading & planning", intro: "For executives, directors, heads, core and team leads, and project managers. Much of your work is judgement and communication, where Expert and Thorough earn their cost. Plans and reports fit Standard, and notes fit Quick.", cards: [
      { area: "Board narrative", setting: "expert", answers: [1, 2, 1], prompt: "Draft a 10-slide board outline on our early-clinical KRAS G12V programme: next milestones, risks and funding needs. Audience: non-scientist investors.", tip: "Use Expert for the storyline, then Standard to write the slide text. Two short steps usually beat one long Thorough run." },
      { area: "Portfolio decision", setting: "thorough", answers: [2, 2, 2], bio: true, prompt: "Using the attached data packs, compare our IND-enabling programmes against MAGE-A4, PRAME, NY-ESO-1 and KRAS G12D on target safety, HLA coverage, competition and cost. Suggest an order and say what would change it.", tip: "Give it the data packs, not just the names. Context beats a higher setting. The decision stays with the team." },
      { area: "Trade-offs", setting: "expert", answers: [1, 2, 1], prompt: "Two programmes need the same screening capacity in Q2. Lay out the options, what each one delays, and the questions I should ask before deciding.", tip: "A stronger model helps with judgement calls. Asking for the questions to ask keeps you in charge." },
      { area: "Project plan", setting: "standard", answers: [1, 1, 1], prompt: "Build a plan for transferring the TCR-T manufacturing process from process development into the GMP facility: milestones, dependencies and critical path, as an Excel table.", tip: "Ask for dependencies to be listed explicitly so you can check them." },
      { area: "Status report", setting: "standard", answers: [1, 0, 1], prompt: "Draft a 5-slide monthly status update from this tracker: RAG status, top risks, next month's milestones. Audience: the leadership team.", tip: "Attach the tracker and say who it's for. That does more than moving up a setting." },
      { area: "Meeting notes", setting: "quick", answers: [0, 0, 0], prompt: "Turn these meeting notes into decisions, action items with owners and due dates, and open questions.", tip: "Quick is ideal. You can check the result in seconds." },
    ] },
  { key: "lab", label: "Lab research", intro: "For scientists, bioengineers, laboratory technicians and support specialists in the research cores. Use Standard for data handling and write-ups. Step up when statistics or the study design decides the outcome, and step down when the answer is easy to see.", cards: [
      { area: "Data clean-up", setting: "standard", answers: [1, 1, 0], prompt: "Reshape this flow cytometry export into one row per sample with donor, TCR clone, effector:target ratio and % specific killing. Flag samples with fewer than 1,000 events.", tip: "Ask it to tell you which rows it dropped and why." },
      { area: "Statistics", setting: "expert", answers: [1, 2, 1], bio: true, prompt: "I have killing-assay data for six TCR candidates at eight peptide concentrations. Which curve model and normalisation should I use for EC50, and how should I treat the replicate that looks off at the top dose?", tip: "Method choices are hard to check, so ask the stronger model. Use Thorough if it goes into a report or filing." },
      { area: "Calculations", setting: "standard", answers: [0, 1, 1], prompt: "I need 50 mL of PBS with 0.5% BSA and 2 mM EDTA from a 10% BSA stock and 0.5 M EDTA. Show the working.", tip: "Asking for the working lets you re-derive one number yourself. Small slips matter at the bench." },
      { area: "Literature", setting: "thorough", answers: [2, 2, 1], bio: true, prompt: "From these 15 abstracts, summarise how solid tumours escape TCR-T therapy, such as HLA loss and antigen downregulation. Group the findings by mechanism and cite each one.", tip: "If it skips papers, it needed more time. Splitting a broad question into smaller ones often helps more." },
      { area: "Study design", setting: "thorough", answers: [2, 2, 2], bio: true, prompt: "Help me design an in vivo efficacy study for a TCR-T candidate: groups, controls, endpoints and a power calculation for a 30% tumour growth difference.", tip: "Errors here show up months later. Have a statistician check the power calculation." },
      { area: "Quick tidy-up", setting: "quick", answers: [0, 0, 0], prompt: "Rename these 96 sample IDs to the format DONOR-CLONE-DATE, keeping the original order.", tip: "When you can see at a glance whether it's right, Quick is enough. Stronger settings only add wait." },
    ] },
  { key: "clin", label: "Clinical", intro: "For clinical development, clinical operations and clinical science, and anyone supporting a trial. Patient-facing and regulatory text is high stakes, so start at Thorough. Trackers and summaries fit Standard. Use pseudonymised data only, as the data policy allows.", cards: [
      { area: "Protocol section", setting: "thorough", answers: [2, 2, 2], bio: true, prompt: "Draft the rationale and dose-escalation section of a phase 1 protocol synopsis for a KRAS G12V TCR-T product, based on these preclinical summaries.", tip: "Ask it to mark every statement that needs a reference. Clinical and regulatory reviewers own the final text." },
      { area: "Patient materials", setting: "thorough", answers: [1, 1, 2], prompt: "Rewrite this informed consent section for a reading age of about 12, keeping every risk and how often it happens. List anything you had to simplify.", tip: "Patient-facing text is high stakes even when it's short. Ethics and clinical review still approve it." },
      { area: "Site selection", setting: "expert", answers: [1, 2, 1], prompt: "Compare these six candidate sites on eligible patients per year, apheresis capacity, cell-therapy experience and start-up time. Rank them and explain the trade-offs.", tip: "Ranking needs judgement you can't check at a glance. Check the ranking logic before sharing." },
      { area: "Monitoring visits", setting: "standard", answers: [1, 1, 1], prompt: "Summarise these monitoring visit reports into open issues per site, with owner, due date and whether each one affects patient safety.", tip: "Remove patient identifiers before you paste anything." },
      { area: "Investigator meeting", setting: "standard", answers: [1, 0, 1], prompt: "Turn this protocol amendment into 8 slides for the investigator meeting: what changed, why, and what sites need to do.", tip: "Attach the amendment and say who is in the room." },
      { area: "Enrolment tracker", setting: "quick", answers: [0, 0, 0], prompt: "Write an Excel formula that flags rows where the screening window closes within 7 days, using column C (screening date) and column D (status).", tip: "Quick is fine. Use subject IDs, never names." },
    ] },
  { key: "mfg", label: "Manufacturing & process", intro: "For GMP operations, production and process development: process engineers and technicians, production leads, facility and equipment, and materials. Claude drafts, sorts and widens your thinking. It doesn't make GMP decisions. Anything for a GMP record goes through normal review and document control.", cards: [
      { area: "Change control", setting: "thorough", answers: [1, 2, 2], prompt: "Draft a change-control impact assessment for replacing the incubator used during T-cell expansion. Cover product quality, validation, training, documents and implementation risks.", tip: "Use the approved template and have QA own the decision." },
      { area: "Process troubleshooting", setting: "expert", answers: [1, 2, 1], prompt: "These three TCR-T runs had lower expansion after day 7. Based on the attached process trends, list the most plausible process causes and what data would distinguish them.", tip: "A stronger model can widen the hypothesis list; process owners still decide the investigation." },
      { area: "Batch review", setting: "thorough", answers: [2, 2, 2], prompt: "Review this batch record summary for inconsistencies, missing checks and deviations that need follow-up. Do not make a disposition decision.", tip: "This is a first pass only. QA/QP review and normal document control remain mandatory." },
      { area: "Material planning", setting: "standard", answers: [1, 1, 1], prompt: "Turn this production schedule and inventory export into a material demand plan by week, with shortages highlighted.", tip: "Check units and lead times before relying on the output." },
      { area: "Work instruction", setting: "standard", answers: [1, 0, 1], prompt: "Draft a visual work instruction for staging materials before a manufacturing run, based on this SOP.", tip: "Keep it aligned to the approved SOP; do not invent steps." },
      { area: "Shift handover", setting: "quick", answers: [0, 0, 0], prompt: "Turn these handover notes into a short list of open actions, owners and due times for the next shift.", tip: "Quick is enough when the source is short and easy to verify." },
    ] },
  { key: "qa", label: "Quality & validation", intro: "For QA, QC, Qualified Persons, analytical engineers and validation leads. The model can surface inconsistencies and draft structured material, but quality decisions remain with qualified staff. Use Thorough when the output affects disposition, validation strategy or regulated records.", cards: [
      { area: "Deviation review", setting: "thorough", answers: [2, 2, 2], prompt: "Review this deviation investigation for missing evidence, weak root-cause logic and CAPA gaps. Do not make a batch-disposition decision.", tip: "Use the approved investigation template and keep QA ownership explicit." },
      { area: "Method question", setting: "expert", answers: [1, 2, 1], prompt: "We saw a shift in potency-assay control recovery over six runs. List likely analytical causes and what checks would separate method, reagent and instrument effects.", tip: "This is a judgement call you can't check at a glance, so ask the stronger model. Escalate to Thorough if a batch decision depends on it." },
      { area: "QC trending", setting: "standard", answers: [1, 1, 1], prompt: "In this Excel sheet of release results, add mean ± 3 SD limits for viability, CD3+ purity and TCR expression, and flag results outside the limits or six in a row rising or falling.", tip: "Check the limits and rules against your trending SOP." },
      { area: "Consistency check", setting: "standard", answers: [1, 1, 1], prompt: "Compare this SOP with the batch record template and list every step, limit or term that doesn't match.", tip: "Treat the list as a first pass. It can miss things, so keep your own review." },
      { area: "CAPA tracker", setting: "quick", answers: [0, 0, 0], prompt: "Turn these audit findings into a table with columns: finding, area, owner, due date, status.", tip: "Reformatting you can check at a glance belongs on Quick." },
    ] },
  { key: "tech", label: "Software, IT & automation", intro: "For developers, IT, informatics and automation. In OpenChamber you choose the model and thinking level yourself: start at medium, change one level at a time, and go back to medium when you switch models. Helpdesk questions and documentation work well in the chat app.", cards: [
      { area: "Small task", setting: "c-sonnet-medium", prompt: "Write a SQL query that returns samples with more than two failed QC runs in the last 30 days.", tip: "Sonnet at medium is plenty. Give helper subagents Haiku at low under Settings → Agents." },
      { area: "Bug fix", setting: "c-sonnet-high", prompt: "The plate import fails on files with a BOM header. Reproduce it, fix it, and add a test.", tip: "If it skips steps, raise the thinking level. If it stays confidently wrong with full context, switch to Opus at medium." },
      { area: "Lab automation", setting: "c-opus-medium", prompt: "Write the liquid-handler script that sets up a 384-well killing assay from this plate map, with a dry-run mode that only logs the moves.", tip: "Run the dry run and check the log before anything touches the robot." },
      { area: "Infrastructure", setting: "c-opus-high", prompt: "Review this Terraform change for the analysis cluster. What could break, and what's the rollback plan?", tip: "Plan with Claude, but apply infrastructure changes yourself." },
      { area: "Long build", setting: "c-opus-xhigh", bio: true, prompt: "Migrate the single-cell TCR sequencing pipeline from Snakemake to Nextflow, keeping outputs byte-identical on the test dataset.", tip: "Use xhigh for long runs (30+ minutes). Keep max for rare, very hard problems." },
      { area: "Helpdesk", setting: "quick", answers: [0, 0, 0], prompt: "Write simple step-by-step instructions for setting up the VPN on a Mac for a new starter.", tip: "Check the steps against our actual setup before sending." },
      { area: "Admin script", setting: "standard", answers: [1, 1, 1], prompt: "Write a PowerShell script that lists Entra ID users who haven't signed in for 90 days. Read-only, no changes.", tip: "Run it against a test scope first. Use OpenChamber at Sonnet high for anything that changes things." },
      { area: "System validation", setting: "thorough", answers: [2, 1, 2], prompt: "Draft a risk-based validation plan for the new environmental monitoring system using GAMP 5: intended use, risk assessment, test strategy and data-integrity controls.", tip: "Give it the validation SOP so it follows our format. QA approves the plan." },
    ] },
  { key: "biz", label: "Business & operations", intro: "For business development and strategy, finance and controlling, HR, patents, G&A, LogOps and operations support. Contracts, patents and policies are high stakes and slow to check, so start at Expert or Thorough and keep the specialist sign-off. Everyday admin fits Quick or Standard.", cards: [
      { area: "Patents", setting: "thorough", answers: [2, 2, 2], bio: true, prompt: "Compare the independent claims in these three published TCR patents with our invention summary. Make a table of overlapping features, claim element by claim element.", tip: "Patent counsel draws the conclusions. Check the data policy before pasting anything not yet filed." },
      { area: "Term sheet", setting: "thorough", answers: [1, 2, 2], prompt: "Review this term sheet against our standard positions on milestones, royalties, field and exclusivity. Make a table of deviations, with risk level.", tip: "Always a legal sign-off. Thorough helps most when you can't quickly check every clause yourself." },
      { area: "Deal comparables", setting: "expert", answers: [1, 2, 1], prompt: "Put these five cell-therapy licensing deals in one table: upfront, milestones, royalties and stage at signing. Then say what they suggest for our next deal.", tip: "Attach the sources and ask for a citation on every figure. Check anything surprising." },
      { area: "Budget follow-up", setting: "standard", answers: [1, 1, 1], prompt: "Build a monthly budget-vs-actual sheet by cost centre from these two exports, with variance in SEK and %, and flag variances over 10%.", tip: "Check that the totals tie back to the ledger export." },
      { area: "Hiring", setting: "standard", answers: [1, 0, 1], prompt: "Write a job ad for a Senior Process Technician, plus a structured interview guide with scoring criteria.", tip: "Keep candidates' and employees' personal data out of the chat." },
      { area: "Everyday admin", setting: "quick", answers: [0, 0, 0], prompt: "Write a short, friendly email to all lab staff about the new courier cut-off time of 14:00.", tip: "Quick is perfect for short messages you'll proofread anyway." },
    ] },
];

export const TITLES: Record<string, RoleKey[]> = {
  "CEO": ["lead"], "COO": ["lead", "mfg"], "CFO": ["lead", "biz"], "CSO": ["lead", "lab"], "CTO": ["lead", "tech"], "CIO": ["lead", "tech"], "CDO": ["lead", "clin"], "CBO": ["lead", "biz"], "VP Strategy & Corporate Development": ["biz", "lead"], "VP Strategy & Business Development": ["biz", "lead"], "Director of Clinical Development": ["clin", "lead"], "Director of Clinical Operations": ["clin", "lead"], "Director of GMP Operations": ["mfg", "lead"], "Director of Quality Development": ["qa", "lead"], "Head of Manufacturing Development": ["mfg", "lead"], "Head of Production": ["mfg", "lead"], "Head of QC": ["qa", "lead"], "Core leader": ["lead", "lab"], "Team lead": ["lead"], "Platform Project Manager": ["lead"], "Senior Project Manager GMP": ["lead", "mfg"], "Production lead": ["mfg", "lead"], "Operations Support Manager": ["biz", "lead"], "IT Manager": ["tech", "lead"], "Principal Scientist": ["lab"], "Senior Scientist": ["lab"], "Scientist": ["lab"], "Senior Bioengineer": ["lab"], "Bioengineer": ["lab"], "Senior Laboratory Technician": ["lab"], "Laboratory Technician": ["lab"], "Laboratory Support Specialist": ["lab"], "Clinical Science Lead": ["clin"], "Clinical Operations Coordinator": ["clin"], "Senior Process Engineer": ["mfg"], "Process Engineer": ["mfg"], "Senior Process Technician": ["mfg"], "Process Technician": ["mfg"], "Process and automation specialist": ["mfg", "tech"], "PD/GMP Coordinator & Validation Lead": ["mfg", "qa"], "Facility and Equipment manager": ["mfg"], "Material Inventory": ["mfg", "biz"], "QA Manager": ["qa"], "Quality Assurance Manager": ["qa"], "Quality Assurance Manager & Qualified Person": ["qa"], "Senior Scientist Quality Control": ["qa"], "Scientist Quality Control": ["qa"], "Senior Analytical Engineer": ["qa", "lab"], "Analytical Engineer": ["qa", "lab"], "Application Specialist and Validation Lead": ["qa", "tech"], "Senior Software Developer": ["tech"], "Senior Software Engineer": ["tech"], "Software Developer": ["tech"], "Junior Software Developer - Frontend": ["tech"], "Senior IT Engineer": ["tech"], "IT Engineer": ["tech"], "IT Technician": ["tech"], "Business Development Associate": ["biz"], "Corporate Business Controller": ["biz"], "HR Manager": ["biz"], "Scientist / Patent Portfolio Manager": ["biz", "lab"], "Operations Support Administrator": ["biz"], "Consultant": ["biz", "lead"]
};

export const TEAMS: Record<string, RoleKey[]> = {
  "Advanced Gene Editing": ["lab"], "Antigen Core": ["lab"], "Cell Analysis Core": ["lab"], "Cell Engineering Core": ["lab"], "DNA Core": ["lab"], "Protein Core": ["lab"], "Specimen Core": ["lab", "clin"], "Synthetic Biology": ["lab"], "T-cell Capture Core": ["lab"], "Translation Core": ["lab", "clin"], "Virus Core": ["lab"], "Tech Development Core": ["lab", "tech"], "Clinical Trial": ["clin"], "GMP Operations": ["mfg"], "GMP Production": ["mfg"], "GMP Process Development Core": ["mfg"], "Quality Control": ["qa"], "Engineering": ["tech", "mfg"], "Software, Development and Informatics Core": ["tech"], "IT Core": ["tech"], "I&A Core": ["tech"], "Business Development": ["biz"], "G&A": ["biz"], "LogOps Core": ["biz", "mfg"]
};
