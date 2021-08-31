const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const boatImage = new Image();
// Connects image to the image file
boatImage.src = "../Assets/boat.png";
const riverImage = new Image();
// Connects image to the image file
riverImage.src = "../Assets/background.jpg";

let boat;
let obstacles = [];
let frame;
let animationID;

window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    boat = new Boat();
    frame = 1;
    // assign events to left, right, up and down arrow keys
    document.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "ArrowLeft": // left arrow
          boat.moveLeft();
          break;
        case "ArrowRight": // right arrow
          boat.moveRight();
          break;
        case "ArrowUp": // right arrow
          boat.moveUp();
          break;
        case "ArrowDown": // right arrow
          boat.moveDown();
          break;
      }
    }); // end assign events to left and right arrow keys
    updateCanvas();
  };
};

function updateCanvas() {
  ctx.fillStyle = "#870007";
  ctx.clearRect(0, 0, 600, 700);
  ctx.drawImage(riverImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(boatImage, boat.x, boat.y, boat.width, boat.height);
  if (frame % 180 == 0) {
    // let obstacle = new Obstacle()
    obstacles.push(new Obstacle());
  }
  let collisionDetectedBoolean = false;
  obstacles.forEach((obstacle) => {
    obstacle.moveDown();
    obstacle.checkIfOffscreen();
    if (obstacle.offScreen && obstacle.alreadyCounted === false) {
      boat.increaseScore();
      obstacle.updateScore();
    }
    if (obstacle.detectCollision(boat)) {
      collisionDetectedBoolean = true;
      return;
    }
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
  console.log(boat.score);

  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + boat.score, 70, 50);

  if (collisionDetectedBoolean) {
    cancelAnimationFrame(animationID);
    document.getElementById("scoreboard").textContent = boat.score;
    document.getElementById("game-over").style.display = "block";
    setTimeout(() => {
      window.location.reload();
    }, 4000);
  } else {
    frame++;
    animationID = requestAnimationFrame(updateCanvas);
  }
  // frame = frame + 1
  // frame updates go here
}

class Boat {
  constructor() {
    this.score = 0;
    this.width = 75;
    this.height = 150;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height - 20;
  }

  moveLeft() {
    this.x -= 25;
  }
  moveRight() {
    this.x += 25;
  }
  moveUp() {
    this.y -= 20;
  }
  moveDown() {
    this.y += 20;
  }
  increaseScore() {
    this.score += 1;
  }
}

class Obstacle {
  constructor() {
    this.width = Math.max(
      Math.floor(Math.random() * canvas.width * 0.65 * 0.85),
      140
    );
    this.height = 20;
    let tempX =
      Math.floor(Math.random() * (canvas.width * 0.85)) +
      (canvas.width * 0.27) / 2;
    if (this.width + tempX > canvas.width * 0.85) {
      this.x = canvas.width * 0.85 - this.width;
    } else {
      this.x = tempX;
    }
    this.y = 0;
    this.offScreen = false;
    this.alreadyCounted = false;
  }

  checkIfOffscreen() {
    if (this.y > canvas.height) {
      this.offScreen = true;
    }
  }

  updateScore() {
    this.alreadyCounted = true;
  }

  detectCollision(boat) {
    if (
      boat.x < this.x + this.width &&
      boat.x + boat.width > this.x &&
      boat.y < this.y + this.height &&
      boat.y + boat.height > this.y
    ) {
      console.log("collision detected");
      return true;
    }
    return false;
  }
  // obstacles move down throughout frame
  moveDown() {
    this.y += 3;
  }
}
