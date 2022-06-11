import { showAddItemDialog } from "./add-item-dialog.js";

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