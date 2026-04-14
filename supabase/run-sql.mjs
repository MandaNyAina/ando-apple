#!/usr/bin/env node

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execFileSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envPath = resolve(__dirname, "..", ".env.local");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    process.env[trimmed.slice(0, eqIndex)] = trimmed.slice(eqIndex + 1);
  }
} catch {
  console.error("Could not read .env.local");
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;

if (!SUPABASE_URL) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  process.exit(1);
}

if (!DB_PASSWORD) {
  console.error("Missing SUPABASE_DB_PASSWORD in .env.local");
  console.error("Add: SUPABASE_DB_PASSWORD=your-database-password");
  process.exit(1);
}

const ref = SUPABASE_URL.replace("https://", "").replace(".supabase.co", "");
const connString = `postgresql://postgres.${ref}:${DB_PASSWORD}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`;

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error("Usage: node supabase/run-sql.mjs <file1.sql> [file2.sql] ...");
  process.exit(1);
}

for (const file of files) {
  const filePath = resolve(__dirname, file);
  console.log(`\n--- Running: ${file} ---`);

  try {
    readFileSync(filePath, "utf-8");
    execFileSync("psql", [connString, "-f", filePath], {
      stdio: "inherit",
      env: { ...process.env, PGPASSWORD: DB_PASSWORD },
    });
    console.log(`--- ${file}: OK ---`);
  } catch {
    console.error(`--- ${file}: FAILED ---`);
    console.error("If psql is not installed, run: brew install libpq");
    console.error("Or paste the SQL into Supabase Dashboard > SQL Editor");
    process.exit(1);
  }
}

console.log("\nDone!");
