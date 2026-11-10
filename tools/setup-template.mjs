import * as fs from "fs";
import path from "path";

const TEMPLATE_ID = "module-template";
const TEMPLATE_TITLE = "Module Template";
const TEMPLATE_REPO = "foundryvtt-module-template";

// call "node tools/setup-template.mjs [repository-name]", defaults to the project folder name
const name = process.argv[2] ?? path.basename(process.cwd());
if (name === TEMPLATE_REPO) {
    console.log("This is the template repository, nothing to do.");
    process.exit(0);
}

// Foundry ids only allow letters, digits, hyphens and underscores
const id = name.replace(/[^A-Za-z0-9_-]/g, "-");
const title = id
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
const langKey = id.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

const { id: currentId } = JSON.parse(fs.readFileSync("module.json", "utf-8"));
if (currentId !== TEMPLATE_ID) {
    console.log(`module.json id is already "${currentId}", nothing to do.`);
    process.exit(0);
}

function replaceIn(file, from, to) {
    fs.writeFileSync(file, fs.readFileSync(file, "utf-8").replaceAll(from, to));
}

replaceIn("module.json", `"id": "${TEMPLATE_ID}"`, `"id": "${id}"`);
replaceIn("module.json", `"title": "${TEMPLATE_TITLE}"`, `"title": "${title}"`);
replaceIn("package.json", `"name": "${TEMPLATE_ID}"`, `"name": "${id.toLowerCase()}"`);
replaceIn("scripts/hooks.js", `"${TEMPLATE_ID}"`, `"${id}"`);
replaceIn("lang/en.json", "MODULETEMPLATE", langKey);
replaceIn("lang/en.json", TEMPLATE_TITLE, title);

console.log(`Module id set to "${id}".`);

