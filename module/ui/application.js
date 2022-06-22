import { uiWindowClose, uiWindowOpen } from "../sound.js";

export class CYApplication extends Application {  
  /** @override */
  render(force=false, options={}) {
    if (!this.rendered && this._state != Application.RENDER_STATES.RENDERING) {
      uiWindowOpen();
    }
    return super.render(force, options);
  }
  
  /** @override */
  async close(options={}) {
    uiWindowClose();
    return super.close(options);
  }
}