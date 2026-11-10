import * as fs from "fs";
import { load } from "js-yaml";
import os from "os";
import path from "path";

const TEMPLATE_ID = "module-template";

// Mirrors Foundry's own default locations per OS
const localAppData = process.env.LOCALAPPDATA ?? path.join(os.homedir(), "AppData", "Local");
const PLATFORM_DEFAULTS = {
    win32: {
        installPath: path.join(localAppData, "Programs", "Foundry Virtual Tabletop"),
        dataPath: path.join(localAppData, "FoundryVTT"),
    },
    darwin: {
        installPath: "/Applications/Foundry Virtual Tabletop.app",
        dataPath: path.join(os.homedir(), "Library", "Application Support", "FoundryVTT"),
    },
    linux: {
        dataPath: path.join(
            process.env.XDG_DATA_HOME ?? path.join(os.homedir(), ".local", "share"),
            "FoundryVTT",
        ),
    },
};

const expandHome = (p) => p?.replace(/^~(?=$|[\\/])/, os.homedir());

// Electron installs nest the app (resources/app, or Contents/Resources/app on macOS), Node installs don't
function resolveAppRoot(installPath) {
    for (const nested of [["Contents", "Resources", "app"], ["resources", "app"], []]) {
        const root = path.join(installPath, ...nested);
        if (fs.existsSync(path.join(root, "client"))) return root;
    }
    return null;
}

async function link(target, linkPath) {
    if (!fs.existsSync(target)) return console.warn(`Missing ${target}, skipped.`);
    try {
        // Windows needs the link type, other platforms ignore it
        const type = fs.statSync(target).isDirectory() ? "dir" : "file";
        await fs.promises.symlink(target, linkPath, type);
        console.log(`Linked ${linkPath} -> ${target}`);
    } catch (e) {
        if (e.code === "EEXIST") return console.log(`Already linked: ${linkPath}`);
        if (e.code === "EPERM" && process.platform === "win32") {
            throw new Error(
                "Creating symlinks on Windows needs Developer Mode enabled or an elevated terminal.",
            );
        }
        throw e;
    }
}

console.log("Reforging Symlinks");

const defaults = PLATFORM_DEFAULTS[process.platform] ?? PLATFORM_DEFAULTS.linux;
let config = {};
if (fs.existsSync("foundry-config.yaml")) {
    const text = await fs.promises.readFile("foundry-config.yaml", "utf-8");
    // js-yaml throws on a file that's only comments
    if (text.replace(/#.*$/gm, "").trim()) config = load(text) ?? {};
} else {
    console.log(`No foundry-config.yaml, using ${process.platform} defaults.`);
}
const installPath = expandHome(config.installPath ?? defaults.installPath);
const dataPath = expandHome(config.dataPath ?? defaults.dataPath);

// Intellisense
const appRoot = installPath && resolveAppRoot(installPath);
if (appRoot) {
    await fs.promises.mkdir("foundry", { recursive: true });
    for (const p of ["client", "common", "tsconfig.json"]) {
        await link(path.join(appRoot, p), path.join("foundry", p));
    }
    await link(path.join(appRoot, "public", "lang"), path.join("foundry", "lang"));
} else {
    console.warn(
        `Foundry install not found at "${installPath}", set installPath in foundry-config.yaml.`,
    );
}

// Foundry only loads a module whose folder name matches its id
const { id } = JSON.parse(await fs.promises.readFile("module.json", "utf-8"));
const modulesDir = path.join(dataPath, "Data", "modules");
if (id === TEMPLATE_ID) {
    console.warn(
        `module.json id is still "${TEMPLATE_ID}", run "npm run setupTemplate" first. Skipped module link.`,
    );
} else if (fs.existsSync(modulesDir)) {
    await link(process.cwd(), path.join(modulesDir, id));
} else {
    console.warn(
        `Foundry modules folder not found at "${modulesDir}", set dataPath in foundry-config.yaml.`,
    );
}

