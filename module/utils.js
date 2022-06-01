

export const d20Formula = (modifier) => {
  if (modifier < 0) {
    return `d20-${-modifier}`;
  } else if (modifier > 0) {
    return `d20+${modifier}`;
  } else {
    return "d20";
  }
};

export const pluralize = (key1, key2, num) => {
  return game.i18n.localize(num == 1 ? key1 : key2);
}
