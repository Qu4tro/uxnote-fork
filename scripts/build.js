const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version || '0.0.0';
const inputPath = path.join(root, 'uxnote-tool', 'uxnote.js');
const snapdomPath = path.join(root, 'uxnote-tool', 'snapdom.min.js');
const distDir = path.join(root, 'dist');
const outFile = `uxnote.min-v${version}.js`;
const outPath = path.join(distDir, outFile);
const mapPath = `${outPath}.map`;

fs.mkdirSync(distDir, { recursive: true });

async function build() {
  await esbuild.build({
    entryPoints: [inputPath],
    outfile: outPath,
    bundle: false,
    minify: true,
    sourcemap: 'external',
    format: 'iife',
    target: ['es2017'],
    logLevel: 'silent'
  });

  if (!fs.existsSync(outPath)) {
    throw new Error('Minification failed: no output');
  }

  if (fs.existsSync(mapPath)) {
    const mapData = fs.readFileSync(mapPath, 'utf8');
    if (!mapData) {
      throw new Error('Minification failed: empty sourcemap');
    }
  }

  // The release carries snapdom too, so both URLs of the screenshot install
  // snippet resolve against the same directory.
  fs.copyFileSync(snapdomPath, path.join(distDir, 'snapdom.min.js'));

  console.log(`Built ${outFile} and snapdom.min.js`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
