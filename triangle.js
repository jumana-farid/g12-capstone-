window.onload = function () {
  const canvas = document.getElementById("tri-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 500;  
  canvas.height = 400;

  const img = new Image();
  img.src = "Triangular Object with Yellow Accents.png";

  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
};
