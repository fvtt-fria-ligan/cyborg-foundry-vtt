import { CY } from "../config.js";
import { addShowDicePromise, diceSound, showDice } from "../dice.js";
import { soundEffects, trackCarryingCapacity } from "../settings.js";
import { AttackDialog } from "../dialog/attack-dialog.js";
import { DefendDialog } from "../dialog/defend-dialog.js";
import { RestDialog } from "../dialog/rest-dialog.js";

const ATTACK_ROLL_CARD_TEMPLATE =
  "systems/cy_borg/templates/chat/attack-roll-card.html";
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

  d20Formula(modifier) {
    if (modifier < 0) {
      return `d20-${-modifier}`;
    } else if (modifier > 0) {
      return `d20+${modifier}`;
    } else {
      return "d20";
    }
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

  async showDefendDialog() {
    const attackDialog = new DefendDialog();
    attackDialog.actor = this;
    attackDialog.render(true);
  }

  /**
   * Do the actual defend rolls and resolution.
   */
  async rollDefend(defendDR, incomingAttack) {
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
      defendFormula: `1d20+${game.i18n.localize("CY.AgilityAbbrev")}`,
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

  async showAttackDialog(itemId) {
    const item = this.items.get(itemId);
    if (!item) {
      return;
    }
    const attackDialog = new AttackDialog();
    attackDialog.actor = this;
    attackDialog.item = item;
    attackDialog.render(true);
  }

  /**
   * Do the actual attack rolls and resolution.
   */
  async rollAttack(itemId, attackDR, targetArmor, autofire) {
    const item = this.items.get(itemId);
    const itemRollData = item.getRollData();

    if (soundEffects && item.data.data.sound) {
      AudioHelper.play({src: item.data.data.sound, volume: 0.8, loop: false}, true);
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
    const value = this.data.data.abilities[ability].value;

    // roll 1: attack
    const attackRoll = new Roll(this.d20Formula(value));
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
      if (autofire) {
        attackOutcome += ". " + game.i18n.localize("CY.AutofireHit");
      }
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
      attackOutcome = this._missText(isFumble);
    }

    const rollResult = {
      actor: this,
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
    await this._renderAttackRollCard(rollResult);
  }

  _missText(isFumble) {
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

  /**
   * Roll reaction.
   */
   async rollReaction() {
    const reactionRoll = new Roll("2d6");
    reactionRoll.evaluate({ async: false });
    let key = "";
    if (reactionRoll.total <= 3) {
      key = "CY.ReactionHostile";
    } else if (reactionRoll.total <= 6) {
      key = "CY.ReactionAngered";
    } else if (reactionRoll.total <= 8) {
      key = "CY.ReactionIndifferent";
    } else if (reactionRoll.total <= 10) {
      key = "CY.ReactionCurious";
    } else {
      key = "CY.ReactionAsksForHelp";
    }
    const reactionText = `${this.name} ${game.i18n.localize(key)}.`;   
    await reactionRoll.toMessage({
      flavor: reactionText
    });
  }

  /**
   * Roll morale.
   */  
  async rollMorale() {
    const moraleRoll = new Roll("2d6");
    moraleRoll.evaluate({ async: false });
    let key = "";
    if (moraleRoll.total > this.data.data.morale) {
      const resultRoll = new Roll("1d6");
      resultRoll.evaluate({ async: false });
      if (resultRoll.total <= 3) {
        key = "CY.MoraleFlees";
      } else {
        key = "CY.MoraleSurrenders";
      }
    } else {
      key = "CY.MoraleStandsStrong";
    }
    const moraleText = `${this.name} ${game.i18n.localize(key)}.`;   
    await moraleRoll.toMessage({
      flavor: moraleText
    });
  }

  async showRestDialog() {
    const restDialog = new RestDialog();
    restDialog.actor = this;
    restDialog.render(true);
  }

  async rollRest(restLength, starving) {
    if (starving) {
      await this.rollStarvation();      
    } else if (restLength === "short") {
      await this.rollHealHitPoints("d4");
    } else if (restLength === "long") {
      await this.rollHealHitPoints("d6");
    }
  }

  hitPointPlurality(num) {
    const key = num == 1 ? "CY.HitPoint" : "CY.HitPoints";
    return game.i18n.localize(key);
  }

  async rollHealHitPoints(dieRoll) {
    const roll = new Roll(dieRoll);
    roll.evaluate({async: false});
    const flavor = `${game.i18n.localize("CY.Rest")}: ${game.i18n.localize("CY.Heal")} ${roll.total} ${this.hitPointPlurality(roll.total)}`;
    await roll.toMessage({flavor});

    const newHP = Math.min(
      this.data.data.hitPoints.max,
      this.data.data.hitPoints.value + roll.total
    );
    await this.update({ ["data.hitPoints.value"]: newHP });
  }

  async rollStarvation() {
    const roll = new Roll("1d4");
    roll.evaluate({async: false});
    const flavor = `${game.i18n.localize("CY.Starving")}: ${game.i18n.localize("CY.Lose")} ${roll.total} ${this.hitPointPlurality(roll.total)}`;
    await roll.toMessage({flavor});

    const newHP = this.data.data.hitPoints.value - roll.total;
    await this.update({ ["data.hitPoints.value"]: newHP });
  }
  
  async rollBattered() {

  }

  async rollUseApp() {

  }

  async rollUseNano() {

  }
 }
