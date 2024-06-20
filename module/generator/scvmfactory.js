import { CYActor } from "../actor/actor.js";
import { CY } from "../config.js";
import { CYItem } from "../item/item.js";
import { articalize, lowerCaseFirst, randomIntFromInterval, rollTotal, sample, upperCaseFirst } from "../utils.js";

import {
  drawFromTableUuid,
  drawTextFromTableUuid,
} from "../packutils.js";
import { getAllowedScvmClasses } from "../settings.js";

export async function createScvm(clazz) {
  const scvm = await rollScvmForClass(clazz);
  await createActorWithScvm(scvm);
};

export async function createScvmFromClassUuid(classUuid) {
  const clazz = await fromUuid(classUuid);
  if (!clazz) {
    // couldn't find class item, so bail
    const err = `No class item found with UUID ${classUuid}`;
    console.error(err);
    ui.notifications.error(err);
    return;
  }
  await createScvm(clazz);
};

export async function scvmifyActor(actor, clazz) {
  const scvm = await rollScvmForClass(clazz);
  await updateActorWithScvm(actor, scvm);
};

export async function createNpc() {
  const npc = await randomNpc();
  const actor = await CYActor.create(npc);
  actor.sheet.render(true);
};

function randomName() {
  return drawTextFromTableUuid(CY.scvmFactory.namesTable);
};

async function randomNpc() {
  const name = await randomName();
  const description = await makeDescription(CY.scvmFactory.npcDescriptionTables);
  const img = randomCharacterPortrait();
  const hp = await rollTotal("1d8");
  const morale = await rollTotal("1d8+4");
  const attack = npcAttack();
  const armor = npcArmor();
  return {
    name,
    system: {
      armor,
      attack,
      description,
      hitPoints: {
        max: hp,
        value: hp,
      },
      morale,
    },
    img,
    items: [],
    prototypeToken: {
      name,
      texture: {
        src: img,
      },
    },    
    type: "npc",
  };  
};

function npcAttack() {
  return sample([
    "Unarmed d2",
    "Shiv d3",
    "Machete d6",
    "Throwing knives d4",
    "Revolver d8",
    "Smartgun d6a",
    "Shotgun d8",
  ]);
}

function npcArmor() {
  return sample([
    "No armor",
    "Styleguard -d2",
    "Rough -d4",
  ]);
}

async function makeDescription(descriptionTables) {
  let descriptionLine = "";
  for (const dt of descriptionTables) {
    const table = await fromUuid(dt.uuid);
    if (table) {
      const draw = await table.draw({ displayChat: false });
      let text = lowerCaseFirst(draw.results[0].text);
      if (dt.articalize) {
        text = articalize(text);
      }
      const formatted = game.i18n.format(dt.formatKey, {text});
      descriptionLine += upperCaseFirst(formatted) + " ";  
    } else {
      console.error(`Could not find table ${dt.uuid}`);
    }
  }
  return descriptionLine;
};

export async function findClasses() {
  const classes = [];
  for (const uuid of CY.scvmFactory.classUuids) {
    const clazz = await fromUuid(uuid);
    if (clazz && clazz.type == CY.itemTypes.class) {
      classes.push(clazz);
    }
  }
  return classes;
};

export async function findAllowedClasses() {
  const classes = await findClasses();
  const allowedScvmClasses = getAllowedScvmClasses();
  const filtered = classes.filter((c) => {
    return !(c.uuid in allowedScvmClasses) || allowedScvmClasses[c.uuid];
  });
  return filtered;
};

async function abilityRoll(formula) {
  const total = await rollTotal(formula);
  return abilityBonus(total);
}

const classStartingArmor = async (clazz) => {
  if (CY.scvmFactory.startingArmorTable && clazz.system.armorTable) {
    // TODO: refactor documentsFromTableUuid() to take a roll, and use it
    const armorRoll = new Roll(clazz.system.armorTable);
    const armorTable = await fromUuid(CY.scvmFactory.startingArmorTable);
    const armorDraw = await armorTable.draw({
      roll: armorRoll,
      displayChat: false,
    });
    const armor = await docsFromResults(armorDraw.results);
    return armor;
  }
};

