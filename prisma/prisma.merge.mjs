import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"

const SRC_DIR = resolve("prisma/schemas")
const OUT = resolve("prisma/schema.prisma")

// only .prisma files, sort by filename so 00-... runs first
const parts = readdirSync(SRC_DIR)
  .filter(f => f.endsWith(".prisma"))
  .sort((a, b) => a.localeCompare(b))

const content = parts
  .map(f => `// >>> ${f}\n${readFileSync(join(SRC_DIR, f), "utf8").trim()}\n`)
  .join("\n")

writeFileSync(OUT, content, "utf8")
console.log(`Merged ${parts.length} files into prisma/schema.prisma`)