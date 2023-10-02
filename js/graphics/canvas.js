import Block, { createStyle } from "./block.js";
export default class CanvasBoard {
  constructor(canvas, blockWidth, blockHeight) {
    canvas.offscreenCanvas = document.createElement("canvas");
    canvas.offscreenCanvas.width = canvas.width;
    canvas.offscreenCanvas.height = canvas.height;

    this.width = canvas.width;
    this.height = canvas.height;

    this.blockWidth = blockWidth;
    this.blockHeight = blockHeight;
    this.offsetX = this.blockWidth;
    this.offsetY = this.blockHeight;

    this.ctx = canvas.offscreenCanvas.getContext("2d", { willReadFrequently: true });
    this._mainCtx = canvas.getContext("2d");
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  draw() {}
  render() {
    this._mainCtx.putImageData(this.ctx.getImageData(0, 0, this.width, this.height), 0, 0);
  }
}

export class MainView extends CanvasBoard {
  draw(board, current) {
    const drawBlock = (block) => {
      const [x, y, color] = block;
      new Block(
        x * this.blockWidth,
        y * this.blockHeight,
        this.blockWidth,
        this.blockHeight,
        createStyle(color)
      ).draw(this.ctx);
    };

    board?.occupiedBlocks.forEach(drawBlock);

    current?.draw(
      this.ctx,
      { x: this.offsetX, y: this.offsetY },
      { width: this.blockWidth, height: this.blockHeight }
    );
  }
}

export class SpawnView extends CanvasBoard {
  draw(spawner) {
    spawner?._next?.draw(
      this.ctx,
      { x: 0, y: 0 },
      { width: this.blockWidth, height: this.blockHeight }
    );
  }
}
