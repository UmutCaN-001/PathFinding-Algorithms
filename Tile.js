class Tile {
  constructor(x, y, size, isClosed = false){
    this.x = x;
    this.y = y;
    this.size = size;
    this.isClosed = isClosed;
    this.isPressed = false;
    this.visited = false;
    this.visiting = false;
    this.bg = TILE_COLOR;
    this.distance = 0;
  }

  update(){
    if(mouseIsPressed && mouseX > this.x - this.size / 2 && mouseX < this.x + this.size / 2
        && mouseY > this.y - this.size / 2 && mouseY < this.y + this.size / 2 && !this.isClosed && !this.isPressed){
          // tile is clicked!
          this.clicked();
    }
  }

  clicked(){
    if(gameState === 0){
      //beklemedeyse 
      this.isPressed = true;
      this.visited = true;
      this.bg =  TILE_START_COLOR;
      gameState = 1;
      start = this;
    }
    else if(gameState === 1){
      // hedef sec
      this.isPressed = true;
      this.bg = TILE_TARGET_COLOR;
      gameState = 2;
      target = this;
    }

  }

  visit(){
    this.bg = this === start || this === target ? this.bg : TILE_VISIT_COLOR;
    this.visited = true;
    this.visiting = true;
  }

  searchNeighbor(){
    if(gameState === 3) return;

    let neighbors = this.getNeighborIndexes();
    let neiIndex = [];

    for(let i of neighbors){
      if((!tiles[i].visiting && !tiles[i].isClosed)){
        tiles[i].visiting = true;
        neiIndex.push(i);
      }
    }

    return neiIndex;
  }


  getNeighborIndexes(){
    // possible neighbor positions
    let left   = [this.x - TILE_SIZE, this.y];
    let right  = [this.x + TILE_SIZE, this.y];
    let top    = [this.x, this.y - TILE_SIZE];
    let bottom = [this.x, this.y + TILE_SIZE];

    let neighbors = [left,right,top,bottom];

    let indexes = [];

    for(let nei of neighbors){
      let i = findTileByPos(nei);
      if(!i) continue; 
      indexes.push(i);
    }

    return indexes;

  }

  draw(){
    push();

    rectMode(CENTER);
    strokeWeight(2);
    fill(this.isClosed ? TILE_CLOSED_COLOR : this.bg);
    rect(this.x, this.y, this.size, this.size);
    // push();
    // textSize(15);
    // fill('black');
    // textAlign(CENTER);
    // text(this.distance,this.x ,this.y );
    // pop();
    pop();
  }
}