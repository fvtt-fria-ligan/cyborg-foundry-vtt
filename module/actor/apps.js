import { CY } from "../config.js";
import { showDice } from "../dice.js";
import { d20Formula, showOutcomeRollCard } from "../utils.js";
  
/**
 * Roll for actor to use an app.
 */
 export const rollUseApp = async (actor, itemId) => {
  const app = actor.items.get(itemId);
  if (!app) {
    return;
  }
  if (app.data.data.burned) {    
    ui.notifications.warn(
      `${game.i18n.localize("CY.AppIsBurned")}!`
    );
    return;
  }

  const useFormula = d20Formula(actor.data.data.abilities.knowledge.value);
  const useRoll = new Roll(useFormula);
  useRoll.evaluate({ async: false });
  await showDice(useRoll);

  const d20Result = useRoll.terms[0].results[0].result;
  const isFumble = d20Result <= actor.data.data.appFumbleOn;
  const useDR = 12;

  let useOutcome = null;
  if (isFumble) {    
    useOutcome = game.i18n.localize("CY.UseAppFumble");
  } else if (useRoll.total < useDR) {
    // failure
    useOutcome = game.i18n.localize("CY.Failure");
  } else {
    // success
    useOutcome = game.i18n.localize("CY.Success");
  }

  const rollResult = {
    cardCssClass: "use-app-roll-card",
    cardTitle: game.i18n.localize("CY.UseApp"),
    dr: useDR,
    formula: `1d20 + ${game.i18n.localize("CY.KnowledgeAbbrev")}`,
    outcome: useOutcome,
    roll: useRoll,
  };
  await showOutcomeRollCard(actor, rollResult);

  if (isFumble) {
    // roll on the App Backlashes table
    const pack = game.packs.get(CY.appBacklashesPack);
    const content = await pack.getDocuments();
    const table = content.find((i) => i.name === CY.appBacklashesTable);
    await table.draw();

    // and burn the app
    await app.update({ ["data.burned"]: true});
  }

  // increment appFumbleOn
  const newAppFumbleOn = actor.data.data.appFumbleOn + 1;
  await actor.update({ ["data.appFumbleOn"]: newAppFumbleOn });
}
