
import { randomCssAnimationClass, randomCssColorClass, randomCssFontClass } from "./ad-css.js";
import { randomAd } from "./ad-data.js";
import { playSound } from "../sound.js";


export const showPopupAd = () => {
  const popup = new CorpcommDialog();
  popup.render(true);
};

const moveDelta = 10;


class CorpcommDialog extends Application {
  constructor() {
    super();
    this.animationTimerId =
    this.ad = randomAd();
    this.cssAdClass = `${randomCssAnimationClass()} ${randomCssColorClass()} ${randomCssFontClass()}`
    this.animationTimerId = setInterval(() => this.animationTick(), 500);
    playSound("systems/cy_borg/assets/audio/sfx/popup-ad-open.wav");
  }

  /** @override */
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.classes = ["cy", "dialog"];
    options.title = game.i18n.localize("AdBot2000");
    options.template =
      "systems/cy_borg/templates/dialog/corpcomm-dialog.html";
    options.width =300;
    options.height = "auto";
    options.top = window.innerHeight * Math.random()
    options.left = window.innerWidth * Math.random();
    return options;
  }

  /** @override */
  getData() {
    return {
      cssAdClass: this.cssAdClass,
      content: this.ad,
    };
  }

  /** @override */
  async close(options={}) {
    clearInterval(this.animationTimerId);
    playSound("systems/cy_borg/assets/audio/sfx/popup-ad-close.wav");
    return super.close(options);
  }

  randomDelta() {
    return -moveDelta + Math.random() * 2 * moveDelta; 
  }

  animationTick() {
    const deltaX = this.randomDelta();
    const deltaY = this.randomDelta();
    const left = this.position.left + deltaX;
    const top = this.position.top + deltaY;
    this.setPosition({left, top});
  }
}