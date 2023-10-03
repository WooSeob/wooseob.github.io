import Block, { createStyle } from "./block.js";

// 게임 내에서 Canvas Api를 사용하기 위해 분리한 추상화 클래스
// 각 캔버스 영역의 width, height, context등을 가짐
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

    // canvas 성능 최적화를 위한 offscreenCanvas
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_canvas_using_css_transforms
    this.ctx = canvas.offscreenCanvas.getContext("2d", { willReadFrequently: true });
    this._mainCtx = canvas.getContext("2d");
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  draw() {
    console.error("please implement");
  }

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
    if (!spawner) {
      return;
    }

    // 스포너 캔버스에서 세로 배치하기 위해 offset 정보를 관리
    const margin = 20;
    let offset = 0;

    spawner.allNexts?.forEach((tetromino) => {
      tetromino.draw(
        this.ctx,
        { x: 0, y: offset },
        { width: this.blockWidth, height: this.blockHeight }
      );
      offset += tetromino.arr.length * this.blockHeight + margin;
    });
  }
}
