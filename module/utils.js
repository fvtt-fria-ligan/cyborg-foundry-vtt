
import { diceSound } from "./dice.js";

export const byName = (a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0);

export const d20Formula = (modifier) => {
  return rollFormula("d20");
};

export const rollFormula = (roll, modifier) => {
  if (modifier < 0) {
    return `${roll}-${-modifier}`;
  } else if (modifier > 0) {
    return `${roll}+${modifier}`;
  } else {
    return roll;
  }
};

export const pluralize = (key1, key2, num) => {
  return game.i18n.localize(num == 1 ? key1 : key2);
};

export const showOutcomeRollCard = async (actor, rollResult) => {
  const html = await renderTemplate(
    "systems/cy_borg/templates/chat/outcome-roll-card.html",
    rollResult
  );
  ChatMessage.create({
    content: html,
    sound: diceSound(),
    speaker: ChatMessage.getSpeaker({ actor }),
  });  
};

export const sample = (array) => {
  if (!array) {
    return;
  }
  return array[Math.floor(Math.random() * array.length)];
}