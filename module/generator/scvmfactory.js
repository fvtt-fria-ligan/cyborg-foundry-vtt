import { CYActor } from "../actor/actor.js";
import { CY } from "../config.js";
import { CYItem } from "../item/item.js";
import { randomName } from "./names.js";
import { lowerCaseFirst, rollTotal, upperCaseFirst, sample, articalize } from "../utils.js";

import {
  documentFromPack,
  drawFromTable,
  drawText,
} from "../packutils.js";

export const createRandomScvm = async () => {
  const clazz = await pickRandomClass();
  await createScvm(clazz);
};

export const createScvm = async (clazz) => {
  const scvm = await rollScvmForClass(clazz);
  await createActorWithScvm(scvm);
};

export const scvmifyActor = async (actor, clazz) => {
  const scvm = await rollScvmForClass(clazz);
  await updateActorWithScvm(actor, scvm);
};

export const createNpc = async () => {
  const npc = await randomNpc();
  const actor = await CYActor.create(npc);
  actor.sheet.render(true);
};

const randomNpc = async () => {
  const name = randomName();
  const description = await makeDescription(CY.scvmFactory.npcDescriptionTables);
  const img = randomNpcPortrait();
  const hp = rollTotal("1d8");
  const morale = rollTotal("1d8+4");
  const attack = npcAttack();
  const armor = npcArmor();
  return {
    name,
    data: {
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

const npcAttack = () => {
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

const npcArmor = () => {
  return sample([
    "No armor",
    "Styleguard -d2",
    "Rough -d4",
  ]);
}

const makeDescription = async (descriptionTables) => {
  const ccPack = game.packs.get(CY.scvmFactory.characterCreationPack);
  const ccContent = await ccPack.getDocuments();
  let descriptionLine = "";
  for (const dt of descriptionTables) {
    const table = ccContent.find((i) => i.name === dt.tableName);
    if (table) {
      const draw = await table.draw({ displayChat: false });
      let text = lowerCaseFirst(draw.results[0].text);
      if (dt.articalize) {
        text = articalize(text);
      }
      const formatted = game.i18n.format(dt.formatKey, {text});
      descriptionLine += upperCaseFirst(formatted) + " ";  
    } else {
      console.error(`Could not find table ${dt.tableName}`);
    }
  }
  return descriptionLine;
};

const pickRandomClass = async () => {
  const classPacks = findClassPacks();
  if (classPacks.length === 0) {
    // TODO: error on 0-length classPaths
    return;
  }
  const packName = classPacks[Math.floor(Math.random() * classPacks.length)];
  // TODO: debugging hardcodes
  const pack = game.packs.get(packName);
  const content = await pack.getDocuments();
  return content.find((i) => i.type === "class");
};

export const findClassPacks = () => {
  const classPacks = [];
  const packKeys = game.packs.keys();
  for (const packKey of packKeys) {
    // moduleOrSystemName.packName
    const keyParts = packKey.split(".");
    if (keyParts.length === 2) {
      const packName = keyParts[1];
      if (packName.startsWith("class-") && packName.length > 6) {
        // class pack
        classPacks.push(packKey);
      }
    }
  }
  return classPacks;
};

export const classItemFromPack = async (packName) => {
  const pack = game.packs.get(packName);
  const content = await pack.getDocuments();
  return content.find((i) => i.type === "class");
};

const abilityRoll = (formula) => {
  return abilityBonus(rollTotal(formula));
}

const classStartingArmor = async (clazz) => {
  const ccPack = game.packs.get(CY.scvmFactory.characterCreationPack);
  const ccContent = await ccPack.getDocuments();
  if (CY.scvmFactory.startingArmorTable && clazz.system.armorTable) {
    const armorRoll = new Roll(clazz.system.armorTable);
    const armorTable = ccContent.find(
      (i) => i.name === CY.scvmFactory.startingArmorTable
    );
    const armorDraw = await armorTable.draw({
      roll: armorRoll,
      displayChat: false,
    });
    const armor = await docsFromResults(armorDraw.results);
    return armor;
  }
};

const classStartingWeapons = async (clazz) => {
  const ccPack = game.packs.get(CY.scvmFactory.characterCreationPack);
  const ccContent = await ccPack.getDocuments();
  if (CY.scvmFactory.startingWeaponTable && clazz.system.weaponTable) {
    const weaponRoll = new Roll(clazz.system.weaponTable);
    const weaponTable = ccContent.find(
      (i) => i.name === CY.scvmFactory.startingWeaponTable
    );
    const weaponDraw = await weaponTable.draw({
      roll: weaponRoll,
      displayChat: false,
    });
    const weapons = await docsFromResults(weaponDraw.results);
    // add ammo mags if starting weapon uses ammo
    const mags = [];
    for (const weapon of weapons) {
      if (weapon.system.usesAmmo) {
        const mag = await documentFromPack(CY.scvmFactory.ammoPack, CY.scvmFactory.ammoItem);
        const magRoll = new Roll("1d4").evaluate({async: false});
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

const classStartingItems = async (clazz) => {
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

const classDescriptionLines = async (clazz) => {
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

const hasApp = (items) => {
  return items.filter(x => x.type === CY.itemTypes.app).length > 0;
}

const hasCybertech = (items) => {
  return items.filter(x => x.system.cybertech).length > 0;
}

const hasNano = (items) => {
  return items.filter(x => x.type === CY.itemTypes.nanoPower).length > 0;
}

const startingEquipment = async (clazz) => {
  const equipment = [];

  if (CY.scvmFactory.startingItemsPack) {
    const itemPack = game.packs.get(CY.scvmFactory.startingItemsPack);
    const items = await itemPack.getDocuments();
    for (const itemName of CY.scvmFactory.startingItems) {
      const item = items.find(x => x.name === itemName);
      equipment.push(item);
    }
  }

  const ccPack = game.packs.get(CY.scvmFactory.characterCreationPack);
  const ccContent = await ccPack.getDocuments();
  for (const tableName of CY.scvmFactory.startingEquipmentTables) {
    const table = ccContent.find(x => x.name === tableName);
    if (table) {
      const draw = await table.draw({ displayChat: false });
      let items = await docsFromResults(draw.results);
      if (clazz.system.onlyApps && (hasCybertech(items) || hasNano(items))) {
        // replace with a draw from apps
        const item = await drawFromTable(CY.scvmFactory.characterCreationPack, "Apps");
        items = [item];
      } else if (clazz.system.onlyCybertech && (hasApp(items) || hasNano(items))) {
        // replace with a draw from cybertech
        const item = await drawFromTable(CY.scvmFactory.characterCreationPack, "Cybertech", "1d12");
        items = [item];
      } else if (clazz.system.onlyNano && (hasApp(items) || hasCybertech(items))) {
        // replace with a draw from nano powers
        const item = await drawFromTable(CY.scvmFactory.characterCreationPack, "Nano Powers");
        items = [item];
      }
      equipment.push(...items);  
    } else {
      console.error(`Could not find table ${tableName}`);
    }
  }
  return equipment;
};

const simpleData = (e) => ({
  data: e.system,
  img: e.img,
  items: e.items?.map(i => simpleData(i)),
  name: e.name,
  type: e.type,  
});

const randomPortrait = (dir, prefix, maxImgNum) => {
  const imgNum = Math.floor(Math.random() * (maxImgNum + 1));
  const imgNumStr = imgNum.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
  return `systems/cy-borg/assets/images/portraits/${dir}/${prefix}${imgNumStr}.png`;
};

const randomNpcPortrait = () => {
  const rand = Math.random();
  if (rand < 0.50) {
    return randomCorpoPortrait();
  } else if (rand < 0.70) {
    return randomSecopPortrait();
  } else {
    return randomPunkPortrait();
  }
};

const randomCorpoPortrait = () => {
  return randomPortrait("corpos", "corpo_", 16);
};

const randomPunkPortrait = () => {
  return randomPortrait("punks", "punk_", 96);
};

const randomSecopPortrait = () => {
  return randomPortrait("secops", "secop_", 11);
};

const rollScvmForClass = async (clazz) => {
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
            if (result.type === 0) {
              // text
              descriptionLines.push(
                `<p>${table.name}: ${result.text}</p>`
              );
            } else if (result.type === 1) {
              // entity
              // TODO: what do we want to do here?
            } else if (result.type === 2) {
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

  const name = randomName();
  const npcs = allDocs.filter(e => e instanceof CYActor);
  const npcData = npcs.map(n => simpleData(n));

  const strength = abilityRoll(clazz.system.strength);
  const agility = abilityRoll(clazz.system.agility);
  const presence = abilityRoll(clazz.system.presence);
  const toughness = abilityRoll(clazz.system.toughness);
  const knowledge = abilityRoll(clazz.system.knowledge);
  const hitPoints = Math.max(1,
    rollTotal(clazz.system.hitPoints) + toughness);
  const credits = rollTotal(clazz.system.credits);
  const debtAmount = rollTotal("3d6*1000");
  const debtTo = await drawText(CY.scvmFactory.characterCreationPack, "Debt");
  const glitches = rollTotal(clazz.system.glitches);
  descriptionLines.push("<p>&nbsp;</p>");
  descriptionLines.push(`<p>You owe a debt of ${debtAmount} to ${debtTo}.</p>`);
  const img = randomPunkPortrait();
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

const scvmToActorData = (s) => {
  return {
    name: s.name,
    data: {
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

const createActorWithScvm = async (s) => {
  const data = scvmToActorData(s);
  // use CYActor.create() so we get default disposition, actor link, vision, etc
  const actor = await CYActor.create(data);  
  actor.sheet.render(true);

  // create any npcs
  for (const npcData of s.npcs) {
    const lastWord = npcData.name.split(" ").pop();
    npcData.name = `${actor.name}'s ${lastWord}`;
    if (npcData.type === "vehicle") {
      npcData.data.ownerId = actor.id;
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

const updateActorWithScvm = async (actor, s) => {
  const data = scvmToActorData(s);
  // Explicitly nuke all items before updating.
  await actor.deleteEmbeddedDocuments("Item", [], { deleteAll: true });
  await actor.update(data);
  await actor.linkNanos();

  // update any actor tokens in the scene
  for (const token of actor.getActiveTokens()) {
    console.log(token);
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
        npcData.data.ownerId = actor.id;
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

const docsFromResults = async (results) => {
  const ents = [];
  for (const result of results) {
    const entity = await entityFromResult(result);
    if (entity) {
      ents.push(entity);
    }
  }
  return ents;
};

const entityFromResult = async (result) => {
  // draw result type: text (0), entity (1), or compendium (2)
  if (result.type === 2) {
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

const abilityBonus = (rollTotal) => {
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
const compendiumTableDrawMany = async (rollTable, numDesired, formula) => {
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
