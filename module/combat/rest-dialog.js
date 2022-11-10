import { rollRest } from "./rest.js";
import { CYApplication } from "../ui/application.js";

export const showRestDialog = async (actor) => {
  const restDialog = new RestDialog();
  restDialog.actor = actor;
  restDialog.render(true);
};

export class RestDialog extends CYApplication {
  /** @override */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = "rest-dialog";
    options.classes = ["cy", "dialog"];
    options.title = game.i18n.localize("CY.Rest");
    options.template =
      "systems/cy-borg/templates/dialog/rest-dialog.html";
    options.width = 420;
    options.height = "auto";
    return options;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".rest-button").click(this._onRest.bind(this));
  }

  async _onRest(event) {
    event.preventDefault();
    const form = $(event.currentTarget).parents(".rest-dialog")[0];
    const restLength = $(form).find("input[name=rest-length]:checked").val();
    const starving = $(form).find("input[name=starving]:checked").val() ? true : false;
    this.close();
    rollRest(this.actor, restLength, starving);
  }
}
