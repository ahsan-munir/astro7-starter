// Generates public/admin/config.yml from the CMS_BACKEND env var.
//
// It concatenates a backend header (public/admin/backends/<backend>.yml) with
// the shared field body (public/admin/_config.body.yml). Fields live in ONE
// place; only the backend block changes.
//
// Usage:
//   CMS_BACKEND=local   node scripts/switch-cms.mjs   (or set it in .env)
//   CMS_BACKEND=netlify node scripts/switch-cms.mjs
//   CMS_BACKEND=github  node scripts/switch-cms.mjs
//
// .env is read manually (no dependency) so this works standalone and on prebuild.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const adminDir = join(root, "public", "admin");

// --- resolve which backend: env wins, else .env file, else default 'local' ---
function fromDotEnv(key) {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) return undefined;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m && m[1] === key) return m[2].replace(/^["']|["']$/g, "");
  }
  return undefined;
}

const VALID = ["local", "netlify", "github"];
const backend = (process.env.CMS_BACKEND || fromDotEnv("CMS_BACKEND") || "local").toLowerCase();

if (!VALID.includes(backend)) {
  console.error(`✖ CMS_BACKEND="${backend}" is invalid. Use one of: ${VALID.join(", ")}`);
  process.exit(1);
}

// --- build config.yml ---------------------------------------------------------
const header = readFileSync(join(adminDir, "backends", `${backend}.yml`), "utf8");
const body = readFileSync(join(adminDir, "_config.body.yml"), "utf8");

const banner = `# =============================================================================
# GENERATED FILE — do not edit. Run \`node scripts/switch-cms.mjs\` to regenerate.
# Active backend: ${backend}   (set CMS_BACKEND in .env to change)
# Edit FIELDS in public/admin/_config.body.yml; edit BACKENDS in public/admin/backends/.
# =============================================================================
`;

writeFileSync(join(adminDir, "config.yml"), `${banner}\n${header}\n${body}`, "utf8");
console.log(`✔ public/admin/config.yml generated for backend: ${backend}`);
