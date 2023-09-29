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
  L: [],
  J: [],
  S: [],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

Object.freeze(TetrominoTypes);
