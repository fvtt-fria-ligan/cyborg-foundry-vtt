import { showDice } from "../dice.js";
import { CYApplication } from "../ui/application.js";
import { showOutcomeRollCard } from "../utils.js";

export const countBullets = async (actor, itemId) => {
  const item = actor.items.get(itemId);
  if (!item) {
    return;
  }
  if (item.system.autofire) {
    showCountBulletsDialog(actor, itemId);
  } else {
    rollCountBullets(actor, itemId);
  }
};

export const rollCountBullets = async (actor, itemId, usedAutofire) => {
  const item = actor.items.get(itemId);
  if (!item) {
    return;
  }

  const formula = usedAutofire ? "1d6" : "1d8";
  const roll = new Roll(formula).evaluate({async: false});
  await showDice(roll);

  let outcome;
  if (roll.total <= 3) {
    outcome = game.i18n.localize("CY.MagEmpty");
  } else {
    outcome = game.i18n.localize("CY.MagNotEmpty");
  }

  const cardTitle = `${game.i18n.localize("CY.CountBullets")}: ${item.name}`;
  const rollResult = {
    cardTitle,
    formula,
    outcome,
    roll,
  };
  await showOutcomeRollCard(actor, rollResult);
}

export const showCountBulletsDialog = async (actor, itemId) => {
  const item = actor.items.get(itemId);
  if (!item) {
    return;
  }
  const countDialog = new CountBulletsDialog();
  countDialog.actor = actor;
  countDialog.item = item;
  countDialog.render(true);
}

export class CountBulletsDialog extends CYApplication {
  /** @override */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = "count-bullets-dialog";
    options.classes = ["cy", "dialog"];
    options.title = game.i18n.localize("CY.CountBullets");
    options.template =
      "systems/cy-borg/templates/dialog/count-bullets-dialog.html";
    options.width = 420;
    options.height = "auto";
    return options;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".count-button").click(this._onCount.bind(this));
  }

  async _onCount(event) {
    event.preventDefault();
    const form = $(event.currentTarget).closest("form.count-bullets-dialog");
    const usedAutofire = $(form).find("input[name=usedAutofire]:checked").val();
    this.close();
    rollCountBullets(this.actor, this.item.id, usedAutofire);
  }
}
