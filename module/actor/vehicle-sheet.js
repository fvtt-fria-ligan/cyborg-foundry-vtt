import { CYActorSheet } from "./actor-sheet.js";
import { rollMorale, rollReaction } from "./misc-rolls.js";

export class CYVehicleSheet extends CYActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cy", "sheet", "actor", "vehicle"],
      template: "systems/cy_borg/templates/actor/vehicle-sheet.html",
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
  }

 }