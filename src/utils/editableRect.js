/* eslint-disable no-param-reassign */
import Rect from './rect';

const borderWidth = 1;

export default class EditableRect extends Rect {
  constructor(x, y, width, height, type, color, id) {
    super(x, y, width, height, type, color);
    this.parent = null;
    this.id = id;
  }

  addGlow(ctx) {
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = this.color;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  containsRect(rect) {
    return (
      rect.x > this.x
      && rect.x + rect.width < this.x + this.width
      && rect.y > this.y + 2 * borderWidth
      && rect.y + rect.height < this.y + this.height + 2 * borderWidth
    );
  }

  draw(ctx) {
    super.draw(ctx);
    ctx.beginPath();
    ctx.shadowBlur = 0;
    super.drawLabel(
      ctx,
      '20px serif',
      this.x,
      this.y + 20,
      this.width - 20,
    );
    this.drawDeleteTab(ctx);
    this.drawResizeTab(ctx);
  }

  drawDeleteTab(ctx) {
    ctx.fillStyle = '#282b2e';
    ctx.fillRect(this.x + this.width - 18, this.y + 2, 16, 16);
    super.drawDeleteTab(ctx);
  }

  drawResizeTab(ctx) {
    const x = this.x + this.width - 12;
    const y = this.y + this.height - 12;
    ctx.fillStyle = '#E9ECEE';
    ctx.fillRect(x, y, 12, 12);
  }

  resizeTabContains(x, y) {
    return (
      x >= this.x + this.width - 12
      && x <= this.x + this.width
      && y >= this.y + this.height - 12
      && y <= this.y + this.height
    );
  }
}
