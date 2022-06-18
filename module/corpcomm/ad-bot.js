import { showChatAd } from "./chat-comm.js";
import { showPopupAd } from "./popup-comm.js";

const adTimerInterval = 1000;
const quietTimeBeforeAd = 10000;
let adTimerID;
let lastChatMessageTime;

export const initializeAdBot = () => {
  console.log("Initializing AdBot2000...");
  // if (!game.user.isGM) {
  //   // adbot only runs for gm
  //   return;
  // }

  Hooks.on("createChatMessage", (chatLog, message, chatData) => {
    lastChatMessageTime = new Date().getTime();
  });

  lastChatMessageTime = new Date().getTime();
  startAdTimer();
}

const stopAdTimer = () => {
  clearInterval(adTimerId);
}

const startAdTimer = () => {
  adTimerID = setInterval(adTimerTick, adTimerInterval);
};

const adTimerTick = () => {
  const timeSinceLastChatMessage = new Date().getTime() - lastChatMessageTime;
  if (timeSinceLastChatMessage > quietTimeBeforeAd) {
    showChatAd();
  }
};