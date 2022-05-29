import { CY } from "../config.js";
import { addShowDicePromise, diceSound, showDice } from "../dice.js";
import { trackCarryingCapacity } from "../settings.js";

const ATTACK_DIALOG_TEMPLATE =
  "systems/cy_borg/templates/dialog/attack-dialog.html";
const ATTACK_ROLL_CARD_TEMPLATE =
  "systems/cy_borg/templates/chat/attack-roll-card.html";
const DEFEND_DIALOG_TEMPLATE =
  "systems/cy_borg/templates/dialog/defend-dialog.html";
const DEFEND_ROLL_CARD_TEMPLATE =
  "systems/cy_borg/templates/chat/defend-roll-card.html";


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

  // ===== encumbrance =====
  
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
      "presence",
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
      "toughness",
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
    const formula = this.d20Formula(value);
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

  async defend() {
    // look up any previous DR or incoming attack value
    console.log(this);
    let defendDR = await this.getFlag(
      CONFIG.CY.flagScope,
      CONFIG.CY.flags.DEFEND_DR
    );
    if (!defendDR) {
      defendDR = 12; // default
    }
    let incomingAttack = await this.getFlag(
      CONFIG.CY.flagScope,
      CONFIG.CY.flags.INCOMING_ATTACK
    );
    if (!incomingAttack) {
      incomingAttack = "1d4"; // default
    }

    const armor = this.equippedArmor();
    const drModifiers = [];
    if (armor) {
      // armor defense adjustment is based on its max tier, not current
      // TODO: maxTier is getting stored as a string
      const maxTier = parseInt(armor.data.data.tier.max);
      const defenseModifier = CONFIG.CY.armorTiers[maxTier].defenseModifier;
      if (defenseModifier) {
        drModifiers.push(
          `${armor.name}: ${game.i18n.localize("CY.DR")} +${defenseModifier}`
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

    const dialogData = {
      defendDR,
      drModifiers,
      incomingAttack,
    };
    const html = await renderTemplate(DEFEND_DIALOG_TEMPLATE, dialogData);

    return new Promise((resolve) => {
      new Dialog({
        title: game.i18n.localize("CY.Defend"),
        content: html,
        buttons: {
          roll: {
            icon: '<i class="fas fa-dice-d20"></i>',
            label: game.i18n.localize("CY.Roll"),
            callback: (html) => this._defendDialogCallback(html),
          },
        },
        default: "roll",
        render: (html) => {
          html
            .find("input[name='defensebasedr']")
            .on("change", this._onDefenseBaseDRChange.bind(this));
          html.find("input[name='defensebasedr']").trigger("change");
        },
        close: () => resolve(null),
      }).render(true);
    });
  }

  _onDefenseBaseDRChange(event) {
    event.preventDefault();
    const baseInput = $(event.currentTarget);
    let drModifier = 0;
    const armor = this.equippedArmor();
    if (armor) {
      // TODO: maxTier is getting stored as a string
      const maxTier = parseInt(armor.data.data.tier.max);
      const defenseModifier = CONFIG.CY.armorTiers[maxTier].defenseModifier;
      if (defenseModifier) {
        drModifier += defenseModifier;
      }
    }
    if (this.isEncumbered()) {
      drModifier += 2;
    }
    const modifiedDr = parseInt(baseInput[0].value) + drModifier;
    // TODO: this is a fragile way to find the other input field
    const modifiedInput = baseInput
      .parent()
      .parent()
      .find("input[name='defensemodifieddr']");
    modifiedInput.val(modifiedDr.toString());
  }

  /**
   * Callback from defend dialog.
   */
  async _defendDialogCallback(html) {
    const form = html[0].querySelector("form");
    const baseDR = parseInt(form.defensebasedr.value);
    const modifiedDR = parseInt(form.defensemodifieddr.value);
    const incomingAttack = form.incomingattack.value;
    if (!baseDR || !modifiedDR || !incomingAttack) {
      // TODO: prevent dialog/form submission w/ required field(s)
      return;
    }
    await this.setFlag(CONFIG.CY.flagScope, CONFIG.CY.flags.DEFEND_DR, baseDR);
    await this.setFlag(
      CONFIG.CY.flagScope,
      CONFIG.CY.flags.INCOMING_ATTACK,
      incomingAttack
    );
    this._rollDefend(modifiedDR, incomingAttack);
  }

  d20Formula(modifier) {
    console.log(modifier);
    if (modifier < 0) {
      return `d20-${-modifier}`;
    } else if (modifier > 0) {
      return `d20+${modifier}`;
    } else {
      return "d20";
    }
  }

  /**
   * Do the actual defend rolls and resolution.
   */
  async _rollDefend(defendDR, incomingAttack) {
    console.log(this);
    const agility = this.data.data.abilities.agility;
    const defendFormula = this.d20Formula(agility);

    // roll 1: defend
    const defendRoll = new Roll(defendFormula);
    defendRoll.evaluate({ async: false });
    await showDice(defendRoll);

    const d20Result = defendRoll.terms[0].results[0].result;
    const isFumble = d20Result === 1;
    const isCrit = d20Result === 20;

    const items = [];
    let damageRoll = null;
    let armorRoll = null;
    let defendOutcome = null;
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
      damageRoll.evaluate({ async: false });
      const dicePromises = [];
      addShowDicePromise(dicePromises, damageRoll);
      let damage = damageRoll.total;

      // roll 3: damage reduction from equipped armor, if any
      let damageReductionDie = "";
      const armor = this.equippedArmor();
      if (armor) {
        damageReductionDie =
          CONFIG.CY.armorTiers[armor.data.data.tier.value].damageReductionDie;
        items.push(armor);
      }
      if (damageReductionDie) {
        armorRoll = new Roll("@die", { die: damageReductionDie });
        armorRoll.evaluate({ async: false });
        addShowDicePromise(dicePromises, armorRoll);
        damage = Math.max(damage - armorRoll.total, 0);
      }
      if (dicePromises) {
        await Promise.all(dicePromises);
      }
      takeDamage = `${game.i18n.localize(
        "CY.Take"
      )} ${damage} ${game.i18n.localize("CY.Damage")}`;
    }

    const rollResult = {
      actor: this,
      armorRoll,
      damageRoll,
      defendDR,
      defendFormula: `1d20 + ${game.i18n.localize("CY.AgilityAbbrev")}`,
      defendOutcome,
      defendRoll,
      items,
      takeDamage,
    };
    await this._renderDefendRollCard(rollResult);
  }

  /**
   * Show attack rolls/result in a chat roll card.
   */
  async _renderDefendRollCard(rollResult) {
    const html = await renderTemplate(DEFEND_ROLL_CARD_TEMPLATE, rollResult);
    ChatMessage.create({
      content: html,
      sound: diceSound(),
      speaker: ChatMessage.getSpeaker({ actor: this }),
    });
  }

  /**
   * Attack!
   */
   async attack(itemId) {
    let attackDR = await this.getFlag(
      CONFIG.CY.flagScope,
      CONFIG.CY.flags.ATTACK_DR
    );
    if (!attackDR) {
      attackDR = 12; // default
    }
    const targetArmor = await this.getFlag(
      CONFIG.CY.flagScope,
      CONFIG.CY.flags.TARGET_ARMOR
    );
    const dialogData = {
      attackDR,
      config: CONFIG.MorkBorg,
      itemId,
      targetArmor,
    };
    const html = await renderTemplate(ATTACK_DIALOG_TEMPLATE, dialogData);
    return new Promise((resolve) => {
      new Dialog({
        title: game.i18n.localize("CY.Attack"),
        content: html,
        buttons: {
          roll: {
            icon: '<i class="fas fa-dice-d20"></i>',
            label: game.i18n.localize("CY.Roll"),
            // callback: html => resolve(_createItem(this.actor, html[0].querySelector("form")))
            callback: (html) => this._attackDialogCallback(html),
          },
        },
        default: "roll",
        close: () => resolve(null),
      }).render(true);
    });
  }

  /**
   * Callback from attack dialog.
   */
  async _attackDialogCallback(html) {
    const form = html[0].querySelector("form");
    const itemId = form.itemid.value;
    const attackDR = parseInt(form.attackdr.value);
    const targetArmor = form.targetarmor.value;
    if (!itemId || !attackDR) {
      // TODO: prevent form submit via required fields
      return;
    }
    await this.setFlag(
      CONFIG.CY.flagScope,
      CONFIG.CY.flags.ATTACK_DR,
      attackDR
    );
    await this.setFlag(
      CONFIG.CY.flagScope,
      CONFIG.CY.flags.TARGET_ARMOR,
      targetArmor
    );
    this._rollAttack(itemId, attackDR, targetArmor);
  }

  /**
   * Do the actual attack rolls and resolution.
   */
  async _rollAttack(itemId, attackDR, targetArmor) {
    const item = this.items.get(itemId);
    const itemRollData = item.getRollData();
    const actorRollData = this.getRollData();

    // roll 1: attack
    const isRanged = itemRollData.weaponType === "ranged";
    // ranged weapons use presence; melee weapons use strength
    const ability = isRanged ? "presence" : "strength";
    const attackRoll = new Roll(
      `d20+@abilities.${ability}.value`,
      actorRollData
    );
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
      // roll 2: damage.
      // Use parentheses for critical 2x in case damage die something like 1d6+1
      const damageFormula = isCrit ? "(@damage) * 2" : "@damage";
      damageRoll = new Roll(damageFormula, itemRollData);
      damageRoll.evaluate({ async: false });
      const dicePromises = [];
      addShowDicePromise(dicePromises, damageRoll);
      let damage = damageRoll.total;
      // roll 3: target damage reduction
      if (targetArmor) {
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
      attackOutcome = game.i18n.localize(
        isFumble ? "CY.AttackFumbleText" : "CY.Miss"
      );
    }

    // TODO: decide keys in handlebars/template?
    const abilityAbbrevKey = isRanged
      ? "CY.PresenceAbbrev"
      : "CY.StrengthAbbrev";
    const weaponTypeKey = isRanged
      ? "CY.Ranged"
      : "CY.Melee";
    const rollResult = {
      actor: this,
      attackDR,
      attackFormula: `1d20 + ${game.i18n.localize(abilityAbbrevKey)}`,
      attackRoll,
      attackOutcome,
      damageRoll,
      items: [item],
      takeDamage,
      targetArmorRoll,
      weaponTypeKey,
    };
    await this._renderAttackRollCard(rollResult);
  }

  /**
   * Show attack rolls/result in a chat roll card.
   */
  async _renderAttackRollCard(rollResult) {
    const html = await renderTemplate(ATTACK_ROLL_CARD_TEMPLATE, rollResult);
    ChatMessage.create({
      content: html,
      sound: diceSound(),
      speaker: ChatMessage.getSpeaker({ actor: this }),
    });
  }

 }
