import { CYActor } from "../actor/actor.js";
import { CY } from "../config.js";
import { CYItem } from "../item/item.js";
import { randomName } from "./names.js";

// import {
//   documentFromPack,
//   drawDocument,
//   drawDocuments,
//   drawText,
// } from "./packutils.js";


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
  return content.find((i) => i.data.type === "class");
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
  return content.find((i) => i.data.type === "class");
};

const rollScvmForClass = async (clazz) => {
  console.log(`Creating new ${clazz.data.name}`);

  const creditsRoll = new Roll(clazz.data.data.credits).evaluate({
    async: false,
  });
  const glitchesRoll = new Roll(clazz.data.data.glitches).evaluate({
    async: false,
  });
  const hpRoll = new Roll(clazz.data.data.hitPoints).evaluate({
    async: false,
  });

  const strRoll = new Roll(clazz.data.data.strength).evaluate({
    async: false,
  });
  const strength = abilityBonus(strRoll.total);
  const agiRoll = new Roll(clazz.data.data.agility).evaluate({
    async: false,
  });
  const agility = abilityBonus(agiRoll.total);
  const preRoll = new Roll(clazz.data.data.presence).evaluate({
    async: false,
  });
  const presence = abilityBonus(preRoll.total);
  const touRoll = new Roll(clazz.data.data.toughness).evaluate({
    async: false,
  });
  const toughness = abilityBonus(touRoll.total);
  const knoRoll = new Roll(clazz.data.data.knowledge).evaluate({
    async: false,
  });
  const knowledge = abilityBonus(knoRoll.total);

  const hitPoints = Math.max(1, hpRoll.total + toughness);

  const allDocs = [clazz];

  // TODO: headset
  /*
  if (CY.scvmFactory.foodAndWaterPack) {
    // everybody gets food and water
    const miscPack = game.packs.get(CY.scvmFactory.foodAndWaterPack);
    const miscContent = await miscPack.getDocuments();
    if (CY.scvmFactory.foodItemName) {
      const food = miscContent.find(
        (i) => i.data.name === CY.scvmFactory.foodItemName
      );
      const foodRoll = new Roll("1d4", {}).evaluate({ async: false });
      // TODO: need to mutate _data to get it to change for our owned item creation.
      // Is there a better way to do this?
      food.data._source.data.quantity = foodRoll.total;
      allDocs.push(food);
    }
    if (CY.scvmFactory.waterItemName) {
      const waterskin = miscContent.find(
        (i) => i.data.name === CY.scvmFactory.waterItemName
      );
      allDocs.push(waterskin);
    }
  }
  */

  // starting equipment, weapons, armor, and traits etc all come from the same pack
  const ccPack = game.packs.get(CY.scvmFactory.characterCreationPack);
  const ccContent = await ccPack.getDocuments();

  // starting equipment tables
  for (const tableName of CY.scvmFactory.startingEquipmentTables) {
    const table = ccContent.find((i) => i.name === tableName);
    const draw = await table.draw({ displayChat: false });
    const items = await docsFromResults(draw.results);
    allDocs.push(...items);
  }

  // starting weapon
  if (CY.scvmFactory.startingWeaponTable && clazz.data.data.weaponTable) {
    const weaponRoll = new Roll(clazz.data.data.weaponTable);
    const weaponTable = ccContent.find(
      (i) => i.name === CY.scvmFactory.startingWeaponTable
    );
    const weaponDraw = await weaponTable.draw({
      roll: weaponRoll,
      displayChat: false,
    });
    const weapons = await docsFromResults(weaponDraw.results);
    // TODO: add ammo mags if starting weapon uses ammo
    allDocs.push(...weapons);
  }

  // starting armor
  if (CY.scvmFactory.startingArmorTable && clazz.data.data.armorTable) {
    const armorRoll = new Roll(clazz.data.data.armorTable);
    const armorTable = ccContent.find(
      (i) => i.name === CY.scvmFactory.startingArmorTable
    );
    const armorDraw = await armorTable.draw({
      roll: armorRoll,
      displayChat: false,
    });
    const armor = await docsFromResults(armorDraw.results);
    allDocs.push(...armor);
  }

  // class-specific starting items
  if (clazz.data.data.startingItems) {
    const startingItems = [];
    const lines = clazz.data.data.startingItems.split("\n");
    for (const line of lines) {
      const [packName, itemName] = line.split(",");
      const pack = game.packs.get(packName);
      if (pack) {
        const content = await pack.getDocuments();
        const item = content.find((i) => i.data.name === itemName);
        if (item) {
          startingItems.push(item);
        }
      }
    }
    allDocs.push(...startingItems);
  }

  // start accumulating character description, starting with the class description
  const descriptionLines = [];
  descriptionLines.push(clazz.data.data.description);
  descriptionLines.push("<p>&nbsp;</p>");

  let descriptionLine = "";
  // TODO
  /*
  if (CY.scvmFactory.terribleTraitsTable) {
    const ttTable = ccContent.find(
      (i) => i.name === CY.scvmFactory.terribleTraitsTable
    );
    const ttResults = await compendiumTableDrawMany(ttTable, 2);
    const terribleTrait1 = ttResults[0].data.text;
    const terribleTrait2 = ttResults[1].data.text;
    // BrokenBodies and BadHabits end with a period, but TerribleTraits don't.
    descriptionLine += `${terribleTrait1} and ${terribleTrait2
      .charAt(0)
      .toLowerCase()}${terribleTrait2.slice(1)}.`;
  }
  if (CY.scvmFactory.brokenBodiesTable) {
    const bbTable = ccContent.find(
      (i) => i.name === CY.scvmFactory.brokenBodiesTable
    );
    const bbDraw = await bbTable.draw({ displayChat: false });
    const brokenBody = bbDraw.results[0].data.text;
    descriptionLine += ` ${brokenBody}`;
  }
  if (CY.scvmFactory.badHabitsTable) {
    const bhTable = ccContent.find(
      (i) => i.name === CY.scvmFactory.badHabitsTable
    );
    const bhDraw = await bhTable.draw({ displayChat: false });
    const badHabit = bhDraw.results[0].data.text;
    descriptionLine += ` ${badHabit}`;
  }
  */
  if (descriptionLine) {
    descriptionLines.push(descriptionLine);
    descriptionLines.push("<p>&nbsp;</p>");
  }

  // class-specific starting rolls
  const startingRollItems = [];
  if (clazz.data.data.startingRolls) {
    const lines = clazz.data.data.startingRolls.split("\n");
    for (const line of lines) {
      const [packName, tableName, rolls] = line.split(",");
      // assume 1 roll unless otherwise specified in the csv
      const numRolls = rolls ? parseInt(rolls) : 1;
      const pack = game.packs.get(packName);
      if (pack) {
        const content = await pack.getDocuments();
        const table = content.find((i) => i.name === tableName);
        if (table) {
          // const tableDraw = await table.drawMany(numRolls, {displayChat: false});
          // const results = tableDraw.results;
          const results = await compendiumTableDrawMany(table, numRolls);
          for (const result of results) {
            // draw result type: text (0), entity (1), or compendium (2)
            if (result.data.type === 0) {
              // text
              descriptionLines.push(
                `<p>${table.data.name}: ${result.data.text}</p>`
              );
            } else if (result.data.type === 1) {
              // entity
              // TODO: what do we want to do here?
            } else if (result.data.type === 2) {
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

  // add items as owned items
  const items = allDocs.filter((e) => e instanceof CYItem);
  // for other non-item documents, just add some description text (ITEMTYPE: Item Name)
  const nonItems = allDocs.filter((e) => !(e instanceof CYItem));
  for (const nonItem of nonItems) {
    if (nonItem && nonItem.data && nonItem.data.type) {
      const upperType = nonItem.data.type.toUpperCase();
      descriptionLines.push(
        `<p>&nbsp;</p><p>${upperType}: ${nonItem.data.name}</p>`
      );
    } else {
      console.log(`Skipping non-item ${nonItem}`);
    }
  }

  // make simple data structure for embedded items
  const itemData = items.map((i) => ({
    data: i.data.data,
    img: i.data.img,
    name: i.data.name,
    type: i.data.type,
  }));

  return {
    actorImg: clazz.img,
    agility,
    credits: creditsRoll.total,
    description: descriptionLines.join(""),
    glitches: glitchesRoll.total,
    hitPoints,
    items: itemData,
    knowledge,
    presence,
    strength,
    tokenImg: clazz.img,
    toughness,
  };
};

const scvmToActorData = (s) => {
  const newName = randomName();
  return {
    name: newName,
    // TODO: do we need to set folder or sort?
    // folder: folder.data._id,
    // sort: 12000,
    data: {
      abilities: {
        strength: { value: s.strength },
        agility: { value: s.agility },
        presence: { value: s.presence },
        toughness: { value: s.toughness },
        knowledge: { value: s.knowledge },
      },
      credits: s.credits,
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
    token: {
      img: s.actorImg,
      name: newName,
    },
    type: "character",
  };
};

const createActorWithScvm = async (s) => {
  const data = scvmToActorData(s);
  // use CYActor.create() so we get default disposition, actor link, vision, etc
  const actor = await CYActor.create(data);
  actor.sheet.render(true);
};

const updateActorWithScvm = async (actor, s) => {
  const data = scvmToActorData(s);
  // Explicitly nuke all items before updating.
  // Before Foundry 0.8.x, actor.update() used to overwrite items,
  // but now doesn't. Maybe because we're passing items: [item.data]?
  // Dunno.
  await actor.deleteEmbeddedDocuments("Item", [], { deleteAll: true });
  await actor.update(data);
  // update any actor tokens in the scene, too
  for (const token of actor.getActiveTokens()) {
    await token.document.update({
      img: actor.data.img,
      name: actor.name,
    });
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
  // TODO: figure out how we want to handle an entity result

  // TODO: handle scroll lookup / rolls
  // TODO: can we make a recursive random scroll thingy

  if (result.data.type === 0) {
    // hack for not having recursive roll tables set up
    // TODO: set up recursive roll tables :P
    // TODO
    if (result.data.text === "Roll on Random Unclean Scrolls") {
      const collection = game.packs.get("morkborg.random-scrolls");
      const content = await collection.getDocuments();
      const table = content.find((i) => i.name === "Unclean Scrolls");
      const draw = await table.draw({ displayChat: false });
      const items = await docsFromResults(draw.results);
      return items[0];
    } else if (result.data.text === "Roll on Random Sacred Scrolls") {
      const collection = game.packs.get("morkborg.random-scrolls");
      const content = await collection.getDocuments();
      const table = content.find((i) => i.name === "Sacred Scrolls");
      const draw = await table.draw({ displayChat: false });
      const items = await docsFromResults(draw.results);
      return items[0];
    }
  } else if (result.data.type === 2) {
    // grab the item from the compendium
    const collection = game.packs.get(result.data.collection);
    if (collection) {
      // TODO: should we use pack.getEntity(entryId) ?
      // const item = await collection.getEntity(result._id);
      const content = await collection.getDocuments();
      const entity = content.find((i) => i.name === result.data.text);
      return entity;
    } else {
      console.log(`Could not find pack ${result.data.collection}`);
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
const compendiumTableDrawMany = async (rollTable, numDesired) => {
  const rollTotals = [];
  let results = [];
  while (rollTotals.length < numDesired) {
    const tableDraw = await rollTable.draw({ displayChat: false });
    if (rollTotals.includes(tableDraw.roll.total)) {
      // already rolled this, so roll again
      continue;
    }
    rollTotals.push(tableDraw.roll.total);
    results = results.concat(tableDraw.results);
  }
  return results;
};
