import { CYActorSheet } from "./actor-sheet.js";

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
    html.find(".defend-button").on("click", this._defend.bind(this));
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

  async _defend(event) {
    event.preventDefault();
    await this.actor.defend();
  }

 }