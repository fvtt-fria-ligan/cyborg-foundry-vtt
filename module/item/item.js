import { CY } from "../config.js";
import { drawDocument, dupeData } from "../packutils.js";

/**
 * @extends {Item}
 */
 export class CYItem extends Item {

  /** @override */
  async _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
    // run create macro, if any
    if (s.createMacro) {
      const [packName, macroName] = s.createMacro.split(",");
      const pack = game.packs.get(packName);
      if (pack) {
        const content = await pack.getDocuments();
        const macro = content.find(x => x.name === macroName);
        if (macro) {
          console.log("Executing macro ${macroName} from pack ${packName}");          
          macro.execute({item: this});
        } else {
          console.error(`Could not find macro named ${macroName}.`);
        }  
      } else {
        console.error(`Could not find pack named ${packName}.`);
      }
    }  
  }
  
  linkedNano() {
    if (this.system.nanoId) {
      return this.findParentItem(this.system.nanoId);
    }
  }

  linkedInfestation() {
    if (this.system.infestationId) {
      return this.findParentItem(this.system.infestationId);
    }
  }

  findParentItem(id) {
    return this.parent.items.filter(x => x.id === id).shift();
  }

  async createLinkedInfestation() {
    const infestation = await drawDocument("cy-borg.random-tables", "Infestations");
    if (!infestation) {
      console.error("Failed to draw an infestation");
      return;
    }
    const data = dupeData(infestation);
    data.data.nanoId = this.id;
    const docs = await this.parent.createEmbeddedDocuments("Item", [data]);
    await this.update({["system.infestationId"]: docs[0].id})
  }

  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();
    if (this.system.nanoId) {
      this.system.nanoName = this.linkedNano()?.name;
    }
    if (this.system.infestationId) {
      this.system.infestationName = this.linkedInfestation()?.name;
    }
  }
}