export async function showGlitchesHelp(actor) {
  await ChatMessage.create({
    content: game.i18n.localize("CY.GlitchesHelpHtml"),
    flavor: game.i18n.localize("CY.Glitches"),
    speaker: ChatMessage.getSpeaker({ actor }),
  });
};