import { CY } from "../config.js";
import { pluralize } from "../utils.js";


export const rollRest = async (actor, restLength, starving) => {
  if (starving) {
    await rollStarvation(actor);      
  } else if (restLength === "short") {
    await rollHealHitPoints(actor, "d4");
  } else if (restLength === "long") {
    await rollHealHitPoints(actor, "d6");
    if (actor.data.data.glitches.value === 0) {
      await rollGlitches(actor);
    }
    await resetFumbles(actor);    
  }
};

const rollStarvation = async (actor) => {
  const roll = new Roll("1d4");
  roll.evaluate({async: false});
  const flavor = `${game.i18n.localize("CY.Starving")}: ${game.i18n.localize("CY.Lose")} ${roll.total} ${pluralize("CY.HitPoint", "CY.HitPoints", roll.total)}`;
  await roll.toMessage({
    flavor,
    speaker: ChatMessage.getSpeaker({ actor: actor }),
  });

  const newHP = actor.data.data.hitPoints.value - roll.total;
  await actor.update({ ["data.hitPoints.value"]: newHP });
};

const rollHealHitPoints = async (actor, dieRoll) => {
  const roll = new Roll(dieRoll);
  roll.evaluate({async: false});
  const flavor = `${game.i18n.localize("CY.Rest")}: ${game.i18n.localize("CY.Heal")} ${roll.total} ${pluralize("CY.HitPoint", "CY.HitPoints", roll.total)}`;
  await roll.toMessage({
    flavor,
    speaker: ChatMessage.getSpeaker({ actor: actor }),
  });

  const newHP = Math.min(
    actor.data.data.hitPoints.max,
    actor.data.data.hitPoints.value + roll.total
  );
  await actor.update({ ["data.hitPoints.value"]: newHP });
};

const rollGlitches = async (actor) => {
  const classItem = actor.items.filter((x) => x.type === CY.itemTypes.class).pop();
  if (!classItem || !classItem.data.data.glitches) {
    return;
  }
  const roll = new Roll(classItem.data.data.glitches);
  await roll.toMessage({
    flavor: game.i18n.localize("CY.Glitches"),
    speaker: ChatMessage.getSpeaker({ actor }),
  })
  await actor.update({ ["data.glitches"]: { max: roll.total, value: roll.total } });
};

const resetFumbles = async (actor) => {
  await actor.update({ 
    ["data.appFumbleOn"]: 1,
    ["data.nanoFumbleOn"]: 1,
  });
};