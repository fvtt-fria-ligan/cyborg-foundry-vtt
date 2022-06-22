import { showAddItemDialog } from "./add-item-dialog.js";
import { byName } from "../utils.js";
import { countBullets } from "../combat/count-bullets.js";
import { uiWindowClose, uiWindowOpen } from "../sound.js";

/**
 * @extends {ActorSheet}
 */
 export class CYActorSheet extends ActorSheet {

    /** @override */
    render(force=false, options={}) {
      uiWindowOpen();
      return super.render(force, options);
    }

    /** @override */
    async close(options={}) {
      uiWindowClose();
      return super.close(options);
    }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".item-edit").click(this._onItemEdit.bind(this));
    html.find(".item-delete").click(this._onItemDelete.bind(this));
    html.find(".item-qty-plus").click(this._onItemAddQuantity.bind(this));
    html.find(".item-qty-minus").click(this._onItemSubtractQuantity.bind(this));
    html.find(".add-item-button").on("click", this._addItem.bind(this));
    html.find(".item-count-bullets").click(this._onItemCountBullets.bind(this));
  }  
  
  /** @override */
  getData() {
    const superData = super.getData();
    superData.data.data.armor = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.armor)
      .sort(byName);
    superData.data.data.equipment = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.equipment)
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

  /**
   * Handle adding quantity of an Owned Item within the Actor
   */
   async _onItemAddQuantity(event) {
    event.preventDefault();
    const anchor = $(event.currentTarget);
    const li = anchor.parents(".item");
    const itemId = li.data("itemId");
    const item = this.actor.items.get(itemId);
    const attr = "data.quantity";
    const currQuantity = getProperty(item.data, attr);
    return item.update({ [attr]: currQuantity + 1 });
  }

  /**
   * Handle subtracting quantity of an Owned Item within the Actor
   */
  async _onItemSubtractQuantity(event) {
    event.preventDefault();
    const anchor = $(event.currentTarget);
    const li = anchor.parents(".item");
    const itemId = li.data("itemId");
    const item = this.actor.items.get(itemId);
    const attr = "data.quantity";
    const currQuantity = getProperty(item.data, attr);
    // can't reduce quantity below one
    if (currQuantity > 1) {
      return item.update({ [attr]: currQuantity - 1 });
    }
  }

  async _onItemCountBullets(event) {
    event.preventDefault();
    const anchor = $(event.currentTarget);
    const parent = anchor.parents(".item");
    const itemId = parent.data("itemId");
    await countBullets(this.actor, itemId);
  }
 }