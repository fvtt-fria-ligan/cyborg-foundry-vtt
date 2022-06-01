import { diceSound, showDice } from "./dice.js";

const INDIVIDUAL_INITIATIVE_ROLL_CARD_TEMPLATE =
  "systems/morkborg/templates/chat/individual-initiative-roll-card.html";
const PARTY_INITIATIVE_ROLL_CARD_TEMPLATE =
  "systems/morkborg/templates/chat/party-initiative-roll-card.html";

export const rollPartyInitiative = async () => {
  const initiativeRoll = new Roll("d6", {});
  initiativeRoll.evaluate({ async: false });
  await showDice(initiativeRoll);

  let outcomeText = "";
  if (initiativeRoll.total <= 3) {
    outcomeText = game.i18n.localize("MB.InitiativeEnemiesBegin");
  } else {
    outcomeText = game.i18n.localize("MB.InitiativePlayerCharactersBegin");
  }

  const rollResult = {
    initiativeRoll,
    outcomeText,
  };
  const html = await renderTemplate(
    PARTY_INITIATIVE_ROLL_CARD_TEMPLATE,
    rollResult
  );
  await ChatMessage.create({
    content: html,
    sound: diceSound(),
  });

  // if a combat/encounter is happening, apply player/enemy ordering
  if (game.combats && game.combat) {
    await game.combat.setPartyInitiative(initiativeRoll.total);
  }
};
  
export const rollIndividualInitiative = async (actor) => {
  if (game.combats && game.combat) {
    // there is an encounter started in the Combat Tracker
    const combatant = game.combat.combatants.find(
      (i) => i.data.actorId === actor.id
    );
    if (combatant) {
      // the actor is part of the combat, so roll initiative
      game.combat.rollInitiative(combatant.id);
    } else {
      // the actor hasn't been added to the combat
      ui.notifications.warn(`${game.i18n.localize("MB.ActorNotInEncounter")}!`);
    }
    return;
  }

  // no encounter going on, so just show chat cards
  const initiativeRoll = new Roll(
    "d6+@abilities.agility.value",
    actor.getRollData()
  );
  initiativeRoll.evaluate({ async: false });
  await showDice(initiativeRoll);

  const rollResult = {
    initiativeRoll,
  };
  const html = await renderTemplate(
    INDIVIDUAL_INITIATIVE_ROLL_CARD_TEMPLATE,
    rollResult
  );
  ChatMessage.create({
    content: html,
    sound: diceSound(),
    speaker: ChatMessage.getSpeaker({ actor: actor }),
  });
};