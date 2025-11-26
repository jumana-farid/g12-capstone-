window.onload = function () {
  const canvas = document.getElementById("tri-canvas");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawTriangle();
  }

  function drawTriangle() {
    const img = new Image();
    img.src = "Triangular Object with Yellow Accents.png"; // put this in same folder

    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.4; // dim the image overlay
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
};
