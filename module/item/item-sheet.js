import { uiClick, uiWindowClose, uiWindowOpen } from "../sound.js";

export class CYItemSheet extends ItemSheet {  
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["cy", "sheet", "item"],
      width: 411,
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

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".tabs a.item").on("click", this._onTabClick.bind(this));  
  }

  /** @inheritdoc */
  get template() {
    const path = "systems/cy-borg/templates/item/";
    return `${path}/${this.item.type}-sheet.html`;
  }

  /** @override */
  async getData() {
    const superData = await super.getData();
    superData.cssCyberClass = superData.data.system.cybertech ? "cyber" : "";
    superData.data.system.description = await TextEditor.enrichHTML(
      superData.data.system.description);
    return superData;
  }

  _onTabClick(event) {
    uiClick();
  }  
}