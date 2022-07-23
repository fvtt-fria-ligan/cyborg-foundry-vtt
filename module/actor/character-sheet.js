import { showRestDialog } from "../combat/rest-dialog.js";
import { rollBattered } from "../combat/battered.js";
import { nopeShowAd } from "../corpcomm/ad-bot.js";
import { testAgility, testKnowledge, testPresence, testStrength, testToughness } from "./ability-tests.js";
import { CYActorSheet } from "./actor-sheet.js";
import { rollUseApp } from "./apps.js";
import { showGlitchesHelp } from "./glitches.js";
import { rollLevelUp } from "./level-up.js";
import { rollUseNano } from "./nanos.js";
import { uiSuccess } from "../sound.js";
import { byName } from "../utils.js";


export class CYCharacterSheet extends CYActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cy", "sheet", "actor", "character"],
      template: "systems/cy_borg/templates/actor/character-sheet.html",
      width: 410,
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

    //   this.data.system.nano = game.items.find(x => x.system._id === this.data.system.nanoId);

  /** @override */
  getData() {
    const superData = super.getData();
    superData.data.system.armor = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.armor)
      .sort(byName);
    superData.data.system.equipment = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.equipment)
      .sort(byName);
    superData.data.system.weapons = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.weapon)
      .sort(byName);
    superData.data.system.class = superData.data.items
      .filter(item => item.type === CONFIG.CY.itemTypes.class)
      .pop();
    superData.data.system.apps = superData.data.items
      .filter(item => item.type === CONFIG.CY.itemTypes.app)
      .sort(byName);
    superData.data.system.feats = superData.data.items
      .filter(item => item.type === CONFIG.CY.itemTypes.feat)
      .sort(byName);
    superData.data.system.infestations = superData.data.items
      .filter(item => item.type === CONFIG.CY.itemTypes.infestation)
      .sort(byName);
    superData.data.system.nanoPowers = superData.data.items
      .filter(item => item.type === CONFIG.CY.itemTypes.nanoPower)
      .sort(byName);
    superData.data.system.encumberedClass = this.actor.isEncumbered ? "encumbered": "";
    return superData;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html
      .find(".ability-link")
      .on("click", this._testAbility.bind(this));
    html.find(".rest-button").on("click", this._rest.bind(this));
    html.find(".battered-button").on("click", this._battered.bind(this));
    html.find(".level-up-button").on("click", this._levelUp.bind(this));
    html.find(".use-app-button").on("click", this._useApp.bind(this));
    html.find(".use-nano-button").on("click", this._useNano.bind(this));
  }

  _testAbility(event) {
    event.preventDefault();
    // uiClick();
    const ability = event.currentTarget.dataset.ability;
    switch(ability) {
      case "agility":
        nopeShowAd(() => {
          uiSuccess();
          testAgility(this.actor);
        });        
        break;
      case "glitches":
        nopeShowAd(() => {
          uiSuccess();
          showGlitchesHelp(this.actor);
        });        
        break;
      case "knowledge":
        nopeShowAd(() => {
          uiSuccess();
          testKnowledge(this.actor);
        });        
        break;
      case "presence":
        nopeShowAd(() => {
          uiSuccess();
          testPresence(this.actor);
        });        
        break;
      case "strength":
        nopeShowAd(() => {
          uiSuccess();
          testStrength(this.actor);
        });        
        break;
      case "toughness":
        nopeShowAd(() => {
          uiSuccess();
          testToughness(this.actor);
        });        
        break;
    }
  }

  _rest(event) {
    event.preventDefault();
    // uiClick();
    nopeShowAd(() => {
      showRestDialog(this.actor);
    });
  }

  _battered(event) {
    event.preventDefault();
    // uiClick();
    nopeShowAd(() => {
      uiSuccess();
      rollBattered(this.actor);
    });
  }

  _levelUp(event) {
    event.preventDefault();
    // uiClick();
    nopeShowAd(() => {
      uiSuccess();
      rollLevelUp(this.actor);
    });
  }

  _useApp(event) {
    event.preventDefault();
    // uiClick();
    const item = $(event.currentTarget).parents(".item");
    const itemId = item.data("itemId");
    nopeShowAd(() => {
      uiSuccess();
      rollUseApp(this.actor, itemId);
    });
  }

  _useNano(event) {
    event.preventDefault();
    // uiClick();
    const item = $(event.currentTarget).parents(".item");
    const itemId = item.data("itemId");
    nopeShowAd(() => {
      uiSuccess();
      rollUseNano(this.actor, itemId);
    });
  }
 }