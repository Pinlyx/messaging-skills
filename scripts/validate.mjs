#!/usr/bin/env node
// Zero-dependency checks for the skills in this repository.
// Run: node scripts/validate.mjs
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PD = '.' + 'cla' + 'ude-plugin'; // plugin manifest folder name
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (file, msg) => errors.push(`${relative(root, file) || '.'}: ${msg}`);

const SKIP_DIRS = new Set(['.git', 'node_modules']);
const TEXT_EXT = new Set(['.md', '.json', '.mjs', '.js', '.yml', '.yaml', '.txt']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const ext = (p) => {
  const i = p.lastIndexOf('.');
  return i === -1 ? '' : p.slice(i).toLowerCase();
};
const posix = (p) => relative(root, p).split(sep).join('/');

// ---------------------------------------------------------------- frontmatter

function parseFrontmatter(text) {
  const m = text.replace(/^﻿/, '').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
  const data = {};
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || /^\s/.test(line)) continue; // nested blocks (metadata) are not inspected
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith('"')) {
      try { v = JSON.parse(v); } catch { v = null; }
    } else if (v.startsWith("'") && v.endsWith("'")) {
      v = v.slice(1, -1).replace(/''/g, "'");
    }
    data[kv[1]] = v;
  }
  return { data, body: m[2] };
}

// ---------------------------------------------------------------- skills

