import { d20Formula, showOutcomeRollCard } from "../utils.js";


export const rollInfestationTriggers = async (actor) => {
  const dr = 10;
  const formula = d20Formula(actor.system.abilities.presence.value);

  for (const infestation of actor.unlinkedInfestations()) {
    const roll = new Roll(formula).evaluate({async: false});
    let outcome;
    if (roll.total >= dr) {
      // passed
      outcome = `${infestation.name} ${game.i18n.localize("CY.Untriggered")}`;
    } else {
      // failed
      outcome = `${infestation.name} ${game.i18n.localize("CY.Triggered")}: ${infestation.system.triggered}`;
    }
    const rollResult = {
      cardCssClass: "trigger-infestation-roll-card",
      cardTitle: game.i18n.localize("CY.TriggerInfestation"),
      dr,
      formula: `1d20 + ${game.i18n.localize("CY.PresenceAbbrev")}`,
      outcome,
      roll,
    };
    await showOutcomeRollCard(actor, rollResult);
  }
};
