import { CYActorSheet } from "./actor-sheet.js";

export class CYFoeSheet extends CYActorSheet {
  /** @override */
  static get defaultOptions() {
    console.log("********* default options");
    return mergeObject(super.defaultOptions, {
      classes: ["cy", "sheet", "actor", "foe"],
      template: "systems/cy_borg/templates/actor/foe-sheet.html",
      width: 402,
      height: 900,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "details",
        },
      ],
    });
  }

  /** @override */
  getData() {
    const superData = super.getData();
    return superData;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    // html
    //   .find(".ability-link")
    //   .on("click", this._testAbility.bind(this));
    //   html.find(".weapon-icon").on("click", this._attack.bind(this));
    //   html.find(".defend-button").on("click", this._defend.bind(this));
  }
 }