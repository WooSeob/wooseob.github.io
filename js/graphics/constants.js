import { rand } from "../utils.js";

export const Colors = {
  Red: { R: 180, G: 0, B: 0 },
  Blue: { R: 0, G: 0, B: 180 },
  Gray: { R: 130, G: 130, B: 130 },
  Yellow: { R: 204, G: 204, B: 2 },
  Purple: { R: 153, G: 0, B: 203 },
  Cyan: { R: 0, G: 204, B: 204 },
};

export const getRandomColor = () => {
  const arr = ["Red", "Blue", "Yellow", "Purple", "Cyan"];
  return Colors[arr[rand(0, arr.length)]];
};

Object.freeze(Colors);
