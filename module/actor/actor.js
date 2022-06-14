import { CY } from "../config.js";
import { CYItem } from "../item/item.js";
import { trackCarryingCapacity } from "../settings.js";
import { documentFromPack } from "../packutils.js";

/**
 * @extends {Actor}
 */
 export class CYActor extends Actor {

  /** @override */
  static async create(data, options = {}) {
    data.token = data.token || {};
    let defaults = {};
    if (data.type === "character") {
      defaults = {
        actorLink: true,
        disposition: 1,
        vision: true,
      };
    } else if (data.type === "foe") {
      defaults = {
        actorLink: false,
        disposition: -1,
        vision: false,
      };
    } 
    mergeObject(data.token, defaults, { overwrite: false });
    return super.create(data, options);
  }

  /** @override */
  async _onCreate(data, options, userId) {
    if (data.type === "character") {
      // give Characters a default class
      this.addDefaultClass();
      // give any nanos linked infestations
      await this.linkNanos();
    }
    super._onCreate(data, options, userId);
  }

  /** @override */
  async _onCreateEmbeddedDocuments(embeddedName, documents, result, options, userId) {
    console.log("_onCreateEmbeddedDocuments");
    super._onCreateEmbeddedDocuments(embeddedName, documents, result, options, userId);
    if (this.data.type === "character") {
      console.log(documents);
      for (const doc of documents) {
        if (doc instanceof CYItem && doc.data.type === "nanoPower" && !doc.data.data.infestionId) {
          await doc.createLinkedInfestation();
        }
      }
      // this.linkNanos();
    }
  }

  async addDefaultClass() {
    const clazz = await documentFromPack("cy_borg-core.class-classless-punk", "Classless Punk");
    if (clazz) {
      await this.createEmbeddedDocuments("Item", [duplicate(clazz.data)]);
    }
  }

  async linkNanos() {
    for (const item of this.data.items) {
      if (item.type === "nanoPower" && !item.data.data.infestionId) {
        await item.createLinkedInfestation();
      }
    }
  }

  // ===== encumbrance =====
  
  normalCarryingCapacity() {
    return this.data.data.abilities.strength.value + 8;
  }

  maxCarryingCapacity() {
    return 2 * this.normalCarryingCapacity();
  }

  carryingSlots() {
    return this.data.items
      .reduce((slots, item) => slots + (item.data.data.carrySlots ?? 0), 0);
  }

  isEncumbered() {
    if (!trackCarryingCapacity()) {
      return false;
    }
    return this.carryingSlots() > this.normalCarryingCapacity();
  }

  _firstEquipped(itemType) {
    return this.data.items.filter(x => x.data.type === itemType && x.data.data.equipped).shift();
  }

  _first(itemType) {
    return this.data.items.filter(x => x.data.type === itemType).shift();
  }

  equippedArmor() {
    return this._first(CY.itemTypes.armor);
  }

  findItem(itemType, itemName) {
    return this.data.items.filter(x => x.data.type === itemType && x.name === itemName).shift();
  }

  cybertechCount() {
    return this.data.items
    .reduce((count, item) => count + (item.data.data.cybertech ? 1 : 0), 0);
  }

  ownedVehicles() {
    return game.actors.filter(x => x.data.type === "vehicle" && x.data.data.ownerId == this.id);
  }
 }
