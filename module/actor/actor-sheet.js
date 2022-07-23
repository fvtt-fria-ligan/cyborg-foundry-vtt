import { showAddItemDialog } from "./add-item-dialog.js";
import { showAttackDialog } from "../combat/attack-dialog.js";
import { countBullets } from "../combat/count-bullets.js";
import { showDefendDialog } from "../combat/defend-dialog.js";
import { rollPartyInitiative } from "../combat/initiative.js";
import { nopeShowAd } from "../corpcomm/ad-bot.js";
import { uiClick, uiWindowClose, uiWindowOpen } from "../sound.js";


/**
 * @extends {ActorSheet}
 */
 export class CYActorSheet extends ActorSheet {

  /** @override */
  render(force=false, options={}) {
    if (!this.rendered && this._state != Application.RENDER_STATES.RENDERING) {
      uiWindowOpen();
    }
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
    html.find(".item-edit").click(this._onItemEdit.bind(this));
    html.find(".item-delete").click(this._onItemDelete.bind(this));
    html.find(".item-qty-plus").click(this._onItemAddQuantity.bind(this));
    html.find(".item-qty-minus").click(this._onItemSubtractQuantity.bind(this));
    html.find(".add-item-button").on("click", this._addItem.bind(this));
    html.find(".item-count-bullets").click(this._onItemCountBullets.bind(this));
    html.find(".initiative-button").on("click", this._initiative.bind(this));
    html.find(".defend-button").on("click", this._defend.bind(this));
    html.find(".tier-radio").click(this._onArmorTierRadio.bind(this));
    html.find(".weapon-icon").on("click", this._attack.bind(this));
  }  
  
  _onTabClick(event) {
    uiClick();
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

  async _addItem(event) {
    event.preventDefault();
    showAddItemDialog(this.actor);
  }

  /**
   * Handle adding quantity of an Owned Item within the Actor
   */
   async _onItemAddQuantity(event) {
    event.preventDefault();
    uiClick();
    const anchor = $(event.currentTarget);
    const li = anchor.parents(".item");
    const itemId = li.data("itemId");
    const item = this.actor.items.get(itemId);
    const attr = "system.quantity";
    const currQuantity = getProperty(item, attr);
    return item.update({ [attr]: currQuantity + 1 });
  }

  /**
   * Handle subtracting quantity of an Owned Item within the Actor
   */
  async _onItemSubtractQuantity(event) {
    event.preventDefault();
    uiClick();
    const anchor = $(event.currentTarget);
    const li = anchor.parents(".item");
    const itemId = li.data("itemId");
    const item = this.actor.items.get(itemId);
    const attr = "system.quantity";
    const currQuantity = getProperty(item, attr);
    // can't reduce quantity below one
    if (currQuantity > 1) {
      return item.update({ [attr]: currQuantity - 1 });
    }
  }

  async _onItemCountBullets(event) {
    event.preventDefault();
    const anchor = $(event.currentTarget);
    const parent = anchor.parents(".item");
    const itemId = parent.data("itemId");
    await countBullets(this.actor, itemId);
  }

  _initiative(event) {
    event.preventDefault();
    // uiClick();
    nopeShowAd(() => {
      rollPartyInitiative(this.actor);
    });
  }

  _attack(event) {
    event.preventDefault();
    // uiClick();
    const item = $(event.currentTarget).parents(".item");
    const itemId = item.data("itemId");
    nopeShowAd(() => {
      showAttackDialog(this.actor, itemId);
    });
  }

  async _defend(event) {
    event.preventDefault();
    // uiClick();
    nopeShowAd(() => {
      showDefendDialog(this.actor);
    });
  }
  
  /**
   * Handle a click on the armor current tier radio buttons.
   */
   async _onArmorTierRadio(event) {
    event.preventDefault();
    uiClick();
    const input = $(event.currentTarget);
    const newTier = parseInt(input[0].value);
    const parent = input.parents(".item");
    const item = this.actor.items.get(parent.data("itemId"));
    await item.update({ ["system.tier.value"]: newTier });
  }
 }