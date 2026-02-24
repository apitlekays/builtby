export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  github: {
    owner: string;
    repo: string;
  };
  docker?: {
    namespace: string;
    repo: string;
  };
  topics?: string[];
  license?: string;
}

export const projects: Project[] = [
  {
    id: 'meteor-mcp',
    name: 'Meteor MCP',
    description:
      'A Model Context Protocol (MCP) server that provides complete Meteor.js v3.4.0 API documentation, code examples, and architectural guides to AI coding assistants.',
    language: 'Python',
    github: {
      owner: 'apitlekays',
      repo: 'meteor-mcp',
    },
    docker: {
      namespace: 'dochafizhanif',
      repo: 'meteor-mcp',
    },
  },
  {
    id: 'spectre-ui',
    name: 'Spectre UI',
    description:
      'A futuristic React component framework with dark cyber aesthetics, built-in animations, and full accessibility.',
    language: 'TypeScript',
    github: {
      owner: 'apitlekays',
      repo: 'spectre-ui',
    },
    topics: ['react', 'ui-components'],
    license: 'MIT',
  },
];
