import { d20Formula } from "../utils.js";


export async function testAgility(actor) {
  const drModifiers = [];
  const armor = actor.equippedArmor();
  if (armor) {
    const armorTier = CONFIG.CY.armorTiers[armor.system.tier.max];
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

export async function testKnowledge(actor) {
  await testAbility(
    actor,
    "knowledge",
    "CY.Knowledge",
    null
  );
};

export async function testPresence(actor) {
  await testAbility(
    actor,
    "presence",
    "CY.Presence",
    null
  );
};

export async function testStrength(actor) {
  const drModifiers = [];
  const armor = actor.equippedArmor();
  if (armor) {
    const armorTier = CONFIG.CY.armorTiers[armor.system.tier.max];
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

export async function testToughness(actor) {
  const drModifiers = [];
  const armor = actor.equippedArmor();
  if (armor) {
    const armorTier = CONFIG.CY.armorTiers[armor.system.tier.max];
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

function drModifiersToHtml(drModifiers) {
  if (!drModifiers) {
    return "";
  }
  return "<ul>" + drModifiers.map(x => `<li>${x}`) + "</ul>"
};

async function testAbility(actor, ability, abilityKey, drModifiers) {
  const value = actor.system.abilities[ability].value;
  const formula = d20Formula(value);
  const abilityRoll = new Roll(formula);
  const flavor = `${game.i18n.localize('CY.Test')} ${game.i18n.localize(abilityKey)} ${drModifiersToHtml(drModifiers)}`;
  await abilityRoll.toMessage({
    flavor,
    speaker: ChatMessage.getSpeaker({ actor }),
  });
};
