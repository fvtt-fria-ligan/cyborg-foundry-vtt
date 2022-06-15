
export const showChatAd = async () => {
  //const html = await renderTemplate(ATTACK_ROLL_CARD_TEMPLATE, rollResult);
  const html = "I am an add";
  ChatMessage.create({
    content: html,
    // speaker: ChatMessage.getSpeaker({ actor }),
  });
}