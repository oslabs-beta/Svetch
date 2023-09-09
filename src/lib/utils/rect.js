/* eslint-disable no-param-reassign */
const borderWidth = 1;

export default class Rect {
  constructor(x, y, width, height, type, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.color = color;
  }

  contains(x, y) {
    return (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y + 2 * borderWidth &&
      y < this.y + this.height + 2 * borderWidth
    );
  }

  draw(ctx) {
    ctx.strokeStyle = this.color;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  drawLabel(ctx, font, x, y, maxWidth) {
    ctx.font = font;
    ctx.fillStyle = `${this.color}`;
    ctx.fillText(this.type, x + 4.5, y, maxWidth);
  }

  drawDeleteTab(ctx) {
    ctx.strokeRect(this.x + this.width - 20, this.y, 20, 20);
    ctx.fillStyle = '#FA2B2E';
    ctx.font = '20px serif';
    ctx.fillText('X', this.x + this.width - 17, this.y + 17);
  }

  deleteTabContains(x, y) {
    return (
      x >= this.x + this.width - 20 && x <= this.x + this.width && y >= this.y && y <= this.y + 20
    );
  }
}
