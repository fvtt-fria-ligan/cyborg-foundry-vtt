export class CYCombat extends Combat {
  async setPartyInitiative(rollTotal) {
    game.combat.partyInitiative = rollTotal;
    await game.combat.resortCombatants();
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

  // /**
  //  * Define how the array of Combatants is sorted in the displayed list of the tracker.
  //  * This method can be overridden by a system or module which needs to display combatants in an alternative order.
  //  * By default sort by initiative, falling back to name
  //  * @private
  //  */
  // _sortCombatants(a, b) {
  //   // .combat is a getter, so verify existence of combats array
  //   if (game.combats && game.combat?.partyInitiative) {
  //     const isPartyA = game.combat.isFriendlyCombatant(a);
  //     const isPartyB = game.combat.isFriendlyCombatant(b);
  //     if (isPartyA !== isPartyB) {
  //       // only matters if they're different
  //       if (game.combat.partyInitiative > 3) {
  //         // players begin
  //         return isPartyA ? -1 : 1;
  //       } else {
  //         // enemies begin
  //         return isPartyA ? 1 : -1;
  //       }
  //     }
  //   }

  //   // combatants are both friendly or enemy, so sort by normal initiative
  //   const ia = Number.isNumeric(a.initiative) ? a.initiative : -9999;
  //   const ib = Number.isNumeric(b.initiative) ? b.initiative : -9999;
  //   const ci = ib - ia;
  //   if (ci !== 0) return ci;
  //   const [an, bn] = [a.token?.name || "", b.token?.name || ""];
  //   const cn = an.localeCompare(bn);
  //   if (cn !== 0) return cn;
  //   return a.tokenId - b.tokenId;
  // }
}
