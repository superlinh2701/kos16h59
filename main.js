const tileSize = 32;

/*
0 = sàn
1 = tường
2 = bàn
3 = tủ (tương tác)
*/

const map = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,1,1,1,1,1,1,1,1,1],
  [1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = map[0].length * tileSize;
canvas.height = map.length * tileSize + 40; // chừa chỗ cho text

const player = {
  x: 2 * tileSize,
  y: 2 * tileSize,
  size: 20,
  speed: 2
};

const keys = {};
let interactPressed = false;
let message = "";

window.addEventListener("keydown", e => {
  keys[e.key] = true;
  if (e.key === "e" || e.key === "E") interactPressed = true;
});

window.addEventListener("keyup", e => {
  keys[e.key] = false;
  if (e.key === "e" || e.key === "E") interactPressed = false;
});

function isWall(x, y) {
  const left = Math.floor(x / tileSize);
  const right = Math.floor((x + player.size - 1) / tileSize);
  const top = Math.floor(y / tileSize);
  const bottom = Math.floor((y + player.size - 1) / tileSize);

  if (
    top < 0 || bottom >= map.length ||
    left < 0 || right >= map[0].length
  ) return true;

  const tiles = [
    map[top][left],
    map[top][right],
    map[bottom][left],
    map[bottom][right]
  ];

  return tiles.some(t => t === 1 || t === 2 || t === 3);
}

// 🔍 kiểm tra ô xung quanh
function checkInteraction() {
  const px = Math.floor((player.x + player.size / 2) / tileSize);
  const py = Math.floor((player.y + player.size / 2) / tileSize);

  const around = [
    [px + 1, py],
    [px - 1, py],
    [px, py + 1],
    [px, py - 1],
  ];

  for (let [x, y] of around) {
    if (map[y] && map[y][x] === 3 && interactPressed) {
      message = "📁 Bạn mở tủ và tìm thấy tài liệu!";
      return;
    }
  }

  message = "";
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

  checkInteraction();
}

function drawMap() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      let color = "#BABABA";
      if (map[y][x] === 1) color = "#ffffff";
      if (map[y][x] === 2) color = "#D0B99B";
      if (map[y][x] === 3) color = "#9D9AB6";

      ctx.fillStyle = color;
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
}

function drawUI() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

  ctx.fillStyle = "#fff";
  ctx.font = "14px sans-serif";
  ctx.fillText("← ↑ ↓ → : Di chuyển    |    E : Tương tác", 10, canvas.height - 14);

  if (message) {
    ctx.fillStyle = "#ffd54f";
    ctx.fillText(message, 10, canvas.height - 24);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();

  ctx.fillStyle = "#4caf50";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  drawUI();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
