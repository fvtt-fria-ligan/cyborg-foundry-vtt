import { addShowDicePromise, diceSound, showDice } from "../dice.js";
import { rollInfestationTriggers } from "../actor/infestations.js";
import { d20Formula } from "../utils.js";

const DEFEND_ROLL_CARD_TEMPLATE =
  "systems/cy-borg/templates/chat/defend-roll-card.html";

/**
 * Do the actual defend rolls and resolution.
 */
export async function rollDefend(actor, defendDR, incomingAttack) {
  const agility = actor.system.abilities.agility.value;
  const defendFormula = d20Formula(agility);

  // roll 1: defend
  const defendRoll = new Roll(defendFormula);
  await defendRoll.evaluate();
  await showDice(defendRoll);

  const d20Result = defendRoll.terms[0].results[0].result;
  const isFumble = d20Result === 1;
  const isCrit = d20Result === 20;

  const items = [];
  let damageRoll = null;
  let armorRoll = null;
  let defendOutcome = null;
  let damage = 0;
  let takeDamage = null;

  if (isCrit) {
    // critical success
    defendOutcome = game.i18n.localize("CY.DefendCritText");
  } else if (defendRoll.total >= defendDR) {
    // success
    defendOutcome = game.i18n.localize("CY.Dodge");
  } else {
    // failure
    if (isFumble) {
      defendOutcome = game.i18n.localize("CY.DefendFumbleText");
    } else {
      defendOutcome = game.i18n.localize("CY.YouAreHit");
    }

    // roll 2: incoming damage
    let damageFormula = incomingAttack;
    if (isFumble) {
      damageFormula += " * 2";
    }
    damageRoll = new Roll(damageFormula, {});
    await damageRoll.evaluate();
    const dicePromises = [];
    addShowDicePromise(dicePromises, damageRoll);
    damage = damageRoll.total;

    // roll 3: damage reduction from equipped armor, if any
    let damageReductionDie = "";
    const armor = actor.equippedArmor();
    if (armor) {
      damageReductionDie =
        CONFIG.CY.armorTiers[armor.system.tier.value].damageReductionDie;
      items.push(armor);
    }
    if (damageReductionDie) {
      armorRoll = new Roll("@die", { die: damageReductionDie });
      await armorRoll.evaluate();
      addShowDicePromise(dicePromises, armorRoll);
      damage = Math.max(damage - armorRoll.total, 0);
    }
    if (dicePromises) {
      await Promise.all(dicePromises);
    }
    takeDamage = `${game.i18n.localize(
      "CY.Take"
    )} ${damage} ${game.i18n.localize("CY.Damage")}`;
    if (damage >= 5 && actor.unlinkedInfestations()) {
      takeDamage += "... infestations may be triggered!"
    }
  }

  const rollResult = {
    actor: actor,
    armorRoll,
    damageRoll,
    defendDR,
    defendFormula: `1d20+${game.i18n.localize("CY.AgilityAbbrev")}`,
    defendOutcome,
    defendRoll,
    items,
    takeDamage,
  };
  await renderDefendRollCard(actor, rollResult);
  if (damage >= 5) {
    await rollInfestationTriggers(actor);
  }
};

/**
 * Show attack rolls/result in a chat roll card.
 */
async function renderDefendRollCard(actor, rollResult) {
  const html = await renderTemplate(DEFEND_ROLL_CARD_TEMPLATE, rollResult);
  ChatMessage.create({
    content: html,
    sound: diceSound(),
    speaker: ChatMessage.getSpeaker({ actor }),
  });
};

