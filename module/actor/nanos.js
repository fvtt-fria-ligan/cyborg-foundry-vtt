import { showDice } from "../dice.js";
import { d20Formula, showOutcomeRollCard } from "../utils.js";


/**
 * Roll for actor to use a nano power.
 */
export async function rollUseNano(actor, itemId) {
  const nano = actor.items.get(itemId);
  if (!nano) {
    return;
  }

  const useFormula = d20Formula(actor.system.abilities.presence.value);
  const useRoll = new Roll(useFormula);
  await useRoll.evaluate();
  await showDice(useRoll);

  const d20Result = useRoll.terms[0].results[0].result;
  const isFumble = d20Result <= actor.system.nanoFumbleOn;
  const useDR = 12;

  let useOutcome = null;
  let damageRoll;
  let takeDamage;    

  if (isFumble) {    
    useOutcome = game.i18n.localize("CY.UseNanoFumble");
    // and trigger the nano's infestation
    const infestation = nano.linkedInfestation();
    if (infestation) {
      useOutcome += ` ${infestation.name}: ${infestation.system.triggered}`;
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
  const newNanoFumbleOn = actor.system.nanoFumbleOn + 1;
  await actor.update({ ["system.nanoFumbleOn"]: newNanoFumbleOn });
};
