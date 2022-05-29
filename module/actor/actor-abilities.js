import { CYActor } from "./actor.js";

CYActor.prototype.testAgility = async () => {
  const drModifiers = [];
  const armor = this.equippedArmor();
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
  if (this.isEncumbered()) {
    drModifiers.push(
      `${game.i18n.localize("CY.Encumbered")}: ${game.i18n.localize(
        "CY.DR"
      )} +2`
    );
  }
  await this._testAbility(
    "agility",
    "CY.Agility",
    drModifiers
  );
};

CYActor.prototype.testKnowledge = async () => {
  await this._testAbility(
    "knowledge",
    "CY.Knowledge",
    null
  );
};

CYActor.prototype.testPresence = async () => {
  await this._testAbility(
    "presence",
    "CY.Presence",
    null
  );
};

CYActor.prototype.testStrength = async () => {
  const drModifiers = [];
  const armor = this.equippedArmor();
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
  if (this.isEncumbered()) {
    drModifiers.push(
      `${game.i18n.localize("CY.Encumbered")}: ${game.i18n.localize(
        "CY.DR"
      )} +2`
    );
  }    
  await this._testAbility(
    "strength",
    "CY.Strength",
    drModifiers
  );
};

CYActor.prototype.testToughness = async () => {
  const drModifiers = [];
  const armor = this.equippedArmor();
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
  await this._testAbility(
    "toughness",
    "CY.Knowledge",
    drModifiers
  );
};

CYActor.prototype.drModifiersToHtml = (drModifiers) => {
  if (!drModifiers) {
    return "";
  }
  return "<ul>" + drModifiers.map(x => `<li>${x}`) + "</ul>"
};

CYActor.prototype._testAbility = async (ability, abilityKey, drModifiers) => {
  const value = this.data.data.abilities[ability].value;
  const formula = this.d20Formula(value);
  const abilityRoll = new Roll(formula);
  const flavor = `${game.i18n.localize('CY.Test')} ${game.i18n.localize(abilityKey)} ${this.drModifiersToHtml(drModifiers)}`;
  await abilityRoll.toMessage({
    flavor,
  });
};

CYActor.prototype.showGlitchesHelp = async () => {
  await ChatMessage.create({
    content: game.i18n.localize("CY.GlitchesHelpHtml"),
    flavor: game.i18n.localize("CY.Glitches"),
  });    
};

