export const showGlitchesHelp = async (actor) => {
  await ChatMessage.create({
    content: game.i18n.localize("CY.GlitchesHelpHtml"),
    flavor: game.i18n.localize("CY.Glitches"),
    speaker: ChatMessage.getSpeaker({ actor }),
  });    
}

/**
 * Roll reaction.
 */
 export const rollReaction = async (actor) => {
  const reactionRoll = new Roll("2d6");
  reactionRoll.evaluate({ async: false });
  let key = "";
  if (reactionRoll.total <= 3) {
    key = "CY.ReactionHostile";
  } else if (reactionRoll.total <= 6) {
    key = "CY.ReactionAngered";
  } else if (reactionRoll.total <= 8) {
    key = "CY.ReactionIndifferent";
  } else if (reactionRoll.total <= 10) {
    key = "CY.ReactionCurious";
  } else {
    key = "CY.ReactionAsksForHelp";
  }
  const reactionText = `${actor.name} ${game.i18n.localize(key)}.`;   
  await reactionRoll.toMessage({
    flavor: reactionText,
    speaker: ChatMessage.getSpeaker({ actor }),
  });
}

/**
 * Roll morale.
 */  
export const rollMorale = async (actor) => {
  const moraleRoll = new Roll("2d6");
  moraleRoll.evaluate({ async: false });
  let key = "";
  if (moraleRoll.total > actor.data.data.morale) {
    const resultRoll = new Roll("1d6");
    resultRoll.evaluate({ async: false });
    if (resultRoll.total <= 3) {
      key = "CY.MoraleFlees";
    } else {
      key = "CY.MoraleSurrenders";
    }
  } else {
    key = "CY.MoraleStandsStrong";
  }
  const moraleText = `${actor.name} ${game.i18n.localize(key)}.`;   
  await moraleRoll.toMessage({
    flavor: moraleText,
    speaker: ChatMessage.getSpeaker({ actor }),
  });
};

export const rollUseApp = async (actor) => {
  const value = this.data.data.abilities.knowledge;
  const formula = this.d20Formula(value);
  const roll = new Roll(formula);
  await roll.toMessage();
}

export const rollUseNano = async (actor) => {
  const value = this.data.data.abilities.presence;
  const formula = this.d20Formula(value);
  const roll = new Roll(formula);
  await roll.toMessage();
}
