const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function drawRiver() {
  const river = new Image();
  river.src = "../Assets/river.jpg";
  river.onload = function () {
    ctx.drawImage(road, 0, 0, 600, 600);
  };
}

drawRiver();
