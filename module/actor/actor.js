import { CY } from "../config.js";
import { CYItem } from "../item/item.js";
import { trackCarryingCapacity } from "../settings.js";
import { documentFromPack } from "../packutils.js";
import { rollCyRage } from "./cybertech.js";
import { MakePunkDialog } from "../generator/make-punk-dialog.js";


const byCurrentTierDesc = (a, b) => (a.data.data.tier.value < b.data.data.tier.value ? 1 : b.data.data.tier.value < a.data.data.tier.value ? -1 : 0);

/**
 * @extends {Actor}
 */
 export class CYActor extends Actor {

  /** @override */
  static async create(data, options = {}) {
    data.token = data.token || {};
    let defaults = {};
    if (data.type === CY.actorTypes.character) {
      defaults = {
        actorLink: true,
        disposition: 1,
        vision: true,
      };
    } else if (data.type === CY.actorTypes.foe) {
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
    mergeObject(data.token, defaults, { overwrite: false });
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
  async _onCreateEmbeddedDocuments(embeddedName, documents, result, options, userId) {
    super._onCreateEmbeddedDocuments(embeddedName, documents, result, options, userId);
    if (this.data.type === CY.actorTypes.character) {
      for (const doc of documents) {
        if (doc instanceof CYItem && doc.data.type === CY.itemTypes.nanoPower && !doc.data.data.infestionId) {
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
    for (const item of this.data.items) {
      if (item.type === CY.itemTypes.nanoPower && !item.data.data.infestionId) {
        await item.createLinkedInfestation();
      }
    }
  }

  // ===== encumbrance =====
  
  get normalCarryingCapacity() {
    return this.data.data.abilities.strength.value + 8;
  }

  get maxCarryingCapacity() {
    return 2 * this.normalCarryingCapacity();
  }

  get carryingSlots() {
    return this.data.items
      .reduce((slots, item) => slots + (item.data.data.carrySlots ? (item.data.data.carrySlots * item.data.data.quantity) : 0), 0);
  }

  get isEncumbered() {
    if (!trackCarryingCapacity()) {
      return false;
    }
    return this.carryingSlots > this.normalCarryingCapacity;
  }

  _firstEquipped(itemType) {
    return this.data.items.filter(x => x.data.type === itemType && x.data.data.equipped).shift();
  }

  _first(itemType) {
    return this.data.items.filter(x => x.data.type === itemType).shift();
  }

  equippedArmor() {
    return this.data.items.filter(x => x.data.type === CY.itemTypes.armor).sort(byCurrentTierDesc).shift();
  }

  findItem(itemType, itemName) {
    return this.data.items.filter(x => x.data.type === itemType && x.name === itemName).shift();
  }

  cybertechCount() {
    return this.data.items
    .reduce((count, item) => count + (item.data.data.cybertech ? 1 : 0), 0);
  }

  ownedVehicles() {
    return game.actors.filter(x => x.data.type === CY.actorTypes.vehicle && x.data.data.ownerId == this.id);
  }

  unlinkedInfestations() {
    return this.data.items.filter(x => x.data.type === CY.itemTypes.infestation && !x.data.data.nanoId);
  }

  async testCyRage() {
    await rollCyRage(this);
  }

  async reroll() {
    new MakePunkDialog(this).render(true);
  }  
 }
