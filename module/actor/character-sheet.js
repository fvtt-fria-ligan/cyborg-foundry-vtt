const byName = (a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0);

export class CYCharacterSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cy", "sheet", "actor", "character"],
      template: "systems/cy_borg/templates/actor/character-sheet.html",
      width: 402,
      height: 900,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "combat",
        },
      ],
      // TODO: decide dragDrop setup
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
    });
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
    superData.data.data.cybernetics = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.cybernetic)
      .sort(byName);
    superData.data.data.equipment = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.equipment)
      .sort(byName);
    superData.data.data.feats = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.feat)
      .sort(byName);
    superData.data.data.nanoPowers = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.nanoPower)
      .sort(byName);
    superData.data.data.weapons = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.weapon)
      .sort(byName);

    console.log(superData);
    return superData;
  }

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