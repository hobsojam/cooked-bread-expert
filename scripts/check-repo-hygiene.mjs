import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  encoding: "utf8",
}).trim();

const checkedFiles = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard"],
  {
    cwd: root,
    encoding: "utf8",
  },
)
  .split(/\r?\n/)
  .filter(Boolean)
  .filter((file, index, files) => files.indexOf(file) === index)
  .filter((file) => !file.startsWith(".git/"));

if (checkedFiles.length === 0) {
  console.log("Repo hygiene check skipped because there are no files to check.");
  process.exit(0);
}

const textExtensions = new Set([
  ".cjs",
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml",
]);

const forbiddenTerms = [
  {
    pattern: new RegExp(`\\b${"toa" + "st"}\\s*${"mas" + "ters?"}\\b`, "i"),
    reason: "external organization terminology is not allowed",
  },
  {
    pattern: new RegExp(`\\b${"toa" + "st" + "mas" + "ters?"}\\b`, "i"),
    reason: "external organization terminology is not allowed",
  },
  {
    pattern: new RegExp(`\\b${"con" + "test"}\\b`, "i"),
    reason: "competition framing is out of scope",
  },
  {
    pattern: new RegExp(`\\b${"jud" + "ge"}(?:s|d|ment)?\\b`, "i"),
    reason: "use feedback giver or evaluator instead",
  },
  {
    pattern: new RegExp(`\\b${"bal" + "lot"}\\b`, "i"),
    reason: "use feedback form instead",
  },
  {
    pattern: new RegExp(`\\b${"win" + "ner"}\\b`, "i"),
    reason: "competition framing is out of scope",
  },
  {
    pattern: new RegExp(`\\b${"rank" + "ing"}\\b`, "i"),
    reason: "competition framing is out of scope",
  },
];

const staleRetentionPatterns = [
  {
    pattern: /\b24\s*hours?\b/i,
    reason: "public demo retention should remain 6 hours",
  },
  {
    pattern: /\bDEMO_SESSION_RETENTION_HOURS\s*=\s*24\b/i,
    reason: "public demo retention should remain 6 hours",
  },
];

const forbiddenTrackedFiles = [
  /^\.env$/i,
  /^\.env\.(?!example$).+/i,
  /(^|\/)(?:debug|error|access)\.log$/i,
  /(^|\/).*\.(?:sqlite|sqlite3|db)$/i,
  /(^|\/)(?:exports|reports|data)\//i,
];

const secretLiteralPatterns = [
  {
    pattern: /gh[pousr]_[A-Za-z0-9_]{20,}/,
    reason: "looks like a GitHub token",
  },
  {
    pattern: /(?:api[_-]?key|secret|token|password)\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{16,}/i,
    reason: "looks like a hardcoded secret",
  },
];

const allowedSecretLiteralFiles = new Set([".env.example"]);
const failures = [];

function extensionOf(file) {
  const match = file.match(/(\.[^.\/]+)$/);
  return match ? match[1].toLowerCase() : "";
}

function isTextFile(file) {
  return textExtensions.has(extensionOf(file));
}

function addFailure(file, lineNumber, reason, excerpt) {
  const location = lineNumber ? `${file}:${lineNumber}` : file;
  failures.push(`${location} - ${reason}${excerpt ? `: ${excerpt.trim()}` : ""}`);
}

for (const file of checkedFiles) {
  const absolutePath = join(root, file);

  if (!existsSync(absolutePath) || statSync(absolutePath).isDirectory()) {
    continue;
  }

  for (const pattern of forbiddenTrackedFiles) {
    if (pattern.test(file)) {
      addFailure(file, null, "forbidden tracked file", "");
    }
  }

  if (!isTextFile(file)) {
    continue;
  }

  const content = readFileSync(absolutePath, "utf8");
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const { pattern, reason } of forbiddenTerms) {
      if (pattern.test(line)) {
        addFailure(file, index + 1, reason, line);
      }
    }

    for (const { pattern, reason } of staleRetentionPatterns) {
      if (pattern.test(line)) {
        addFailure(file, index + 1, reason, line);
      }
    }

    if (!allowedSecretLiteralFiles.has(file)) {
      for (const { pattern, reason } of secretLiteralPatterns) {
        if (pattern.test(line)) {
          addFailure(file, index + 1, reason, line);
        }
      }
    }
  });
}

if (failures.length > 0) {
  console.error("Repo hygiene check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Repo hygiene check passed for ${checkedFiles.length} files.`);
console.log(`Root: ${relative(process.cwd(), root) || "."}`);
