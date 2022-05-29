import { CY } from "../config.js";
import { addShowDicePromise, diceSound, showDice } from "../dice.js";
import { trackCarryingCapacity } from "../settings.js";

/**
 * @extends {Actor}
 */
 export class CYActor extends Actor {

  /** @override */
  static async create(data, options = {}) {
    data.token = data.token || {};
    let defaults = {};
    if (data.type === "character") {
      defaults = {
        actorLink: true,
        disposition: 1,
        vision: true,
      };
    } else if (data.type === "foe") {
      defaults = {
        actorLink: false,
        disposition: -1,
        vision: false,
      };
    } 
    mergeObject(data.token, defaults, { overwrite: false });
    return super.create(data, options);
  }

  /** @override */
  _onCreate(data, options, userId) {
    if (data.type === "character") {
      // give Characters a default class
      // TODO
      // this._addDefaultClass();
    }
    super._onCreate(data, options, userId);
  }

  normalCarryingCapacity() {
    return this.data.data.abilities.strength.value + 8;
  }

  maxCarryingCapacity() {
    return 2 * this.normalCarryingCapacity();
  }

  carryingSlots() {
    return this.data.items
      .reduce((slots, item) => slots + (item.data.data.carrySlots ?? 0), 0);
  }

  isEncumbered() {
    if (!trackCarryingCapacity()) {
      return false;
    }
    return this.carryingSlots() > this.normalCarryingCapacity();
  }

  _firstEquipped(itemType) {
    return this.data.items.filter(x => x.data.type === itemType && x.data.data.equipped).shift();
  }

  _first(itemType) {
    return this.data.items.filter(x => x.data.type === itemType).shift();
  }

  equippedArmor() {
    return this._first(CY.itemTypes.armor);
  }

  async testAgility() {
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
  }

  async testKnowledge() {
    await this._testAbility(
      "knowledge",
      "CY.Knowledge",
      null
    );
  }

  async testPresence() {
    await this._testAbility(
      "strength",
      "CY.Presence",
      null
    );
  }

  async testStrength() {
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
  }

  async testToughness() {
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
      "knowledge",
      "CY.Knowledge",
      drModifiers
    );
  }

  drModifiersToHtml(drModifiers) {
    if (!drModifiers) {
      return "";
    }
    return "<ul>" + drModifiers.map(x => `<li>${x}`) + "</ul>"
  }

  async _testAbility(ability, abilityKey, drModifiers) {
    const value = this.data.data.abilities[ability].value;
    const formula = value >= 0 ? `1d20+${value}` : `1d20-${-value}`;
    const abilityRoll = new Roll(formula);
    const flavor = `${game.i18n.localize('CY.Test')} ${game.i18n.localize(abilityKey)} ${this.drModifiersToHtml(drModifiers)}`;
    await abilityRoll.toMessage({
      flavor,
    });
  }

  async showGlitchesHelp() {
    await ChatMessage.create({
      content: game.i18n.localize("CY.GlitchesHelpHtml"),
      flavor: game.i18n.localize("CY.Glitches"),
    });    
  }  
 }
