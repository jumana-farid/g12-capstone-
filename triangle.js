window.onload = function () {
  const canvas = document.getElementById("tri-canvas");
  const ctx = canvas.getContext("2d");

  // Road/Intersection polygons
  const roads = {
    road1: [[75,342],[253,126],[289,155],[137,341]],
    road3: [[358,128],[314,160],[440,341],[532,340]]
  };

  // Intersection ellipse coordinates
  const intersection = {
    x: (532 + 305) / 2, // center x
    y: (366 + 246) / 2, // center y
    radiusX: Math.abs(532 - 305) / 2,
    radiusY: Math.abs(366 - 246) / 2
  };

  function getColor(status) {
    switch(status) {
      case "Occupied": return "rgba(255,0,0,0.5)";  // red, 50% opacity
      case "In use": return "rgba(255,255,0,0.5)";  // yellow, 50% opacity
      default: return "rgba(0,255,0,0.5)";          // green, 50% opacity
    }
  }

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawMapAndRoads();
  }

  function drawMapAndRoads() {
    const img = new Image();
    img.src = "Triangular Object with Yellow Accents.png"; // map background

    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.4;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      // Assuming triangle.js exposes an object `triangleStatus`
      // with UL1, UL2, UL3 values like: "Occupied" / "In use"
      const road1Color = getColor(triangleStatus.UL1);
      const intersectionColor = getColor(triangleStatus.UL2);
      const road3Color = getColor(triangleStatus.UL3);

      // Draw Road 1 polygon
      ctx.beginPath();
      ctx.moveTo(roads.road1[0][0], roads.road1[0][1]);
      for(let i=1; i<roads.road1.length; i++){
        ctx.lineTo(roads.road1[i][0], roads.road1[i][1]);
      }
      ctx.closePath();
      ctx.fillStyle = road1Color;
      ctx.fill();

      // Draw Road 3 polygon
      ctx.beginPath();
      ctx.moveTo(roads.road3[0][0], roads.road3[0][1]);
      for(let i=1; i<roads.road3.length; i++){
        ctx.lineTo(roads.road3[i][0], roads.road3[i][1]);
      }
      ctx.closePath();
      ctx.fillStyle = road3Color;
      ctx.fill();

      // Draw Intersection
      ctx.beginPath();
      ctx.ellipse(intersection.x, intersection.y, intersection.radiusX, intersection.radiusY, 0, 0, 2*Math.PI);
      ctx.fillStyle = intersectionColor;
      ctx.fill();
    };
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
};
