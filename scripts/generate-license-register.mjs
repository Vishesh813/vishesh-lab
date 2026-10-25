import { readFileSync, writeFileSync } from "node:fs";

const source = process.argv[2];
if (!source) {
  console.error("Usage: node scripts/generate-license-register.mjs <license-checker.json>");
  process.exit(1);
}

const data = JSON.parse(readFileSync(source, "utf8"));
const rows = Object.entries(data)
  .filter(([name]) => !name.startsWith("vishesh-lab@"))
  .map(([name, value]) => {
    const licence = Array.isArray(value.licenses)
      ? value.licenses.join(", ")
      : String(value.licenses);
    const repo = String(value.repository ?? "")
      .replace(/^git\+/, "")
      .replace(/\.git$/, "");
    return { name, licence, repo };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const lines = [
  "# Production dependency licence register",
  "",
  "Generated from the installed production tree with `npx license-checker --production --json`.",
  "Versions are the resolved versions in `package-lock.json`. Build-only and optional",
  "platform packages appear when the checker reports them.",
  "",
  "| Package | Licence | Repository |",
  "| --- | --- | --- |",
  ...rows.map(
    (row) =>
      `| \`${row.name}\` | ${row.licence} | ${row.repo ? `<${row.repo}>` : "—"} |`,
  ),
  "",
  "> The project package itself (`vishesh-lab`) is private and is not a third-party",
  "> component. Licences are reproduced in `THIRD_PARTY_NOTICES.md`.",
  "",
];

writeFileSync("docs/DEPENDENCY-LICENCES.md", lines.join("\n"));
console.log(`Wrote ${rows.length} packages to docs/DEPENDENCY-LICENCES.md`);
