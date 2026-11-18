import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppRoutes } from './App';

// Used by vite.config.ts at build time, so each page's HTML already holds its text for crawlers that don't run JavaScript.
export function render(path: string) {
  return renderToString(
    <StaticRouter location={path}>
      <AppRoutes />
    </StaticRouter>,
  );
}
