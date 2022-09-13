export const registerHandlebarsPartials = async () => {
  await loadTemplates([
    "systems/cy_borg/templates/actor/abilities.html",
    "systems/cy_borg/templates/actor/combat-tab.html",
    "systems/cy_borg/templates/actor/dossier-tab.html",
    "systems/cy_borg/templates/actor/equipment-tab.html",
    "systems/cy_borg/templates/actor/feats-tab.html",
    "systems/cy_borg/templates/actor/hit-points.html",
    "systems/cy_borg/templates/actor/nano-tab.html",
    "systems/cy_borg/templates/item/item-base-fields.html",
    "systems/cy_borg/templates/item/item-description-tab.html",
    "systems/cy_borg/templates/item/item-sheet-header.html",
    "systems/cy_borg/templates/item/item-sheet-tabs.html",
  ]);
}

export const registerHandlebarsHelpers = () => {
  /**
   * Formats a Roll as either the total or x + y + z = total if the roll has multiple terms.
   */
   Handlebars.registerHelper("xtotal", (roll) => {
    // collapse addition of negatives into just subtractions
    // e.g., 15 +  - 1 => 15 - 1
    // Also: apparently roll.result uses 2 spaces as separators?
    // We replace both 2- and 1-space varieties
    const result = roll.result.replace("+  -", "-").replace("+ -", "-");
    // roll.result is a string of terms. E.g., "16" or "1 + 15".
    if (result !== roll.total.toString()) {
      return `${result} = ${roll.total}`;
    } else {
      return result;
    }
  });  

  Handlebars.registerHelper("ifEq", function (arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper("ifLt", function (arg1, arg2, options) {
    return arg1 < arg2 ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper("ceil", function (num) {
    return Math.ceil(num);
  });
}
