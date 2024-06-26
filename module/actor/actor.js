import { CY } from "../config.js";
import { CYItem } from "../item/item.js";
import { trackCarryingCapacity } from "../settings.js";
import { ITEMS_PACK, documentFromPack, dupeData } from "../packutils.js";
import { rollCyRage } from "./cybertech.js";
import { showMakePunkDialog } from "../generator/make-punk-dialog.js";


const byCurrentTierDesc = (a, b) => (a.system.tier.value < b.system.tier.value ? 1 : b.system.tier.value < a.system.tier.value ? -1 : 0);

/**
 * @extends {Actor}
 */
 export class CYActor extends Actor {

  /** @override */
  static async create(data, options = {}) {
    data.prototypeToken = data.prototypeToken || {};
    let defaults = {};
    if (data.type === CY.actorTypes.character) {
      defaults = {
        actorLink: true,
        disposition: 1,
        vision: true,
      };
    } else if (data.type === CY.actorTypes.npc) {
      defaults = {
        actorLink: false,
        disposition: -1,
        vision: false,
      };
    } else if (data.type === CY.actorTypes.vehicle) {
      defaults = {
        actorLink: true,
        disposition: 0,
        vision: true,
      };
    } 
    foundry.utils.mergeObject(data.prototypeToken, defaults, { overwrite: false });
    return super.create(data, options);
  }

  /** @override */
  async _onCreate(data, options, userId) {
    if (data.type === CY.actorTypes.character) {
      // give Characters a default class
      this.addDefaultClass();
      // give any nanos linked infestations
      await this.linkNanos();
    }
    super._onCreate(data, options, userId);
  }

  /** @override */
  async _onCreateDescendantDocuments(parent, collection, documents, data, options, userId) {
    super._onCreateDescendantDocuments(parent, collection, documents, data, options, userId);
    if (this.type === CY.actorTypes.character) {
      for (const doc of documents) {
        if (doc instanceof CYItem && doc.type === CY.itemTypes.nanoPower && !doc.system.infestionId) {
          await doc.createLinkedInfestation();
        }
      }
    }
  }

  async addDefaultClass() {
    // add classless punk if a class doesn't already exist
    if (!this._first(CY.itemTypes.class)) {
      const clazz = await documentFromPack(ITEMS_PACK, "Classless Punk");
      if (clazz) {
        await this.createEmbeddedDocuments("Item", [dupeData(clazz)]);
      }  
    }
  }

  async linkNanos() {
    for (const item of this.items) {
      if (item.type === CY.itemTypes.nanoPower && !item.system.infestionId) {
        await item.createLinkedInfestation();
      }
    }
  }

  // ===== encumbrance =====
  
  get normalCarryingCapacity() {
    return this.system.abilities.strength.value + 8;
  }

  get maxCarryingCapacity() {
    return 2 * this.normalCarryingCapacity();
  }

  get carryingSlots() {
    return this.items
      .reduce((slots, item) => slots + item.totalCarrySlots, 0);
  }

  get isEncumbered() {
    if (!trackCarryingCapacity()) {
      return false;
    }
    return this.carryingSlots > this.normalCarryingCapacity;
  }

  _firstEquipped(itemType) {
    return this.items.filter(x => x.type === itemType && x.system.equipped).shift();
  }

  _first(itemType) {
    return this.items.filter(x => x.type === itemType).shift();
  }

  equippedArmor() {
    return this.items.filter(x => x.type === CY.itemTypes.armor).sort(byCurrentTierDesc).shift();
  }

  findItem(itemType, itemName) {
    return this.items.filter(x => x.type === itemType && x.name === itemName).shift();
  }

  cybertechCount() {
    // only count equipped cybertech
    return this.items
    .reduce((count, item) => count + ((item.system.cybertech && item.system.equipped) ? 1 : 0), 0);
  }

  ownedVehicles() {
    return game.actors.filter(x => x.type === CY.actorTypes.vehicle && x.system.ownerId == this.id);
  }

  unlinkedInfestations() {
    return this.items.filter(x => x.type === CY.itemTypes.infestation && !x.system.nanoId);
  }

  async testCyRage() {
    await rollCyRage(this);
  }

  async reboot() {
    showMakePunkDialog(this);
  }  
 }
