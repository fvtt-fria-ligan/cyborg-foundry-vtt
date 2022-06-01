import { CYActorSheet } from "./actor-sheet.js";
import { rollMorale, rollReaction } from "./misc-rolls.js";

export class CYFoeSheet extends CYActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cy", "sheet", "actor", "foe"],
      template: "systems/cy_borg/templates/actor/foe-sheet.html",
      width: 402,
      height: 900,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "details",
        },
      ],
    });
  }

  /** @override */
  getData() {
    const superData = super.getData();
    return superData;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".reaction-button").on("click", this._onReactionClick.bind(this));
    html.find(".morale-button").on("click", this._onMoraleClick.bind(this));
  }

  async _onReactionClick(event) {
    event.preventDefault();
    await rollReaction(this.actor);
  }

  async _onMoraleClick(event) {
    event.preventDefault();
    await rollMorale(this.actor);
  }
 }