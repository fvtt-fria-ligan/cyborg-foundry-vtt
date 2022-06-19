
import { randomCssAnimationClass, randomCssColorClass, randomCssFontClass } from "./ad-css.js";
import { randomAd } from "./ad-data.js";


export const showPopupAd = () => {
  const popup = new CorpcommDialog();
  popup.render(true);
};

class CorpcommDialog extends Application {
  constructor() {
    super();
    this.scheduleAnimate();
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
    const ad = randomAd();
    const cssAdClass = `${randomCssAnimationClass()} ${randomCssColorClass()} ${randomCssFontClass()}`
    return {
      cssAdClass,
      content: ad,
    };
  }

  // might as well use setInterval, so we have id to cancel
  
  // scheduleAnimation() {
  //   setTimeout(() => {
  //     this.animate();
  //   }, 1000);
  // }

  // animate() {
  //   console.log("***** animation tick");
  //   this.scheduleAnimate();
  // }

  // async close(options={}) {
  // };
}