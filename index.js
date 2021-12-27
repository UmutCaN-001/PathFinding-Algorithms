const TILE_SIZE = 50;
const WIDTH = 800;
const HEIGHT = 700;

const SEARCH_SPEED = 50; // miliseconds

const TILE_VISIT_COLOR = 'white';
const TILE_START_COLOR = 'blue';
const TILE_TARGET_COLOR = 'purple';
const TILE_CLOSED_COLOR = 'red';
const TILE_PATH_COLOR = 'purple';
const TILE_COLOR = 50;

var tiles = [];

var gameState = 0;
var start;
var target;


function setup(){
  createCanvas(WIDTH,HEIGHT);
  let b = createButton('Baslat');
  b.position(0,0);
  b.mousePressed(startSearch);
  let tilecounter = 0;
  // create map
  for(let i =0; i<WIDTH / TILE_SIZE; i++){
    for(let j = 0; j< HEIGHT / TILE_SIZE; j++){
      let closedChance = Math.floor(Math.random() * 100) < 20 ? true : false;
      tiles.push(new Tile(TILE_SIZE * i  + TILE_SIZE/2 , TILE_SIZE * j + TILE_SIZE/2, TILE_SIZE, closedChance ));
      tilecounter++;
    }
  }
  console.log("Total tile count: "+tilecounter);
}

function draw(){
  background(50);
  for(let i =0; i< tiles.length; i++){
    tiles[i].update();
    tiles[i].draw();
  }
}

/**
 * @param {[number,number]} pos 
 * @returns index for tiles
 */
function findTileByPos(pos){
  for(let i = 0; i<tiles.length;i++){
    if(tiles[i].x === pos[0] && tiles[i].y === pos[1]){
      return i;
    }
  }
  return null;
}


function startSearch(){
  let dist = 1;
  start.distance = dist;
  start.visit();
  // get first neighbors
  let indexes = [start.searchNeighbor()];
  let searcher = setInterval(()=>{
    if(indexes.length <= 0){
      clearInterval(searcher);
      return;
    }
    let tempIndexes = [];
    dist++;
    for(let i in indexes){
      for(let j of indexes[i]){
        tiles[j].visit();
        tiles[j].distance = dist;    

        if(tiles[j] === target){
          // finded
          tiles[j].bg = 'purple';
          gameState = 3;
          findPath();
          // clear the interval
          clearInterval(searcher);
          break;
        }
        tempIndexes.push(tiles[j].searchNeighbor());
      }
    }
    indexes = tempIndexes;
  }, SEARCH_SPEED);
}

function findPath(){
  if(!target) return console.error("No target!");

  let tempTarget = target;

  let searcher = setInterval(() => {
    if(tempTarget === start) {
      console.log("Path finded!");
      clearInterval(searcher);
      return;
    }
    let ind = tempTarget.getNeighborIndexes();
    let closestDist = Infinity;
    let selectedIndex;
    for(let i of ind){
      if(tiles[i].visited && !tiles[i].isClosed){
        if(closestDist >= tiles[i].distance){
          closestDist = tiles[i].distance;
          selectedIndex = i;
        }
      }
    }

    tiles[selectedIndex].bg = TILE_PATH_COLOR;
    tempTarget = tiles[selectedIndex];
  }, SEARCH_SPEED);


}