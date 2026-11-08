// Draws the 1200x630 link-preview images: public/og-image.png for the home page and
// public/og/<slug>.png for each project, from src/data/projects.ts.
// Run `npm run share-images` after adding or changing a project, then commit the PNGs.
// It drives the Google Chrome installed on this computer, so it does not run during deploy.
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
import { audiences, projects, statusLabels } from '../src/data/projects.ts';

const publicDir = resolve('public');
const asset = (path) => pathToFileURL(join(publicDir, path)).href;
const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const notOpenYet = ['closed-beta', 'coming-soon', 'in-development'];

const styles = `
  :root { --bg:#E4E4DF; --mod:#F5F5F1; --mod2:#ECECE7; --ink:#111111; --body:#33332F; --mut:#55554F; --line:#B9B9B2; --sig:#FFD60A; --go:#11703A; --wait:#8A4208; }
  * { box-sizing: border-box; }
  html, body { margin: 0; width: 1200px; height: 630px; background: var(--bg); overflow: hidden; }
  body { font-family: 'Chivo', sans-serif; color: var(--ink); padding: 28px; }
  .rack { display: grid; grid-template-columns: minmax(0, 1fr) 392px; gap: 1px; height: 100%; background: var(--line); border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
  .m { background: var(--mod); min-width: 0; }
  .mono { font-family: 'Chivo Mono', monospace; font-weight: 600; text-transform: uppercase; letter-spacing: .02em; }
  .left { display: flex; flex-direction: column; min-height: 0; }
  .cap { display: flex; justify-content: space-between; gap: 16px; padding: 16px 22px; font-size: 17px; color: var(--mut); }
  .title { margin: auto 0 0; padding: 0 40px; font-weight: 900; line-height: .86; letter-spacing: -0.05em; white-space: nowrap; }
  .line { margin: 28px 40px 36px; font-size: 32px; line-height: 1.22; color: var(--body); max-width: 20em; text-wrap: balance; }
  .url { display: flex; align-items: center; gap: 16px; padding: 0 22px; height: 84px; flex-shrink: 0; background: var(--sig); border-top: 1px solid var(--line); }
  .url svg { width: 48px; height: 48px; flex-shrink: 0; }
  .url span { font-size: 28px; text-transform: none; letter-spacing: 0; white-space: nowrap; }
  .right { display: grid; grid-template-rows: minmax(0, 1fr) auto; gap: 1px; background: var(--line); }
  .fill { position: relative; overflow: hidden; }
  .fill > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .solo { display: flex; align-items: center; justify-content: center; background: var(--mod2); }
  .fill.solo > img { position: static; width: 168px; height: 168px; object-fit: contain; }
  .low { padding: 14px 18px 20px; }
  .low .mono { font-size: 17px; color: var(--mut); display: flex; justify-content: space-between; }
  .grid { margin-top: 14px; display: grid; grid-template-columns: repeat(5, 56px); justify-content: space-between; row-gap: 14px; }
  .ic { width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; background: var(--mod2); border: 1px solid var(--line); flex-shrink: 0; }
  .ic img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }
  .ic.framed img { padding: 8px; }
  .ic.full img { padding: 7px; border-radius: 14px; }
  .ic.px img { image-rendering: pixelated; }
  .ic span { font-weight: 800; font-size: 18px; color: var(--mut); }
  .by { display: flex; align-items: center; gap: 14px; margin-top: 12px; }
  .by img { width: 64px; height: 64px; border-radius: 10px; object-fit: cover; object-position: 50% 15%; border: 1px solid var(--line); }
  .by b { display: block; font-size: 26px; font-weight: 800; letter-spacing: -0.01em; }
  .by small { display: block; margin-top: 2px; font-size: 17px; color: var(--body); }
  .head { display: flex; align-items: center; gap: 22px; margin: auto 0 0; padding: 0 40px; }
  .head .ic { width: 96px; height: 96px; border-radius: 20px; }
  .head .ic.framed img { padding: 14px; }
  .head .title { margin: 0; padding: 0; }
  .led { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; }
  .led i { width: 14px; height: 14px; border-radius: 50%; display: block; }
  .go { color: var(--go); } .go i { background: var(--go); }
  .wait { color: var(--wait); } .wait i { border: 3px solid var(--wait); }
`;

const mark = `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="12" fill="#111111"/><rect x="15" y="10" width="9.5" height="43" rx="1.5" fill="#FFD60A"/><circle cx="33" cy="38.25" r="10.5" fill="none" stroke="#FFD60A" stroke-width="9.5"/></svg>`;

// Icons that fill their whole square get a small inset so every tile looks the same size.
const fullBleed = new Set(['kelasruum']);

function iconTile(project) {
  const { src, monogram, framed, pixelated } = project.icon;
  const classes = ['ic', framed && 'framed', pixelated && 'px', fullBleed.has(project.slug) && 'full'].filter(Boolean).join(' ');
  return `<div class="${classes}">${src ? `<img src="${asset(src)}" alt="">` : `<span>${escape(monogram ?? '')}</span>`}</div>`;
}

