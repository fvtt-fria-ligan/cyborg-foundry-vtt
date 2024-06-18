import { showChatAd } from "./chat-comm.js";
import { showPopupAd } from "./popup-comm.js";
import { chatAdDelay, popupAdChance, popupAdInstead, showChatAds, showPopupAds } from "../settings.js";

const chatAdTimerInterval = 1000;
let chatAdTimerId;
let lastChatMessageTime;

export function initializeAdBot() {
  if (!game.user.isGM) {
    // adbot only runs for gm
    return;
  }

  console.log("Initializing ▁ ▂ ▄ ▅ ▆ ▇ █ [ AdBot2000 ] █ ▇ ▆ ▅ ▄ ▂ ▁");

  if (showChatAds()) {
    Hooks.on("createChatMessage", onCreateChatMessage);
    lastChatMessageTime = new Date().getTime();
    chatAdTimerId = setInterval(adTimerTick, chatAdTimerInterval);
  }
}

export function terminateAdBot() {
  Hooks.off("createChatMessage", onCreateChatMessage);
  clearInterval(chatAdTimerId);
};

export function nopeShowAd(originalFn) {
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

function onCreateChatMessage(chatLog, message, chatData) {
  lastChatMessageTime = new Date().getTime();
};

function adTimerTick() {
  const timeSinceLastChatMessage = new Date().getTime() - lastChatMessageTime;
  if (timeSinceLastChatMessage > (chatAdDelay() * 1000)) {
    showChatAd();
  }
};