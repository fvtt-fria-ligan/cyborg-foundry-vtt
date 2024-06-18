import { CYApplication } from "../ui/application.js";

export function showAddItemDialog(actor) {
  const dialog = new AddItemDialog();
  dialog.actor = actor;
  dialog.render(true);
}

export class AddItemDialog extends CYApplication {
  /** @override */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = "add-item-dialog";
    options.classes = ["cy", "dialog"];
    options.title = game.i18n.localize("CY.AddItem");
    options.template =
      "systems/cy-borg/templates/dialog/add-item-dialog.html";
    options.width = 420;
    options.height = "auto";
    return options;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".add-item-button").click(this._onAddItem.bind(this));
  }

  async _onAddItem(event) {
    event.preventDefault();
    const form = $(event.currentTarget).parents(".add-item-dialog")[0];
    const itemName = form.itemname.value;
    const itemType = form.itemtype.value;
    if (!itemName || !itemType) {
      ui.notifications.error(game.i18n.localize('CY.ItemNameAndTypeRequired'));
      return;
    }
    const itemData = {
      name: form.itemname.value,
      type: form.itemtype.value,
      data: {},
    };
    const docs = await this.actor.createEmbeddedDocuments("Item", [itemData]);
    this.close();
    docs[0].sheet.render(true);  
  }
}
