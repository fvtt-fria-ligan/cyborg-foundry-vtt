import { rollPartyInitiative } from "./initiative.js";

export class CYCombat extends Combat {
  async setPartyInitiative(rollTotal) {
    game.combat.partyInitiative = rollTotal;
    await game.combat.setCombatantsInitiative();
  }

  async setCombatantsInitiative() {
    const updates = this.turns.map((t) => {
      return {
        _id: t.id,
        initiative: this.#getInitiative(t),
      };
    });
    await this.updateEmbeddedDocuments("Combatant", updates);
  }

  #isFriendlyCombatant(combatant) {
    if (combatant._token) {
      // v8 compatible
      return combatant._token.system.disposition === 1;
    } else if (combatant.token.system?.disposition != null) {
      // v9+
      return combatant.token.system.disposition === 1;
    } else if (combatant.token.disposition != null) {
      // v12+
      return combatant.token.disposition === 1;
    }
    return false;
  }

  #getInitiative(combatant) {
    if (this.partyInitiative == null) {
      return null;
    }

    if (this.#isFriendlyCombatant(combatant)) {
      return this.partyInitiative >= 4;
    } else {
      return this.partyInitiative <= 3;
    }
  }

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
}
