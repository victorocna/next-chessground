// Builds dist/styles.css and dist/pieces.css from src/css.
//
// File order matters and is NOT interchangeable:
//   1. chessground's own base stylesheet, so our rules load after it and can override it.
//   2. root.css - sizing/layout for the elements next-chessground itself renders.
//   3. highlights.css - square highlight colours (selected/move-dest/check/...).
//   4. board.css - board theme variables (--board-bg, --coord-*) and their move-dest colours.
//   5. coords.css - after board.css because it consumes --coord-light/--coord-dark from it, and
//      after chessground's base because both style `coords`; see the specificity note in the file
//      itself for why the selectors there out-specify the base rule rather than relying on this
//      order alone (belt and braces: keep both).
//   6. promotion.css - the promotion picker overlay, independent of the rest.
//
// pieces.css is a separate stylesheet (dist/pieces.css): consumers opt into a piece set by
// importing it, so it is copied as-is rather than concatenated into styles.css.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(rootDir, 'dist');

const HEADER =
  '/* next-chessground: chessground base stylesheet, board themes, coordinates, highlights, promotion */\n';

// Order matters - see the comment at the top of this file.
const SOURCES = [
  'node_modules/@lichess-org/chessground/assets/chessground.base.css',
  'src/css/root.css',
  'src/css/highlights.css',
  'src/css/board.css',
  'src/css/coords.css',
  'src/css/promotion.css',
];

const MIME_TYPES = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

// Matches url('../../assets/boards/<name>') or url("...") emitted by src/css/board.css, and
// inlines the referenced file as a base64 data: URI so dist/styles.css stays a single file.
const ASSET_URL_RE = /url\((['"])((?:\.\.\/)+assets\/boards\/[^'"]+)\1\)/g;

function readSource(relativePath) {
  const absolutePath = join(rootDir, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`build-css: missing source file "${relativePath}"`);
  }
  return readFileSync(absolutePath, 'utf8');
}

// assets/boards/*.svg are byte-exact decodes of the data: URIs shipped inline in the 1.x/2.0
// stylesheets (two files start with a blank line, two lack a trailing newline): do not reformat
// them, or the base64 this function emits changes and every consumer's board image changes with it.
function inlineBoardAssets(css) {
  return css.replace(ASSET_URL_RE, (match, quote, assetRelativePath) => {
    // assetRelativePath is relative to src/css (where board.css lives), e.g.
    // "../../assets/boards/brown.svg"; resolve it against the repo root accordingly.
    const assetPath = join(rootDir, 'src/css', assetRelativePath);
    if (!existsSync(assetPath)) {
      throw new Error(
        `build-css: referenced board asset not found: ${assetRelativePath} (resolved to ${assetPath})`
      );
    }
    const mime = MIME_TYPES[extname(assetPath)];
    if (!mime) {
      throw new Error(`build-css: unsupported board asset type: ${assetRelativePath}`);
    }
    const base64 = readFileSync(assetPath).toString('base64');
    return `url(${quote}data:${mime};base64,${base64}${quote})`;
  });
}

function build() {
  const concatenated = SOURCES.map(readSource).join('');
  const styles = HEADER + inlineBoardAssets(concatenated);
  // ASSET_URL_RE only matches the quoted url('...') form; anything it missed (an unquoted or
  // differently-shaped reference) would otherwise ship silently unresolved in dist/styles.css.
  if (styles.includes('assets/boards')) {
    throw new Error(
      'build-css: a board asset reference was not inlined; check the url() form in src/css/board.css'
    );
  }
  if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true });
  }
  writeFileSync(join(distDir, 'styles.css'), styles);

  const pieces = readSource('src/css/pieces.css');
  writeFileSync(join(distDir, 'pieces.css'), pieces);
}

build();