const page = (body) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chivo:wght@400;500;700;800;900&family=Chivo+Mono:wght@500;600&display=swap">
<style>${styles}</style></head><body>${body}</body></html>`;

function homeCard() {
  return page(`<div class="rack">
    <div class="m left">
      <div class="cap mono"><span>Educational technology</span><span>UPSI, Malaysia</span></div>
      <h1 class="title" data-fit="140">Hafiz<br>Hanif, PhD</h1>
      <p class="line">Apps, sites and libraries for teachers, researchers and Muslims.</p>
      <div class="url">${mark}<span class="mono">builtby.drhafizhanif.net</span></div>
    </div>
    <div class="right">
      <div class="m fill"><img src="${asset('drHafiz.jpg')}" alt="" style="object-position: 50% 18%"></div>
      <div class="m low">
        <div class="mono"><span>Projects</span><span>${projects.length}</span></div>
        <div class="grid">${projects.slice(0, 10).map(iconTile).join('')}</div>
      </div>
    </div>
  </div>`);
}

function projectCard(project) {
  const index = audiences.findIndex((a) => a.id === project.audience);
  const audience = audiences[index];
  const tone = notOpenYet.includes(project.status) ? 'wait' : 'go';
  const screen = project.screens?.[0];
  const visual = screen
    ? `<div class="m fill"><img src="${asset(screen.src)}" alt="" style="object-position: top left"></div>`
    : `<div class="m fill solo">${project.icon.src ? `<img src="${asset(project.icon.src)}" alt="">` : ''}</div>`;

  return page(`<div class="rack">
    <div class="m left">
      <div class="cap mono"><span>${String(index + 1).padStart(2, '0')} &middot; ${escape(audience.title)}</span><span class="led ${tone}"><i></i>${escape(statusLabels[project.status])}</span></div>
      <div class="head">${iconTile(project)}<h1 class="title" data-fit="118">${escape(project.name)}</h1></div>
      <p class="line">${escape(project.tagline)}</p>
      <div class="url">${mark}<span class="mono">builtby.drhafizhanif.net/${project.slug}</span></div>
    </div>
    <div class="right">
      ${visual}
      <div class="m low">
        <div class="mono"><span>Runs on</span><span>${escape(project.platforms.join(', '))}</span></div>
        <div class="by"><img src="${asset('drHafiz.jpg')}" alt=""><div><b>Hafiz Hanif, PhD</b><small>Built at UPSI, Malaysia</small></div></div>
      </div>
    </div>
  </div>`);
}

// Shrinks the big title until it fits its panel, and the tagline until the card has no overflow.
async function fit(tab) {
  await tab.evaluate(() => {
    for (const title of document.querySelectorAll('[data-fit]')) {
      let size = Number(title.dataset.fit);
      title.style.fontSize = `${size}px`;
      const room = title.closest('.left').clientWidth - 80 - (title.closest('.head') ? 118 : 0);
      const textWidth = () => {
        const range = document.createRange();
        range.selectNodeContents(title);
        return range.getBoundingClientRect().width;
      };
      while (textWidth() > room && size > 48) title.style.fontSize = `${(size -= 2)}px`;
    }
    const line = document.querySelector('.line');
    const left = document.querySelector('.left');
    let size = 32;
    while (left.scrollHeight > left.clientHeight && size > 22) line.style.fontSize = `${(size -= 1)}px`;
  });
}

async function draw(browser, html, output) {
  const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  // A page opened from a file may load the local icons and screens; a blank page may not.
  const card = join(workDir, 'card.html');
  writeFileSync(card, html);
  await tab.goto(pathToFileURL(card).href, { waitUntil: 'networkidle' });
  await tab.evaluate(() => document.fonts.ready);
  await fit(tab);
  const problems = await tab.evaluate(() => {
    const left = document.querySelector('.left');
    return [
      ...[...document.images].filter((image) => !image.naturalWidth).map((image) => `missing image ${image.src}`),
      ...(left.scrollHeight > left.clientHeight ? ['text does not fit'] : []),
      ...(document.fonts.check('900 40px Chivo') ? [] : ['Chivo did not load']),
    ];
  });
  if (problems.length) throw new Error(`${output}: ${problems.join(', ')}`);
  await tab.screenshot({ path: output });
  await tab.close();
  console.log(`✓ ${output}`);
}

const workDir = mkdtempSync(join(tmpdir(), 'builtby-share-'));
const browser = await chromium.launch({ channel: 'chrome' });
try {
  mkdirSync(join(publicDir, 'og'), { recursive: true });
  await draw(browser, homeCard(), join(publicDir, 'og-image.png'));
  for (const project of projects) {
    await draw(browser, projectCard(project), join(publicDir, 'og', `${project.slug}.png`));
  }
} finally {
  await browser.close();
  rmSync(workDir, { recursive: true, force: true });
}
