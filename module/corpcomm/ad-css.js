import { sample } from "../utils.js";

export function randomCssAnimationClass() {
  return sample(cssAnimationClasses);
}

export function randomCssColorClass() {
  return sample(cssColorClasses);
}

export function randomCssFontClass() {
  return sample(cssFontClasses);
}

const cssAnimationClasses = [
  "blinking",
  "crt",
  "flip-x",
  "flip-y",
  "glitch",
  "glow",
  "marching-ants-1",
  "marching-ants-2",
  "no-animation",
  "rainbow",
  "shadow-bounce",
];

const cssColorClasses = [
  "color1",
  "color2",
  "color3",
  "color4",
  "color5",
  "color6",
  "color7",
  "color8",
  "color9",
  "color10",
];

const cssFontClasses = [
  "font1",
  "font2",
  "font3",
  "font4",
  "font5",
  "font6",
  "font7",
  "font8",
  "font9",
  "font10",
  "font11",
];