async function classStartingWeapons(clazz) {
  if (CY.scvmFactory.startingWeaponTable && clazz.system.weaponTable) {
    // TODO: refactor documentsFromTableUuid() to take a roll, and use it
    const weaponRoll = new Roll(clazz.system.weaponTable);
    const weaponTable = await fromUuid(CY.scvmFactory.startingWeaponTable);
    const weaponDraw = await weaponTable.draw({
      roll: weaponRoll,
      displayChat: false,
    });
    const weapons = await docsFromResults(weaponDraw.results);    
    // add ammo mags if starting weapon uses ammo
    const mags = [];
    for (const weapon of weapons) {
      if (weapon.system.usesAmmo) {
        const mag = await fromUuid(CY.scvmFactory.ammoItem);
        const magRoll = await new Roll("1d4").evaluate();
        // TODO: need to mutate _data to get it to change for our owned item creation.
        // Is there a better way to do this?
        mag.name = `${weapon.name} ${mag.name}`;
        // mag.system._source.system.quantity = magRoll.total;
        mag.system.quantity = magRoll.total;
        mags.push(mag);
      }      
    }
    weapons.push(...mags);    
    return weapons;
  }
};

async function classStartingItems(clazz) {
  if (clazz.system.items) {
    const startingItems = [];
    const lines = clazz.system.items.split("\n");
    for (const line of lines) {
      const [packName, itemName] = line.split(",");
      const pack = game.packs.get(packName);
      if (pack) {
        const content = await pack.getDocuments();
        const item = content.find((i) => i.name === itemName);
        if (item) {
          startingItems.push(item);
        }
      }
    }
    return startingItems;
  }
};

async function classDescriptionLines(clazz) {
  const descriptionLines = [];
  descriptionLines.push(clazz.system.description);
  descriptionLines.push("<p>&nbsp;</p>");
  let descriptionLine = await makeDescription(CY.scvmFactory.descriptionTables);
  if (descriptionLine) {
    descriptionLines.push(descriptionLine);
    descriptionLines.push("<p>&nbsp;</p>");
  }
  return descriptionLines;
};

function hasApp(items) {
  return items.filter(x => x.type === CY.itemTypes.app).length > 0;
}

function hasCybertech(items) {
  return items.filter(x => x.system.cybertech).length > 0;
}

function hasNano(items) {
  return items.filter(x => x.type === CY.itemTypes.nanoPower).length > 0;
}

async function startingEquipment(clazz) {
  const equipment = [];
  if (CY.scvmFactory.startingItems) {
    for (const uuid of CY.scvmFactory.startingItems) {
      const item = await fromUuid(uuid);
      if (item) {
        equipment.push(item);
      }
    }
  }

  for (const uuid of CY.scvmFactory.startingEquipmentTables) {
    const table = await fromUuid(uuid);
    if (table) {
      const draw = await table.draw({ displayChat: false });
      let items = await docsFromResults(draw.results);
      if (clazz.system.onlyApps && (hasCybertech(items) || hasNano(items))) {
        // replace with a draw from apps
        const item = await drawFromTableUuid(CY.scvmFactory.appsTable);
        items = [item];
      } else if (clazz.system.onlyCybertech && (hasApp(items) || hasNano(items))) {
        // replace with a draw from cybertech
        const item = await drawFromTableUuid(CY.scvmFactory.cybertechTable, "1d12");
        items = [item];
      } else if (clazz.system.onlyNano && (hasApp(items) || hasCybertech(items))) {
        // replace with a draw from nano powers
        const item = await drawFromTableUuid(CY.scvmFactory.nanoPowersTable);
        items = [item];
      }
      equipment.push(...items);  
    } else {
      console.error(`Could not find table ${uuid}`);
    }
  }
  return equipment;
};

function simpleData(e) {
  return {
    system: e.system,
    img: e.img,
    items: e.items?.map(i => simpleData(i)),
    name: e.name,
    type: e.type,  
  };
};

function randomNumberedFile(dir, prefix, maxImgNum, extension) {
  // pick a suffix from 1 to max
  const imgNum = randomIntFromInterval(1, maxImgNum);
  // format to 2 digits
  const imgNumStr = imgNum.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
  return `/${dir}/${prefix}${imgNumStr}.${extension}`;
};

function randomCharacterPortrait() {
  return randomNumberedFile("systems/cy-borg/assets/images/portraits/characters", "profile_", 7, "svg");  
};

