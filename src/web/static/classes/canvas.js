
// CONST -------------------------------------------------------------------------------------------

const PHYSICAL_BRUSH_LENGTH = 20;

const WORLD = {
  BACKGROUND_COLOR: '#DDD'
};

const TICK = {
  STROKE_COLOR: '#000',
  WIDTH: 1,
  LENGTH: 9
}

const POINTER = {
  STROKE_COLOR: '#00F8',
  WIDTH: 2,
  LENGTH: 12
};

const POINTER_TO = {
  STROKE_COLOR: '#F008',
  WIDTH: 2
};

const STROKE = {
  STROKE_COLOR: '#000',
  WIDTH: 2
};

Math.HALF_PI = Math.PI / 2;
Math.TWO_PI = Math.PI * 2;

Math.toRadians = function (deg) {
  return Math.PI * deg / 180;
}

// WORLD -------------------------------------------------------------------------------------------

class World {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.W = width;
    this.H = height;
    this.stroke = new CanvasStroke(this, ctx);
    this.pointer = new Pointer(this, ctx, 'main');
    this.pointerTo = new Pointer(this, ctx, 'to');
  }
  
  draw({ x, y, z, r, phi, stroke, to }) { // to is same things as x y z a b but where it will go to
    this.drawBackground();
    this.stroke.draw({ stroke, x, y });
    this.pointer.draw({ x, y, z, r, phi });
    this.pointerTo.draw(to);
  }

  drawBackground() {
    this.ctx.rect(0, 0, this.W, this.H);
    this.ctx.fillStyle = WORLD.BACKGROUND_COLOR;
    this.ctx.fill();
    this.drawTicks();
  }

  drawTicks() {
    for(let y = 10; y < this.H; y += 10){
      this.ctx.strokeStyle = TICK.STROKE_COLOR;
      this.ctx.lineWidth = TICK.WIDTH;
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(TICK.LENGTH, y);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(this.W, y);
      this.ctx.lineTo(this.W - TICK.LENGTH, y);
      this.ctx.stroke();
    }
    for(let x = 10; x < this.W; x += 10){
      this.ctx.strokeStyle = TICK.STROKE_COLOR;
      this.ctx.lineWidth = TICK.WIDTH;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, TICK.LENGTH);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.H);
      this.ctx.lineTo(x, this.H - TICK.LENGTH);
      this.ctx.stroke();
    }
  }

}

// STROKE ------------------------------------------------------------------------------------------

class CanvasStroke {
  constructor(world, ctx) {
    this.world = world;
    this.ctx = ctx;
  }

  draw({ stroke, x, y }) {
    this.ctx.strokeStyle = STROKE.STROKE_COLOR;
    this.ctx.lineWidth = STROKE.WIDTH;
    const commands = parseCommands(stroke);
    commands.forEach(command => {
      switch (command.type) {
      case 'down':
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        break;
      case 'to':
        x = x + command.x;
        y = y + command.y;
        this.ctx.lineTo(x, y);
        break;
      case 'up':
        this.ctx.stroke();
        this.ctx.closePath();
        break;
      }
    });
  }
}

// POINTER ------------------------------------------------------------------------------------------

class Pointer {
  constructor(world, ctx, type) {
    this.world = world;
    this.ctx = ctx;
    this.type = type;
  }

  draw({ x, y, z, r, phi }) {
    this.drawCricle({ x, y, r });
    this.drawLines({ x, y, r });
    this.drawBrush({ x, y , r, phi });
  }

  drawCricle({ x, y, z, r }) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, Math.TWO_PI);
    this.ctx.strokeStyle = POINTER.STROKE_COLOR;
    if(this.type === 'to') {
      this.ctx.strokeStyle = POINTER_TO.STROKE_COLOR;
    }
    this.ctx.stroke();
  }

  drawLines({ x, y, r }) {
    this.ctx.strokeStyle = POINTER.STROKE_COLOR;
    this.ctx.lineWidth = POINTER.WIDTH;
    if(this.type === 'to') {
      this.ctx.strokeStyle = POINTER_TO.STROKE_COLOR;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + r);
    this.ctx.lineTo(x, y + r + POINTER.LENGTH);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - r);
    this.ctx.lineTo(x, y - r - POINTER.LENGTH);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x + r, y);
    this.ctx.lineTo(x + r + POINTER.LENGTH, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x - r, y);
    this.ctx.lineTo(x - r - POINTER.LENGTH, y);
    this.ctx.stroke();
  }

  drawBrush({ x, y, r, phi }) {
    this.ctx.strokeStyle = POINTER.STROKE_COLOR;
    this.ctx.lineWidth = POINTER.WIDTH;

    if(this.type === 'to') {
      this.ctx.strokeStyle = POINTER_TO.STROKE_COLOR;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);

    const rad = Math.toRadians(phi);
    const dx = Math.cos(rad) * r;
    const dy = Math.sin(rad) * r;
    
    this.ctx.lineTo(x + dx, y + dy);
    this.ctx.stroke();

    // this.ctx.beginPath();
    // this.ctx.arc(x + 16, y + 24, 2, 0, Math.TWO_PI);
    // this.ctx.fillStyle = BRUSH.STROKE_COLOR;
    // this.ctx.fill();
  }
}
