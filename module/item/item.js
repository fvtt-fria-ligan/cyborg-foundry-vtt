import { CY } from "../config.js";
import { drawDocument, dupeData } from "../packutils.js";
import { soundEffects } from "../settings.js";
import { uiEject, uiError, uiSlot } from "../sound.js";
import { byName, rollTotal } from "../utils.js";

/**
 * @extends {Item}
 */
 export class CYItem extends Item {

  /** @override */
  async _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
    // run create macro, if any
    if (data.system.createMacro) {
      const [packName, macroName] = data.system.createMacro.split(",");
      const pack = game.packs.get(packName);
      if (pack) {
        const content = await pack.getDocuments();
        const macro = content.find(x => x.name === macroName);
        if (macro) {
          console.log(`Executing macro ${macroName} from pack ${packName}`);
          macro.execute({actor: this.actor});
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
    if (this.type === CY.itemTypes.app && this.parent) {
    } else if (this.type === CY.itemTypes.cyberdeck && this.parent) {
      this.system.slottedAppsData = this.slottedApps();
      const rollData = this.parent.getRollData();
      if (this.system.slotFormula) {
        this.system.slots = rollTotal(this.system.slotFormula, rollData);
      } else {
        this.system.slots = 1;
      }
      this.system.slotsUsed = this.slottedApps().length;
    } else if (this.type === CY.itemTypes.infestation && this.system.nanoId) {
      this.system.nanoName = this.linkedNano()?.name;
    } else if (this.type === CY.itemTypes.nanoPower && this.system.infestationId) {
      this.system.infestationName = this.linkedInfestation()?.name;
    }
  }

  // TODO:L figure out if we need this, or if using this.actor in prepareDerivedData() suffices
  // prepareActorDerivedData(actor) {
  // }

  slottedApps() {
    return this.parent?.items
      .filter(item => item.type === CY.itemTypes.app)
      .filter(item => item.system.cyberdeckId === this._id)
      .sort(byName);
  }  

  async slotApp(app) {
    if (app.system.cyberdeckId === this._id) {
      // already slotted in this deck
      return;
    }
    if (this.slottedApps().length < this.system.slots) {
      // slots available, so slot it
      if (soundEffects()) {
        uiSlot();
        setTimeout(() => app.update({ "data.cyberdeckId": this._id }), 1000);  
      } else {
        await app.update({ "data.cyberdeckId": this._id });
      }
    } else {
      // no empty slots
      ui.notifications.error(game.i18n.localize('CY.NoEmptySlots'));
      uiError();
    }
  }

  async eject() {
    if (this.system.cyberdeckId) {
      if (soundEffects()) {
        uiEject();
        setTimeout(() => this.update({ "data.cyberdeckId": null }), 1000);
      } else {
        await this.update({ "data.cyberdeckId": null });
      }
    }        
  }
}