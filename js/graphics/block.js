export default class Block {
  constructor(x, y, width, height, style) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.style = style;
  }

  draw(ctx) {
    ctx.fillStyle = this.style?.getColor(0);
    ctx.fillRect(this.x, this.y, this.width, this.height);
    this.style?.doStyle(ctx, this);
  }
}

export class ClassicStyle {
  constructor(baseColor, weight, lineWidthRatio) {
    this.baseColor = baseColor;
    this.weight = weight;
    this.lineWidthRatio = lineWidthRatio;
  }

  doStyle(ctx, block) {
    const lwidth = block.width * this.lineWidthRatio;
    ctx.beginPath();
    ctx.lineWidth = lwidth;
    ctx.strokeStyle = this.getColor(this.weight);
    ctx.moveTo(block.x, block.y + lwidth / 2); // Begin first sub-path
    ctx.lineTo(block.x + block.width, block.y + lwidth / 2);
    ctx.moveTo(block.x + lwidth / 2, block.y); // Begin second sub-path
    ctx.lineTo(block.x + lwidth / 2, block.y + block.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = lwidth;
    ctx.strokeStyle = this.getColor(-this.weight);
    ctx.moveTo(+lwidth + block.x, block.y + block.height - lwidth / 2); // Begin first sub-path
    ctx.lineTo(block.x + block.width, block.y + block.height - lwidth / 2);
    ctx.moveTo(block.x + block.width - lwidth / 2, block.y + lwidth); // Begin second sub-path
    ctx.lineTo(block.x + block.width - lwidth / 2, block.y + block.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = this.getColor(-this.weight);
    ctx.moveTo(block.x, block.y + block.height); // Begin first sub-path
    ctx.lineTo(block.x + lwidth, block.y + block.height);
    ctx.lineTo(block.x + lwidth, block.y + block.height - lwidth);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = this.getColor(-this.weight);
    ctx.moveTo(block.x + block.width, block.y); // Begin first sub-path
    ctx.lineTo(block.x + block.width, block.y + lwidth);
    ctx.lineTo(block.x + block.width - lwidth, block.y + lwidth);
    ctx.fill();
  }

  getColor(weight) {
    return `rgb(${this.baseColor.R + weight}, ${this.baseColor.G + weight}, ${
      this.baseColor.B + weight
    })`;
  }
}