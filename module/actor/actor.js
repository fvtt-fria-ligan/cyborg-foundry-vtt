import { CY } from "../config.js";
import { CYItem } from "../item/item.js";
import { trackCarryingCapacity } from "../settings.js";
import { documentFromPack } from "../packutils.js";
import { rollCyRage } from "./cybertech.js";

const byCurrentTierDesc = (a, b) => (a.data.system.tier.value < b.data.system.tier.value ? 1 : b.data.system.tier.value < a.data.system.tier.value ? -1 : 0);

/**
 * @extends {Actor}
 */
 export class CYActor extends Actor {

  /** @override */
  static async create(data, options = {}) {
    system.token = system.token || {};
    let defaults = {};
    if (system.type === CY.actorTypes.character) {
      defaults = {
        actorLink: true,
        disposition: 1,
        vision: true,
      };
    } else if (system.type === CY.actorTypes.foe) {
      defaults = {
        actorLink: false,
        disposition: -1,
        vision: false,
      };
    } else if (system.type === CY.actorTypes.vehicle) {
      defaults = {
        actorLink: true,
        disposition: 0,
        vision: true,
      };
    } 
    mergeObject(system.token, defaults, { overwrite: false });
    return super.create(data, options);
  }

  /** @override */
  async _onCreate(data, options, userId) {
    if (system.type === CY.actorTypes.character) {
      // give Characters a default class
      this.addDefaultClass();
      // give any nanos linked infestations
      await this.linkNanos();
    }
    super._onCreate(data, options, userId);
  }

  /** @override */
  async _onCreateEmbeddedDocuments(embeddedName, documents, result, options, userId) {
    super._onCreateEmbeddedDocuments(embeddedName, documents, result, options, userId);
    if (this.system.type === CY.actorTypes.character) {
      for (const doc of documents) {
        if (doc instanceof CYItem && doc.system.type === CY.itemTypes.nanoPower && !doc.data.system.infestionId) {
          await doc.createLinkedInfestation();
        }
      }
    }
  }

  async addDefaultClass() {
    // add classless punk if a class doesn't already exist
    if (!this._first(CY.itemTypes.class)) {
      const clazz = await documentFromPack("cy_borg-core.class-classless-punk", "Classless Punk");
      if (clazz) {
        await this.createEmbeddedDocuments("Item", [duplicate(clazz.data)]);
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
      .reduce((slots, item) => slots + (item.system.carrySlots ? (item.system.carrySlots * item.system.quantity) : 0), 0);
  }

  get isEncumbered() {
    if (!trackCarryingCapacity()) {
      return false;
    }
    return this.carryingSlots > this.normalCarryingCapacity;
  }

  _firstEquipped(itemType) {
    return this.items.filter(x => x.system.type === itemType && x.data.system.equipped).shift();
  }

  _first(itemType) {
    return this.items.filter(x => x.system.type === itemType).shift();
  }

  equippedArmor() {
    return this.items.filter(x => x.system.type === CY.itemTypes.armor).sort(byCurrentTierDesc).shift();
  }

  findItem(itemType, itemName) {
    return this.items.filter(x => x.system.type === itemType && x.name === itemName).shift();
  }

  cybertechCount() {
    return this.items
    .reduce((count, item) => count + (item.system.cybertech ? 1 : 0), 0);
  }

  ownedVehicles() {
    return game.actors.filter(x => x.system.type === CY.actorTypes.vehicle && x.data.system.ownerId == this.id);
  }

  unlinkedInfestations() {
    return this.items.filter(x => x.system.type === CY.itemTypes.infestation && !x.data.system.nanoId);
  }

  async testCyRage() {
    await rollCyRage(this);
  }
 }
