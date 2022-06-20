import { addShowDicePromise, diceSound, showDice } from "../dice.js";
import { d20Formula } from "../utils.js";

const ATTACK_ROLL_CARD_TEMPLATE =
  "systems/cy_borg/templates/chat/attack-roll-card.html";

/**
 * Do the actual attack rolls and resolution.
 */
export const rollAttack = async (
  actor, itemId, attackDR, targetArmor, 
  autofire, weakPoints, targetIsVehicle) => {
  const item = actor.items.get(itemId);
  const itemRollData = item.getRollData();

  if (item.data.data.sound) {
    playSound(item.data.data.sound);
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
  } else if(itemRollData.weaponType === "ranged") {
    // ranged
    ability = "presence";
    abilityAbbrevKey = "CY.PresenceAbbrev";
    attackTypeKey = "CY.Ranged";
  } else {
    // melee
    ability = "strength";
    abilityAbbrevKey = "CY.StrengthAbbrev";
    attackTypeKey = "CY.Melee";
  }
  const value = actor.data.data.abilities[ability].value;

  // roll 1: attack
  const attackRoll = new Roll(d20Formula(value));
  attackRoll.evaluate({ async: false });
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
    const baseDamage = targetIsVehicle ? item.data.data.vehicleDamage : item.data.data.damage;
    let damageFormula = baseDamage;
    if (weakPoints) {
      // wrap formula in parentheses for chainsaw 1d6+1
      damageFormula = `(${damageFormula})*2`;
    }
    if (isCrit) {
      damageFormula += `(${damageFormula})*2`;
    }
    damageRoll = new Roll(damageFormula);
    damageRoll.evaluate({ async: false });
    const dicePromises = [];
    addShowDicePromise(dicePromises, damageRoll);
    let damage = damageRoll.total;
    // roll 3: target armor soak
    if (targetArmor && !weakPoints) {
      targetArmorRoll = new Roll(targetArmor, {});
      targetArmorRoll.evaluate({ async: false });
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
    attackOutcome = missText(isFumble);
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

const missText = (isFumble) => {
  let missKey;
  if (isFumble) {
    const fumbleRoll = new Roll("1d6");
    fumbleRoll.evaluate({ async: false });
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
const renderAttackRollCard = async (actor, rollResult) => {
  const html = await renderTemplate(ATTACK_ROLL_CARD_TEMPLATE, rollResult);
  ChatMessage.create({
    content: html,
    sound: diceSound(),
    speaker: ChatMessage.getSpeaker({ actor }),
  });
};