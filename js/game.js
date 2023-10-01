import Block, { createStyle } from "./graphics/block.js";
import { Actions, InternalEvent } from "./tetris/constants.js";
import { Timer, EventBus } from "./utils.js";
import Board from "./tetris/core.js";
import Score from "./tetris/score.js";
import Spawner from "./tetris/spawner.js";
import Level from "./tetris/level.js";

export default class GameManager {
  isRunning = false;
  constructor(row, col, canvasBoard, nextCanvasBoard, onScoreChange, onGameOver) {
    this.canvasBoard = canvasBoard;
    this.nextCanvasBoard = nextCanvasBoard;
    this.row = row + 2;
    this.col = col + 2;

    this.board = new Board(this.row, this.col);
    this.blockWidth = Math.floor(canvasBoard.width / (col + 2));
    this.blockHeight = Math.floor(canvasBoard.height / (row + 2));
    // this.blockWidth = 30;
    // this.blockHeight = 30;

    this.offsetX = this.blockWidth;
    this.offsetY = this.blockHeight;
    console.log(this);

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
    this.spawner = new Spawner(this);
    this.board = new Board(this.row, this.col);
    this.score = new Score(this.eventBus);

    this.current = this.spawner.spawn(this);

    this.isRunning = true;
    this.timer = new Timer(500, () => {
      if (this.isRunning) {
        this.eventBus.emit(InternalEvent.TimerTick);
        this.handle();
      }
    });
    this.level = new Level(this.eventBus, this.timer);
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

      const spawningTetromino = this.spawner.spawn(this);
      if (this.board.isGameOver(spawningTetromino)) {
        this.isRunning = false;
        this.eventBus.emit(InternalEvent.GameOvered, this.score.value);
        return;
      }

      this.current = spawningTetromino;
    }
  }

  render() {
    this.nextCanvasBoard.ctx.clearRect(
      0,
      0,
      this.nextCanvasBoard.width,
      this.nextCanvasBoard.height
    );
    this.canvasBoard.ctx.clearRect(0, 0, this.canvasBoard.width, this.canvasBoard.height);

    const drawBlock = (block) => {
      const [x, y, color] = block;
      new Block(
        x * this.blockWidth,
        y * this.blockHeight,
        this.blockWidth,
        this.blockHeight,
        createStyle(color)
      ).draw(this.canvasBoard.ctx);
    };

    // this.current.clear(this.canvasBoard.ctx);
    this.board?.occupiedBlocks.forEach(drawBlock);

    this.spawner?._next?.draw(
      this.nextCanvasBoard.ctx,
      { x: 0, y: 0 },
      { width: this.blockWidth, height: this.blockHeight }
    );
    this.current?.draw(
      this.canvasBoard.ctx,
      { x: this.offsetX, y: this.offsetY },
      { width: this.blockWidth, height: this.blockHeight }
    );

    this.timer?.run();
    this.canvasBoard.render();
    this.nextCanvasBoard.render();
  }
}
