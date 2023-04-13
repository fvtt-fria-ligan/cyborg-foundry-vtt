

// e.g., @DRAW[Compendium.cy-borg-core.random-tables.vX47Buopuq9t0x9r]{Names}
const DRAW_FROM_TABLE_PATTERN = /@DRAW\[([^\]]+)\]{([^}]*)}/gm;
const drawFromTableEnricher = (match, _options) => {
  const uuid = match[1];
  const tableName = match[2];
  const elem = document.createElement('span');
  elem.className = "draw-from-table";
  elem.setAttribute("title", `Draw from table ${tableName}`);
  elem.setAttribute("data-uuid", uuid);
  elem.innerHTML = `<i class="fas fa-dice-d20">&nbsp;</i>`;
  return elem;
}

export const enrichTextEditors = () => {
  CONFIG.TextEditor.enrichers.push(
    {
      pattern: DRAW_FROM_TABLE_PATTERN,
      enricher: drawFromTableEnricher,
    },
  );
};

