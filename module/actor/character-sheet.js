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
    return superData;
  }  
 }