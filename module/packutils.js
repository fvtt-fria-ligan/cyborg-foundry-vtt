export const ACTORS_PACK = "cy-borg.cyborg-actors";
export const ITEMS_PACK = "cy-borg.cyborg-items";
export const MACROS_PACK = "cy-borg.cyborg-macros";
export const TABLES_PACK = "cy-borg.cyborg-tables";

export const documentFromPack = async (packName, docName) => {
  const pack = game.packs.get(packName);
  if (!pack) {
    console.error(`Could not find pack ${packName}.`);
    return;
  }
  const docs = await pack.getDocuments();
  const doc = docs.find((i) => i.name === docName);
  if (!doc) {
    console.error(`Could not find doc ${docName} in pack ${packName}.`);
  }
  return doc;
};

export const drawFromTable = async (packName, tableName, formula) => {
  const table = await documentFromPack(packName, tableName);
  if (!table) {
    console.log(`Could not load ${tableName} from pack ${packName}`);
    return;
  }  
  const roll = formula ? new Roll(formula) : undefined;
  const tableDraw = await table.draw({ displayChat: false, roll });
  // TODO: decide if/how we want to handle multiple results
  return tableDraw;
};

export const drawFromTableUuid = async (
  uuid,
  formula = null,
  displayChat = false
) => {
  const table = await fromUuid(uuid);
  if (!table) {
    console.log(`Could not find table ${uuid}`);
    console.trace();
    return;
  }
  const roll = formula ? new Roll(formula) : undefined;
  const tableDraw = await table.draw({ displayChat, roll });
  // TODO: decide if/how we want to handle multiple results
  return tableDraw;
};

export const drawText = async (packName, tableName) => {
  const draw = await drawFromTable(packName, tableName);
  if (draw) {
    return draw.results[0].text;
  }  
};

export const drawTextFromTableUuid = async (uuid) => {
  const draw = await drawFromTableUuid(uuid);
  if (draw) {
    return draw.results[0].text;
  }
};

export const drawDocument = async (packName, tableName) => {
  const draw = await drawFromTable(packName, tableName);
  const doc = await documentFromDraw(draw);
  return doc;
};

export const drawDocumentsFromTableUuid = async (uuid) => {
  const draw = await drawFromTableUuid(uuid);
  const docs = await documentsFromDraw(draw);
  return docs;
};

export const drawDocuments = async (packName, tableName) => {
  const draw = await drawFromTable(packName, tableName);
  const docs = await documentsFromDraw(draw);
  return docs;
};

export const documentsFromDraw = async (draw) => {
  const docResults = draw.results.filter((r) => r.type === 2);
  return Promise.all(docResults.map((r) => documentFromResult(r)));
};

export const documentFromDraw = async (draw) => {
  const doc = await documentFromResult(draw.results[0]);
  return doc;
};

export const documentFromResult = async (result) => {
  if (!result.documentCollection) {
    console.log("No documentCollection for result; skipping");
    return;
  }
  const collectionName =
    result.type === 2
      ? "Compendium." + result.documentCollection
      : result.documentCollection;
  const uuid = `${collectionName}.${result.documentId}`;
  const doc = await fromUuid(uuid);
  return doc;
};

export const dupeData = (doc) => {
  return {
    data: doc.system,
    img: doc.img,
    name: doc.name,
    type: doc.type,
  };
};