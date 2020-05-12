export const generateUid = (min = 1, max = 9999, places = 4) => {
  // TODO: Add id verification
  const randomBetweenNumbers = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
  const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');
  return zeroPad(randomBetweenNumbers(min, max), places);
};
