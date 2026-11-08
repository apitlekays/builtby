import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { projects } from './src/data/projects.ts'
import { siteDescription, siteUrl } from './src/data/site.ts'

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const structuredData = () =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'builtby /drhafizhanif',
        description: siteDescription,
        publisher: { '@id': `${siteUrl}/#person` },
      },
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: 'Hafiz Hanif, PhD',
        url: 'https://drhafizhanif.net',
        jobTitle: 'Senior Lecturer and Software Developer',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Muallim',
          addressRegion: 'Perak',
          addressCountry: 'Malaysia',
        },
        sameAs: ['https://github.com/apitlekays', 'https://scholar.google.com/citations?user=4fmr9rIAAAAJ'],
      },
      {
        '@type': 'ItemList',
        itemListElement: projects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': project.kind === 'open-source' ? 'SoftwareSourceCode' : 'SoftwareApplication',
            '@id': `${siteUrl}/${project.slug}/#project`,
            name: project.name,
            url: `${siteUrl}/${project.slug}/`,
            description: project.about[0],
            author: { '@id': `${siteUrl}/#person` },
          },
        })),
      },
    ],
  }).replace(/</g, '\\u003c')

const projectLinks = () =>
  projects
    .map((p) => `<li><a href="/${p.slug}/">${escapeHtml(p.name)}</a>: ${escapeHtml(p.tagline)}</li>`)
    .join('')

function pageHtml(template: string, url: string, title: string, description: string) {
  const safeTitle = escapeHtml(title)
  const safeDescription = escapeHtml(description)
  const setContent = (attribute: string, value: string) => (html: string) =>
    html.replace(new RegExp(`(<meta ${attribute} content=")[^"]*"`), (_, start) => `${start}${value}"`)

  const edits = [
    (html: string) => html.replace(/<title>[^<]*<\/title>/, () => `<title>${safeTitle}</title>`),
    (html: string) => html.replace(/(<link rel="canonical" href=")[^"]*"/, (_, start) => `${start}${url}"`),
    setContent('name="title"', safeTitle),
    setContent('name="description"', safeDescription),
    setContent('property="og:url"', url),
    setContent('property="og:title"', safeTitle),
    setContent('property="og:description"', safeDescription),
    setContent('name="twitter:url"', url),
    setContent('name="twitter:title"', safeTitle),
    setContent('name="twitter:description"', safeDescription),
  ]
  return edits.reduce((html, edit) => edit(html), template)
}

// GitHub Pages answers unknown paths with a 404 status. Writing a real file per
// project gives crawlers and link previews a 200 and that project's own title.
function projectPages(): Plugin {
  return {
    name: 'project-pages',
    transformIndexHtml: (html) =>
      html
        .replace('<!-- structured-data -->', () => `<script type="application/ld+json">${structuredData()}</script>`)
        .replace('<!-- project-links -->', () => `<ul>${projectLinks()}</ul>`),
    closeBundle() {
      const template = readFileSync('dist/index.html', 'utf8')
      for (const project of projects) {
        const directory = join('dist', project.slug)
        mkdirSync(directory, { recursive: true })
        writeFileSync(
          join(directory, 'index.html'),
          pageHtml(template, `${siteUrl}/${project.slug}/`, `${project.name} | builtby.`, project.about[0]),
        )
      }

      const urls = [`${siteUrl}/`, ...projects.map((p) => `${siteUrl}/${p.slug}/`)]
      writeFileSync(
        'dist/sitemap.xml',
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map((url) => `  <url><loc>${url}</loc></url>`)
          .join('\n')}\n</urlset>\n`,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), projectPages()],
  base: '/',
})

