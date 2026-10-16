import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const read = (p) => readFile(new URL(`../${p}`, import.meta.url), 'utf8');
const guideSettings = await read('src/guide/Settings.tsx');
const picker = await read('src/guide/Picker.tsx');
const pickerResult = await read('src/guide/picker/PickerResult.tsx');
const roles = await read('src/guide/Roles.tsx');
const learn = await read('src/guide/Learn.tsx');
const playbookHtml = await read('src/playbook.html');
const playbook = await read('src/playbook/Playbook.tsx');
const hero = await read('src/playbook/components/PlaybookHero.tsx');
const nav = await read('src/playbook/playbook-nav.ts');
const sectionNav = await read('src/playbook/components/SectionNav.tsx');
const rail = await read('src/playbook/components/SectionRail.tsx');
const navHook = await read('src/playbook/usePlaybookNavigation.ts');
const css = await read('src/playbook/playbook.css');
const fx = await read('src/playbook-fx.tsx');
const tuning = await read('src/playbook/sections/Tuning.tsx');
const diagnosis = await read('src/playbook/sections/Diagnosis.tsx');
const explorer = await read('src/playbook/sections/EffortExplorer.tsx');
const matrix = await read('src/playbook/sections/RoutingMatrix.tsx');
const topbar = await read('src/guide/TopBar.tsx');
const desktopGuideNav = await read('src/guide/navigation/DesktopChapterNav.tsx');
const pickerRadio = await read('src/components/ui/PickerRadioGroup.tsx');
const sequenceReveal = await read('src/fx/SequenceReveal.tsx');

const expectedIds = ['dials','explorer','when','which','defaults','matrix','chat','openchamber','bio','bedrock','sweep','habit'];
const sectionFiles = await readdir(new URL('../src/playbook/sections/', import.meta.url));
const sectionSource = (await Promise.all(sectionFiles.filter(f => f.endsWith('.tsx')).map(f => read(`src/playbook/sections/${f}`)))).join('\n');

test('guide review changes remain intact', () => {
  assert.match(guideSettings, /Check context, then give it more time/);
  assert.match(pickerResult, /Recommended starting setting/);
  assert.match(roles, /Search your title or team, or browse all work groups/);
  assert.match(learn, /Build your own rule of thumb/);
  assert.match(desktopGuideNav, /aria-current=\{c\.id === active \? "location"/);
  assert.match(topbar, /GuideHeader as TopBar/);
  assert.match(pickerRadio, /@base-ui\/react\/radio-group/);
  assert.doesNotMatch(picker, /RippleBox|<canvas/);
  assert.doesNotMatch(sequenceReveal, /<canvas|htmlInCanvasGeneration/);
});

test('playbook HTML is a small semantic React shell with extracted CSS', () => {
  assert.match(playbookHtml, /id="playbook-root"/);
  assert.match(playbookHtml, /playbook-entry\.tsx/);
  assert.match(playbookHtml, /playbook\/playbook\.css/);
  assert.doesNotMatch(playbookHtml, /<style>/);
  assert.doesNotMatch(playbookHtml, /Platform guide · Developers/);
});

test('hero has one real back link and non-interactive scope metadata', () => {
  assert.match(hero, /href="\/"[^>]*>← Staff guide/);
  assert.match(hero, /<span>Platform guide<\/span>/);
  assert.match(hero, /For developers, platform &amp; IT admins/);
  assert.match(hero, /<span>Amazon Bedrock<\/span>/);
  assert.doesNotMatch(hero, /href=.*Platform guide/);
  assert.match(hero, /href="#defaults"/);
});

test('one navigation registry defines seven groups and all section ids', () => {
  for (const label of ['Understand','Diagnose','Choose & route','Configure','Platform','Measure','Govern']) assert.match(nav, new RegExp(label.replace('&','&')));
  for (const id of expectedIds) assert.match(nav, new RegExp(`id: "${id}"`));
  assert.match(nav, /code: "openchamber"/);
  assert.match(sectionNav, /PLAYBOOK_NAV\.map/);
  assert.match(rail, /PLAYBOOK_NAV\.map/);
});

test('every registered primary section is rendered once and no legacy code section remains', () => {
  for (const id of expectedIds) {
    const count = (sectionSource.match(new RegExp(`<section id=(?:\\"|\")${id}(?:\\"|\")`, 'g')) ?? []).length;
    assert.equal(count, 1, `${id} should appear once in section source`);
    assert.match(playbook, new RegExp(`<${id === 'dials' ? 'Concepts' : id === 'when' ? 'Tuning' : id === 'which' ? 'Diagnosis' : id === 'defaults' ? 'Defaults' : id === 'matrix' ? 'RoutingMatrix' : id === 'chat' ? 'ChatPresets' : id === 'openchamber' ? 'OpenChamber' : id === 'bio' ? 'BiologyRefusals' : id === 'bedrock' ? 'Bedrock' : id === 'sweep' ? 'Sweep' : id === 'habit' ? 'Governance' : 'EffortExplorer'} \/>`));
  }
  assert.doesNotMatch(sectionSource, /id=\\"code\\"/);
});

test('responsive navigation is hierarchical and never relies on a horizontal peer scroller', () => {
  assert.match(css, /\.section-rail/);
  assert.match(css, /\.compact-nav/);
  assert.match(css, /\.mobile-sections/);
  assert.match(sectionNav, /<details className="mobile-sections">/);
  assert.doesNotMatch(css.match(/\.compact-nav \{[^}]+\}/s)?.[0] ?? '', /overflow-x:\s*auto/);
  assert.match(css, /--measure-prose/);
  assert.match(css, /--width-reference/);
  assert.match(css, /\.reference-breakout/);
});

test('navigation owns fragment behavior; effects remain decorative only', () => {
  assert.match(navHook, /history\.replaceState/);
  assert.match(navHook, /normalizePlaybookFragment/);
  assert.match(navHook, /scrollIntoView/);
  assert.doesNotMatch(fx, /history\.replaceState|querySelectorAll.*section|scroll-spy|\.toc/);
  assert.match(fx, /Optional decorative effects only/);
});

test('mixed-experience content uses progressive disclosure without hiding core rules', () => {
  assert.match(tuning, /First check that Claude has the right task, files and tools/);
  assert.match(tuning, /<details class=\\"disclosure\\">/);
  assert.match(diagnosis, /Context → Effort → Model/);
  assert.match(explorer, /Illustrative, not benchmark data/);
  assert.match(sectionSource, /Verified 16 October 2026 \\u00b7 Owner: Platform/);
});

test('interactive reference surfaces use native DOM controls and semantic table markup', () => {
  assert.match(explorer, /<button type="button"/);
  assert.match(explorer, /aria-pressed/);
  assert.match(diagnosis, /aria-live="polite"/);
  assert.match(matrix, /<table className="matrix-table">/);
  assert.match(matrix, /aria-label="Search routing tasks"/);
  assert.doesNotMatch(explorer + diagnosis + matrix, /<canvas/);
});
