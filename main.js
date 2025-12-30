const tileSize = 32;

const map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,1,1,0,1,1,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,1,1,0,1,0,1,1,0,1,0,1,1,1,0,1,0,1,1,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = map[0].length * tileSize;
canvas.height = map.length * tileSize;

const player = {
  x: 1 * tileSize,
  y: 1 * tileSize,
  size: 20,
  speed: 2
};

const keys = {};

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

function isWall(x, y) {
  const left = Math.floor(x / tileSize);
  const right = Math.floor((x + player.size - 1) / tileSize);
  const top = Math.floor(y / tileSize);
  const bottom = Math.floor((y + player.size - 1) / tileSize);

  if (
    top < 0 || bottom >= map.length ||
    left < 0 || right >= map[0].length
  ) return true;

  return (
    map[top][left] === 1 ||
    map[top][right] === 1 ||
    map[bottom][left] === 1 ||
    map[bottom][right] === 1
  );
}

function update() {
  let nextX = player.x;
  let nextY = player.y;

  if (keys["ArrowUp"]) nextY -= player.speed;
  if (keys["ArrowDown"]) nextY += player.speed;
  if (keys["ArrowLeft"]) nextX -= player.speed;
  if (keys["ArrowRight"]) nextX += player.speed;

  if (!isWall(nextX, player.y)) player.x = nextX;
  if (!isWall(player.x, nextY)) player.y = nextY;
}

function drawMap() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      ctx.fillStyle = map[y][x] === 1 ? "#555" : "#2a2a2a";
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  ctx.fillStyle = "#4caf50";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
