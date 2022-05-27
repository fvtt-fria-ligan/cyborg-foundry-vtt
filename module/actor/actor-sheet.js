/**
 * @extends {ActorSheet}
 */
 export class CYActorSheet extends ActorSheet {
  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    // html.find(".item-create").click(this._onItemCreate.bind(this));
    html.find(".item-edit").click(this._onItemEdit.bind(this));
    html.find(".item-delete").click(this._onItemDelete.bind(this));
    // html.find(".inline-edit").change(this._onInlineEdit.bind(this));
    // html.find(".ability-name").click(this._onAbilityRoll.bind(this));
    // html.find("a.regenerate").click(this._onRegenerate.bind(this));
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
 }