import { d20Formula } from "../utils.js";


export const testAgility = async (actor) => {
  const drModifiers = [];
  const armor = actor.equippedArmor();
  if (armor) {
    const armorTier = CONFIG.CY.armorTiers[armor.data.data.tier.max];
    if (armorTier.agilityModifier) {
      drModifiers.push(
        `${armor.name}: ${game.i18n.localize("CY.DR")} +${
          armorTier.agilityModifier
        }`
      );
    }
  }
  if (actor.isEncumbered) {
    drModifiers.push(
      `${game.i18n.localize("CY.Encumbered")}: ${game.i18n.localize(
        "CY.DR"
      )} +2`
    );
  }
  await testAbility(
    actor,
    "agility",
    "CY.Agility",
    drModifiers
  );
};

export const testKnowledge = async (actor) => {
  await testAbility(
    actor,
    "knowledge",
    "CY.Knowledge",
    null
  );
};

export const testPresence = async (actor) => {
  await testAbility(
    actor,
    "presence",
    "CY.Presence",
    null
  );
};

export const testStrength = async (actor) => {
  const drModifiers = [];
  const armor = actor.equippedArmor();
  if (armor) {
    const armorTier = CONFIG.CY.armorTiers[armor.data.data.tier.max];
    if (armorTier.strengthModifier) {
      drModifiers.push(
        `${armor.name}: ${game.i18n.localize("CY.DR")} ${
          armorTier.strengthModifier
        }`
      );
    }
  }
  if (actor.isEncumbered) {
    drModifiers.push(
      `${game.i18n.localize("CY.Encumbered")}: ${game.i18n.localize(
        "CY.DR"
      )} +2`
    );
  }    
  await testAbility(
    actor,
    "strength",
    "CY.Strength",
    drModifiers
  );
};

export const testToughness = async (actor) => {
  const drModifiers = [];
  const armor = actor.equippedArmor();
  if (armor) {
    const armorTier = CONFIG.CY.armorTiers[armor.data.data.tier.max];
    if (armorTier.strengthModifier) {
      drModifiers.push(
        `${armor.name}: ${game.i18n.localize("CY.DR")} ${
          armorTier.strengthModifier
        }`
      );
    }
  }    
  await testAbility(
    actor,
    "toughness",
    "CY.Toughness",
    drModifiers
  );
};

const drModifiersToHtml = (drModifiers) => {
  if (!drModifiers) {
    return "";
  }
  return "<ul>" + drModifiers.map(x => `<li>${x}`) + "</ul>"
};

const testAbility = async (actor, ability, abilityKey, drModifiers) => {
  const value = actor.data.data.abilities[ability].value;
  const formula = d20Formula(value);
  const abilityRoll = new Roll(formula);
  const flavor = `${game.i18n.localize('CY.Test')} ${game.i18n.localize(abilityKey)} ${drModifiersToHtml(drModifiers)}`;
  await abilityRoll.toMessage({
    flavor,
    speaker: ChatMessage.getSpeaker({ actor }),
  });
};
