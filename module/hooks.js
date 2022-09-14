import { uiAdd, uiDelete } from "./sound.js";
import { CY } from "./config.js";

export const registerHooks = () => {

  Hooks.on("createItem", async (item, options, userId) => {
    if (userId != game.user.id) {
      return;
    }
    if (item.parent?._sheet?._state == Application.RENDER_STATES.RENDERED) {
      uiAdd();
    }
  });

  Hooks.on("deleteItem", async (item, options, userId) => {
    if (userId != game.user.id) {
      return;
    }
    if (item.parent?._sheet?._state == Application.RENDER_STATES.RENDERED) {
      uiDelete();
    }
  });

  Hooks.once("ready", () => {
    applyFontsAndColors();
  });

  const applyFontsAndColors = () => {
    const colorSchemeSetting = game.settings.get(CY.system, "colorScheme");
    const colorScheme = CONFIG.CY.colorSchemes[colorSchemeSetting];
    const r = document.querySelector(":root");
    // CY css variables
    r.style.setProperty("--cy-accent-color", colorScheme.accent);
    r.style.setProperty("--cy-background-color", colorScheme.background);
    r.style.setProperty("--cy-cybertext-color", colorScheme.cybertext);
    r.style.setProperty("--cy-disabled-color", colorScheme.disabled);
    r.style.setProperty("--cy-foreground-color", colorScheme.foreground);
    r.style.setProperty("--cy-highlight-color", colorScheme.highlight);
    r.style.setProperty("--cy-window-background-color", colorScheme.windowBackground);
    // Foundry css variables
    r.style.setProperty("--color-text-hyperlink", colorScheme.highlight);
    r.style.setProperty("--color-shadow-primary", colorScheme.highlight);
    r.style.setProperty("--color-shadow-highlight", colorScheme.highlight);
    r.style.setProperty("--color-border-highlight", colorScheme.highlight);
    r.style.setProperty("--color-border-highlight-alt", colorScheme.highlight);

    // TODO: fonts
    // --font-primary: 'Perfect DOS VGA 437';                
  };

  // Hooks.on("createOwnedItem", async (item, options, userId) => {
  //   if (userId != game.user.id) {
  //     return;
  //   }
  //   console.log("******* createOwnedItem");
  //   console.log(item);
  //   console.log(options);
  //   console.log(userId);
  // });

  // Hooks.on("createActor", async (actor, options, userId) => {
  //   if (userId != game.user.id) {
  //     return;
  //   }
  //   console.log("******* createActor");
  //   console.log(actor);
  //   console.log(options);
  //   console.log(userId);
  // });

  // Hooks.on("createDocument", async (document, options, userId) => {
  //   if (userId != game.user.id) {
  //     return;
  //   }
  //   console.log("******* createDocument");
  //   console.log(document);
  //   console.log(options);
  //   console.log(userId);
  // });

  // Hooks.on("createEmbeddedDocument", async (document, options, userId) => {
  //   if (userId != game.user.id) {
  //     return;
  //   }
  //   console.log("******* createEmbeddedDocument");
  //   console.log(document);
  //   console.log(options);
  //   console.log(userId);
  // })
};
