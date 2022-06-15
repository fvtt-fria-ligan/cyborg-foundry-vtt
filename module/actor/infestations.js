import { diceSound } from "../dice.js";
import { d20Formula } from "../utils.js";

const OUTCOME_ROLL_CARD_TEMPLATE =
"systems/cy_borg/templates/chat/outcome-roll-card.html";

export const rollInfestationTriggers = async (actor) => {
  const dr = 10;
  const formula = d20Formula(actor.data.data.abilities.presence.value);

  for (const infestation of actor.unlinkedInfestations()) {
    const roll = new Roll(formula).evaluate({async: false});
    let outcome;
    if (roll.total >= dr) {
      // passed
      outcome = `${infestation.name} ${game.i18n.localize("CY.Untriggered")}`;
    } else {
      // failed
      outcome = `${infestation.name} ${game.i18n.localize("CY.Triggered")}: ${infestation.data.data.triggered}`;
    }

    const rollResult = {
      cardCssClass: "trigger-infestation-roll-card",
      cardTitle: game.i18n.localize("CY.TriggerInfestation"),
      dr,
      formula: `1d20 + ${game.i18n.localize("CY.PresenceAbbrev")}`,
      outcome,
      roll,
    };    
    const html = await renderTemplate(
      OUTCOME_ROLL_CARD_TEMPLATE,
      rollResult
    );
    ChatMessage.create({
      content: html,
      sound: diceSound(),
      speaker: ChatMessage.getSpeaker({ actor }),
    });
  }
};
