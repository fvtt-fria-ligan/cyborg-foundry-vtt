import { randomCssAnimationClass, randomCssColorClass, randomCssFontClass } from "./ad-css.js";
import { randomAd } from "./ad-data.js";
import { documentFromPack } from "../packutils.js";
import { playSound } from "../sound.js";
import { sample } from "../utils.js";


const getAdBotActor = async () => {
  const adbot = await documentFromPack("cy_borg-core.npcs", "AdBot2000");
  return adbot;
}

const playChatAdSound = () => {
  const sound = sample([
    "chat-ad-1.ogg",
    "chat-ad-2.mp3",
    "chat-ad-3.ogg",
    "chat-ad-4.ogg",
    "chat-ad-5.mp3",
  ]);
  const src = `systems/cy_borg/assets/audio/sfx/${sound}`;  
  playSound(src);
}

export const showChatAd = async () => {
  const ad = randomAd();
  const cssAdClass = `${randomCssAnimationClass()} ${randomCssColorClass()} ${randomCssFontClass()}`
  const data = {
    cssAdClass,
    content: ad,
  };
  const html = await renderTemplate("systems/cy_borg/templates/chat/ad-card.html", data);
  const actor = await getAdBotActor();
  playChatAdSound();
  ChatMessage.create({
    content: html,
    speaker: ChatMessage.getSpeaker({ actor }),
  });
};