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
  T: [],
  L: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
  ],
  J: [],
  S: [],
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
};

Object.freeze(TetrominoTypes);
Object.freeze(Actions);
