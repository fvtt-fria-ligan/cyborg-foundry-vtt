import { CYActorSheet } from "./actor-sheet.js";
import { rollMorale } from "./morale.js";
import { rollReaction } from "./reaction.js";

export class CYNpcSheet extends CYActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cy", "sheet", "actor", "npc"],
      template: "systems/cy-borg/templates/actor/npc-sheet.html",
      width: 411,
      height: 900,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "data",
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