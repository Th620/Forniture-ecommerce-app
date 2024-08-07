const hasDuplicatesArrayOfStings = (array) => {
  return new Set(array).size !== array.length;
};

const hasDuplicatesArrayOfObjects = (array, prop) => {
  const set = new Set();
  array.some((object) => {
    return set.size === set.add(object[prop]).size;
  });
};

const hasDuplicatesArrayOfObjectsTwoProprties = (array, prop1, prop2) => {
  const set = new Set();
  array.some((object) => {
    const key = `${object[prop1]}-${object[prop2]}`
    return set.size === set.add(key).size;
  });
};

module.exports = { hasDuplicatesArrayOfStings, hasDuplicatesArrayOfObjects, hasDuplicatesArrayOfObjectsTwoProprties };
