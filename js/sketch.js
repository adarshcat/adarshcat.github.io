
let boids = [];
let mask;
const imgX = 15;
const imgY = 100;

function preload(){
  mask = loadImage("/js/mask.png");
}

function setup() {
  createCanvas(370, 700);
  colorMode(HSB, 255);
  boid = new Boid(100, 100);
  let scFac = 0.52;
  mask.resize(int(720*scFac), int(1000*scFac));
  
  mask.loadPixels();
  
  for (let i=0; i<4*mask.width*mask.height; i+=4*6){
    if (mask.pixels[i+3] == 255){
      let rad = random(2, 5);
      let boid = new Boid(imgX+(i/4)%mask.width, imgY+(i/4)/mask.width, rad);
      let check = false;
      for (let j=0; j<boids.length; j++){
        if (boids[j].checkCol(boid)){
          check = true;
        }
      }
      if (!check){
        boids.push(boid);
      }
    }
  }
  
  mask.updatePixels();
}

function draw() {
  background(0);
  for (let i=0; i<boids.length; i++){
    boids[i].update();
  }
} 

class Boid{
  
  constructor(x, y, r){
    this.base = createVector(x, y);
    
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc= createVector(0, 0);
    this.rad = r;
  }
  
  reactToMouse(){
    if (dist(mouseX, mouseY, this.base.x, this.base.y) < 100 && mouseIsPressed){
      this.acc = p5.Vector.sub(this.base, createVector(mouseX, mouseY)).normalize().mult(4);
    }
    let subVec = p5.Vector.sub(this.base, this.pos);
    this.vel.add(subVec.normalize().mult(3));
  }
  
  update(){
    this.reactToMouse();
    
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if (this.pos.dist(this.base) < 3){
      this.pos = this.base.copy();
    }
    this.vel.mult(0.8);
    this.acc.mult(0);
    
    const fac = 300;
    
    fill(noise(this.pos.x/fac, this.pos.y/fac)*80+150, 180, 255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.rad*2, this.rad*2);
  }
  
  checkCol(boid){
    if (dist(boid.pos.x, boid.pos.y, this.pos.x, this.pos.y) < this.rad+boid.rad){
      return true;
    }
    return false;
  }
}
