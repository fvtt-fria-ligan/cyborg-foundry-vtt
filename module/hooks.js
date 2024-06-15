import { applyFontsAndColors } from "./colors.js";
import { uiAdd, uiDelete } from "./sound.js";
import { createScvmFromClassUuid } from "./generator/scvmfactory.js";


export function registerHooks() {

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

  Hooks.on("renderJournalTextPageSheet", (journalTextPageSheet, html) => {
    html.find(".draw-from-table").on("click", drawFromRollableTable.bind(this));  
    html.find(".rollable").click(roll.bind(this)); 
    html.find(".create-scvm").click(createScvm.bind(this));   
  });

  Hooks.on("closeJournalTextPageSheet", (journalTextPageSheet, html) => {
    html.find(".draw-from-table").off("click");  
    html.find(".rollable").off("click");
    html.find(".create-scvm").off("click");
  });
};

async function drawFromRollableTable(event) {
  event.preventDefault();
  const uuid = event.currentTarget.getAttribute("data-uuid");
  if (uuid) {
    const table = await fromUuid(uuid);
    if (table instanceof RollTable) {
      const formula = event.currentTarget.getAttribute("data-roll");
      const roll = formula ? new Roll(formula) : null;
      await table.draw({roll});
    }
  }
}

function roll(event) {
  event.preventDefault();
  const formula = event.currentTarget.dataset.roll;
  if (formula) {
    const roll = new Roll(formula);
    roll.toMessage();
  }
}

async function createScvm(event) {
  event.preventDefault();
  const uuid = event.currentTarget.dataset.uuid;
  await createScvmFromClassUuid(uuid);
}