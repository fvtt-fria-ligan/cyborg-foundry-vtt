import { diceSound, showDice } from "../dice.js";
import { pluralize } from "../utils.js";

const BATTERED_ROLL_CARD_TEMPLATE =
  "systems/cy-borg/templates/chat/battered-roll-card.html";


export async function rollBattered(actor) {
  const batteredRoll = await new Roll("1d8").evaluate();
  await showDice(batteredRoll);

  let outcomeLines = [];
  let additionalRolls = [];
  if (batteredRoll.total <= 2) {
    // unconscious
    const roundsRoll = await new Roll("1d4").evaluate();
    const roundsWord = pluralize("CY.Round", "CY.Rounds", roundsRoll.total);
    const hpRoll = await new Roll("1d4").evaluate();
    outcomeLines = [
      game.i18n.format("CY.BatteredUnconscious", {
        rounds: roundsRoll.total,
        roundsWord,
        hp: hpRoll.total,
      }),
    ];
    additionalRolls = [roundsRoll, hpRoll];
  } else if (batteredRoll.total <= 4) {
    // maybe cy-rage
    const rageDR = 10 + actor.cybertechCount();
    const presenceRoll = await new Roll(`1d20+${actor.system.abilities.presence.value}`).evaluate();
    if (presenceRoll.total >= rageDR) {
      // passed presence test, so just unconscious
      const roundsRoll = await new Roll("1d4").evaluate();
      const roundsWord = pluralize("CY.Round", "CY.Rounds", roundsRoll.total);
      const hpRoll = await new Roll("1d4").evaluate();
      outcomeLines = [
        game.i18n.localize("CY.CyRageAverted") + ".",
        game.i18n.format("CY.BatteredUnconscious", {
          rounds: roundsRoll.total,
          roundsWord,
          hp: hpRoll.total,
        }),
      ];
      additionalRolls = [presenceRoll, roundsRoll, hpRoll];  
    } else {
      // cy-rage, woooo
      const hpRoll = await new Roll("1d8").evaluate();
      outcomeLines = [
        game.i18n.format("CY.BatteredCyRage", {
          hp: hpRoll.total,
        }),
      ];
      additionalRolls = [presenceRoll, hpRoll];  
    }
  } else if (batteredRoll.total <= 6) {
    // critical injury
    const bodyPart = randomBodyPart();
    const roundsRoll = await new Roll("1d4").evaluate();
    const roundsWord = pluralize("CY.Round", "CY.Rounds", roundsRoll.total);
    const hpRoll = await new Roll("1d4").evaluate();
    outcomeLines = [
      game.i18n.format("CY.BatteredCriticalInjury", {
        bodyPart,
        hp: hpRoll.total,
        rounds: roundsRoll.total,
        roundsWord,
      }),
    ];
    additionalRolls = [roundsRoll, hpRoll];
  } else if (batteredRoll.total == 7) {
    // hemmorrhage
    const hoursRoll = await new Roll("1d2").evaluate();
    const hoursWord = pluralize("CY.Hour", "CY.Hours", hoursRoll.total);
    const drModifier = game.i18n.localize(hoursRoll.total == 1 ? "CY.BatteredHemorrhageOneHour" : "CY.BatteredHemorrhageTwoHours");
    outcomeLines = [
      game.i18n.format("CY.BatteredHemorrhage", {
        hours: hoursRoll.total,
        hoursWord,
        drModifier,
      }),
    ];
    additionalRolls = [hoursRoll];
  } else {
    // death
    outcomeLines = [game.i18n.localize("CY.BatteredDead")];
  }

  const data = {
    additionalRolls,
    batteredRoll,
    outcomeLines,
  };
  const html = await renderTemplate(BATTERED_ROLL_CARD_TEMPLATE, data);
  ChatMessage.create({
    content: html,
    sound: diceSound(),
    speaker: ChatMessage.getSpeaker({ actor: actor }),
  });
}

function randomBodyPart() {
  // TODO: localize
  const bodyParts = [
    {name: "forehead"},
    {name: "eye", sided: true},
    {name: "ear", sided: true},
    {name: "jaw"},
    {name: "throat"},
    {name: "shoulder", sided: true},
    {name: "upper arm", sided: true},
    {name: "elbow", sided: true},
    {name: "lower arm", sided: true},
    {name: "hand", sided: true},
    {name: "chest"},
    {name: "spine"},
    {name: "abdomen"},
    {name: "hip", sided: true},
    {name: "groin"},
    {name: "thigh", sided: true},
    {name: "knee", sided: true},
    {name: "shin", sided: true},
    {name: "foot", sided: true},
    {name: "finger/toe"}
  ];
  const bodyPart = bodyParts[Math.floor(Math.random() * bodyParts.length)];
  if (bodyPart.sided) {
    const side = Math.random() < .5 ? "left" : "right";
    return `${side} ${bodyPart.name}`
  } else {
    return bodyPart.name;
  }
};