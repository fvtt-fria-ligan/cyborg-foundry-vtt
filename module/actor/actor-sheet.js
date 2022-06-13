import { showAddItemDialog } from "./add-item-dialog.js";
import { byName } from "../utils.js";

/**
 * @extends {ActorSheet}
 */
 export class CYActorSheet extends ActorSheet {
  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".item-edit").click(this._onItemEdit.bind(this));
    html.find(".item-delete").click(this._onItemDelete.bind(this));
    html.find(".add-item-button").on("click", this._addItem.bind(this));
  }  
  
  /** @override */
  getData() {
    const superData = super.getData();
    superData.data.data.class = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.class)
      .pop();
    superData.data.data.apps = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.app)
      .sort(byName);
    superData.data.data.armor = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.armor)
      .sort(byName);
    superData.data.data.equipment = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.equipment)
      .sort(byName);
    superData.data.data.feats = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.feat)
      .sort(byName);
    superData.data.data.infestations = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.infestation)
      .sort(byName);
    superData.data.data.nanoPowers = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.nanoPower)
      .sort(byName);
    superData.data.data.weapons = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.weapon)
      .sort(byName);
    return superData;
  }
  
  _onItemEdit(event) {
    const row = $(event.currentTarget).parents(".item");
    if (row) {
      const item = this.actor.items.get(row.data("itemId"));
      if (item) {
        item.sheet.render(true);
      }
    }
  }

  _onItemDelete(event) {
    const row = $(event.currentTarget).parents(".item");
    this.actor.deleteEmbeddedDocuments("Item", [row.data("itemId")]);
    row.slideUp(200, () => this.render(false));
  }

  async _addItem(event) {
    event.preventDefault();
    showAddItemDialog(this.actor);
  }
 }