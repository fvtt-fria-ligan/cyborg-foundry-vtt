import { CYActor } from "./actor/actor.js";
import { CY } from "./config.js";
import { CYCharacterSheet } from "./actor/character-sheet.js";
import { CYFoeSheet } from "./actor/foe-sheet.js";
import { CYItem } from "./item/item.js";
import { CYItemSheet } from "./item/item-sheet.js";
import { registerSystemSettings } from "./settings.js";

Hooks.once("init", async function () {
  consoleBanner();
  CONFIG.CY = CY;
  registerSystemSettings();
  registerDocumentClasses();
  registerSheets();
  registerHandlebarsHelpers();
  await registerHandlebarsPartials();
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

const registerDocumentClasses = () => {
  CONFIG.Actor.documentClass = CYActor;
  CONFIG.Item.documentClass = CYItem;
}

const registerSheets = () => {
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(CY.system, CYCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "CY.CharacterSheet",
  });
  Actors.registerSheet(CY.system, CYFoeSheet, {
    types: ["foe"],
    makeDefault: true,
    label: "CY.FoeSheet",
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(CY.system, CYItemSheet, {
    makeDefault: true,
    label: "CY.ItemSheet",
  });  
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

const registerHandlebarsHelpers = () => {
  /**
   * Formats a Roll as either the total or x + y + z = total if the roll has multiple terms.
   */
   Handlebars.registerHelper("xtotal", (roll) => {
    // collapse addition of negatives into just subtractions
    // e.g., 15 +  - 1 => 15 - 1
    // Also: apparently roll.result uses 2 spaces as separators?
    // We replace both 2- and 1-space varieties
    const result = roll.result.replace("+  -", "-").replace("+ -", "-");
    // roll.result is a string of terms. E.g., "16" or "1 + 15".
    if (result !== roll.total.toString()) {
      return `${result} = ${roll.total}`;
    } else {
      return result;
    }
  });  
}