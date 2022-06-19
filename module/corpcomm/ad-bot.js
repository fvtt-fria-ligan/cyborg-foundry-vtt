import { showChatAd } from "./chat-comm.js";
import { showPopupAd } from "./popup-comm.js";
import { chatAdDelay, popupAdChance, popupAdInstead, showChatAds, showPopupAds } from "../settings.js";

const chatAdTimerInterval = 1000;
let chatAdTimerID;
let lastChatMessageTime;

export const initializeAdBot = () => {
  if (!game.user.isGM) {
    // adbot only runs for gm
    return;
  }

  console.log("Initializing ▁ ▂ ▄ ▅ ▆ ▇ █ [ AdBot2000 ] █ ▇ ▆ ▅ ▄ ▂ ▁");

  if (showChatAds()) {
    Hooks.on("createChatMessage", onCreateChatMessage);
    lastChatMessageTime = new Date().getTime();
    chatAdTimerID = setInterval(adTimerTick, chatAdTimerInterval);
  }
}

export const terminateAdBot = () => {
  Hooks.off("createChatMessage", onCreateChatMessage);
  stopChatAdTimer();
  clearInterval(chatAdTimerId);
};

export const nopeShowAd = (originalFn) => {
  const percent = Math.random() * 100;
  if (showPopupAds() && percent < popupAdChance()) {
    showPopupAd();
    if (!popupAdInstead()) {
      originalFn();
    }
  } else {
    originalFn();
  }
};

const onCreateChatMessage = (chatLog, message, chatData) => {
  lastChatMessageTime = new Date().getTime();
};

const adTimerTick = () => {
  const timeSinceLastChatMessage = new Date().getTime() - lastChatMessageTime;
  if (timeSinceLastChatMessage > (chatAdDelay() * 1000)) {
    showChatAd();
  }
};