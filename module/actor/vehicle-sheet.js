import { CYActorSheet } from "./actor-sheet.js";

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
    if (superData.data.data.ownerId) {
      superData.data.data.owner = game.actors.get(superData.data.data.ownerId);
    }
    return superData;
  }
 }