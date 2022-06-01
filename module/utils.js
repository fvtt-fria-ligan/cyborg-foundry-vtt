

export const pluralize = (key1, key2, num) => {
  return game.i18n.localize(num == 1 ? key1 : key2);
}
