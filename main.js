const tileSize = 32;

const TILE = {
  FLOOR: { x: 0, y: 0 },
  WALL_TOP: { x: 32, y: 0 },
  DESK: { x: 0, y: 32 },
  WALL: { x: 32, y: 32 }
};


const floorTile = new Image();
floorTile.src = "assets/tileset.png";

/*
0 = sàn
1 = tường
2 = bàn
3 = tủ (tương tác)
*/

const collisionMap = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,2,2,0,0,1],
  [1,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0,1,0,0,2,2,0,0,1],
  [1,0,0,2,2,2,2,2,2,2,2,2,0,0,0,0,1,0,0,2,2,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,2,2,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const decorMap = collisionMap.map(row =>
  row.map(cell => (cell === 1 ? 1 : 0))
);



const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const UI_HEIGHT = 110;

canvas.width = collisionMap[0].length * tileSize;
canvas.height = collisionMap.length * tileSize + UI_HEIGHT;

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
    top < 0 || bottom >= collisionMap.length ||
    left < 0 || right >= collisionMap[0].length
  ) return true;

  const tiles = [
    collisionMap[top][left],
    collisionMap[top][right],
    collisionMap[bottom][left],
    collisionMap[bottom][right]
  ];

  // 1 & 3 là vật cản
  if (tiles.some(t => t === 1 || t === 3)) return true;

  // NPC collision
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
    if (!collisionMap[y]) continue;

    if (collisionMap[y][x] === 3) {
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
  for (let y = 0; y < collisionMap.length; y++) {
    for (let x = 0; x < collisionMap[y].length; x++) {

      const px = x * tileSize;
      const py = y * tileSize;

      // FLOOR
      ctx.drawImage(
        floorTile,
        TILE.FLOOR.x, TILE.FLOOR.y, 32, 32,
        px, py, 32, 32
      );

      // DESK
      if (collisionMap[y][x] === 2) {
        ctx.drawImage(
          floorTile,
          TILE.DESK.x, TILE.DESK.y, 32, 32,
          px, py, 32, 32
        );
      }

      // WALL BASE
      if (collisionMap[y][x] === 1) {
        ctx.drawImage(
          floorTile,
          TILE.WALL.x, TILE.WALL.y, 32, 32,
          px, py, 32, 32
        );
      }
    }
  }
}

function drawWallTop() {
  for (let y = 0; y < decorMap.length; y++) {
    for (let x = 0; x < decorMap[y].length; x++) {
      if (decorMap[y][x] === 1) {
        ctx.drawImage(
          floorTile,
          TILE.WALL_TOP.x, TILE.WALL_TOP.y, 32, 32,
          x * 32, y * 32, 32, 32
        );
      }
    }
  }
}


function drawUI() {
  const y = canvas.height - UI_HEIGHT;

  // nền khung hội thoại
  ctx.fillStyle = "#2b2b2b";
  ctx.fillRect(8, y + 8, canvas.width - 16, UI_HEIGHT - 16);

  // viền ngoài
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(8, y + 8, canvas.width - 16, UI_HEIGHT - 16);

  // text
  ctx.fillStyle = "#f5e9c8";
  ctx.font = "16px monospace";
  ctx.textAlign = "left";
  wrapText(message, 20, y + 40, canvas.width - 40, 20);

  // hint
  ctx.font = "12px monospace";
  ctx.fillStyle = "#bbbbbb";
  ctx.textAlign = "right";
  ctx.fillText("←↑↓→ di chuyển | E tương tác", canvas.width - 20, y + UI_HEIGHT - 20);
}

function wrapText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, y);
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

// vẽ tường trên cùng
drawWallTop();

drawUI();

}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

floorTile.onload = () => {
  gameLoop();
};

