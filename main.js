const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Player
const player = {
  x: 300,
  y: 160,
  size: 20,
  speed: 2
};

// Input
const keys = {};

// Lắng nghe phím
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Update vị trí
function update() {
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;
}

// Vẽ game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // nhân vật
  ctx.fillStyle = "#4caf50";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
