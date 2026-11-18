import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createServer, defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { audiences, pageDescription, pageTitle, projects, type Project, type ProjectDoc } from './src/data/projects.ts'
import { siteDescription, siteImageAlt, siteTitle, siteUrl } from './src/data/site.ts'

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const toJsonLd = (data: object) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

const projectUrl = (project: Project) => `${siteUrl}/${project.slug}/`
const docUrl = (project: Project, doc: ProjectDoc) => `${siteUrl}/${project.slug}/${doc.slug}/`

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

// A project's App Store page, taken from its actions, so adding the link there is enough.
const appStoreUrl = (project: Project) => project.actions.find((action) => action.href.startsWith('https://apps.apple.com/'))?.href
const appStoreId = (project: Project) => appStoreUrl(project)?.match(/\/id(\d+)/)?.[1]

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
    // The exact versions from the Runs on fact say more than the platform names.
    operatingSystem: project.facts.find((fact) => fact.label === 'Runs on')?.value ?? project.platforms.join(', '),
    featureList: project.features.map((feature) => `${feature.title}: ${feature.detail}`),
    offers: project.schema?.free ? { '@type': 'Offer', price: '0', priceCurrency: 'USD' } : undefined,
    publisher: project.schema?.publisher ? { '@type': 'Organization', name: project.schema.publisher } : undefined,
    screenshot: project.screens?.map((screen) => `${siteUrl}${encodeURI(screen.src)}`),
    downloadUrl: project.download
      ? `https://github.com/${project.download.owner}/${project.download.repo}/releases/latest`
      : appStoreUrl(project),
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
        name: pageTitle(project),
        description: pageDescription(project),
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

// A project's own page (privacy policy, terms, support, samples): a WebPage inside the project's breadcrumb.
function docData(project: Project, doc: ProjectDoc) {
  const audience = audiences.find((a) => a.id === project.audience)
  const url = docUrl(project, doc)
  return toJsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      website,
      person,
      {
        '@type': 'WebPage',
        '@id': url,
        url,
        name: `${doc.title} | ${project.name}`,
        description: doc.description,
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${projectUrl(project)}#project` },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'builtby', item: `${siteUrl}/` },
            { '@type': 'ListItem', position: 2, name: audience?.title ?? 'Projects', item: `${siteUrl}/#${project.audience}` },
            { '@type': 'ListItem', position: 3, name: project.name, item: projectUrl(project) },
            { '@type': 'ListItem', position: 4, name: doc.title, item: url },
          ],
        },
      },
    ],
  })
}

interface PageMeta {
  url: string
  title: string
  description: string
  image: string
  imageAlt: string
  structuredData: string
  // The page as React renders it, so crawlers that don't run JavaScript still read its text.
  body: string
  // Shows Safari's banner for the app on iPhone and iPad.
  appStoreId?: string
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
    (html: string) => html.replace('<div id="root"></div>', () => `<div id="root">${page.body}</div>`),
    (html: string) =>
      page.appStoreId ? html.replace('</head>', () => `  <meta name="apple-itunes-app" content="app-id=${page.appStoreId}" />\n  </head>`) : html,
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
        html.replace('<!-- structured-data -->', () => homeData()),
        {
          url: `${siteUrl}/`,
          title: siteTitle,
          description: siteDescription,
          image: shareImage(),
          imageAlt: siteImageAlt,
          structuredData: homeData(),
          // closeBundle fills the home page's body once the build is done.
          body: '',
        },
      ),
    async closeBundle() {
      const template = readFileSync('dist/index.html', 'utf8')

      // Render each page with the app's own components, the same markup the browser draws.
      const server = await createServer({
        configFile: false,
        logLevel: 'error',
        appType: 'custom',
        server: { middlewareMode: true, hmr: false, ws: false },
        plugins: [react()],
      })
      const { render } = (await server.ssrLoadModule('/src/entry-server.tsx')) as { render: (path: string) => string }

      writeFileSync('dist/index.html', template.replace('<div id="root"></div>', () => `<div id="root">${render('/')}</div>`))

      for (const project of projects) {
        const directory = join('dist', project.slug)
        mkdirSync(directory, { recursive: true })
        writeFileSync(
          join(directory, 'index.html'),
          pageHtml(template, {
            url: projectUrl(project),
            title: pageTitle(project),
            description: pageDescription(project),
            image: shareImage(project),
            imageAlt: `${project.name}: ${project.tagline}`,
            structuredData: projectData(project),
            body: render(`/${project.slug}`),
            appStoreId: appStoreId(project),
          }),
        )
      }

      for (const project of projects) {
        for (const doc of project.docs ?? []) {
          const directory = join('dist', project.slug, doc.slug)
          mkdirSync(directory, { recursive: true })
          writeFileSync(
            join(directory, 'index.html'),
            pageHtml(template, {
              url: docUrl(project, doc),
              title: `${doc.title} | ${project.name}`,
              description: doc.description,
              image: shareImage(project),
              imageAlt: `${project.name}: ${project.tagline}`,
              structuredData: docData(project, doc),
              body: render(`/${project.slug}/${doc.slug}`),
            }),
          )
        }
      }

      const urls = [
        `${siteUrl}/`,
        ...projects.flatMap((project) => [projectUrl(project), ...(project.docs ?? []).map((doc) => docUrl(project, doc))]),
      ]
      writeFileSync(
        'dist/sitemap.xml',
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map((url) => `  <url><loc>${url}</loc></url>`)
          .join('\n')}\n</urlset>\n`,
      )
      await server.close()
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), projectPages()],
  base: '/',
})
