window.onload = function () {
  const canvas = document.getElementById("tri-canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.src = "Triangular Object with Yellow Accents.png"; // your map

  img.onload = function () {
    resizeCanvas();
  };

  // Example AI predictions
  // true = congested, false = clear
  const aiPredictions = {
    road1: false,
    road2: true
  };

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawMapAndRoads();
  }

  function drawMapAndRoads() {
    // Draw base map
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.4;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 1; // reset alpha for roads

    // Draw road 1
    ctx.beginPath();
    ctx.moveTo(50, 100); // start point
    ctx.lineTo(300, 100); // end point
    ctx.lineWidth = 10;
    ctx.strokeStyle = aiPredictions.road1 ? "red" : "green"; // red if congested
    ctx.stroke();

    // Draw road 2
    ctx.beginPath();
    ctx.moveTo(200, 50);
    ctx.lineTo(200, 300);
    ctx.lineWidth = 10;
    ctx.strokeStyle = aiPredictions.road2 ? "red" : "green";
    ctx.stroke();

    // Draw intersection as a circle
    ctx.beginPath();
    ctx.arc(200, 100, 15, 0, 2 * Math.PI);
    ctx.fillStyle = "yellow";
    ctx.fill();
  }

  window.addEventListener("resize", resizeCanvas);
};
