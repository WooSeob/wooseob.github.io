import { rand } from "../utils.js";

export const TetrominoTypes = {
  Line: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  Square: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
  L: [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

export const Actions = {
  Left: {
    delta: { x: -1, y: 0 },
  },
  Right: {
    delta: { x: 1, y: 0 },
  },
  Down: {
    delta: { x: 0, y: 1 },
  },
  Rotate: {},
  Drop: {},
};

export const InternalEvent = {
  TimerTick: "timertick",
  LineCleared: "linecleared",
};

export const getRandomTetrominoType = () => {
  const arr = Object.keys(TetrominoTypes);
  return TetrominoTypes[arr[rand(0, arr.length)]];
};

Object.freeze(InternalEvent);
Object.freeze(TetrominoTypes);
Object.freeze(Actions);
