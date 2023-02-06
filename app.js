const canvasEl = document.querySelector("canvas");
const canvasContext = canvasEl.getContext("2d");

canvasEl.width = 1500;
canvasEl.height = 720;
// --------------------------------------------------------------------
let RIScore = new Audio();
let AIScore = new Audio();
let hit = new Audio();
let wall = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
AIScore.src = "sounds/AIScore.mp3";
RIScore.src = "sounds/RIScore.mp3";

const playerPaddleRI = {
  xP: 0,
  yP: canvasEl.height / 2 - 100 / 2,
  height: 100,
  width: 10,
  color: "#d2e603",
  score: 0,
};

const playerPaddleAI = {
  xP: canvasEl.width - 10,
  yP: canvasEl.height / 2 - 100 / 2,
  height: 100,
  width: 10,
  color: "orange",
  score: 0,
};

const ball = {
  xP: canvasEl.width / 2,
  yP: canvasEl.height / 2,
  radius: 10,
  speed: 7,
  xV: 5,
  yV: 5,
  color: "white",
};

const net = {
  xP: canvasEl.width / 2 - 1,
  yP: 0,
  width: 2,
  height: 10,
  color: "white",
};

function drawRect(xP, yP, width, height, color) {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(xP, yP, width, height);
}

function drawCircle(xP, yP, radius, color) {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(xP, yP, radius, 0, Math.PI * 2);
  canvasContext.fill();
}

function drawText(content, xP, yP, color) {
  canvasContext.fillStyle = color;
  canvasContext.font = "35px sans-serif";
  canvasContext.fillText(content, xP, yP);
}

function drawNet() {
  for (let i = 0; i < canvasEl.height; i += 15) {
    drawRect(net.xP, net.yP + i, net.width, net.height, net.color);
  }
}

function runGame() {
  
  drawRect(0, 0, canvasEl.width, canvasEl.height, "#4683a0");

  drawNet();

  drawText(
    playerPaddleRI.score,
    (1 * canvasEl.width) / 4,
    (1 * canvasEl.height) / 10,
    "white"
  );
  drawText(
    playerPaddleAI.score,
    (3 * canvasEl.width) / 4,
    (1 * canvasEl.height) / 10,
    "white"
  );

  drawRect(
    playerPaddleRI.xP,
    playerPaddleRI.yP,
    playerPaddleRI.width,
    playerPaddleRI.height,
    playerPaddleRI.color
  );

  drawRect(
    playerPaddleAI.xP,
    playerPaddleAI.yP,
    playerPaddleAI.width,
    playerPaddleAI.height,
    playerPaddleAI.color
  );

  drawCircle(ball.xP, ball.yP, ball.radius, ball.color);
}

canvasEl.addEventListener("mousemove", movePaddle);
function movePaddle(e) {
  let canvasRect = canvasEl.getBoundingClientRect();
  playerPaddleRI.yP = e.clientY - canvasRect.top - playerPaddleRI.height / 2;
}

function paddleColliDete(BALL, PADDLE) {
  BALL.top = BALL.yP - BALL.radius;
  BALL.bottom = BALL.yP + BALL.radius;
  BALL.left = BALL.xP - BALL.radius;
  BALL.right = BALL.xP + BALL.radius;

  PADDLE.top = PADDLE.yP;
  PADDLE.bottom = PADDLE.yP + PADDLE.height;
  PADDLE.left = PADDLE.xP;
  PADDLE.right = PADDLE.xP + PADDLE.width;

  return (
    BALL.right > PADDLE.left &&
    BALL.bottom > PADDLE.top &&
    BALL.left < PADDLE.right &&
    BALL.top < PADDLE.bottom
  );
}

function resetBall() {
  ball.xP = canvasEl.width / 2;
  ball.yP = canvasEl.height / 2;

  ball.speed = 7;
}

function everythingManager() {

  ball.xP += ball.xV;
  ball.yP += ball.yV;

  let intelligenceLevel = 0.1;
  playerPaddleAI.yP +=
    (ball.yP - (playerPaddleAI.yP + playerPaddleAI.height / 2)) *
    intelligenceLevel;

  if (ball.yP + ball.radius > canvasEl.height || ball.yP - ball.radius < 0) {
    ball.yV = -ball.yV;
    wall.play();
  }

  let player =
    ball.xP + ball.radius < canvasEl.width / 2
      ? playerPaddleRI
      : playerPaddleAI;

  if (paddleColliDete(ball, player)) {
    hit.play();

    let collisionPoint = ball.yP - (player.yP + player.height / 2);

    collisionPoint = collisionPoint / (player.height / 2);

    let bounceAngle = (collisionPoint * Math.PI) / 4;

    let direction = ball.xP + ball.radius < canvasEl.width / 2 ? 1 : -1;

    ball.xV = direction * ball.speed * Math.cos(bounceAngle);
    ball.yV = ball.speed * Math.sin(bounceAngle);

    ball.speed += 0.3;
  }

  if (ball.xP + ball.radius < 0) {

    playerPaddleAI.score++;
    AIScore.play();
    resetBall();
  } else if (ball.xP - ball.radius > canvasEl.width) {

    playerPaddleRI.score++;
    RIScore.play();
    resetBall();
  }
}

function gameInit() {
  everythingManager();
  runGame();
}

const FPS = 60;
setInterval(gameInit, 1000 / FPS);
