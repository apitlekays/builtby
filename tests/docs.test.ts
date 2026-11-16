// Run with `npm test` (after `npm run build` for the built-page checks).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { projects } from '../src/data/projects.ts';
import { inlineSegments } from '../src/data/inline.ts';
import { siteUrl } from '../src/data/site.ts';

test('inline links are split out of a paragraph', () => {
  assert.deepEqual(inlineSegments('Write to [us](mailto:a@b.c) or read [the policy](/x/privacy).'), [
    { text: 'Write to ' },
    { text: 'us', href: 'mailto:a@b.c' },
    { text: ' or read ' },
    { text: 'the policy', href: '/x/privacy' },
    { text: '.' },
  ]);
  assert.deepEqual(inlineSegments('No links here.'), [{ text: 'No links here.' }]);
});

const suluhdiff = projects.find((p) => p.slug === 'suluhdiff');

test('SuluhDiff has privacy, terms, support and samples pages', () => {
  assert.ok(suluhdiff);
  assert.deepEqual(suluhdiff.docs?.map((d) => d.slug), ['privacy', 'terms', 'support', 'samples']);
});

test('every document is complete, and its local links point at real pages or files', () => {
  for (const project of projects) {
    const slugs = new Set<string>();
    for (const doc of project.docs ?? []) {
      assert.ok(!slugs.has(doc.slug), `${project.slug}/${doc.slug} appears twice`);
      slugs.add(doc.slug);
      assert.ok(doc.title && doc.description && doc.sections.length > 0, `${project.slug}/${doc.slug} is incomplete`);
      const texts = doc.sections.flatMap((s) => s.blocks.flatMap((b) => (typeof b === 'string' ? [b] : b.items)));
      for (const segment of texts.flatMap(inlineSegments)) {
        if (!segment.href?.startsWith('/')) continue;
        const path = segment.href.split('#')[0];
        const isPage = path === `/${project.slug}` || (project.docs ?? []).some((d) => path === `/${project.slug}/${d.slug}`);
        assert.ok(isPage || existsSync(join('public', path)), `${project.slug}/${doc.slug} links to missing ${segment.href}`);
      }
    }
  }
});

test('every SuluhDiff screen and sample file exists', () => {
  for (const screen of suluhdiff?.screens ?? []) assert.ok(existsSync(join('public', screen.src)), screen.src);
  for (const name of ['salt-road-draft-1', 'salt-road-draft-2', 'thesis-chapter-2-draft-1', 'thesis-chapter-2-draft-2']) {
    assert.ok(existsSync(join('public', 'suluhdiff', 'samples', `${name}.docx`)), name);
  }
});

test('the build writes each document as its own page and lists it in the sitemap', { skip: !existsSync('dist/index.html') && 'run npm run build first' }, () => {
  const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
  for (const project of projects) {
    for (const doc of project.docs ?? []) {
      const url = `${siteUrl}/${project.slug}/${doc.slug}/`;
      const file = join('dist', project.slug, doc.slug, 'index.html');
      assert.ok(existsSync(file), `${file} missing`);
      const html = readFileSync(file, 'utf8');
      assert.match(html, new RegExp(`<title>${doc.title} \\| ${project.name}</title>`));
      assert.ok(html.includes(`<link rel="canonical" href="${url}"`), `${file} canonical`);
      assert.ok(html.includes('"BreadcrumbList"') && html.includes(`"name":"${doc.title}"`), `${file} breadcrumb`);
      assert.ok(sitemap.includes(`<loc>${url}</loc>`), `${url} not in sitemap`);
    }
  }
});
