/**
 * @extends {Item}
 */
 export class CYItem extends Item {
  linkedNano() {
    if (this.data.data.nanoId) {
      return game.items.filter(x => x.id == this.data.data.nanoId).shift();
    }
  }

  linkedInfestation() {
    if (this.data.data.infestationId) {
      return game.items.filter(x => x.id == this.data.data.infestationId).shift();
    }
  }
}