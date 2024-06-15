import { nopeShowAd } from "../corpcomm/ad-bot.js";
import { testAgility, testKnowledge, testPresence, testStrength, testToughness } from "./ability-tests.js";
import { CYActorSheet } from "./actor-sheet.js";
import { rollUseApp } from "./apps.js";
import { showGlitchesHelp } from "./glitches.js";
import { rollLevelUp } from "./level-up.js";
import { rollUseNano } from "./nanos.js";
import { uiSuccess } from "../sound.js";
import { byName } from "../utils.js";
import { CY } from "../config.js";


export class CYCharacterSheet extends CYActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["cy", "sheet", "actor", "character"],
      template: "systems/cy-borg/templates/actor/character-sheet.html",
      // width: 411,
      // height: 900,
      width: 1000,
      height: 582,
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
  async getData() {
    const superData = await super.getData();
    // TODO: move this to prepareItems?
    superData.data.items.forEach(item => {
      item.system.equippable = (
        item.type == CONFIG.CY.itemTypes.armor || 
        item.type == CONFIG.CY.itemTypes.weapon || 
        item.system.cybertech);
      item.system.equippedClass = item.system.equipped ? "equipped" : "unequipped";
      });
    superData.data.system.armor = superData.data.items
      .filter(item => item.type === CONFIG.CY.itemTypes.armor && item.system.equipped)
      .sort(byName);
    superData.data.system.equipment = superData.data.items
      .filter(item => {
        return (
          (item.type === CONFIG.CY.itemTypes.equipment && (!item.system.cybertech || !item.system.equipped)) ||
          (item.type === CONFIG.CY.itemTypes.armor && !item.system.equipped) || 
          (item.type === CONFIG.CY.itemTypes.weapon && !item.system.equipped)
          );
      })
      .sort(byName);
      superData.data.system.cybertech = superData.data.items
      .filter(item => {
        return (
          item.type === CONFIG.CY.itemTypes.equipment &&
          item.system.cybertech && 
          item.system.equipped);
      })
      .sort(byName);      
    superData.data.system.weapons = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.weapon && item.system.equipped)
      .sort(byName);
    superData.data.system.class = superData.data.items
      .filter(item => item.type === CONFIG.CY.itemTypes.class)
      .pop();
    superData.data.system.feats = superData.data.items
      .filter(item => item.type === CONFIG.CY.itemTypes.feat)
      .sort(byName);
    superData.data.system.infestations = superData.data.items
      .filter(item => item.type === CONFIG.CY.itemTypes.infestation)
      .sort(byName);
    superData.data.system.nanoPowers = superData.data.items
      .filter(item => item.type === CONFIG.CY.itemTypes.nanoPower)
      .sort(byName);
    superData.data.system.cyberdecks = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.cyberdeck)
      .sort(byName);
    superData.data.system.unslottedApps = superData.data.items
      .filter(item => item.type === CONFIG.CY.itemTypes.app)
      .filter(item => !item.system.cyberdeckId)
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
    html.find(".item-eject").on("click", this._ejectApp.bind(this));
    html.find(".level-up-button").on("click", this._levelUp.bind(this));
    html.find(".reboot-button").on("click", this._reboot.bind(this));
    html.find(".use-app-button").on("click", this._useApp.bind(this));
    html.find(".use-nano-button").on("click", this._useNano.bind(this));
  }

  /** @override */
  async _onDropItem(event, itemData) {
    await this._tryToSlotApp(event, itemData);
  }

  async _tryToSlotApp(event, itemData) {
    const item = ((await super._onDropItem(event, itemData)) || []).pop();
    if (!item || item.type !== CY.itemTypes.app) {
      // we only slot apps...
      return;
    }
    const deck = this._findDropCyberdeck(event);
    console.log(deck);
    if (deck && deck.type === CY.itemTypes.cyberdeck) {
      // ...onto cyberdecks
      await deck.slotApp(item);
    }
  }

  _findDropCyberdeck(event) {
    console.log(event);
    const dropIntoItem = $(event.srcElement).closest(".cyberdeck-row-wrapper");
    return dropIntoItem.length > 0
      ? this.actor.items.get(dropIntoItem.attr("data-item-id"))
      : null;
  }
  
  async _ejectApp(event) {
    event.preventDefault();
    const itemDiv = $(event.currentTarget).parents(".item");
    const itemId = itemDiv.data("itemId");
    const app = this.actor.items.get(itemId);
    await app.eject();
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

  _levelUp(event) {
    event.preventDefault();
    // uiClick();
    nopeShowAd(() => {
      uiSuccess();
      // confirm before leveling
      const d = new Dialog({
        title: game.i18n.localize("CY.LevelUp"),
        content: `<p>${game.i18n.localize("CY.LevelUpHelp")}</p>`,
        buttons: {
          cancel: {
            label: game.i18n.localize("CY.Cancel"),
          },
          getbetter: {
            icon: '<i class="fas fa-check"></i>',
            label: game.i18n.localize("CY.LevelUp"),
            callback: () => rollLevelUp(this.actor),
          },
        },
        default: "cancel",
      });
      d.render(true);
    });
  }

  _reboot(event) {
    event.preventDefault();
    nopeShowAd(() => {
      uiSuccess();
      this.actor.reboot();
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