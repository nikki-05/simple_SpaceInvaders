// space-invaders.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const player = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 40,
  width: 30,
  height: 30,
  dx: 5,
  bullets: []
};

const aliens = [];
const alienRows = 5;
const alienCols = 10;
const alienWidth = 40;
const alienHeight = 30;
const alienPadding = 10;
const alienOffsetTop = 30;
const alienOffsetLeft = 30;
let alienDx = 2;
let alienDy = 0;

let rightPressed = false;
let leftPressed = false;
let spacePressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  } else if (e.key === ' ' || e.key === 'Spacebar') {
    spacePressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  } else if (e.key === ' ' || e.key === 'Spacebar') {
    spacePressed = false;
    shootBullet();
  }
}

function createAliens() {
  for (let c = 0; c < alienCols; c++) {
    aliens[c] = [];
    for (let r = 0; r < alienRows; r++) {
      const alienX = (c * (alienWidth + alienPadding)) + alienOffsetLeft;
      const alienY = (r * (alienHeight + alienPadding)) + alienOffsetTop;
      aliens[c][r] = { x: alienX, y: alienY, status: 1 };
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = 'green';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawAliens() {
  for (let c = 0; c < alienCols; c++) {
    for (let r = 0; r < alienRows; r++) {
      if (aliens[c][r].status === 1) {
        const alienX = aliens[c][r].x;
        const alienY = aliens[c][r].y;
        ctx.fillStyle = 'red';
        ctx.fillRect(alienX, alienY, alienWidth, alienHeight);
        ctx.beginPath();
        ctx.arc(alienX + alienWidth / 2, alienY + alienHeight / 2, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawBullets() {
  ctx.fillStyle = 'yellow';
  player.bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

function movePlayer() {
  if (rightPressed && player.x < canvas.width - player.width) {
    player.x += player.dx;
  } else if (leftPressed && player.x > 0) {
    player.x -= player.dx;
  }
}

function moveAliens() {
  let moveDown = false;
  for (let c = 0; c < alienCols; c++) {
    for (let r = 0; r < alienRows; r++) {
      if (aliens[c][r].status === 1) {
        aliens[c][r].x += alienDx;
        if (aliens[c][r].x + alienWidth > canvas.width || aliens[c][r].x < 0) {
          moveDown = true;
        }
      }
    }
  }
  if (moveDown) {
    for (let c = 0; c < alienCols; c++) {
      for (let r = 0; r < alienRows; r++) {
        aliens[c][r].x -= alienDx;
        aliens[c][r].y += 10;
      }
    }
    alienDx = -alienDx;
  }
}

function shootBullet() {
  const bullet = {
    x: player.x + player.width / 2 - 2.5,
    y: player.y - 10,
    width: 5,
    height: 10,
    dy: -5
  };
  player.bullets.push(bullet);
}

function updateBullets() {
  player.bullets.forEach((bullet, index) => {
    bullet.y += bullet.dy;
    if (bullet.y + bullet.height < 0) {
      player.bullets.splice(index, 1);
    }
  });
}

function detectCollisions() {
  player.bullets.forEach((bullet, bulletIndex) => {
    for (let c = 0; c < alienCols; c++) {
      for (let r = 0; r < alienRows; r++) {
        const alien = aliens[c][r];
        if (alien.status === 1 && bullet.x < alien.x + alienWidth && bullet.x + bullet.width > alien.x && bullet.y < alien.y + alienHeight && bullet.y + bullet.height > alien.y) {
          alien.status = 0;
          player.bullets.splice(bulletIndex, 1);
          break;
        }
      }
    }
  });
}

function checkWin() {
  for (let c = 0; c < alienCols; c++) {
    for (let r = 0; r < alienRows; r++) {
      if (aliens[c][r].status === 1) {
        return false;
      }
    }
  }
  return true;
}

function displayWinMessage() {
  ctx.font = '48px serif';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText('Congratulations! You won!', canvas.width / 2, canvas.height / 2);
}

function update() {
  if (checkWin()) {
    displayWinMessage();
    return;
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawAliens();
  drawBullets();
  movePlayer();
  moveAliens();
  updateBullets();
  detectCollisions();

  requestAnimationFrame(update);
}

createAliens();
update();
