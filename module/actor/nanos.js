import { showDice } from "../dice.js";
import { d20Formula, showOutcomeRollCard } from "../utils.js";


/**
 * Roll for actor to use a nano power.
 */
export const rollUseNano = async (actor, itemId) => {
  const nano = actor.items.get(itemId);
  if (!nano) {
    return;
  }

  const useFormula = d20Formula(actor.data.data.abilities.presence.value);
  const useRoll = new Roll(useFormula);
  useRoll.evaluate({ async: false });
  await showDice(useRoll);

  const d20Result = useRoll.terms[0].results[0].result;
  const isFumble = d20Result <= actor.data.data.nanoFumbleOn;
  const useDR = 12;

  let useOutcome = null;
  let damageRoll;
  let takeDamage;    

  if (isFumble) {    
    useOutcome = game.i18n.localize("CY.UseNanoFumble");
    // and trigger the nano's infestation
    const infestation = nano.linkedInfestation();
    if (infestation) {
      useOutcome += ` ${infestation.name}: ${infestation.data.data.triggered}`;
    }
  } else if (useRoll.total < useDR) {
    // failure
    useOutcome = game.i18n.localize("CY.Failure");
  } else {
    // success
    useOutcome = game.i18n.localize("CY.Success");
  }

  if (isFumble || useRoll.total < useDR) {
    // take 1d2 damage
    damageRoll = new Roll("1d2", actor.getRollData());
    damageRoll.evaluate({ async: false });
    await showDice(damageRoll);
    takeDamage = `${game.i18n.localize("CY.Take")} ${damageRoll.total} ${game.i18n.localize("CY.Damage")}`;
  }

  const rollResult = {
    cardCssClass: "use-nano-roll-card",
    cardTitle: game.i18n.localize("CY.UseNano"),
    damageRoll,
    dr: useDR,
    formula: `1d20 + ${game.i18n.localize("CY.PresenceAbbrev")}`,
    outcome: useOutcome,
    roll: useRoll,
    takeDamage,
  };
  await showOutcomeRollCard(actor, rollResult);

  // increment nanoFumbleOn
  const newNanoFumbleOn = actor.data.data.nanoFumbleOn + 1;
  await actor.update({ ["data.nanoFumbleOn"]: newNanoFumbleOn });
};
