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
};