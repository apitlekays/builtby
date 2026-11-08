import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { audiences, projects, type Project } from './src/data/projects.ts'
import { siteDescription, siteImageAlt, siteTitle, siteUrl } from './src/data/site.ts'

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const toJsonLd = (data: object) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

const projectUrl = (project: Project) => `${siteUrl}/${project.slug}/`

// Each project's preview image comes from `npm run share-images`. A project without one yet uses the site image.
const shareImage = (project?: Project) =>
  project && existsSync(join('public', 'og', `${project.slug}.png`))
    ? `${siteUrl}/og/${project.slug}.png`
    : `${siteUrl}/og-image.png`

const website = {
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: `${siteUrl}/`,
  name: 'builtby /drhafizhanif',
  description: siteDescription,
  publisher: { '@id': `${siteUrl}/#person` },
}

const person = {
  '@type': 'Person',
  '@id': `${siteUrl}/#person`,
  name: 'Hafiz Hanif, PhD',
  url: 'https://drhafizhanif.net',
  image: `${siteUrl}/drHafiz.jpg`,
  jobTitle: 'Senior Lecturer and Software Developer',
  worksFor: { '@type': 'CollegeOrUniversity', name: 'Universiti Pendidikan Sultan Idris' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Muallim',
    addressRegion: 'Perak',
    addressCountry: 'MY',
  },
  sameAs: [
    'https://github.com/apitlekays',
    'https://www.linkedin.com/in/hafizhanif',
    'https://scholar.google.com/citations?user=4fmr9rIAAAAJ',
  ],
}

// What a search engine should know about one project, from its entry in projects.ts.
function projectEntity(project: Project) {
  const base = {
    '@id': `${projectUrl(project)}#project`,
    name: project.name,
    url: projectUrl(project),
    description: project.about[0],
    image: shareImage(project),
    author: { '@id': `${siteUrl}/#person` },
  }

  if (project.schema?.type === 'Blog') {
    return { '@type': 'Blog', ...base, sameAs: project.actions[0]?.href, inLanguage: 'en' }
  }
  if (project.kind === 'open-source') {
    return {
      '@type': 'SoftwareSourceCode',
      ...base,
      codeRepository: project.github ? `https://github.com/${project.github.owner}/${project.github.repo}` : undefined,
    }
  }
  return {
    '@type': project.platforms[0] === 'Web' ? 'WebApplication' : 'SoftwareApplication',
    ...base,
    applicationCategory: project.schema?.category ?? 'EducationalApplication',
    operatingSystem: project.platforms.join(', '),
    screenshot: project.screens?.map((screen) => `${siteUrl}${encodeURI(screen.src)}`),
    downloadUrl: project.download
      ? `https://github.com/${project.download.owner}/${project.download.repo}/releases/latest`
      : undefined,
  }
}

const homeData = () =>
  toJsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      website,
      person,
      {
        '@type': 'ItemList',
        name: 'Projects',
        itemListElement: projects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: projectUrl(project),
          name: project.name,
        })),
      },
    ],
  })

function projectData(project: Project) {
  const audience = audiences.find((a) => a.id === project.audience)
  return toJsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      website,
      person,
      {
        '@type': 'WebPage',
        '@id': projectUrl(project),
        url: projectUrl(project),
        name: `${project.name} | builtby.`,
        description: project.about[0],
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${projectUrl(project)}#project` },
        primaryImageOfPage: shareImage(project),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'builtby', item: `${siteUrl}/` },
            { '@type': 'ListItem', position: 2, name: audience?.title ?? 'Projects', item: `${siteUrl}/#${project.audience}` },
            { '@type': 'ListItem', position: 3, name: project.name, item: projectUrl(project) },
          ],
        },
      },
      projectEntity(project),
    ],
  })
}

const projectLinks = () =>
  projects
    .map((p) => `<li><a href="/${p.slug}/">${escapeHtml(p.name)}</a>: ${escapeHtml(p.tagline)}</li>`)
    .join('')

interface PageMeta {
  url: string
  title: string
  description: string
  image: string
  imageAlt: string
  structuredData: string
}

// Writes one page's own address, words and preview image into every tag that names them.
function pageHtml(template: string, page: PageMeta) {
  const safe = {
    title: escapeHtml(page.title),
    description: escapeHtml(page.description),
    imageAlt: escapeHtml(page.imageAlt),
  }
  const setContent = (attribute: string, value: string) => (html: string) =>
    html.replace(new RegExp(`(<meta ${attribute} content=")[^"]*"`), (_, start) => `${start}${value}"`)

  const edits = [
    (html: string) => html.replace(/<title>[^<]*<\/title>/, () => `<title>${safe.title}</title>`),
    (html: string) => html.replace(/(<link rel="canonical" href=")[^"]*"/, (_, start) => `${start}${page.url}"`),
    (html: string) => html.replace(/(<link rel="alternate" hreflang="[^"]*" href=")[^"]*"/g, (_, start) => `${start}${page.url}"`),
    setContent('name="title"', safe.title),
    setContent('name="description"', safe.description),
    setContent('property="og:url"', page.url),
    setContent('property="og:title"', safe.title),
    setContent('property="og:description"', safe.description),
    setContent('property="og:image"', page.image),
    setContent('property="og:image:alt"', safe.imageAlt),
    setContent('name="twitter:url"', page.url),
    setContent('name="twitter:title"', safe.title),
    setContent('name="twitter:description"', safe.description),
    setContent('name="twitter:image"', page.image),
    setContent('name="twitter:image:alt"', safe.imageAlt),
    (html: string) => html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => page.structuredData),
  ]
  return edits.reduce((html, edit) => edit(html), template)
}

// GitHub Pages answers unknown paths with a 404 status. Writing a real file per
// project gives crawlers and link previews a 200 and that project's own title.
function projectPages(): Plugin {
  return {
    name: 'project-pages',
    transformIndexHtml: (html) =>
      pageHtml(
        html
          .replace('<!-- structured-data -->', () => homeData())
          .replace('<!-- project-links -->', () => `<ul>${projectLinks()}</ul>`),
        {
          url: `${siteUrl}/`,
          title: siteTitle,
          description: siteDescription,
          image: shareImage(),
          imageAlt: siteImageAlt,
          structuredData: homeData(),
        },
      ),
    closeBundle() {
      const template = readFileSync('dist/index.html', 'utf8')
      for (const project of projects) {
        const directory = join('dist', project.slug)
        mkdirSync(directory, { recursive: true })
        writeFileSync(
          join(directory, 'index.html'),
          pageHtml(template, {
            url: projectUrl(project),
            title: `${project.name} | builtby.`,
            description: project.about[0],
            image: shareImage(project),
            imageAlt: `${project.name}: ${project.tagline}`,
            structuredData: projectData(project),
          }),
        )
      }

      const urls = [`${siteUrl}/`, ...projects.map(projectUrl)]
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
