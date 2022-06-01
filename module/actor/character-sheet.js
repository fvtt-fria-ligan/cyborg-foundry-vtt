import { CYActorSheet } from "./actor-sheet.js";
import { showAttackDialog } from "../combat/attack-dialog.js";
import { showDefendDialog } from "../combat/defend-dialog.js";
import { showRestDialog } from "../combat/rest-dialog.js";
import { rollBattered } from "../combat/battered.js";
import { rollLevelUp } from "./levelup.js";


const byName = (a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0);

export class CYCharacterSheet extends CYActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cy", "sheet", "actor", "character"],
      template: "systems/cy_borg/templates/actor/character-sheet.html",
      width: 402,
      height: 900,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "combat",
        },
      ],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
    });
  }

  /** @override */
  getData() {
    const superData = super.getData();
    superData.data.data.class = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.class)
      .pop();
    superData.data.data.apps = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.app)
      .sort(byName);
    superData.data.data.armor = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.armor)
      .sort(byName);
    superData.data.data.equipment = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.equipment)
      .sort(byName);
    superData.data.data.feats = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.feat)
      .sort(byName);
    superData.data.data.nanoPowers = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.nanoPower)
      .sort(byName);
    superData.data.data.weapons = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.weapon)
      .sort(byName);
    return superData;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html
      .find(".ability-link")
      .on("click", this._testAbility.bind(this));
    html.find(".weapon-icon").on("click", this._attack.bind(this));
    html.find(".defend-button").on("click", this._defend.bind(this));
    html.find(".rest-button").on("click", this._rest.bind(this));
    html.find(".battered-button").on("click", this._battered.bind(this));
    html.find(".level-up-button").on("click", this._levelUp.bind(this));
    html.find(".use-app-button").on("click", this._useApp.bind(this));
    html.find(".use-nano-button").on("click", this._useNano.bind(this));
    console.log(html.find(".use-app-button"));
  }

  async _testAbility(event) {
    event.preventDefault();
    const ability = event.currentTarget.dataset.ability;
    switch(ability) {
      case "agility":
        await this.actor.testAgility();
        break;
      case "glitches":
        await this.actor.showGlitchesHelp();
        break;
      case "knowledge":
        await this.actor.testKnowledge();
        break;
      case "presence":
        await this.actor.testPresence();
        break;
      case "strength":
        await this.actor.testStrength();
        break;
      case "toughness":
        await this.actor.testToughness();
        break;
    }
  }

  async _attack(event) {
    event.preventDefault();
    const item = $(event.currentTarget).parents(".item");
    const itemId = item.data("itemId");
    showAttackDialog(this.actor, itemId);
  }

  async _defend(event) {
    event.preventDefault();
    await showDefendDialog(this.actor);
  }

  async _rest(event) {
    event.preventDefault();
    await showRestDialog(this.actor);
  }

  async _battered(event) {
    event.preventDefault();
    await rollBattered(this.actor);
  }

  async _levelUp(event) {
    event.preventDefault();
    await rollLevelUp(this.actor);
  }

  async _useApp(event) {
    event.preventDefault();
    this.actor.rollUseApp();
  }

  async _useNano(event) {
    event.preventDefault();
    this.actor.rollUseNano();
  }
 }