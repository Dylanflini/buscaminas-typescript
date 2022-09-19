export const getRandomNumber = (max: number): number => Math.round(Math.random() * max);

export const isNaturalNumber = (value: number) => {
  const absoluteValue = Math.abs(value);
  const integerValue = parseInt(value.toString(), 10);
  return integerValue === value && integerValue === absoluteValue && absoluteValue === value;
};
