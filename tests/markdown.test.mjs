import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const source = readFileSync(new URL('../src/components/AssistantMarkdown.tsx', import.meta.url), 'utf8');
let { outputText } = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext } });
for (const dependency of ['react/jsx-runtime', 'react-markdown', 'remark-gfm']) {
  outputText = outputText.replaceAll(`'${dependency}'`, `'${import.meta.resolve(dependency)}'`).replaceAll(`"${dependency}"`, `"${import.meta.resolve(dependency)}"`);
}
const { default: AssistantMarkdown } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const render = (text) => renderToStaticMarkup(createElement(AssistantMarkdown, null, text));

test('renders headings, emphasis, lists, code, links and GFM tables', () => {
  const html = render('### Minha stack\n\n**React** e *TypeScript*.\n\n- Interface\n- API\n\n1. Planejar\n2. Criar\n\n`npm run dev`\n\n```js\nconst ok = true;\n```\n\n[GitHub](https://github.com/thiagoventurav)\n\n| Área | Stack |\n| --- | --- |\n| Web | React |');
  for (const tag of ['h3', 'strong', 'em', 'ul', 'ol', 'code', 'pre', 'table', 'th', 'td']) assert.ok(html.includes(`<${tag}`), tag);
  assert.ok(html.includes('rel="noopener noreferrer"'));
  assert.ok(html.includes('href="https://github.com/thiagoventurav"'));
});

test('discards executable HTML and unsafe URLs, and does not load remote images', () => {
  const html = render('<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)">\n\n[abrir](javascript:alert%281%29)\n\n![imagem](https://example.com/tracking.png)');
  assert.ok(!html.includes('<script')); assert.ok(!html.includes('<img'));
  assert.ok(!html.includes('javascript:')); assert.ok(!html.includes('onerror'));
});
