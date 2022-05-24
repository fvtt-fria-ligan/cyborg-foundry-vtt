const byName = (a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0);

export class CYCharacterSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cy", "sheet", "actor", "character"],
      template: "systems/cy_borg/templates/actor/character-sheet.html",
      width: 402,
      height: 844,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "notes",
        },
      ],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }],
    });
  }

  /** @override */
  getData() {
    const superData = super.getData();
    superData.data.data.class = superData.data.items
      .filter((item) => item.type === CONFIG.CY.itemTypes.class)
      .pop();
    console.log(superData);
    return superData;
  }  
 }