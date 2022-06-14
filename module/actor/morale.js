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