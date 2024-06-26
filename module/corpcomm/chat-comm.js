import { randomCssAnimationClass, randomCssColorClass, randomCssFontClass } from "./ad-css.js";
import { randomAd } from "./ad-data.js";
import { ACTORS_PACK, documentFromPack } from "../packutils.js";
import { playSound } from "../sound.js";
import { sample } from "../utils.js";


async function getAdBotActor() {
  const adbot = await documentFromPack(ACTORS_PACK, "AdBot2000");
  return adbot;
}

function playChatAdSound() {
  const sound = sample([
    "chat-ad-1.ogg",
    "chat-ad-2.mp3",
    "chat-ad-3.ogg",
    "chat-ad-4.ogg",
    "chat-ad-5.mp3",
  ]);
  const src = `systems/cy-borg/assets/audio/sfx/${sound}`;  
  playSound(src);
}

export async function showChatAd() {
  const ad = randomAd();
  const cssAdClass = `${randomCssAnimationClass()} ${randomCssColorClass()} ${randomCssFontClass()}`
  const data = {
    cssAdClass,
    content: ad,
  };
  const html = await renderTemplate("systems/cy-borg/templates/chat/ad-card.html", data);
  const actor = await getAdBotActor();
  playChatAdSound();
  ChatMessage.create({
    content: html,
    speaker: ChatMessage.getSpeaker({ actor }),
  });
};