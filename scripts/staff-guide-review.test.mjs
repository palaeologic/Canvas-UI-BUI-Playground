import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (p) => fs.readFileSync(p, 'utf8');

const hero = () => read('src/guide/Hero.tsx');
const tokens = () => read('src/styles/tokens.css');
const settings = () => read('src/guide/Settings.tsx');
const learn = () => read('src/guide/Learn.tsx');
const nav = () => read('src/guide/TopBar.tsx');

test('effort wells use dedicated semantic effort tokens instead of ink fallback', () => {
  const css = tokens();
  for (const token of ['--effort-low', '--effort-medium', '--effort-high']) {
    assert.match(css, new RegExp(token.replace('--', '--')));
  }
  assert.match(hero(), /effort-\$\{r\.tone\}/);
  assert.doesNotMatch(read('src/guide/EffortWells.tsx'), /var\(--ink\)/);
});

test('hero gives a safe default and uses capability-first model copy', () => {
  const source = hero();
  assert.match(source, /Most people should start with/);
  assert.match(source, />Standard<\/a>/);
  assert.doesNotMatch(source, /Get them roughly right/);
  const models = read('src/data/models.ts');
  assert.match(models, /Fast and direct/);
  assert.match(models, /Versatile and dependable/);
  assert.match(models, /Best for ambiguity and difficult judgement/);
  assert.doesNotMatch(models, /Has seen problems like yours before/);
});

test('completed guide de-emphasizes historical completion state', () => {
  const header = read('src/guide/navigation/GuideHeader.tsx');
  const desktop = read('src/guide/navigation/DesktopChapterNav.tsx');
  assert.match(header, /isComplete/);
  assert.match(desktop, /!isComplete/);
});

test('later teaching content uses accessible progressive disclosure', () => {
  assert.match(settings(), /<Disclosure className="preset-more" label="More examples"/);
  assert.match(learn(), /<Disclosure className="resource-details" label="Additional resources"/);
  const disclosure = read('src/components/ui/Disclosure.tsx');
  assert.match(disclosure, /@base-ui\/react\/collapsible/);
  assert.match(disclosure, /hiddenUntilFound/);
});

test('overloaded guide files are decomposed while App remains a composition layer', () => {
  const required = [
    'src/guide/EffortWells.tsx',
    'src/guide/navigation/GuideHeader.tsx',
    'src/guide/navigation/DesktopChapterNav.tsx',
    'src/guide/navigation/MobileChapterMenu.tsx',
    'src/guide/navigation/useGuideProgress.ts',
    'src/guide/picker/PickerQuestion.tsx',
    'src/guide/picker/PickerResult.tsx',
    'src/guide/roles/RoleTabs.tsx',
    'src/guide/roles/RoleExampleCard.tsx',
  ];
  for (const file of required) assert.ok(fs.existsSync(file), `${file} should exist`);
  assert.ok(fs.statSync('src/guide/TopBar.tsx').size < 1200, 'TopBar.tsx should become a small facade');
  assert.ok(read('src/App.tsx').length < 2500, 'App should stay a small composition layer');
});
