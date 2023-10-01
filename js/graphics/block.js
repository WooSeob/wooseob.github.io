export default class Block {
  constructor(x, y, width, height, style) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.style = style;
  }

  draw(ctx) {
    this.style?.doStyle(ctx, this);
  }

  clear(ctx) {
    ctx.clearRect(this.x, this.y, this.width, this.height);
  }

  ofMove(dx, dy) {
    return new Block(this.x + dx, this.y + dy, this.width, this.height, this.style);
  }
}

export class ClassicStyle {
  constructor(baseColor, weight, lineWidthRatio) {
    this.baseColor = baseColor;
    this.weight = weight;
    this.lineWidthRatio = lineWidthRatio;
  }

  doStyle(ctx, block) {
    ctx.fillStyle = this.getColor(0);
    ctx.fillRect(block.x, block.y, block.width, block.height);

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

export class GuideStyle {
  constructor(baseColor, lineWidthRatio) {
    this.baseColor = baseColor;
    this.lineWidthRatio = lineWidthRatio;
  }

  doStyle(ctx, block) {
    ctx.strokeStyle = this.getColor(0);
    ctx.setLineDash([5, 15]);
    ctx.strokeRect(block.x, block.y, block.width, block.height);
  }

  getColor(weight) {
    return `rgb(${this.baseColor.R + weight}, ${this.baseColor.G + weight}, ${
      this.baseColor.B + weight
    })`;
  }
}

export const createStyle = (color) => new ClassicStyle(color, 60, 0.1);
export const createEmptyDashedStyle = (color) => new GuideStyle(color, 0.1);
