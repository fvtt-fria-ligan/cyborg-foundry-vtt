import { rollAttack } from "./attack.js";
import { CYApplication } from "../ui/application.js";


export const showAttackDialog = async (actor, itemId) => {
  const item = actor.items.get(itemId);
  if (!item) {
    return;
  }
  const attackDialog = new AttackDialog();
  attackDialog.actor = actor;
  attackDialog.item = item;
  attackDialog.render(true);
}

export class AttackDialog extends CYApplication {
  /** @override */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = "attack-dialog";
    options.classes = ["cy", "dialog"];
    options.title = game.i18n.localize("CY.Attack");
    options.template =
      "systems/cy_borg/templates/dialog/attack-dialog.html";
    options.width = 420;
    options.height = "auto";
    return options;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find(".attack-button").click(this._onAttack.bind(this));
  }

  /** @override */
  async getData() {
    const autofireEnabled = this.item.data.data.autofire;
    let attackDR = await this.actor.getFlag(
      CONFIG.CY.flagScope,
      CONFIG.CY.flags.ATTACK_DR
    );
    if (!attackDR) {
      attackDR = 12; // default
    }
    const targetArmor = await this.actor.getFlag(
      CONFIG.CY.flagScope,
      CONFIG.CY.flags.TARGET_ARMOR
    );
    return {
      attackDR,
      autofireClass: autofireEnabled ? "enabled" : "disabled",
      autofireEnabled,
      targetArmor,
    };
  }

  async _onAttack(event) {
    event.preventDefault();
    const form = $(event.currentTarget).parents(".attack-dialog")[0];
    const attackDRStr = $(form).find("input[name=attack-dr]").val();
    const attackDR = parseInt(attackDRStr);
    const weakPoints = $(form).find("input[name=weakPoints]:checked").val();
    const autofire = $(form).find("input[name=autofire]:checked").val();
    const targetArmor = $(form).find("input[name=target-armor]").val();
    const targetIsVehicle = $(form).find("input[name=targetIsVehicle]:checked").val();
    this.close();
    await this.actor.setFlag(
      CONFIG.CY.flagScope,
      CONFIG.CY.flags.ATTACK_DR,
      attackDR
    );
    await this.actor.setFlag(
      CONFIG.CY.flagScope,
      CONFIG.CY.flags.TARGET_ARMOR,
      targetArmor
    );

    rollAttack(
      this.actor,
      this.item.data._id,
      attackDR,
      targetArmor,
      autofire,
      weakPoints,
      targetIsVehicle
    );
  }
}
