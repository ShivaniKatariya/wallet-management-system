exports.getColumnsFromList = (list, excludedKeys = []) => {
  if (!list || !list.length) return [];

  const sampleObject = list[0];
  const allKeys = Object.keys(sampleObject);
  const filteredKeys = allKeys.filter((key) => !excludedKeys.includes(key));
  return filteredKeys;
};