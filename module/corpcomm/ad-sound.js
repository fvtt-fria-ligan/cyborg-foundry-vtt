
export const adOpen = () => {
  playSound("systems/cy_borg/assets/audio/sfx/ad-open.wav");
};

export const adClose = () => {
  playSound("systems/cy_borg/assets/audio/sfx/ad-close.wav");
};

const playSound = (filename) => {
  AudioHelper.play({src: filename, volume: 0.8, loop: false}, true);
};