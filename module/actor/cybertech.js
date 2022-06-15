import { showDice } from "../dice.js";
import { d20Formula, showOutcomeRollCard } from "../utils.js";

export const rollCyRage = async (actor) => {
  // Test Presence DR10 with +1DR for every cybertech installed.
  const formula = d20Formula(actor.data.data.abilities.presence.value);
  const roll = new Roll(formula).evaluate({async: false});
  await showDice(roll);

  const numCybertechInstalled = actor.cybertechCount();
  const dr = 10 + numCybertechInstalled;
  let outcome;
  if (roll.total >= dr) {
    outcome = game.i18n.localize("CY.CyRageAverted");
  } else {
    outcome = game.i18n.localize("CY.CyRageTriggered") + " " + game.i18n.localize("CY.CyRageHelp");
  }

  const rollResult = {
    cardTitle: game.i18n.localize("CY.Test") + " " + game.i18n.localize("CY.CyRage"),
    dr,
    formula: `1d20 + ${game.i18n.localize("CY.PresenceAbbrev")}`,
    outcome,
    roll
  }
  await showOutcomeRollCard(actor, rollResult);
};
