// Post X Promote: Make Your Own Bounty 01 — entrypoint.
//
// Reads POST.json (the X post that promotes make.fun's
// make-your-own-bounty post) and prints a deterministic summary of the
// entry link. Pure Node.js standard library, no dependencies, no network:
// the post itself lives on X and is read by make.fun, this program only
// validates the link the entry names.
import { readFileSync } from "node:fs";

const POST_URL_PATTERN: RegExp =
  /^https:\/\/(x\.com|twitter\.com)\/([A-Za-z0-9_]+)\/status\/([0-9]+)$/;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  const postPath = new URL("./POST.json", import.meta.url);
  let raw: string;
  try {
    raw = readFileSync(postPath, "utf8");
  } catch {
    fail("POST.json not found next to main.ts");
  }
  let data: unknown;
  try {
    data = JSON.parse(raw as string);
  } catch {
    fail("POST.json is not valid JSON");
  }
  if (typeof data !== "object" || data === null) {
    fail("POST.json must be a JSON object");
  }
  const url = (data as Record<string, unknown>)["url"];
  if (typeof url !== "string" || url.trim() === "") {
    fail('POST.json must carry a non-empty string "url"');
  }
  const match = POST_URL_PATTERN.exec(url.trim());
  if (match === null) {
    fail(`"url" is not an X post address: ${url}`);
  }
  const summary = {
    platform: "x",
    host: match[1],
    handle: match[2],
    status_id: match[3],
    url: url.trim(),
    valid: true,
  };
  console.log(JSON.stringify(summary));
}

main();
