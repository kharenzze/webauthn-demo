export const getRandomU64 = () => {
  const array = new BigUint64Array(1);
  crypto.getRandomValues(array);
  return array[0];
};
