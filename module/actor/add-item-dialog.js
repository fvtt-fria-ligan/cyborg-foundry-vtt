export default class AddItemDialog extends Application {
  /** @override */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = "add-item-dialog";
    options.classes = ["deathinspace"];
    options.title = game.i18n.localize("DIS.AddItem");
    options.template =
      "systems/deathinspace/templates/dialog/add-item-dialog.html";
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
    const itemData = {
      name: form.itemname.value,
      type: form.itemtype.value,
      data: {},
    };
    await this.actor.createEmbeddedDocuments("Item", [itemData]);
    this.close();
  }
}
