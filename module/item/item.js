import { CY } from "../config.js";
import { TABLES_PACK, drawDocument, dupeData } from "../packutils.js";
import { soundEffects } from "../settings.js";
import { uiEject, uiError, uiSlot } from "../sound.js";
import { byName, rollTotalSync } from "../utils.js";

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
  
  get totalCarrySlots() {
    if (this.type === CY.itemTypes.app && this.system.cyberdeckId) {
      // slotted apps don't count
      return 0;
    }
    if (this.system.equipped) {
      // equipped items don't count
      return 0;
    }
    if (this.system.carrySlots) {
      return this.system.carrySlots * this.system.quantity;
    }
    return 0;
  }

  linkedInfestation() {
    return this.parent?.items.find(item => item.system.nanoId === this._id);
  }

  async createLinkedInfestation() {
    const infestation = await drawDocument(TABLES_PACK, "Infestations");
    if (!infestation) {
      console.error("Failed to draw an infestation");
      return;
    }
    const data = dupeData(infestation);
    data.system.nanoId = this.id;
    await this.parent.createEmbeddedDocuments("Item", [data]);
  }

  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();
    if (this.type === CY.itemTypes.app && this.parent) {
    } else if (this.type === CY.itemTypes.cyberdeck && this.parent) {
      const rollData = this.parent.getRollData();
      if (this.system.slotFormula) {
        // e.g., Cyberdeck+ has slots equal to the owner's knowledge + 4.
        // We assume this is a non-random, can-be-synchronous roll.
        this.system.slots = Math.max(rollTotalSync(this.system.slotFormula, rollData), 1);
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
        setTimeout(() => app.update({ "system.cyberdeckId": this._id }), 1000);  
      } else {
        await app.update({ "system.cyberdeckId": this._id });
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
        setTimeout(() => this.update({ "system.cyberdeckId": null }), 1000);
      } else {
        await this.update({ "system.cyberdeckId": null });
      }
    }        
  }
}