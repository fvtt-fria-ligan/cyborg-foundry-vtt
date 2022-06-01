import { pluralize } from "../utils.js";


export const rollRest = async (actor, restLength, starving) => {
  if (starving) {
    await rollStarvation(actor);      
  } else if (restLength === "short") {
    await rollHealHitPoints(actor, "d4");
  } else if (restLength === "long") {
    await rollHealHitPoints(actor, "d6");
  }
}

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
}

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
}