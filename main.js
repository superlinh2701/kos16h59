const tileSize = 32;

/*
0 = sàn
1 = tường
2 = bàn
3 = tủ
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

// ================= PLAYER =================
const player = {
  x: 2 * tileSize,
  y: 2 * tileSize,
  size: 20,
  speed: 2
};

// ================= NPC =================
const npcs = [
  {
    x: 14 * tileSize,
    y: 2 * tileSize,
    size: 20,
    dialog: [
      "👋 Hello!",
      "Bạn cần giúp gì không?"
    ],
    dialogIndex: 0
  }
];

const keys = {};
let message = "Hãy khám phá văn phòng...";
let activeNPC = null;

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

  return tiles.some(t => t === 1 || t === 2 || t === 3);
}

// ======= INTERACTION =======
function interact() {
  const px = player.x + player.size / 2;
  const py = player.y + player.size / 2;

  for (let npc of npcs) {
    const dx = Math.abs(px - (npc.x + npc.size / 2));
    const dy = Math.abs(py - (npc.y + npc.size / 2));

    if (dx < tileSize && dy < tileSize) {
      activeNPC = npc;
      message = npc.dialog[npc.dialogIndex];
      npc.dialogIndex = (npc.dialogIndex + 1) % npc.dialog.length;
      return;
    }
  }

  message = "Không có gì để tương tác.";
}

// ======= UPDATE =======
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

// ======= DRAW =======
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

function drawNPCs() {
  for (let npc of npcs) {
    ctx.fillStyle = "#4FC3F7";
    ctx.fillRect(npc.x, npc.y, npc.size, npc.size);
  }
}

function drawUI() {
  const y = canvas.height - UI_HEIGHT;

  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, y, canvas.width, UI_HEIGHT);

  ctx.fillStyle = "#ffd54f";
  ctx.font = "14px sans-serif";
  ctx.fillText(message, 12, y + 25);

  ctx.fillStyle = "#fff";
  ctx.textAlign = "right";
  ctx.fillText("← ↑ ↓ → Di chuyển", canvas.width - 10, y + 20);
  ctx.fillText("E : Tương tác", canvas.width - 10, y + 40);
  ctx.textAlign = "left";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawNPCs();

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
