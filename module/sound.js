import { soundEffects } from "./settings.js";

export const playSound = (src, volume=0.8) => {
  if (src && soundEffects()) {
    AudioHelper.play({src, volume, loop: false}, true);
  }
};