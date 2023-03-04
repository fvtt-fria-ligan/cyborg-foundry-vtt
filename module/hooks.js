import { applyFontsAndColors } from "./colors.js";
import { uiAdd, uiDelete } from "./sound.js";

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
