#!/usr/bin/env node
/**
 * PreToolUse guard for the "Jarvis" project.
 *
 * Before any `git push`, require a FRESH sprint report. If the
 * sprint-reporter agent has not run recently (writing
 * .claude/state/last-report.json), the push is denied with an instruction
 * to run the agent first. This keeps sprint files, CLAUDE.md and
 * dashboard.html in sync with the actual state before code leaves the machine.
 *
 * Fails OPEN: any parse/IO error → allow (never block legitimate work by accident).
 */
import fs from "node:fs";
import path from "node:path";

const FRESH_MS = 15 * 60 * 1000; // report considered fresh for 15 minutes

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function allow() {
  process.exit(0);
}

function deny(reason) {
  const out = {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason,
    },
  };
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

function main() {
  const raw = readStdin();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return allow(); // fail open
  }

  const tool = data.tool_name || "";
  if (tool !== "Bash" && tool !== "PowerShell") return allow();

  const cmd = String(data.tool_input?.command ?? "");
  // Match a real `git push`, not `git push --help` / `-h`.
  if (!/\bgit\s+push\b/.test(cmd)) return allow();
  if (/--help\b|\s-h\b/.test(cmd)) return allow();

  const projectDir =
    process.env.CLAUDE_PROJECT_DIR || data.cwd || process.cwd();
  const stateFile = path.join(
    projectDir,
    ".claude",
    "state",
    "last-report.json",
  );

  try {
    const st = fs.statSync(stateFile);
    if (Date.now() - st.mtimeMs < FRESH_MS) return allow(); // fresh report → OK
  } catch {
    // no report yet → fall through to deny
  }

  return deny(
    "🚦 Push bloklandi: avval `sprint-reporter` agentini ishga tushiring. " +
      "U sprint fayllarini hisobot bilan to'ldiradi, bajarilgan ishlarni [x] belgilaydi, " +
      "qarorlarni CLAUDE.md ga yozadi va dashboard.html ni aktual holat bilan sinxronlaydi. " +
      "Agent tugagach (.claude/state/last-report.json yangilanadi) `git push` ni qayta bajaring.",
  );
}

main();
