import { Colors } from "../graphics/constants.js";

export default class Board {
  constructor(row, col) {
    this.row = row + 2;
    this.col = col + 2;
    this.board = new Array(row + 2).fill(0).map(() => new Array(col + 2).fill(0));
    this.fillEdge();
  }

  fillEdge() {
    // 상
    for (let x = 0; x < this.col; x++) {
      this.board[0][x] = { color: Colors.Gray };
    }
    // 좌측
    for (let y = 1; y < this.row; y++) {
      this.board[y][0] = { color: Colors.Gray };
    }
    //우측
    for (let y = 1; y < this.row; y++) {
      this.board[y][this.col - 1] = { color: Colors.Gray };
    }
    // 하단
    for (let x = 0; x < this.col; x++) {
      this.board[this.row - 1][x] = { color: Colors.Gray };
    }
  }

  previewPosition(tetromino, action) {
    return {
      newX: tetromino.x + action.delta.x,
      newY: tetromino.y + action.delta.y,
    };
  }

  getBoardState(y, x) {
    return this.board[y + 1][x + 1];
  }

  isMoveable(tetromino, action) {
    // 내부 표현
    const { newX, newY } = this.previewPosition(tetromino, action);

    for (let y = 0; y < tetromino.arr.length; y++) {
      for (let x = 0; x < tetromino.arr[0].length; x++) {
        if (tetromino.arr[y][x] && this.getBoardState(newY + y, newX + x)) {
          return false;
        }
      }
    }

    return true;
  }

  isRotatable(tetromino) {
    const rotatedState = tetromino.ofRotate();

    for (let y = 0; y < rotatedState.arr.length; y++) {
      for (let x = 0; x < rotatedState.arr[0].length; x++) {
        if (
          rotatedState.arr[y][x] &&
          this.getBoardState(rotatedState.y + y, rotatedState.x + x)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  updateBoard(tetromino) {
    for (let y = 0; y < tetromino.arr.length; y++) {
      for (let x = 0; x < tetromino.arr[0].length; x++) {
        if (tetromino.arr[y][x] == 0) {
          continue;
        }
        this.board[tetromino.y + y + 1][tetromino.x + x + 1] = {
          color: tetromino.color,
        };
      }
    }
  }
}
