import { CYActorSheet } from "./actor-sheet.js";
import { byName } from "../utils.js";

export class CYVehicleSheet extends CYActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["cy", "sheet", "actor", "vehicle"],
      template: "systems/cy-borg/templates/actor/vehicle-sheet.html",
      width: 1000,
      height: 442,
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
  async getData() {
    const superData = await super.getData();
    if (superData.data.system.ownerId) {
      superData.data.system.owner = game.actors.get(superData.data.system.ownerId);
    }
    superData.data.system.armor = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.armor)
      .sort(byName);
    superData.data.system.equipment = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.equipment)
      .sort(byName);
    superData.data.system.weapons = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.weapon)
      .sort(byName);
    return superData;
  }
 }