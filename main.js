

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

const UI_HEIGHT = 60;

canvas.width = map[0].length * tileSize;
canvas.height = map.length * tileSize + UI_HEIGHT;

const player = {
  x: 2 * tileSize,
  y: 2 * tileSize,
  size: 20,
  speed: 2
};

const npcs = [
  {
    x: 14 * tileSize,
    y: 2 * tileSize,
    width: 20,
    height: 20,
    dialog: [
      "👋 Hello!",
      "Bạn cần giúp gì không?",
      "Tôi đang hơi bận nhưng vẫn nói chuyện được 😄"
    ],
    dialogIndex: 0
  }
];


const keys = {};
let message = "Hãy khám phá văn phòng...";
let lastInteraction = "";

window.addEventListener("keydown", e => {
  keys[e.key] = true;

  if (e.key === "e" || e.key === "E") {
    interact();
  }
});

window.addEventListener("keyup", e => {
  keys[e.key] = false;
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

  // va chạm map
  if (tiles.some(t => t === 1 || t === 2 || t === 3)) return true;

  // va chạm NPC
  for (let npc of npcs) {
    const overlap =
      x < npc.x + npc.width &&
      x + player.size > npc.x &&
      y < npc.y + npc.height &&
      y + player.size > npc.y;

    if (overlap) return true;
  }

  return false;
}


// 🔍 Kiểm tra tương tác
function interact() {
  const px = Math.floor((player.x + player.size / 2) / tileSize);
  const py = Math.floor((player.y + player.size / 2) / tileSize);

  const around = [
    [px + 1, py],
    [px - 1, py],
    [px, py + 1],
    [px, py - 1],
  ];

  for (let [x, y] of around) {
    if (!map[y]) continue;

    if (map[y][x] === 3) {
      message = "📁 Bạn mở tủ và tìm thấy tài liệu!";
      return;
    }
  }
    for (let npc of npcs) {
    const dx = Math.abs((player.x + player.size / 2) - (npc.x + npc.width / 2));
    const dy = Math.abs((player.y + player.size / 2) - (npc.y + npc.height / 2));

    if (dx < tileSize && dy < tileSize) {
      message = npc.dialog[npc.dialogIndex];
      npc.dialogIndex = (npc.dialogIndex + 1) % npc.dialog.length;
      return;
    }
  }

  message = "Không có gì để tương tác.";
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
      let color = "#EAEAEA";
      if (map[y][x] === 1) color = "#FFFFFF";
      if (map[y][x] === 2) color = "#E6C9A8";
      if (map[y][x] === 3) color = "#A89CC8";

      ctx.fillStyle = color;
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
}

function drawUI() {
  const y = canvas.height - UI_HEIGHT;

  // background
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, y, canvas.width, UI_HEIGHT);

  // left: message
  ctx.fillStyle = "#ffd54f";
  ctx.font = "14px sans-serif";
  ctx.fillText(message, 12, y + 25);

  // right: controls
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "right";
  ctx.fillText("← ↑ ↓ → Di chuyển", canvas.width - 10, y + 20);
  ctx.fillText("E : Tương tác", canvas.width - 10, y + 40);
  ctx.textAlign = "left";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();

  ctx.fillStyle = "#4caf50";
  ctx.fillRect(player.x, player.y, player.size, player.size);
for (let npc of npcs) {
  ctx.fillStyle = "#4FC3F7";
  ctx.fillRect(npc.x, npc.y, npc.width, npc.height);
}
  drawUI();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
