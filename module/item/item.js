import { drawDocument } from "../packutils.js";

/**
 * @extends {Item}
 */
 export class CYItem extends Item {
  linkedNano() {
    if (this.data.data.nanoId) {
      return this.findParentItem(this.data.data.nanoId);
    }
  }

  linkedInfestation() {
    if (this.data.data.infestationId) {
      return this.findParentItem(this.data.data.infestationId);
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
    data.data.nanoId = this.id;
    const docs = await this.parent.createEmbeddedDocuments("Item", [data]);
    await this.update({["data.infestationId"]: docs[0].id})
  }
}