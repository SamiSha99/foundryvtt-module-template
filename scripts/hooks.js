const MODULE_ID = "module-template";

Hooks.once("init", () => {
    console.log(`${MODULE_ID} | init`);
});

Hooks.on("ready", () => {
    console.log(`${MODULE_ID} | ready`);
});
