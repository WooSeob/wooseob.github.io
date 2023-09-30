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

  getClearableLines() {
    // 일단 구현 먼저
    // 상하좌우 테두리 제외
    const lines = [];
    for (let y = 1; y < this.row - 1; y++) {
      let clear = true;
      for (let x = 1; x < this.col - 1; x++) {
        if (this.board[y][x] == 0) {
          clear = false;
          break;
        }
      }
      if (clear) {
        lines.push(y);
      }
    }
    console.log(lines);
    return lines;
  }

  spliceLines(lines) {
    // 자료구조 바꾸면 최적화 가능할듯
    lines.forEach((line) => {
      this.board.splice(line, 1);
      const newRow = new Array(this.col + 2).fill(0);
      newRow[0] = { color: Colors.Gray };
      newRow[this.col - 1] = { color: Colors.Gray };

      this.board.splice(line, 0, newRow);
    });
  }

  mergeLines(emptyLines) {
    emptyLines.forEach((line) => {
      // 1 ~ 20 중 , 5번 이면
      this.board.splice(line, 1);

      const newRow = new Array(this.col + 2).fill(0);
      newRow[0] = { color: Colors.Gray };
      newRow[this.col - 1] = { color: Colors.Gray };

      this.board.splice(1, 0, newRow);
    });
  }

  isGameOver(spawningTetromino) {
    // 스폰할 수 없으면 끝난것?
    for (let y = 0; y < spawningTetromino.arr.length; y++) {
      for (let x = 0; x < spawningTetromino.arr[0].length; x++) {
        if (
          spawningTetromino.arr[y][x] &&
          this.getBoardState(spawningTetromino.y + y, spawningTetromino.x + x)
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

// for (let y = 1; y < this.row - 1; y++) {
//   for (let x = 1; x < this.col - 1; x++) {

//   }
// }
