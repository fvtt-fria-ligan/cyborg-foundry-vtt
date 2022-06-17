import { randomAd, randomCssAnimationClass, randomCssFontClass } from "./ad-data.js";
import { documentFromPack } from "../packutils.js";

const getAdBotActor = async () => {
  const adbot = await documentFromPack("cy_borg-core.npcs", "AdBot2000");
  return adbot;
}

export const showChatAd = async () => {
  const ad = randomAd();
  const cssAnimationClass = randomCssAnimationClass();
  const cssFontClass = randomCssFontClass();
  const data = {
    cssAnimationClass,
    cssFontClass,
    content: ad,
  };
  const html = await renderTemplate("systems/cy_borg/templates/chat/ad-card.html", data);
  const actor = await getAdBotActor();
  console.log(actor);
  ChatMessage.create({
    content: html,
    // speaker: ChatMessage.getSpeaker({ actor }),
    speaker: ChatMessage.getSpeaker({ actor }),
  });
};