import { Tetromino } from "./tetris/model.js";
import Block, { createStyle } from "./graphics/block.js";
import { getRandomColor } from "./graphics/constants.js";
import { Actions, InternalEvent, getRandomTetrominoType } from "./tetris/constants.js";
import { Timer, EventBus, rand } from "./utils.js";
import Board from "./tetris/core.js";
export default class GameManager {
  next;
  isRunning = false;
  constructor(row, col, canvasBoard, nextCanvasBoard, onScoreChange, onGameOver) {
    this.canvasBoard = canvasBoard;
    this.nextCanvasBoard = nextCanvasBoard;
    this.row = row + 2;
    this.col = col + 2;

    this.board = new Board(this.row, this.col);
    // this.blockWidth = Math.floor(canvasBoard.width / (col + 2));
    // this.blockHeight = Math.floor(canvasBoard.height / (row + 2));
    this.blockWidth = 30;
    this.blockHeight = 30;

    this.offsetX = this.blockWidth;
    this.offsetY = this.blockHeight;
    // console.log(this);

    this.eventBus = new EventBus();

    this.eventBus.on(Actions.Rotate, () => {
      if (this.board.isRotatable(this.current)) {
        this.current = this.current.ofRotate();
      }
    });
    this.eventBus.on(Actions.Left, () => {
      if (this.board.isMoveable(this.current, Actions.Left)) {
        this.current = this.current.ofMove(Actions.Left.delta.x, Actions.Left.delta.y);
      }
    });
    this.eventBus.on(Actions.Right, () => {
      if (this.board.isMoveable(this.current, Actions.Right)) {
        this.current = this.current.ofMove(Actions.Right.delta.x, Actions.Right.delta.y);
      }
    });
    this.eventBus.on(Actions.Down, () => {
      if (this.board.isMoveable(this.current, Actions.Down)) {
        this.current = this.current.ofMove(Actions.Down.delta.x, Actions.Down.delta.y);
      }
    });

    this.eventBus.on(Actions.Drop, () => {
      while (this.board.isMoveable(this.current, Actions.Down)) {
        this.current = this.current.ofMove(Actions.Down.delta.x, Actions.Down.delta.y);
      }
    });
    this.eventBus.on(InternalEvent.ScoreChanged, (score) => {
      onScoreChange(score);
    });
    this.eventBus.on(InternalEvent.GameOvered, (score) => {
      onGameOver(score);
    });
  }

  start() {
    this.current = this.spawn();
    this.board = new Board(this.row, this.col);
    this.score = new Score(this.eventBus);

    this.isRunning = true;
    this.timer = new Timer(500, () => {
      if (this.isRunning) {
        this.eventBus.emit(InternalEvent.TimerTick);
        this.handle();
      }
    });
  }

  handle() {
    if (this.board.isMoveable(this.current, Actions.Down)) {
      this.current = this.current.ofDown(1);
    } else {
      this.board.updateBoard(this.current);

      let clearLines = this.board.getClearableLines();
      while (clearLines.length > 0) {
        this.eventBus.emit(InternalEvent.LineCleared, clearLines.length);
        this.board.spliceLines(clearLines);
        this.board.mergeLines(clearLines);
        clearLines = this.board.getClearableLines();
      }

      const spawningTetromino = this.spawn();
      if (this.board.isGameOver(spawningTetromino)) {
        this.isRunning = false;
        this.eventBus.emit(InternalEvent.GameOvered, this.score.value);
        return;
      }

      this.current = spawningTetromino;
    }
  }

  spawn() {
    if (this.next) {
      const t = this.next;
      this.next = this._spawnInternal();
      return t;
    }

    this.next = this._spawnInternal();
    return this._spawnInternal();
  }

  _spawnInternal() {
    let tetromino = new Tetromino(
      getRandomTetrominoType(),
      0,
      0,
      this.offsetX,
      this.offsetY,
      getRandomColor(),
      this.blockWidth,
      this.blockHeight
    );

    // 랜덤 횟수 만큼 회전한 테트로미노를 생성
    const rotateCnt = rand(0, 4);
    for (let i = 0; i < rotateCnt; i++) {
      tetromino = tetromino.ofRotate();
    }
    return tetromino;
  }

  render() {
    this.nextCanvasBoard.ctx.clearRect(
      0,
      0,
      this.nextCanvasBoard.width,
      this.nextCanvasBoard.height
    );
    this.canvasBoard.ctx.clearRect(0, 0, this.canvasBoard.width, this.canvasBoard.height);

    const drawBlock = (x, y, color) => {
      new Block(
        x * this.blockWidth,
        y * this.blockHeight,
        this.blockWidth,
        this.blockHeight,
        createStyle(color)
      ).draw(this.canvasBoard.ctx);
    };

    // this.current.clear(this.canvasBoard.ctx);
    for (let y = 0; y < this.row; y++) {
      for (let x = 0; x < this.col; x++) {
        if (this.board?.board[y][x] != 0) {
          drawBlock(x, y, this.board?.board[y][x].color);
        }
      }
    }
    this.next?.draw(this.nextCanvasBoard.ctx);
    this.current?.draw(this.canvasBoard.ctx);

    this.timer?.run();
    this.canvasBoard.render();
    this.nextCanvasBoard.render();
  }
}

export class Score {
  score = 0;
  constructor(eventBus) {
    eventBus.on(InternalEvent.TimerTick, () => {
      this.score += 100;
      eventBus.emit(InternalEvent.ScoreChanged, this.score);
    });
    eventBus.on(InternalEvent.LineCleared, (numOfLines) => {
      this.score += numOfLines * 1000;
      eventBus.emit(InternalEvent.ScoreChanged, this.score);
    });
  }

  get value() {
    return this.score;
  }
}
