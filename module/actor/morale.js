/**
 * Roll morale.
 */
 export async function rollMorale(actor) {
  const moraleRoll = new Roll("2d6");
  await moraleRoll.evaluate();
  let key = "";
  if (moraleRoll.total > actor.system.morale) {
    const resultRoll = new Roll("1d6");
    await resultRoll.evaluate();
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