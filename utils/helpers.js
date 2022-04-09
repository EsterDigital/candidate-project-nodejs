const filterObj = (obj, ...notAllowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (!notAllowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}

module.exports = {
  filterObj
}