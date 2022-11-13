import { CYActor } from "./actor/actor.js";
import { CY } from "./config.js";
import { CYCharacterSheet } from "./actor/character-sheet.js";
import { CYNpcSheet } from "./actor/npc-sheet.js";
import { CYVehicleSheet } from "./actor/vehicle-sheet.js";
import { CYItem } from "./item/item.js";
import { CYItemSheet } from "./item/item-sheet.js";
import { registerSystemSettings } from "./settings.js";
import { MakePunkDialog } from "./generator/make-punk-dialog.js";
import { createNpc } from "./generator/scvmfactory.js";
import { registerHooks } from "./hooks.js";
import { registerHandlebarsHelpers, registerHandlebarsPartials } from "./handlebars.js";

import { initializeAdBot } from "./corpcomm/ad-bot.js";
import { showChatAd } from "./corpcomm/chat-comm.js";
import { showPopupAd } from "./corpcomm/popup-comm.js";


Hooks.once("init", async () => {
  consoleBanner();
  CONFIG.CY = CY;
  // TODO: for debugging
  window.showChatAd = showChatAd;
  window.showPopupAd = showPopupAd;
  registerSystemSettings();
  registerDocumentClasses();
  registerSheets();
  registerHandlebarsHelpers();
  await registerHandlebarsPartials();
  modifyFoundryUI();
  registerHooks();
});

Hooks.once("ready", async () => {
  initializeAdBot();
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
  Actors.registerSheet(CY.system, CYNpcSheet, {
    types: ["npc"],
    makeDefault: true,
    label: "CY.NpcSheet",
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
    // only show the Create Punk button to users who can create actors
    if (game.user.can("ACTOR_CREATE")) {
      // Add buttons before directory header
      const dirHeader = html[0].querySelector(".directory-header");

      const punkHeader = document.createElement("header");
      punkHeader.classList.add("make-punk");
      punkHeader.classList.add("directory-header");
      dirHeader.parentNode.insertBefore(punkHeader, dirHeader);
      punkHeader.insertAdjacentHTML(
        "afterbegin",
        `
        <div class="header-actions action-buttons flexrow">
          <button type="button" class="make-punk-button"><i class="fas fa-skull"></i> ${game.i18n.localize('CY.MakePunk')}</button>
        </div>
        `
      );
      punkHeader
        .querySelector(".make-punk-button")
        .addEventListener("click", () => {
          new MakePunkDialog().render(true);
        });

      const npcHeader = document.createElement("header");
      npcHeader.classList.add("make-npc");
      npcHeader.classList.add("directory-header");
      dirHeader.parentNode.insertBefore(npcHeader, dirHeader);
      npcHeader.insertAdjacentHTML(
        "afterbegin",
        `
        <div class="header-actions action-buttons flexrow">
          <button type="button" class="make-npc-button"><i class="fas fa-user"></i> ${game.i18n.localize('CY.MakeNpc')}</button>
        </div>
        `
      );
      npcHeader
        .querySelector(".make-npc-button")
        .addEventListener("click", () => {
          createNpc();
        });  
    }
  });
}