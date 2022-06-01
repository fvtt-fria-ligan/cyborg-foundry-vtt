import { CY } from "../config.js";
import { diceSound, showDice } from "../dice.js";
import { d20Formula } from "../utils.js";

const USE_APP_ROLL_CARD_TEMPLATE =
  "systems/cy_borg/templates/chat/use-app-roll-card.html";
  const USE_NANO_ROLL_CARD_TEMPLATE =
  "systems/cy_borg/templates/chat/use-nano-roll-card.html";


export const showGlitchesHelp = async (actor) => {
  await ChatMessage.create({
    content: game.i18n.localize("CY.GlitchesHelpHtml"),
    flavor: game.i18n.localize("CY.Glitches"),
    speaker: ChatMessage.getSpeaker({ actor }),
  });
};

/**
 * Roll reaction.
 */
export const rollReaction = async (actor) => {
  const reactionRoll = new Roll("2d6");
  reactionRoll.evaluate({ async: false });
  let key = "";
  if (reactionRoll.total <= 3) {
    key = "CY.ReactionHostile";
  } else if (reactionRoll.total <= 6) {
    key = "CY.ReactionAngered";
  } else if (reactionRoll.total <= 8) {
    key = "CY.ReactionIndifferent";
  } else if (reactionRoll.total <= 10) {
    key = "CY.ReactionCurious";
  } else {
    key = "CY.ReactionAsksForHelp";
  }
  const reactionText = `${actor.name} ${game.i18n.localize(key)}.`;
  await reactionRoll.toMessage({
    flavor: reactionText,
    speaker: ChatMessage.getSpeaker({ actor }),
  });
};

/**
 * Roll morale.
 */
export const rollMorale = async (actor) => {
  const moraleRoll = new Roll("2d6");
  moraleRoll.evaluate({ async: false });
  let key = "";
  if (moraleRoll.total > actor.data.data.morale) {
    const resultRoll = new Roll("1d6");
    resultRoll.evaluate({ async: false });
    if (resultRoll.total <= 3) {
      key = "CY.MoraleFlees";
    } else {
      key = "CY.MoraleSurrenders";
    }
  } else {
    key = "CY.MoraleStandsStrong";
  }
  const moraleText = `${actor.name} ${game.i18n.localize(key)}.`;
  await moraleRoll.toMessage({
    flavor: moraleText,
    speaker: ChatMessage.getSpeaker({ actor }),
  });
};

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
    useDR,
    useFormula: `1d20 + ${game.i18n.localize("CY.KnowledgeAbbrev")}`,
    useOutcome,
    useRoll,
  };
  const html = await renderTemplate(
    USE_APP_ROLL_CARD_TEMPLATE,
    rollResult
  );
  ChatMessage.create({
    content: html,
    sound: diceSound(),
    speaker: ChatMessage.getSpeaker({ actor }),
  });

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
    // TODO
    console.log(nano);
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
    damageRoll,
    useDR,
    useFormula: `1d20 + ${game.i18n.localize("CY.PresenceAbbrev")}`,
    useOutcome,
    useRoll,
    takeDamage,
  };
  const html = await renderTemplate(
    USE_NANO_ROLL_CARD_TEMPLATE,
    rollResult
  );
  ChatMessage.create({
    content: html,
    sound: diceSound(),
    speaker: ChatMessage.getSpeaker({ actor }),
  });

  if (isFumble) {
  }

  // increment nanoFumbleOn
  const newNanoFumbleOn = actor.data.data.nanoFumbleOn + 1;
  await actor.update({ ["data.nanoFumbleOn"]: newNanoFumbleOn });


};

// const OUTCOME_ROLL_CARD_TEMPLATE =
//   "systems/morkborg/templates/chat/outcome-roll-card.html";

// const rollOutcome = async (
//   dieRoll,
//   rollData,
//   cardTitle,
//   outcomeTextFn,
//   rollFormula = null
// ) => {
//   const roll = new Roll(dieRoll, rollData);
//   roll.evaluate({ async: false });
//   await showDice(roll);
//   const rollResult = {
//     cardTitle: cardTitle,
//     outcomeText: outcomeTextFn(roll),
//     roll,
//     rollFormula: rollFormula ?? roll.formula,
//   };
//   const html = await renderTemplate(OUTCOME_ROLL_CARD_TEMPLATE, rollResult);
//   ChatMessage.create({
//     content: html,
//     sound: diceSound(),
//     speaker: ChatMessage.getSpeaker({ actor: this }),
//   });
//   return roll;
// };
