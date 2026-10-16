import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));
let passed = 0;
let failed = 0;
function check(name, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`PASS ${name}`);
  } else {
    failed++;
    console.error(`FAIL ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

const pkg = JSON.parse(read('package.json'));
const picker = read('src/guide/Picker.tsx');
check('Base UI dependency declared', Boolean(pkg.dependencies?.['@base-ui/react']));
check('Picker does not import RippleBox', !picker.includes('RippleBox'));
check('Picker has no Canvas/vendor imports', !/vendor\/canvasui|<canvas|Ripple/.test(picker));
const sequenceReveal = read('src/fx/SequenceReveal.tsx');
check('Role reveal keeps essential role content out of Canvas', !sequenceReveal.includes('<canvas') && !sequenceReveal.includes('htmlInCanvasGeneration'));

const pickerRadioPath = 'src/components/ui/PickerRadioGroup.tsx';
check('PickerRadioGroup component exists', exists(pickerRadioPath));
if (exists(pickerRadioPath)) {
  const radio = read(pickerRadioPath);
  check('PickerRadioGroup imports Base UI radio group', radio.includes("@base-ui/react/radio-group"));
  check('PickerRadioGroup imports Base UI radio', radio.includes("@base-ui/react/radio"));
  check('PickerRadioGroup is controlled', /value=\{value\}/.test(radio) && /onValueChange/.test(radio));
  check('PickerRadioGroup has accessible group labelling', /aria-labelledby/.test(radio));
}

const guideTabsPath = 'src/components/ui/GuideTabs.tsx';
check('GuideTabs component exists', exists(guideTabsPath));
if (exists(guideTabsPath)) {
  const tabs = read(guideTabsPath);
  check('GuideTabs imports Base UI tabs', tabs.includes("@base-ui/react/tabs"));
  check('GuideTabs is controlled', /value=\{active\}/.test(tabs) && /onValueChange/.test(tabs));
  check('GuideTabs preserves arrow-key activation', tabs.includes('activateOnFocus'));
  check('GuideTabs renders matching tab panels', tabs.includes('<Tabs.Tab') && tabs.includes('<Tabs.Panel'));
}

const disclosurePath = 'src/components/ui/Disclosure.tsx';
check('Disclosure component exists', exists(disclosurePath));
if (exists(disclosurePath)) {
  const disclosure = read(disclosurePath);
  check('Disclosure imports Base UI collapsible', disclosure.includes("@base-ui/react/collapsible"));
  check('Disclosure uses hiddenUntilFound', disclosure.includes('hiddenUntilFound'));
}

const settings = read('src/guide/Settings.tsx');
const learn = read('src/guide/Learn.tsx');
check('Settings no longer uses native details', !settings.includes('<details'));
check('Learn no longer uses native details', !learn.includes('<details'));
check('Core rules remain outside disclosure', !/export function Rules[\s\S]*<Disclosure/.test(settings));

check('Architecture guide exists', exists('ARCHITECTURE.md'));
if (exists('ARCHITECTURE.md')) {
  const arch = read('ARCHITECTURE.md');
  check('Architecture guide mentions Base UI llms.txt', arch.includes('https://base-ui.com/llms.txt'));
  check('Architecture guide explains Bun commands', arch.includes('bun run dev') && arch.includes('bun run build'));
  check('Architecture guide states Canvas safety boundary', /essential UI/i.test(arch) && /Canvas/i.test(arch));
  check('Architecture guide warns not to edit dist', /dist/i.test(arch) && /do not edit/i.test(arch));
}

const baseCssPath = 'src/styles/base-ui.css';
check('Base UI styles file exists', exists(baseCssPath));
if (exists(baseCssPath)) {
  const css = read(baseCssPath);
  check('Base UI styling uses state attributes', /data-checked|data-selected|data-open/.test(css));
  check('Base UI styling avoids hard-coded black/white', !/(#000(?:000)?|#fff(?:fff)?|\bblack\b|\bwhite\b)/i.test(css));
  check('Disclosure CSS preserves hidden-until-found searchability', !/\.disclosure-panel\[data-closed\]\s*\{[^}]*display\s*:\s*none/s.test(css));
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
