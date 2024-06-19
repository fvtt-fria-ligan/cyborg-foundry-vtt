
import { diceSound } from "./dice.js";

export const byName = (a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0);

export const d20Formula = (modifier) => {
  return rollFormula("d20", modifier);
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
    "systems/cy-borg/templates/chat/outcome-roll-card.html",
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
};

export const upperCaseFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const lowerCaseFirst = (str) => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

export const articalize = (str) => {
  const c0 = str.charAt(0).toLowerCase();
  if (c0 == "a" || c0 == "e" || c0 == "i" || c0 == "o" || c0 == "u") {
    return `an ${str}`;
  }
  return `a ${str}`;
};

export async function rollTotal(formula, rollData={}) {
  const roll = new Roll(formula, rollData);
  await roll.evaluate();
  return roll.total;
};

// https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
export const randomIntFromInterval = (min, max) => { 
  // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
};