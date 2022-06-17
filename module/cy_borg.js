import { CYActor } from "./actor/actor.js";
import { CY } from "./config.js";
import { CYCharacterSheet } from "./actor/character-sheet.js";
import { CYFoeSheet } from "./actor/foe-sheet.js";
import { CYVehicleSheet } from "./actor/vehicle-sheet.js";
import { CYItem } from "./item/item.js";
import { CYItemSheet } from "./item/item-sheet.js";
import { registerSystemSettings } from "./settings.js";
import { MakePunkDialog } from "./generator/make-punk-dialog.js";

import { registerHooks } from "./hooks.js";
import { registerHandlebarsHelpers, registerHandlebarsPartials } from "./handlebars.js";

import { showChatAd } from "./corpcomm/chat-comm.js";


Hooks.once("init", async function () {
  consoleBanner();
  CONFIG.CY = CY;
  window.showChatAd = showChatAd;
  registerSystemSettings();
  registerDocumentClasses();
  registerSheets();
  registerHandlebarsHelpers();
  await registerHandlebarsPartials();
  modifyFoundryUI();
  registerHooks();
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
  Actors.registerSheet(CY.system, CYVehicleSheet, {
    types: ["vehicle"],
    makeDefault: true,
    label: "CY.VehicleSheet",
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(CY.system, CYItemSheet, {
    makeDefault: true,
    label: "CY.ItemSheet",
  });  
};

const modifyFoundryUI = () => {
  Hooks.on("renderActorDirectory", (app, html) => {
    if (game.user.can("ACTOR_CREATE")) {
      // only show the Create Punk button to users who can create actors
      const section = document.createElement("header");
      section.classList.add("make-punk");
      section.classList.add("directory-header");
      // Add menu before directory header
      const dirHeader = html[0].querySelector(".directory-header");
      dirHeader.parentNode.insertBefore(section, dirHeader);
      section.insertAdjacentHTML(
        "afterbegin",
        `
        <div class="header-actions action-buttons flexrow">
          <button type="button" class="make-punk-button"><i class="fas fa-skull"></i> ${game.i18n.localize('CY.MakeAPunk')}</button>
        </div>
        `
      );
      section
        .querySelector(".make-punk-button")
        .addEventListener("click", () => {
          new MakePunkDialog().render(true);
        });
    }
  });
}