import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_VERSION = "1.7.0";
const targetDir = path.join(__dirname, "..", "public", "imgly-background-removal");
const marker = path.join(targetDir, "resources.json");

if (fs.existsSync(marker)) {
  process.exit(0);
}

const tgzUrl = `https://staticimgly.com/@imgly/background-removal-data/${PACKAGE_VERSION}/package.tgz`;
const tgzPath = path.join(__dirname, "..", "tmp-imgly-bg-data.tgz");

fs.mkdirSync(targetDir, { recursive: true });
execSync(`curl -L "${tgzUrl}" -o "${tgzPath}"`, { stdio: "inherit" });
execSync(`tar -xzf "${tgzPath}" -C "${targetDir}" --strip-components=2 package/dist`, {
  stdio: "inherit",
});
fs.unlinkSync(tgzPath);

if (!fs.existsSync(marker)) {
  throw new Error("IMG.LY background-removal assets were not extracted correctly.");
}