async function rollScvmForClass(clazz) {
  console.log(`Creating new ${clazz.name}`);
  const allDocs = [clazz];

  // all-character starting equipment tables
  const equipment = await startingEquipment(clazz);
  if (equipment) {
    allDocs.push(...equipment);
  }

  // starting weapons
  const weapons = await classStartingWeapons(clazz);
  if (weapons) {
    allDocs.push(...weapons);
  }

  // starting armor
  const armor = await classStartingArmor(clazz);
  if (armor) {
    allDocs.push(...armor);
  }

  // class-specific starting items
  const startingItems = await classStartingItems(clazz);
  if (startingItems) {
    allDocs.push(...startingItems);
  }

  // start accumulating character description, starting with the class description
  const descriptionLines = await classDescriptionLines(clazz);

  // class-specific starting rolls
  // these may add items, actors, or description lines
  const startingRollItems = [];
  if (clazz.system.rolls) {
    const lines = clazz.system.rolls.split("\n");
    for (const line of lines) {
      const [packName, tableName, rolls, formula] = line.split(",");
      // assume 1 roll unless otherwise specified in the csv
      const numRolls = rolls ? parseInt(rolls) : 1;
      const pack = game.packs.get(packName);
      if (pack) {
        const content = await pack.getDocuments();
        const table = content.find((i) => i.name === tableName);
        if (table) {
          const results = await compendiumTableDrawMany(table, numRolls, formula);
          for (const result of results) {
            // draw result type: text (0), entity (1), or compendium (2)
            if (result.type === CONST.TABLE_RESULT_TYPES.TEXT) {
              // text
              descriptionLines.push(
                `<p>${table.name}: ${result.text}</p>`
              );
            } else if (result.type === CONST.TABLE_RESULT_TYPES.DOCUMENT) {
              // entity
              // TODO: what do we want to do here?
            } else if (result.type === CONST.TABLE_RESULT_TYPES.COMPENDIUM) {
              // compendium
              const entity = await entityFromResult(result);
              startingRollItems.push(entity);
            }
          }
        } else {
          console.log(`Could not find RollTable ${tableName}`);
        }
      } else {
        console.log(`Could not find compendium ${packName}`);
      }
    }
  }
  allDocs.push(...startingRollItems);

  // make simple data structure for embedded items
  const items = allDocs.filter((e) => e instanceof CYItem);
  const itemData = items.map(i => simpleData(i));

  const name = await randomName();
  const npcs = allDocs.filter(e => e instanceof CYActor);
  const npcData = npcs.map(n => simpleData(n));

  const strength = await abilityRoll(clazz.system.strength);
  const agility = await abilityRoll(clazz.system.agility);
  const presence = await abilityRoll(clazz.system.presence);
  const toughness = await abilityRoll(clazz.system.toughness);
  const knowledge = await abilityRoll(clazz.system.knowledge);
  const hitPoints = Math.max(1,
    await rollTotal(clazz.system.hitPoints) + toughness);
  const credits = await rollTotal(clazz.system.credits);
  const debtAmount = await rollTotal("3d6*1000");
  const debtTo = await drawTextFromTableUuid(CY.scvmFactory.debtTable);
  const glitches = await rollTotal(clazz.system.glitches);
  descriptionLines.push("<p>&nbsp;</p>");
  descriptionLines.push(`<p>You owe a debt of ${debtAmount} to ${debtTo}.</p>`);
  const img = randomCharacterPortrait();
  return {
    actorCreateMacro: clazz.system.actorCreateMacro,
    actorImg: img,
    agility,
    credits,
    debt: {
      amount: debtAmount,
      to: debtTo
    },
    description: descriptionLines.join(""),
    glitches,
    hitPoints,
    items: itemData,
    knowledge,
    name,
    npcs: npcData,
    presence,
    strength,
    tokenImg: img,
    toughness,
  };
};

function scvmToActorData(s) {
  return {
    name: s.name,
    system: {
      abilities: {
        strength: { value: s.strength },
        agility: { value: s.agility },
        presence: { value: s.presence },
        toughness: { value: s.toughness },
        knowledge: { value: s.knowledge },
      },
      credits: s.credits,
      debt: s.debt,
      description: s.description,
      glitches: {
        max: s.glitches,
        value: s.glitches,
      },
      hitPoints: {
        max: s.hitPoints,
        value: s.hitPoints,
      },
    },
    img: s.actorImg,
    items: s.items,
    flags: {},
    prototypeToken: {
      name: s.name,
      texture: {
        src: s.actorImg,
      },
    },
    type: "character",
  };
};

