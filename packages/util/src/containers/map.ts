export function mapGetOrThrow<K, V>(map: Map<K, V>, key: K): V {
  if (!map.has(key)) {
    throw new Error(`Map does not have entry for key '${key}'.`);
  }

  return map.get(key) as V;
}
