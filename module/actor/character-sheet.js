import { showAttackDialog } from "../combat/attack-dialog.js";
import { showDefendDialog } from "../combat/defend-dialog.js";
import { rollPartyInitiative } from "../combat/initiative.js";
import { showRestDialog } from "../combat/rest-dialog.js";
import { rollBattered } from "../combat/battered.js";
import { testAgility, testKnowledge, testPresence, testStrength, testToughness } from "./ability-tests.js";
import { CYActorSheet } from "./actor-sheet.js";
import { rollUseApp } from "./apps.js";
import { rollLevelUp } from "./level-up.js";
import { showGlitchesHelp } from "./glitches.js";
import { rollUseNano } from "./nanos.js";
import { byName } from "../utils.js";
import { nopeShowAd } from "../corpcomm/ad-bot.js";


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

    //   this.data.data.nano = game.items.find(x => x.data._id === this.data.data.nanoId);

  /** @override */
  getData() {
    const superData = super.getData();
    superData.data.data.class = superData.data.items
      .filter(item => item.type === CONFIG.CY.itemTypes.class)
      .pop();
    superData.data.data.apps = superData.data.items
      .filter(item => item.type === CONFIG.CY.itemTypes.app)
      .sort(byName);
    superData.data.data.feats = superData.data.items
      .filter(item => item.type === CONFIG.CY.itemTypes.feat)
      .sort(byName);
    superData.data.data.infestations = superData.data.items
      .filter(item => item.type === CONFIG.CY.itemTypes.infestation)
      .sort(byName);
    superData.data.data.nanoPowers = superData.data.items
      .filter(item => item.type === CONFIG.CY.itemTypes.nanoPower)
      .sort(byName);
    superData.data.data.encumberedClass = this.actor.isEncumbered ? "encumbered": "";
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
    html.find(".initiative-button").on("click", this._initiative.bind(this));
    html.find(".defend-button").on("click", this._defend.bind(this));
    html.find(".tier-radio").click(this._onArmorTierRadio.bind(this));
    html.find(".weapon-icon").on("click", this._attack.bind(this));
    html.find(".use-app-button").on("click", this._useApp.bind(this));
    html.find(".use-nano-button").on("click", this._useNano.bind(this));
  }

  _testAbility(event) {
    event.preventDefault();
    const ability = event.currentTarget.dataset.ability;
    switch(ability) {
      case "agility":
        nopeShowAd(() => {
          testAgility(this.actor);
        });        
        break;
      case "glitches":
        nopeShowAd(() => {
          showGlitchesHelp(this.actor);
        });        
        break;
      case "knowledge":
        nopeShowAd(() => {
          testKnowledge(this.actor);
        });        
        break;
      case "presence":
        nopeShowAd(() => {
          testPresence(this.actor);
        });        
        break;
      case "strength":
        nopeShowAd(() => {
          testStrength(this.actor);
        });        
        break;
      case "toughness":
        nopeShowAd(() => {
          testToughness(this.actor);
        });        
        break;
    }
  }

  _attack(event) {
    event.preventDefault();
    const item = $(event.currentTarget).parents(".item");
    const itemId = item.data("itemId");
    nopeShowAd(() => {
      showAttackDialog(this.actor, itemId);
    });
  }

  async _defend(event) {
    event.preventDefault();
    // await showDefendDialog(this.actor);
    nopeShowAd(() => {
      showDefendDialog(this.actor);
    });
  }

  _rest(event) {
    event.preventDefault();
    nopeShowAd(() => {
      showRestDialog(this.actor);
    });
  }

  _battered(event) {
    event.preventDefault();
    nopeShowAd(() => {
      rollBattered(this.actor);
    });
  }

  _levelUp(event) {
    event.preventDefault();
    nopeShowAd(() => {
      rollLevelUp(this.actor);
    });
  }

  _useApp(event) {
    event.preventDefault();
    const item = $(event.currentTarget).parents(".item");
    const itemId = item.data("itemId");
    nopeShowAd(() => {
      rollUseApp(this.actor, itemId);
    });
  }

  _useNano(event) {
    event.preventDefault();
    const item = $(event.currentTarget).parents(".item");
    const itemId = item.data("itemId");
    nopeShowAd(() => {
      rollUseNano(this.actor, itemId);
    });
  }

  _initiative(event) {
    event.preventDefault();
    nopeShowAd(() => {
      rollPartyInitiative(this.actor);
    });
  }

  /**
   * Handle a click on the armor current tier radio buttons.
   */
   async _onArmorTierRadio(event) {
    event.preventDefault();
    const input = $(event.currentTarget);
    const newTier = parseInt(input[0].value);
    const parent = input.parents(".item");
    const item = this.actor.items.get(parent.data("itemId"));
    await item.update({ ["data.tier.value"]: newTier });
  }  
 }