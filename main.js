const map = [
  // 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

  // BÀN 1
  [1, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

  // BÀN 2
  [1, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

  // BÀN 3
  [1, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

  // LỐI ĐI
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],

  // PHÒNG HỌP
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 4, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 1],

  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];



const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = map[0].length * tileSize;
canvas.height = map.length * tileSize;

const player = {
  x: 2 * tileSize,
  y: 2 * tileSize,
  size: 20,
  speed: 2
};


const keys = {};

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

function getTileColor(tile) {
  switch (tile) {
    case 1: return "#444";      // tường
    case 2: return "#6b4f2c";   // bàn
    case 3: return "#8d6e63";   // tủ
    case 4: return "#3a3a3a";   // tường phòng họp
    default: return "#2a2a2a";  // sàn
  }
}

function isWall(x, y) {
  const left = Math.floor(x / tileSize);
  const right = Math.floor((x + player.size - 1) / tileSize);
  const top = Math.floor(y / tileSize);
  const bottom = Math.floor((y + player.size - 1) / tileSize);

  const blocks = [1, 2, 4]; // tường, bàn, phòng họp

  if (
    top < 0 || bottom >= map.length ||
    left < 0 || right >= map[0].length
  ) return true;

  return (
    blocks.includes(map[top][left]) ||
    blocks.includes(map[top][right]) ||
    blocks.includes(map[bottom][left]) ||
    blocks.includes(map[bottom][right])
  );
}

function isNearCabinet() {
  const px = Math.floor(player.x / tileSize);
  const py = Math.floor(player.y / tileSize);

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (map[py + dy]?.[px + dx] === 3) {
        return true;
      }
    }
  }
  return false;
}

window.addEventListener("keydown", (e) => {
  if (e.key === "e" || e.key === "E") {
    if (isNearCabinet()) {
      alert("Bạn mở tủ và tìm thấy tài liệu!");
    }
  }
});


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
      ctx.fillStyle = getTileColor(map[y][x]);
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

      ctx.strokeStyle = "rgba(255,255,255,0.05)";
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
