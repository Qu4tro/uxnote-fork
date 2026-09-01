const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'site');

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const entry of ['index.html', 'assets', 'uxnote-tool', 'demo', 'dist']) {
  const from = path.join(root, entry);
  if (!fs.existsSync(from)) continue;
  fs.cpSync(from, path.join(out, entry), { recursive: true });
}
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log(`Site written to ${path.relative(root, out)}/`);
