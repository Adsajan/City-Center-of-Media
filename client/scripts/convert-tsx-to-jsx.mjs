import { promises as fs } from 'fs';
import path from 'path';

const root = path.resolve(process.cwd(), 'src', 'components');

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
}

function transformTSX(code) {
  let out = code;
  // Remove import type statements
  out = out.replace(/^\s*import\s+type\s+[^;]+;\s*$/gm, '');
  // Remove interfaces/types (basic heuristic)
  out = out.replace(/^\s*interface\s+[A-Za-z0-9_]+\s*\{[\s\S]*?}\s*$/gm, '');
  out = out.replace(/^\s*type\s+[A-Za-z0-9_]+\s*=\s*[\s\S]*?;\s*$/gm, '');
  // Remove : React.FC<...> or : FC<...>
  out = out.replace(/:\s*(React\.)?FC\s*<[^>]*>/g, '');
  // Remove function param type annotations e.g. (props: Props) -> (props)
  out = out.replace(/\(([^)]*?):\s*[^,)]+\)/g, '($1)');
  // Remove const x: Type = ... -> const x = ... (simple cases)
  out = out.replace(/(const\s+[^=\n]+):\s*[^=;\n]+(=)/g, '$1$2');
  // Remove angle-bracket generic in useState etc. e.g. useState<Type>(...) -> useState(...)
  out = out.replace(/use(State|Ref|Memo|Callback)<[^>]+>\(/g, 'use$1(');
  // Remove "as Something" assertions
  out = out.replace(/\s+as\s+[A-Za-z0-9_\[\]\|]+/g, '');
  return out;
}

async function main() {
  const files = await walk(root);
  if (files.length === 0) {
    console.log('No .tsx files found in', root);
    return;
  }
  for (const file of files) {
    const code = await fs.readFile(file, 'utf8');
    const js = transformTSX(code);
    const outPath = file.replace(/\.tsx$/, '.jsx');
    await fs.writeFile(outPath, js, 'utf8');
    await fs.unlink(file);
    console.log('Converted', path.relative(process.cwd(), outPath));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

