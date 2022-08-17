export function pgModelToInsert<TAppModel>(
  item: TAppModel,
  tableName: string,
  columnNames: readonly string[],
  getValues: (item: TAppModel) => readonly string[]
): string {
  const columnNamesString = columnNames.join(', ');
  const valuesString = getValues(item).join(', ');
  return `INSERT INTO ${tableName} (${columnNamesString}) VALUES (${valuesString})`;
}

export function pgModelToUpdate<TAppModel>(
  item: TAppModel,
  tableName: string,
  columnNames: readonly string[],
  getValues: (item: TAppModel) => readonly string[],
  idColumnName: string,
  idColumnValue: string
): string {
  const columnNamesString = columnNames.join(', ');
  const valuesString = getValues(item).join(', ');
  return `UPDATE ${tableName} SET (${columnNamesString}) = (${valuesString}) WHERE ${idColumnName} = ${idColumnValue}`;
}

export function pgModelsToInsert<TAppModel>(
  items: readonly TAppModel[],
  tableName: string,
  columnNames: readonly string[],
  getValues: (item: TAppModel) => readonly string[]
): string {
  const columnNamesString = columnNames.join(', ');
  const valuesString = items
    .map((item) => `  (${getValues(item).join(', ')})`)
    .join(',\n');
  return `INSERT INTO ${tableName} (${columnNamesString}) VALUES\n${valuesString}`;
}
