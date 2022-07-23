import { CY } from "../config.js";
import { drawDocument } from "../packutils.js";

/**
 * @extends {Item}
 */
 export class CYItem extends Item {

  linkedNano() {
    if (this.data.system.nanoId) {
      return this.findParentItem(this.data.system.nanoId);
    }
  }

  linkedInfestation() {
    if (this.data.system.infestationId) {
      return this.findParentItem(this.data.system.infestationId);
    }
  }

  findParentItem(id) {
    return this.parent.data.items.filter(x => x.id === id).shift();
  }

  async createLinkedInfestation() {
    const infestation = await drawDocument("cy_borg-core.random-tables", "Infestations");
    if (!infestation) {
      console.error("Failed to draw an infestation");
      return;
    }
    const data = duplicate(infestation.data);
    data.system.nanoId = this.id;
    const docs = await this.parent.createEmbeddedDocuments("Item", [data]);
    await this.update({["system.infestationId"]: docs[0].id})
  }
}