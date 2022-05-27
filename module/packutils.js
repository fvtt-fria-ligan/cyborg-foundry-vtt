export const documentFromPack = async (packName, docName) => {
  const pack = game.packs.get(packName);
  const docs = await pack.getDocuments();
  const doc = docs.find((i) => i.name === docName);
  return doc;
};

export const tableFromPack = async (packName, tableName) => {
  const creationPack = game.packs.get(packName);
  const creationDocs = await creationPack.getDocuments();
  const table = creationDocs.find((i) => i.name === tableName);
  return table;
};

export const drawFromTable = async (packName, tableName) => {
  const table = await tableFromPack(packName, tableName);
  const tableDraw = await table.draw({ displayChat: false });
  // TODO: decide if/how we want to handle multiple results
  return tableDraw;
};

export const drawText = async (packName, tableName) => {
  const draw = await drawFromTable(packName, tableName);
  return draw.results[0].data.text;
};

export const drawDocument = async (packName, tableName) => {
  const draw = await drawFromTable(packName, tableName);
  const doc = await documentFromDraw(draw);
  return doc;
};

export const drawDocuments = async (packName, tableName) => {
  const draw = await drawFromTable(packName, tableName);
  const docs = await documentsFromDraw(draw);
  return docs;
};

export const documentsFromDraw = async (draw) => {
  const docResults = draw.results.filter((r) => r.data.type === 2);
  return Promise.all(docResults.map((r) => documentFromResult(r)));
};

export const documentFromDraw = async (draw) => {
  const doc = await documentFromResult(draw.results[0]);
  return doc;
};

export const documentFromResult = async (result) => {
  if (!result.data.collection) {
    console.log("No data.collection for result; skipping");
    return;
  }
  const collectionName =
    result.data.type === 2
      ? "Compendium." + result.data.collection
      : result.data.collection;
  const uuid = `${collectionName}.${result.data.resultId}`;
  const doc = await fromUuid(uuid);
  return doc;
};
