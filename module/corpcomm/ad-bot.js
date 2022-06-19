import { showChatAd } from "./chat-comm.js";
import { showPopupAd } from "./popup-comm.js";
import { chatAdDelay, popupAdChance, popupAdInstead, showChatAds, showPopupAds } from "../settings.js";

const chatAdTimerInterval = 1000;
let chatAdTimerID;
let lastChatMessageTime;

export const initializeAdBot = () => {
  console.log("Initializing AdBot2000...");
  // if (!game.user.isGM) {
  //   // adbot only runs for gm
  //   return;
  // }

  if (showChatAds()) {
    Hooks.on("createChatMessage", (chatLog, message, chatData) => {
      lastChatMessageTime = new Date().getTime();
    });
  
    lastChatMessageTime = new Date().getTime();
    startChatAdTimer();      
  }
}

export const terminateAdBot = () => {
  // TODO: Hooks.off?  
  stopChatAdTimer();
};

const stopChatAdTimer = () => {
  clearInterval(chatAdTimerId);
}

const startChatAdTimer = () => {
  chatAdTimerID = setInterval(adTimerTick, chatAdTimerInterval);
};

const adTimerTick = () => {
  const timeSinceLastChatMessage = new Date().getTime() - lastChatMessageTime;
  if (timeSinceLastChatMessage > (chatAdDelay() * 1000)) {
    showChatAd();
  }
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