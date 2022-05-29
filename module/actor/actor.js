import { addShowDicePromise, diceSound, showDice } from "../dice.js";

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

  totalCarrySlots() {
    return this.data.items
      .reduce((slots, item) => slots + item.carrySlots, 0);
  }

  isEncumbered() {
    // if (!trackCarryingCapacity()) {
    //   return false;
    // }
    return this.carryingWeight() > this.normalCarryingCapacity();
  }

  async testAgility() {
    const drModifiers = {};
    await this._testAbility(
      "strength",
      "CY.Agility",
      "CY.AgilityAbbrev",
      drModifiers
    );
  }

  async testKnowledge() {
    const drModifiers = {};
    await this._testAbility(
      "knowledge",
      "CY.Knowledge",
      "CY.KnowledgeAbbrev",
      drModifiers
    );
  }

  async testPresence() {
    const drModifiers = {};
    await this._testAbility(
      "strength",
      "CY.Presence",
      "CY.PresenceAbbrev",
      drModifiers
    );
  }

  async testStrength() {
    const drModifiers = {};
    await this._testAbility(
      "strength",
      "CY.Strength",
      "CY.StrengthAbbrev",
      drModifiers
    );
  }

  async testToughness() {
    const drModifiers = {};
    await this._testAbility(
      "knowledge",
      "CY.Knowledge",
      "CY.KnowledgeAbbrev",
      drModifiers
    );
  }

  async _testAbility(ability, abilityKey, abilityAbbrevKey, drModifiers) {
    const abilityRoll = new Roll(
      `1d20+@abilities.${ability}.value`,
      this.getRollData()
    );

    await abilityRoll.toMessage({
      flavor: `${game.i18n.localize('CY.Test')} ${game.i18n.localize(abilityKey)}`
    });
    /*
    abilityRoll.evaluate({ async: false });
    await showDice(abilityRoll);
    const rollResult = {
      abilityKey,
      abilityRoll,
      displayFormula: `1d20 + ${game.i18n.localize(abilityAbbrevKey)}`,
      drModifiers,
    };
    const html = await renderTemplate(
      TEST_ABILITY_ROLL_CARD_TEMPLATE,
      rollResult
    );
    ChatMessage.create({
      content: html,
      sound: diceSound(),
      speaker: ChatMessage.getSpeaker({ actor: this }),
    });
    */
  }

  async showGlitchesHelp() {
    await ChatMessage.create({
      content: game.i18n.localize("CY.GlitchesHelpHtml"),
      flavor: game.i18n.localize("CY.Glitches"),
    });    
  }  
 }
