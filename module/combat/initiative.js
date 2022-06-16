import { showDice } from "../dice.js";
import { showOutcomeRollCard } from "../utils.js";

export const rollPartyInitiative = async (actor) => {
  const initiativeRoll = new Roll("d6", {});
  initiativeRoll.evaluate({ async: false });
  await showDice(initiativeRoll);
  let outcomeText = "";
  if (initiativeRoll.total <= 3) {
    outcomeText = game.i18n.localize("CY.InitiativeEnemiesActFirst");
  } else {
    outcomeText = game.i18n.localize("CY.InitiativePCsActFirst");
  }
  const rollResult = {
    cardTitle: game.i18n.localize('CY.PartyInitiative'),
    formula: "1d6",
    roll: initiativeRoll,
    outcome: outcomeText,
  };
  showOutcomeRollCard(actor, rollResult);

  // if a combat/encounter is happening, apply player/enemy ordering
  if (game.combats && game.combat) {
    await game.combat.setPartyInitiative(initiativeRoll.total);
  }
};
  
export const rollIndividualInitiative = async (actor) => {
  if (game.combats && game.combat) {
    // there is an encounter started in the Combat Tracker
    const combatant = game.combat.combatants.find(
      (i) => i.data.actorId === actor.id
    );
    if (combatant) {
      // the actor is part of the combat, so roll initiative
      game.combat.rollInitiative(combatant.id);
    } else {
      // the actor hasn't been added to the combat
      ui.notifications.warn(`${game.i18n.localize("CY.ActorNotInEncounter")}!`);
    }
    return;
  }

  // no encounter going on, so just show chat cards
  const formula = rollFormula("1d6", actor.data.data.abilities.agility.value);
  const initiativeRoll = new Roll(formula);
  initiativeRoll.evaluate({ async: false });
  await showDice(initiativeRoll);
  const rollResult = {
    cardTitle: game.i18n.localize('CY.Initiative'),
    formula: `1d6 + ${game.i18n.localize("CY.AgilityAbbrev")}`,
    roll: initiativeRoll
  };
  showOutcomeRollCard(actor, rollResult);
};