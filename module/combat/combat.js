import { rollPartyInitiative } from "./initiative.js";

const { NumberField } = foundry.data.fields;

export class CYCombatModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      partyInitiative: new NumberField({ required: false, integer: true }),
    };
  }

  async setPartyInitiative(rollTotal) {
    this.partyInitiative = rollTotal;
    await this.setCombatantsInitiative();
    // Update system state last since this will construct a new instance of this class
    await this.parent.update({ "system.partyIntiative": rollTotal });
  }

  async setCombatantsInitiative() {
    const updates = this.parent.turns.map((t) => {
      return {
        _id: t.id,
        initiative: this.#getInitiative(this.#isFriendlyCombatant(t)),
      };
    });
    await this.parent.updateEmbeddedDocuments("Combatant", updates);
  }

  addPartyInitiative(data) {
    return data.map((item) => ({
      ...item,
      initiative: this.#getInitiative(
        this.#isFriendly(
          game.canvas?.tokens?.get(item.tokenId)?.document?.disposition
        )
      ),
    }));
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

    let result;
    if (isFriendly) {
      result = this.partyInitiative >= 4;
    } else {
      result = this.partyInitiative <= 3;
    }

    return result ? 1 : 0;
  }
}

export class CYCombat extends Combat {
  /**
   * @inheritdoc
   */
  static async create(data = {}, operation) {
    // Always create with type: 'cy' so we can use the CYCombatModel
    return super.create({ ...data, type: "cy" }, operation);
  }

  /**
   * Rolls party initiative for the combat
   * @override
   */
  async rollInitiative(ids, { updateTurn = true } = {}) {
    // We only need to roll intiative once for all combatants, so grab the first id
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
   * @inheritdoc
   */
  async createEmbeddedDocuments(embeddedName, data = [], operation = {}) {
    return super.createEmbeddedDocuments(
      embeddedName,
      this.system.addPartyInitiative(data),
      operation
    );
  }
}
