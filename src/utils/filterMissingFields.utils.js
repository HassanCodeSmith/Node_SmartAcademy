export const filterMissingFields = (bodyObject, requiredFields) => {
  const missingFields = [];

  for (const field of requiredFields) {
    if (!bodyObject[field]) {
      missingFields.push(field);
    }
  }

  return missingFields;
};
