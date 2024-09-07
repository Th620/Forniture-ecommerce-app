const existsArrayOfObjects = (array, prop, exist) => {
  var resultArr = [];
  array.map((object) => {
    resultArr.push(object[prop]);
  });
  return resultArr.includes(exist);
};

module.exports = { existsArrayOfObjects };
