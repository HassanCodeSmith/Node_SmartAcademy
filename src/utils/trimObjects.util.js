const trimObjects = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].trim();
    } else if (typeof obj[key] === "object") {
      trimObjects(obj[key]);
    }
  });
  return obj;
};

export { trimObjects };
