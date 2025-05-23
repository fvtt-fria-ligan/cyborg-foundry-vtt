import { CY } from "../config.js";
import { addShowDicePromise, diceSound, showDice } from "../dice.js";
import { d20Formula } from "../utils.js";
import { playSound } from "../sound.js";


const ATTACK_ROLL_CARD_TEMPLATE =
  "systems/cy-borg/templates/chat/attack-roll-card.html";

/**
 * Do the actual attack rolls and resolution.
 */
export async function rollAttack(
  actor, itemId, attackDR, targetArmor, 
  autofire, weakPoints, targetIsVehicle) {
  const item = actor.items.get(itemId);
  const itemRollData = item.getRollData();

  if (item.system.sound) {
    playSound(item.system.sound);
  }

  // decide relevant attack ability
  let ability;
  let abilityAbbrevKey;
  let attackTypeKey;
  if (autofire) {
    // ranged + autofire
    ability = "agility";
    abilityAbbrevKey = "CY.AgilityAbbrev";
    attackTypeKey = "CY.Autofire";
  } else if (itemRollData.weaponType?.toLowerCase() === CY.weaponTypes.ranged) {
    // ranged
    ability = "presence";
    abilityAbbrevKey = "CY.PresenceAbbrev";
    attackTypeKey = "CY.Ranged";
  } else if (itemRollData.weaponType?.toLowerCase() === CY.weaponTypes.thrown) {
    // thrown
    ability = "strength";
    abilityAbbrevKey = "CY.StrengthAbbrev";
    attackTypeKey = "CY.Thrown";
  } else {
    // melee
    ability = "strength";
    abilityAbbrevKey = "CY.StrengthAbbrev";
    attackTypeKey = "CY.Melee";
  }
  const value = actor.system.abilities[ability].value;

  // roll 1: attack
  const attackRoll = new Roll(d20Formula(value));
  await attackRoll.evaluate();
  await showDice(attackRoll);

  const d20Result = attackRoll.terms[0].results[0].result;
  const fumbleTarget = itemRollData.fumbleOn ?? 1;
  const critTarget = itemRollData.critOn ?? 20;
  const isFumble = d20Result <= fumbleTarget;
  const isCrit = d20Result >= critTarget;
  // nat 1 is always a miss, nat 20 is always a hit, otherwise check vs DR
  const isHit =
    attackRoll.total !== 1 &&
    (attackRoll.total === 20 || attackRoll.total >= attackDR);
  let attackOutcome = null;
  let damageRoll = null;
  let targetArmorRoll = null;
  let takeDamage = null;
  if (isHit) {
    // HIT!!!
    attackOutcome = game.i18n.localize(
      isCrit ? "CY.AttackCritText" : "CY.Hit"
    );
    if (weakPoints) {
      attackOutcome += ", " + game.i18n.localize("CY.IgnoreArmor");
    }
    if (autofire) {
      attackOutcome += ". " + game.i18n.localize("CY.AutofireHit");
    }
    // roll 2: damage.
    const baseDamage = targetIsVehicle ? item.system.vehicleDamage : item.system.damage;
    let damageFormula = baseDamage;
    if (damageFormula.includes("+") || damageFormula.includes("-")) {
      // wrap formula in parentheses in case of weak points / crit multiplying
      // e.g., chainsaw 1d6+1
      damageFormula = `(${damageFormula})`;
    }
    if (weakPoints) {
      damageFormula = `${damageFormula} * 2`;
    }
    if (isCrit) {
      const critMultiplier = item.system.critMultiplier ?? 2;
      damageFormula = `${damageFormula} * ${critMultiplier}`;
    }
    damageRoll = new Roll(damageFormula);
    await damageRoll.evaluate();
    const dicePromises = [];
    addShowDicePromise(dicePromises, damageRoll);
    let damage = damageRoll.total;
    // roll 3: target armor soak
    if (targetArmor && !weakPoints) {
      targetArmorRoll = new Roll(targetArmor, {});
      await targetArmorRoll.evaluate();
      addShowDicePromise(dicePromises, targetArmorRoll);
      damage = Math.max(damage - targetArmorRoll.total, 0);
    }
    if (dicePromises) {
      await Promise.all(dicePromises);
    }
    takeDamage = `${game.i18n.localize(
      "CY.Inflict"
    )} ${damage} ${game.i18n.localize("CY.Damage")}`;
  } else {
    // MISS!!!
    attackOutcome = await missText(isFumble);
  }

  const rollResult = {
    actor,
    attackDR,
    attackFormula: `1d20+${game.i18n.localize(abilityAbbrevKey)}`,
    attackRoll,
    attackOutcome,
    attackTypeKey,
    damageRoll,
    items: [item],
    takeDamage,
    targetArmorRoll,
  };
  await renderAttackRollCard(actor, rollResult);
};

async function missText(isFumble) {
  let missKey;
  if (isFumble) {
    const fumbleRoll = new Roll("1d6");
    await fumbleRoll.evaluate();
    if (fumbleRoll.total < 4) {
      missKey = "CY.AttackFumbleText1";
    } else if (fumbleRoll.total < 6) {
      missKey = "CY.AttackFumbleText2";
    } else {
      missKey = "CY.AttackFumbleText3";
    }
  } else {
    missKey = "CY.Miss";
  }
  return game.i18n.localize(missKey);
};

/**
 * Show attack rolls/result in a chat roll card.
 */
async function renderAttackRollCard(actor, rollResult) {
  const html = await renderTemplate(ATTACK_ROLL_CARD_TEMPLATE, rollResult);
  ChatMessage.create({
    content: html,
    sound: diceSound(),
    speaker: ChatMessage.getSpeaker({ actor }),
  });
};