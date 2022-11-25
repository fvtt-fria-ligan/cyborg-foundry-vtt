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

  /** @override */
  async _onDelete(options, userId) {
    if (this.type === CY.itemTypes.nanoPower) {
      // delete any linked infestation
      const infestation = this.linkedInfestation();
      if (infestation) {
        await infestation.delete();
      }  
    }
    super._onDelete(options, userId);
  }
    
  linkedInfestation() {
    return this.parent?.items.find(item => item.system.nanoId === this._id);
  }

  async createLinkedInfestation() {
    const infestation = await drawDocument("cy-borg.random-tables", "Infestations");
    if (!infestation) {
      console.error("Failed to draw an infestation");
      return;
    }
    const data = dupeData(infestation);
    data.data.nanoId = this.id;
    await this.parent.createEmbeddedDocuments("Item", [data]);
  }

  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();
    if (this.type === CY.itemTypes.app && this.parent) {
    } else if (this.type === CY.itemTypes.cyberdeck && this.parent) {
      const rollData = this.parent.getRollData();
      if (this.system.slotFormula) {
        this.system.slots = Math.max(rollTotal(this.system.slotFormula, rollData), 1);
      } else {
        this.system.slots = 1;
      }
      this.system.slotsUsed = this.slottedApps().length;
      this.system.slottedAppsData = this.slottedApps();
    } else if (this.type === CY.itemTypes.nanoPower) {      
      this.system.infestationData = this.linkedInfestation();
    }
  }

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