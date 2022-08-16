export function modelItemAppToDb<TAppModel>(
  item: TAppModel,
  tableName: string,
  columnNames: string,
  getValues: (item: TAppModel) => string
): string {
  const values = getValues(item);
  return `INSERT INTO ${tableName} (${columnNames}) VALUES ${values}`;
}

export function modelItemsAppToDb<TAppModel>(
  items: readonly TAppModel[],
  tableName: string,
  columnNames: string,
  getValues: (item: TAppModel) => string
): string {
  const values = items.map((item) => `  (${getValues(item)})`).join(',\n');
  return `INSERT INTO ${tableName} (${columnNames}) VALUES\n${values}`;
}
