export const hasChanged: (originalObject: object, updateValues: object) => boolean = (
  originalObject,
  updateValues
) => {
  return !halfCompare(originalObject, updateValues);
};

const halfCompare: (originalObject: object, updateValues: object) => boolean = (
  originalObject,
  updateValues
) => {
  const keys = Object.keys(updateValues);

  for (const key of keys) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const value1 = originalObject[key];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const value2 = updateValues[key];

    const isObjects = isObject(value1) && isObject(value2);

    if ((isObjects && !hasChanged(value1, value2)) || (!isObjects && value1 !== value2)) {
      return false;
    }
  }

  return true;
};

const isObject = (object: any) => {
  return object != null && typeof object === 'object';
};
