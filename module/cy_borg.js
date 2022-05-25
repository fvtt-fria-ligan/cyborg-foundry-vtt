
import { CY } from "./config.js";
import { CYCharacterSheet } from "./actor/character-sheet.js";
import { CYItemSheet } from "./item/item-sheet.js";

Hooks.once("init", async function () {
  consoleBanner();
  CONFIG.CY = CY;
  await registerHandlebarsPartials();
  registerSheets();
});

const consoleBanner = () => {
  const consoleOptions = 'background: #ffffff; color: #000000';
  console.log('%c===========================================================', consoleOptions);
  console.log('%c   ██████╗██╗   ██╗     ██████╗  ██████╗ ██████╗  ██████╗ ', consoleOptions);
  console.log('%c  ██╔════╝╚██╗ ██╔╝     ██╔══██╗██╔═══██╗██╔══██╗██╔════╝ ', consoleOptions);
  console.log('%c  ██║      ╚████╔╝      ██████╔╝██║   ██║██████╔╝██║  ███╗', consoleOptions);
  console.log('%c  ██║       ╚██╔╝       ██╔══██╗██║   ██║██╔══██╗██║   ██║', consoleOptions);
  console.log('%c  ╚██████╗   ██║███████╗██████╔╝╚██████╔╝██║  ██║╚██████╔╝', consoleOptions);
  console.log('%c   ╚═════╝   ╚═╝╚══════╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ', consoleOptions);                                                          
  console.log('%c===========================================================', consoleOptions);
};

const registerHandlebarsPartials = async () => {
  await loadTemplates([
    "systems/cy_borg/templates/actor/apps-tab.html",
    "systems/cy_borg/templates/actor/combat-tab.html",
    "systems/cy_borg/templates/actor/dossier-tab.html",
    "systems/cy_borg/templates/actor/equipment-tab.html",
    "systems/cy_borg/templates/actor/feats-tab.html",
    "systems/cy_borg/templates/actor/nano-tab.html",
    "systems/cy_borg/templates/item/item-base-fields.html",
    "systems/cy_borg/templates/item/item-description-tab.html",
    "systems/cy_borg/templates/item/item-sheet-header.html",
    "systems/cy_borg/templates/item/item-sheet-tabs.html",
  ]);
}

const registerSheets = () => {
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(CY.system, CYCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "CY.CharacterSheet",
  });  
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(CY.system, CYItemSheet, {
    makeDefault: true,
    label: "CY.ItemSheet",
  });  
};