const skillsDir = join(root, 'skills');
const REQUIRED_HEADINGS = [
  ['When to use', /^## When to use/m],
  ['Context to collect', /^## Context to collect/m],
  ['Workflow', /^## Workflow/m],
  ['Checklist', /^## Checklist/m],
  ['Output template', /^## Output template/m],
  ['Common mistakes', /^## Common mistakes/m],
];

const skillNames = [];
if (!existsSync(skillsDir)) {
  fail(skillsDir, 'skills/ directory is missing');
} else {
  for (const entry of readdirSync(skillsDir).sort()) {
    const dir = join(skillsDir, entry);
    if (!statSync(dir).isDirectory()) {
      fail(dir, 'unexpected file in skills/');
      continue;
    }
    const file = join(dir, 'SKILL.md');
    if (!existsSync(file)) {
      fail(dir, 'SKILL.md is missing');
      continue;
    }
    skillNames.push(entry);
    const text = readFileSync(file, 'utf8');
    const fm = parseFrontmatter(text);
    if (!fm) {
      fail(file, 'missing YAML frontmatter delimited by ---');
      continue;
    }
    const { name, description } = fm.data;
    if (!name) fail(file, 'frontmatter has no name');
    else {
      if (name !== entry) fail(file, `name "${name}" must equal the folder name "${entry}"`);
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) fail(file, `name "${name}" must be lowercase letters, digits and single hyphens`);
      if (name.length > 64) fail(file, 'name is longer than 64 characters');
    }
    if (description === undefined) fail(file, 'frontmatter has no description');
    else if (description === null || description === '') fail(file, 'description is empty or not valid YAML/JSON string syntax');
    else {
      if (description.length > 1024) fail(file, `description is ${description.length} characters (max 1024)`);
      if (description.length < 60) fail(file, 'description is too short to trigger reliably');
    }
    for (const [label, re] of REQUIRED_HEADINGS) {
      if (!re.test(fm.body)) fail(file, `missing section "${label}"`);
    }
    if (fm.body.trim().split(/\s+/).length < 300) fail(file, 'body is under 300 words: not enough substance');

    // every reference file must be linked from SKILL.md and (rules, limits and benchmarks files) carry a source URL
    const refDir = join(dir, 'references');
    if (existsSync(refDir)) {
      for (const ref of readdirSync(refDir)) {
        const rp = join(refDir, ref);
        if (ext(rp) !== '.md') continue;
        if (!text.includes(`references/${ref}`)) fail(rp, 'not linked from SKILL.md');
        if (/rules|limits|benchmarks/.test(ref) && !/https?:\/\//.test(readFileSync(rp, 'utf8'))) fail(rp, 'rules reference contains no source URL');
      }
    }
  }
}

// ---------------------------------------------------------------- markdown links

const files = walk(root);

function stripCode(text) {
  return text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
}

for (const file of files.filter((f) => ext(f) === '.md')) {
  const text = stripCode(readFileSync(file, 'utf8'));
  const re = /\[[^\]\n]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m;
  while ((m = re.exec(text))) {
    const target = m[1];
    if (/^(https?:|mailto:|#)/i.test(target)) continue;
    const path = target.split('#')[0];
    if (!path) continue;
    const abs = resolve(dirname(file), decodeURIComponent(path));
    if (!existsSync(abs)) fail(file, `broken link: ${target}`);
  }
}

// ---------------------------------------------------------------- JSON manifests

function readJson(rel, required = true) {
  const p = join(root, rel);
  if (!existsSync(p)) {
    if (required) fail(p, 'file is missing');
    return null;
  }
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch (e) {
    fail(p, `invalid JSON: ${e.message}`);
    return null;
  }
}

const marketplace = readJson(`${PD}/marketplace.json`);
const plugin = readJson(`${PD}/plugin.json`);
const skillsSh = readJson('skills.sh.json');
const gemini = readJson('gemini-extension.json');

if (marketplace) {
  if (!marketplace.name) fail(join(root, `${PD}/marketplace.json`), 'no name');
  const entry = (marketplace.plugins || [])[0];
  if (!entry) fail(join(root, `${PD}/marketplace.json`), 'no plugins entry');
  else if (plugin && entry.name !== plugin.name) fail(join(root, `${PD}/marketplace.json`), 'plugin entry name differs from plugin.json name');
  else if (entry && !existsSync(resolve(root, entry.source || '.', `${PD}/plugin.json`))) {
    fail(join(root, `${PD}/marketplace.json`), `source "${entry.source}" has no ${PD}/plugin.json`);
  }
}
if (skillsSh) {
  for (const p of skillsSh.paths || []) {
    if (!existsSync(resolve(root, p))) fail(join(root, 'skills.sh.json'), `path does not exist: ${p}`);
  }
}
if (gemini && gemini.contextFileName && !existsSync(join(root, gemini.contextFileName))) {
  fail(join(root, 'gemini-extension.json'), `context file missing: ${gemini.contextFileName}`);
}

// README and GEMINI.md must mention every skill
for (const doc of ['README.md', 'GEMINI.md']) {
  const p = join(root, doc);
  if (!existsSync(p)) {
    fail(p, 'file is missing');
    continue;
  }
  const t = readFileSync(p, 'utf8');
  for (const n of skillNames) if (!t.includes(`\`${n}\``)) fail(p, `does not mention skill \`${n}\``);
}

// ---------------------------------------------------------------- forbidden content

const dashChars = [String.fromCharCode(0x2014), String.fromCharCode(0x2013), "&md" + "ash;", "&nd" + "ash;"];
const forbiddenWords = ['anth' + 'ropic', 'crm' + 'solid', 'crm' + ' solid', 'player' + 'sells', 'xam' + 'pp', 'co-auth' + 'ored'];
const vendorWord = 'cla' + 'ude';
const vendorAllowed = (rel) => rel === 'README.md' || rel.startsWith(`${PD}/`);
const internalPath = /\b[A-Za-z]:\\[A-Za-z]|\/root\/|\/home\/[a-z]/;
const secretLike = /\b(sk-[A-Za-z0-9]{20,}|gh[pousr]_[A-Za-z0-9]{30,}|AKIA[0-9A-Z]{16})\b/;

for (const file of files) {
  if (!TEXT_EXT.has(ext(file))) continue;
  const rel = posix(file);
  const text = readFileSync(file, 'utf8');
  const lower = text.toLowerCase();
  for (const d of dashChars) if (lower.includes(d.toLowerCase())) fail(file, `contains forbidden dash character or entity (U+${d.codePointAt(0).toString(16)})`);
  for (const w of forbiddenWords) if (lower.includes(w)) fail(file, `contains forbidden word "${w}"`);
  if (!vendorAllowed(rel) && lower.includes(vendorWord)) fail(file, `contains "${vendorWord}" outside README.md and ${PD}/`);
  if (internalPath.test(text)) fail(file, 'looks like it contains an internal filesystem path');
  if (secretLike.test(text)) fail(file, 'looks like it contains a secret');
}

// ---------------------------------------------------------------- required top-level files

for (const f of ['README.md', 'LICENSE', 'CHANGELOG.md', 'CONTRIBUTING.md', '.github/workflows/ci.yml']) {
  if (!existsSync(join(root, f))) fail(join(root, f), 'file is missing');
}
const lic = existsSync(join(root, 'LICENSE')) ? readFileSync(join(root, 'LICENSE'), 'utf8') : '';
if (lic && !lic.startsWith('MIT License')) fail(join(root, 'LICENSE'), 'first line must be "MIT License"');

// ---------------------------------------------------------------- result

if (errors.length) {
  console.error(`validate: ${errors.length} problem(s)`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`validate: OK (${skillNames.length} skills, ${files.length} files checked)`);