async function createActorWithScvm(s) {
  const data = scvmToActorData(s);
  // use CYActor.create() so we get default disposition, actor link, vision, etc
  const actor = await CYActor.create(data);  
  actor.sheet.render(true);

  // create any npcs
  for (const npcData of s.npcs) {
    const lastWord = npcData.name.split(" ").pop();
    npcData.name = `${actor.name}'s ${lastWord}`;
    if (npcData.type === "vehicle") {
      npcData.system.ownerId = actor.id;
    }
    const npcActor = await CYActor.create(npcData);
    npcActor.sheet.render(true);
  }

  // run post-create macro, if any
  if (s.actorCreateMacro) {
    const [packName, macroName] = s.actorCreateMacro.split(",");
    const pack = game.packs.get(packName);
    if (pack) {
      const content = await pack.getDocuments();
      const macro = content.find(x => x.name === macroName);
      if (macro) {
        console.log(`Executing macro ${macroName} from pack ${packName}`);
        macro.execute({actor});
      } else {
        console.error(`Could not find macro ${macroName}.`);
      }
    } else {
      console.error(`Could not find pack ${packName}.`);
    }
  }
};

async function updateActorWithScvm(actor, s) {
  const data = scvmToActorData(s);
  // Explicitly nuke all items before updating.
  await actor.deleteEmbeddedDocuments("Item", [], { deleteAll: true });
  await actor.update(data);
  await actor.linkNanos();

  // update any actor tokens in the scene
  for (const token of actor.getActiveTokens()) {
    await token.document.update({
      name: actor.name,
      texture: {
        src: actor.prototypeToken.texture.src,
      },
    });
  }  

  // create any npcs, if player has perms
  for (const npcData of s.npcs) {
    if (game.user.can("ACTOR_CREATE")) {
      const lastWord = npcData.name.split(" ").pop();
      npcData.name = `${actor.name}'s ${lastWord}`;
      if (npcData.type === "vehicle") {
        npcData.system.ownerId = actor.id;
      }  
      const npcActor = await CYActor.create(npcData);
      npcActor.sheet.render(true);      
    } else {
      ui.notifications.info(`Ask the GM to create an NPC for you: ${npcData.name}`, {permanent: true});
    }
  }

  // run post-create macro, if any
  if (s.actorCreateMacro) {
    const [packName, macroName] = s.actorCreateMacro.split(",");
    const pack = game.packs.get(packName);
    const content = await pack.getDocuments();
    const macro = content.find(x => x.name === macroName);
    if (macro) {
      console.log("Executing macro ${macroName} from pack ${packName}...");
      macro.execute({actor});
    }
  }  
};

async function docsFromResults(results) {
  const ents = [];
  for (const result of results) {
    const entity = await entityFromResult(result);
    if (entity) {
      ents.push(entity);
    }
  }
  return ents;
};

async function entityFromResult(result) {
  // draw result type: text (0), entity (1), or compendium (2)
  if (result.type === CONST.TABLE_RESULT_TYPES.COMPENDIUM) {
    // grab the item from the compendium
    const collection = game.packs.get(result.documentCollection);
    if (collection) {
      // TODO: should we use pack.getEntity(entryId) ?
      // const item = await collection.getEntity(result._id);
      const content = await collection.getDocuments();
      const entity = content.find((i) => i.name === result.text);
      return entity;
    } else {      
      console.log(`Could not find pack ${result.documentCollection}`);
    }
  }
};

function abilityBonus(rollTotal) {
  if (rollTotal <= 4) {
    return -3;
  } else if (rollTotal <= 6) {
    return -2;
  } else if (rollTotal <= 8) {
    return -1;
  } else if (rollTotal <= 12) {
    return 0;
  } else if (rollTotal <= 14) {
    return 1;
  } else if (rollTotal <= 16) {
    return 2;
  } else {
    // 17 - 20+
    return 3;
  }
};

/** Workaround for compendium RollTables not honoring replacement=false */
async function compendiumTableDrawMany(rollTable, numDesired, formula) {
  const rollTotals = [];
  let results = [];
  while (rollTotals.length < numDesired) {
    const roll = formula ? new Roll(formula) : undefined;
    const tableDraw = await rollTable.draw({ displayChat: false, roll });
    if (rollTotals.includes(tableDraw.roll.total)) {
      // already rolled this, so roll again
      continue;
    }
    rollTotals.push(tableDraw.roll.total);
    results = results.concat(tableDraw.results);
  }
  return results;
};
