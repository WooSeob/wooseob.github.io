export default class CanvasBoard {
  constructor(canvas) {
    canvas.offscreenCanvas = document.createElement("canvas");
    canvas.offscreenCanvas.width = canvas.width;
    canvas.offscreenCanvas.height = canvas.height;

    this.width = canvas.width;
    this.height = canvas.height;

    this.ctx = canvas.offscreenCanvas.getContext("2d", { willReadFrequently: true });
    this._mainCtx = canvas.getContext("2d");
  }

  render() {
    this._mainCtx.putImageData(this.ctx.getImageData(0, 0, this.width, this.height), 0, 0);
  }
}
