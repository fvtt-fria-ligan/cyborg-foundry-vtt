import { soundEffects } from "./settings.js";

export const playSound = (src, volume=0.8) => {
  if (src && soundEffects()) {
    const pushToOtherClients = false;
    AudioHelper.play({src, volume, loop: false}, pushToOtherClients);
  }
};

export const uiAdd = () => {
  playSound("systems/cy-borg/assets/audio/sfx/ui-add.ogg");
};

export const uiClick = () => {
  playSound("systems/cy-borg/assets/audio/sfx/ui-click-1.ogg");
};

export const uiDelete = () => {
  playSound("systems/cy-borg/assets/audio/sfx/ui-delete.ogg");
};

export const uiEject = () => {
  playSound("systems/cy-borg/assets/audio/sfx/ui-eject.ogg");
};

export const uiError = () => {
  playSound("systems/cy-borg/assets/audio/sfx/ui-error.ogg");
};

export const uiSlot = () => {
  playSound("systems/cy-borg/assets/audio/sfx/ui-slot.ogg");
};

export const uiSuccess = () => {
  playSound("systems/cy-borg/assets/audio/sfx/ui-success.ogg");
};

export const uiWindowClose = () => {
  // playSound("systems/cy-borg/assets/audio/sfx/ui-window-close.ogg");
  playSound("systems/cy-borg/assets/audio/sfx/ui-click-2.ogg");
};

export const uiWindowOpen = () => {
  // playSound("systems/cy-borg/assets/audio/sfx/ui-window-open.ogg");
  playSound("systems/cy-borg/assets/audio/sfx/ui-click-2.ogg");
};

export const popupAdClose = () => {
  playSound("systems/cy-borg/assets/audio/sfx/popup-ad-close.ogg");
};

export const popupAdOpen = () => {
 playSound("systems/cy-borg/assets/audio/sfx/popup-ad-open.ogg");
};