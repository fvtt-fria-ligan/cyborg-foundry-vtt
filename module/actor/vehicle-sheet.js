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
    if (superdata.data.system.ownerId) {
      superdata.data.system.owner = game.actors.get(superdata.data.system.ownerId);
    }
    superdata.data.system.armor = superdata.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.armor)
      .sort(byName);
    superdata.data.system.equipment = superdata.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.equipment)
      .sort(byName);
    superdata.data.system.weapons = superdata.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.weapon)
      .sort(byName);
    return superData;
  }
 }