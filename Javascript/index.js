const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const boatImageUp = new Image();
// Connects image to the image file
boatImageUp.src = "../Assets/boatUp.png";

const boatImageR = new Image();
boatImageR.src = "../Assets/boatR.png";

const boatImageL = new Image();
boatImageL.src = "../Assets/boatL.png";

let boats = {
  img: boatImageUp,
};

const riverImage = new Image();
// Connects image to the image file
riverImage.src = "../Assets/background.jpg";

const alligatorImageR = new Image();
alligatorImageR.src = "../Assets/alligator.png";

const alligatorImageL = new Image();
alligatorImageL.src = "../Assets/alligatorL.png";

let alligatorLR = {
  img: alligatorImageR,
};

const treeImage = new Image();
treeImage.src = "../Assets/treetrunkH.png";

const vtreeImage = new Image();
vtreeImage.src = "../Assets/treetrunk.png";

let boat;
let obstacles = [];
let frame;
let animationID;
let obstacleImages = [treeImage, vtreeImage];

window.onload = () => {
  document.getElementById("start-button").onclick = () => {
    boat = new Boat();
    alligator = new Alligator();
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
  document.addEventListener("keyup", function (e) {
    boats.img = boatImageUp;
  });

  function logKey(e) {
    log.textContent += ` ${e.code}`;
  }
  ctx.fillStyle = "#870007";
  backgroundImage.move();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  backgroundImage.draw();
  ctx.drawImage(boats.img, boat.x, boat.y, boat.width, boat.height);
  if (frame % 180 == 0) {
    // let obstacle = new Obstacle()
    obstacles.push(new Obstacle());
  }
  if (boat.score > 2) {
    ctx.drawImage(
      alligatorLR.img,
      alligator.x,
      alligator.y,
      alligator.width,
      alligator.height
    );
    alligator.move(boat.x, boat.y);
    if (boat.x > alligator.x) {
      alligatorLR.img = alligatorImageR;
    } else {
      alligatorLR.img = alligatorImageL;
    }
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

    ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });

  if (alligator.detectCollision(boat)) {
    collisionDetectedBoolean = true;
    // return;
  }

  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + boat.score, 70, 50);

  if (collisionDetectedBoolean) {
    cancelAnimationFrame(animationID);
    document.getElementById("scoreboard").textContent = boat.score;
    document.getElementById("game-over").style.display = "block";
    document.getElementById("game-over-video").style.display = "block";
    document.getElementById("game-over-video").play();
    setTimeout(() => {
      window.location.reload();
    }, 6200);
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
    this.width = 85;
    this.height = 1.25 * this.width;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height - 20;
  }

  moveLeft() {
    this.x -= 25;
    boats.img = boatImageL;
  }
  moveRight() {
    this.x += 25;
    boats.img = boatImageR;
  }
  moveUp() {
    this.y -= 20;
    boats.img = boatImageUp;
  }
  moveDown() {
    this.y += 20;
    boats.img = boatImageUp;
  }
  increaseScore() {
    this.score += 1;
  }
}

class Obstacle {
  constructor() {
    // // this.width = Math.max(
    //   Math.floor(Math.random() * canvas.width * 0.65 * 0.85),
    //   140
    // );
    // this.height = 20;
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
    this.image = obstacleImages[Math.floor(Math.random() * obstacleImages.length)]
    this.width = this.image.width * 0.2
    this.height = this.image.height * 0.2
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
    this.y += 2;
  }
}

const backgroundImage = {
  img: riverImage,
  x: 0,
  y: 0,
  speed: -0.4,

  move: function () {
    this.y -= this.speed;
    this.y %= canvas.height;
  },

  draw: function () {
    ctx.drawImage(this.img, 0, this.y);
    if (this.speed > 0) {
      ctx.drawImage(this.img, 0, this.y + this.img.height);
    } else {
      ctx.drawImage(this.img, 0, this.y - canvas.height);
    }
  },
};

class Alligator {
  constructor() {
    this.height = 30;
    this.width = 2.36 * this.height;
    this.x = Math.floor(Math.random() * canvas.width);
    this.y = Math.floor(Math.random() * canvas.height);
  }

  move(x, y) {
    if (this.x < x) {
      this.x += 0.2;
    } else {
      this.x -= 0.2;
    }
    if (this.y < y) {
      this.y += 0.2;
    } else {
      this.y -= 0.2;
    }
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
}
