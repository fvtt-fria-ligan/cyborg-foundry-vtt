import { rollDefend } from "./defend.js";

/**
 * Show a defend dialog for the given actor.
 */
 export const showDefendDialog = async (actor) => {
  const attackDialog = new DefendDialog();
  attackDialog.actor = actor;
  attackDialog.render(true);
}

export class DefendDialog extends Application {
  /** @override */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.id = "defend-dialog";
    options.classes = ["cy", "dialog"];
    options.title = game.i18n.localize("CY.Defend");
    options.template =
      "systems/cy_borg/templates/dialog/defend-dialog.html";
    options.width = 420;
    options.height = "auto";
    return options;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    html.find("input[name='defense-base-dr']").change(this._onDefenseBaseDRChange.bind(this));
    html.find("input[name='defense-base-dr']").trigger("change");    
    html.find(".defend-button").click(this._onDefend.bind(this));
  }

  /** @override */
  async getData() {
    let defendDR = await this.actor.getFlag(
      CONFIG.CY.flagScope,
      CONFIG.CY.flags.DEFEND_DR
    );
    if (!defendDR) {
      defendDR = 12; // default
    }
    let incomingAttack = await this.actor.getFlag(
      CONFIG.CY.flagScope,
      CONFIG.CY.flags.INCOMING_ATTACK
    );
    if (!incomingAttack) {
      incomingAttack = "1d4"; // default
    }

    const armor = this.actor.equippedArmor();
    const drModifiers = [];
    if (armor) {
      // armor defense adjustment is based on its max tier, not current
      // TODO: maxTier is getting stored as a string
      const maxTier = parseInt(armor.data.data.tier.max);
      const defenseModifier = CONFIG.CY.armorTiers[maxTier].defenseModifier;
      if (defenseModifier) {
        drModifiers.push(
          `${armor.name}: ${game.i18n.localize("CY.DR")} +${defenseModifier}`
        );
      }
    }
    if (this.actor.isEncumbered) {
      drModifiers.push(
        `${game.i18n.localize("CY.Encumbered")}: ${game.i18n.localize(
          "CY.DR"
        )} +2`
      );
    }

    return {
      defendDR,
      incomingAttack,
      drModifiers
    };
  }

  _onDefenseBaseDRChange(event) {
    event.preventDefault();
    const baseInput = $(event.currentTarget);
    let drModifier = 0;
    const armor = this.actor.equippedArmor();
    if (armor) {
      // TODO: maxTier is getting stored as a string
      const maxTier = parseInt(armor.data.data.tier.max);
      const defenseModifier = CONFIG.CY.armorTiers[maxTier].defenseModifier;
      if (defenseModifier) {
        drModifier += defenseModifier;
      }
    }
    if (this.actor.isEncumbered) {
      drModifier += 2;
    }
    const modifiedDR = parseInt(baseInput.val()) + drModifier;
    const form = $(baseInput).closest("form.defend-dialog");
    const modifiedInput = $(form).find("input[name=defense-modified-dr]")
    console.log(modifiedDR);
    console.log(modifiedInput);
    modifiedInput.val(modifiedDR);
  }

  async _onDefend(event) {
    event.preventDefault();
    const form = $(event.currentTarget).closest("form.defend-dialog");
    const baseDR = parseInt($(form).find("input[name=defense-base-dr]").val());
    const modifiedDR = parseInt($(form).find("input[name=defense-modified-dr]").val());
    const incomingAttack = $(form).find("input[name=incoming-attack]").val();

    if (!baseDR || !modifiedDR || !incomingAttack) {
      // TODO: prevent dialog/form submission w/ required field(s)
      console.log(baseDR);
      console.log(modifiedDR);
      console.log(incomingAttack);
      return;
    }

    this.close();
    await this.actor.setFlag(
      CONFIG.CY.flagScope,
      CONFIG.CY.flags.DEFEND_DR,
      baseDR
    );
    await this.actor.setFlag(
      CONFIG.CY.flagScope,
      CONFIG.CY.flags.INCOMING_ATTACK,
      incomingAttack
    );
    rollDefend(
      this.actor,
      modifiedDR,
      incomingAttack
    );
  }
}
