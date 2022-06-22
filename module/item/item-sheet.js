import { uiWindowClose, uiWindowOpen } from "../sound.js";

export class CYItemSheet extends ItemSheet {  
  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["cy", "sheet", "item"],
      width: 402,
      height: 900,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "data",
        },
      ],
    });
  }

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

  /** @inheritdoc */
  get template() {
    const path = "systems/cy_borg/templates/item/";
    return `${path}/${this.item.data.type}-sheet.html`;
  }

  /** @override */
  getData() {
    const superData = super.getData();
    superData.cssCyberClass = superData.data.data.cybertech ? "cyber": "";
    return superData;
  }
}