const parseContactType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;

  const validTypes = ['home', 'personal'];
  return validTypes.includes(type) ? type : undefined;
};

const parseBoolean = (value) => {
  if (typeof value !== 'string') return;

  if (value.toLowerCase() === 'true') return true;
  if (value.toLowerCase() === 'false') return false;

  return undefined;
};

const parseDate = (dateStr) => {
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? undefined : date;
};
export const parseFilterParams = (query) => {
  const { contactType, isFavourite, updateAfter, updateBefore } = query;

  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = parseBoolean(isFavourite);
  const parsedUpdatedAfter = parseDate(updateAfter);
  const parsedUpdatedBefore = parseDate(updateBefore);

  return {
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
    updatedAfter: parsedUpdatedAfter,
    updatedBefore: parsedUpdatedBefore,
  };
};
