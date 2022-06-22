import { uiWindowClose, uiWindowOpen } from "../sound.js";

export class CYApplication extends Application {
    /** @override */
    render(force=false, options={}) {
      uiWindowOpen();
      return super.render(force, options);
    }

    /** @override */
    async close(options={}) {
      uiWindowClose();
      return super.close(options);
    }
}