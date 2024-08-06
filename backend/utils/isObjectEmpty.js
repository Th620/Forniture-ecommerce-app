const isObjectEmpty = (objName) => {
  return Object.keys(objName).length === 0 && objName.constructor === Object;
};

module.exports = { isObjectEmpty };
