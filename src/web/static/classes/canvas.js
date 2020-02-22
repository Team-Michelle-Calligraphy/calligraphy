
// CONST -------------------------------------------------------------------------------------------

const PHYSICAL_BRUSH_LENGTH = 20;

const WORLD = {
  BACKGROUND_COLOR: '#000',
  Z_AXIS_WIDTH: 120
};

const TICK = {
  STROKE_COLOR: '#ddd4',
  WIDTH: 1,
  LENGTH: 9
}

const POINTER = {
  STROKE_COLOR: '#FFF8',
  WIDTH: 2,
  GAP: 12,
  LENGTH: 24
};

const BRUSH = {
  STROKE_COLOR: '#F00',
  WIDTH: 2
};

const STROKE = {
  STROKE_COLOR: '#FF0',
  WIDTH: 2
};

Math.HALF_PI = Math.PI / 2;
Math.TWO_PI = Math.PI * 2;

Math.toRadians = function (deg) {
  return Math.PI * deg / 180;
}

// GLOBAL ------------------------------------------------------------------------------------------

function distance(a, b) {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) +
    Math.pow(a.y - b.y, 2) +
    Math.pow(a.z - b.z, 2)
  );
}

function getXYFromAngles({ x, y, a, b }) {

}

function getZFromAngles(){

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
    this.zAxis = new ZAxis(this, ctx);
  }
  
  draw({ x, y, z, a, b, stroke, to }) { // to is same things as x y z a b but where it will go to
    this.drawBackground();
    this.stroke.draw({ stroke, x, y });
    this.pointer.draw({ x, y, z, a, b });
    this.pointerTo.draw(to);
    this.zAxis.draw({ z, a, b, to });
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
      this.ctx.moveTo(this.W - WORLD.Z_AXIS_WIDTH, y);
      this.ctx.lineTo(this.W - WORLD.Z_AXIS_WIDTH - TICK.LENGTH, y);
      this.ctx.stroke();
    }
    for(let x = 10; x < this.W - WORLD.Z_AXIS_WIDTH; x += 10){
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
        this.ctx.lineTo(x + command.x, x + command.y);
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

  draw({ x, y, a, b }) {
    this.drawLines({ x, y });
    this.drawBrush({ x, y , a, b });
  }

  drawLines({ x, y }) {
    this.ctx.strokeStyle = POINTER.STROKE_COLOR;
    this.ctx.lineWidth = POINTER.WIDTH;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + POINTER.GAP);
    this.ctx.lineTo(x, y + POINTER.GAP + POINTER.LENGTH);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - POINTER.GAP);
    this.ctx.lineTo(x, y - POINTER.GAP - POINTER.LENGTH);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x + POINTER.GAP, y);
    this.ctx.lineTo(x + POINTER.GAP + POINTER.LENGTH, y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.moveTo(x - POINTER.GAP, y);
    this.ctx.lineTo(x - POINTER.GAP - POINTER.LENGTH, y);
    this.ctx.stroke();
  }

  drawBrush({ x, y, a, b }) {
    this.ctx.strokeStyle = BRUSH.STROKE_COLOR;
    this.ctx.lineWidth = BRUSH.WIDTH;

    if(this.type === 'to') {
      this.ctx.strokeStyle = '#FF0';
    }
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    // TODO: calculate based on angles
    this.ctx.lineTo(x + 16, y + 24);
    this.ctx.stroke();

    // this.ctx.beginPath();
    // this.ctx.arc(x + 16, y + 24, 2, 0, Math.TWO_PI);
    // this.ctx.fillStyle = BRUSH.STROKE_COLOR;
    // this.ctx.fill();
  }
}

// Z-AXIS ------------------------------------------------------------------------------------------

class ZAxis {
  constructor(world, ctx) {
    this.world = world;
    this.ctx = ctx;
  }

  draw({ z, a, b, to }) {
    this.drawBackground();
    this.drawBrush({ z, a, b }, 'main');
    this.drawBrush(to, 'to');
  }

  drawBackground() {
    this.ctx.rect(this.world.W - WORLD.Z_AXIS_WIDTH, 0, this.world.W, this.world.H);
    this.ctx.fillStyle = WORLD.BACKGROUND_COLOR;
    this.ctx.fill();
    for(let y = 10; y < this.world.H; y += 10){
      this.ctx.strokeStyle = TICK.STROKE_COLOR;
      this.ctx.lineWidth = TICK.WIDTH;
      this.ctx.beginPath();
      this.ctx.moveTo(this.world.W, y);

      let end = this.world.W - TICK.LENGTH;
      // if (y % 50 === 0) end = this.world.W - 100;
      if (y > this.world.H - 60) end = this.world.W - WORLD.Z_AXIS_WIDTH;

      this.ctx.lineTo(end, y);
      this.ctx.stroke();
    }

    this.ctx.strokeStyle = TICK.STROKE_COLOR;
    this.ctx.lineWidth = TICK.WIDTH;
    this.ctx.beginPath();
    this.ctx.moveTo(this.world.W - (WORLD.Z_AXIS_WIDTH / 2), 0);
    this.ctx.lineTo(this.world.W - (WORLD.Z_AXIS_WIDTH / 2), this.world.H);
    this.ctx.stroke();
  }

  drawBrush({ z, a, b }, type) {
    this.ctx.strokeStyle = BRUSH.STROKE_COLOR;
    this.ctx.lineWidth = BRUSH.WIDTH;
    if(type === 'to') {
      this.ctx.strokeStyle = '#FF0';
    }
    const x = this.world.W - (WORLD.Z_AXIS_WIDTH / 2);
    this.ctx.beginPath();
    this.ctx.moveTo(x, 0);
    
    // get the total angle and change it to degrees
    const rad = Math.toRadians(a + b); // TODO: use this to draw the angle
    
    this.ctx.lineTo(x + 20, this.world.H * z);
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.arc(x + 20, this.world.H * z, 2, 0, Math.TWO_PI);
    this.ctx.fillStyle = BRUSH.STROKE_COLOR;
    if(type === 'to') {
      this.ctx.fillStyle = '#FF0';
    }
    this.ctx.fill();
  }
}
