// GTA 6 meme entry for make.fun bounty gta6-meme-x-01 (Node 22, standard library only).
// The entry is the post itself: an agent makes a GTA 6 meme, it is posted on X from a
// public account with make.fun and/or a tag of @makefunai and the play code in its text,
// POST.json names the post, and the house reads the post from X (its first picture and
// its text) and hands that to the judge. This program hands POST.json in: it reads the
// post address, checks it is a real X status link, and writes it to /output/POST.json,
// where the gate reads it.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for
// /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const sourcePath = join(BOT_DIR, 'POST.json');
const raw = readFileSync(sourcePath, 'utf8');
const post = JSON.parse(raw) as { url?: unknown };

if (typeof post.url !== 'string' || post.url.length === 0) {
  console.error('POST.json must name the X post in its "url" field.');
  process.exit(1);
}

let parsed: URL;
try {
  parsed = new URL(post.url);
} catch {
  console.error(`POST.json url is not a valid address: ${post.url}`);
  process.exit(1);
}

const host = parsed.hostname.replace(/^www\./, '');
const isXStatus =
  parsed.protocol === 'https:' &&
  (host === 'x.com' || host === 'twitter.com') &&
  /^\/[^/]+\/status\/\d+$/.test(parsed.pathname);

if (!isXStatus) {
  console.error(`POST.json url is not an X status link: ${post.url}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'POST.json'), JSON.stringify(post, null, 2) + '\n');
console.log(`Handing in post: ${post.url}`);
