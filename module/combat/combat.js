import { rollPartyInitiative } from "./initiative.js";

export class CYCombat extends Combat {
  /**
   * @override
   */
  async rollInitiative(ids, { updateTurn = true } = {}) {
    const [id] = ids;
    const currentId = this.combatant?.id;
    if (!id) {
      return;
    }

    const combatant = this.combatants.get(id);
    if (!combatant) {
      return;
    }

    await rollPartyInitiative(combatant.actor);

    if (updateTurn && currentId) {
      await this.update({
        turn: this.turns.findIndex((t) => t.id === currentId),
      });
    }

    return this;
  }

  /**
   * @override
   */
  async createEmbeddedDocuments(embeddedName, data = [], operation = {}) {
    return super.createEmbeddedDocuments(
      embeddedName,
      data.map((item) => ({
        ...item,
        initiative: this.#getInitiative(
          this.#isFriendly(
            game.canvas?.tokens?.get(item.tokenId)?.document?.disposition
          )
        ),
      })),
      operation
    );
  }

  async setPartyInitiative(rollTotal) {
    game.combat.partyInitiative = rollTotal;
    await game.combat.setCombatantsInitiative();
  }

  async setCombatantsInitiative() {
    const updates = this.turns.map((t) => {
      return {
        _id: t.id,
        initiative: this.#getInitiative(this.#isFriendlyCombatant(t)),
      };
    });
    await this.updateEmbeddedDocuments("Combatant", updates);
  }

  #isFriendlyCombatant(combatant) {
    if (combatant._token) {
      // v8 compatible
      return this.#isFriendly(combatant._token.system.disposition);
    } else if (combatant.token.system?.disposition != null) {
      // v9+
      return this.#isFriendly(combatant.token.system.disposition);
    } else if (combatant.token.disposition != null) {
      // v12+
      return this.#isFriendly(combatant.token.disposition);
    }
    return false;
  }

  #isFriendly(disposition) {
    return disposition === 1;
  }

  #getInitiative(isFriendly) {
    if (this.partyInitiative == null) {
      return null;
    }

    if (isFriendly) {
      return this.partyInitiative >= 4;
    } else {
      return this.partyInitiative <= 3;
    }
  }
}
