const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#222";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "#fff";
ctx.font = "16px monospace";
ctx.fillText("Office OT Game - Press Arrow Keys", 40, 180);

document.addEventListener("keydown", (e) => {
  console.log("Key pressed:", e.key);
});
