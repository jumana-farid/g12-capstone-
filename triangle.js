window.onload = function () {
  const canvas = document.getElementById("tri-canvas");
  const ctx = canvas.getContext("2d");

  const BASE_WIDTH = 700;
  const BASE_HEIGHT = 450;

  const roads = {
    road1: [[75,342],[253,126],[289,155],[137,341]],
    road3: [[358,128],[314,160],[440,341],[532,340]]
  };

  const intersection = {
    x: (532 + 305) / 2,
    y: (340 + 34) / 2,
    radiusX: Math.abs(532 - 305) / 2,
    radiusY: Math.abs(340 - 34) / 2
  };

  function getColor(status) {
    switch(status) {
      case "Occupied": return "rgba(255,0,0,0.5)";
      case "In use": return "rgba(255,255,0,0.5)";
      default: return "rgba(0,255,0,0.5)";
    }
  }

  async function loadTrafficData() {
    try {
      const response = await fetch('trafficPredictor.json');
      const data = await response.json();
      const latest = data[data.length - 1];

      Object.keys(latest).forEach(key => {
        if (key.startsWith("UL")) {
          window.triangleStatus[key] = latest[key];
        }
      });

      drawMapAndRoads();
    } catch(err) {
      console.error("Failed to load traffic data:", err);
    }
  }

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawMapAndRoads();
  }

  function scaleX(x) { return x * canvas.width / BASE_WIDTH; }
  function scaleY(y) { return y * canvas.height / BASE_HEIGHT; }

  function drawMapAndRoads() {
    const img = new Image();
    img.src = "Triangular_Object_with_Yellow_Accents.png";

    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.4;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      ctx.fillStyle = getColor(window.triangleStatus.UL1);
      ctx.beginPath();
      ctx.moveTo(scaleX(roads.road1[0][0]), scaleY(roads.road1[0][1]));
      roads.road1.forEach(p => ctx.lineTo(scaleX(p[0]), scaleY(p[1])));
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = getColor(window.triangleStatus.UL3);
      ctx.beginPath();
      ctx.moveTo(scaleX(roads.road3[0][0]), scaleY(roads.road3[0][1]));
      roads.road3.forEach(p => ctx.lineTo(scaleX(p[0]), scaleY(p[1])));
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = getColor(window.triangleStatus.UL2);
      ctx.beginPath();
      ctx.ellipse(
        scaleX(intersection.x),
        scaleY(intersection.y),
        intersection.radiusX * canvas.width / BASE_WIDTH,
        intersection.radiusY * canvas.height / BASE_HEIGHT,
        0, 0, Math.PI * 2
      );
      ctx.fill();
    };
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  loadTrafficData();
  setInterval(loadTrafficData, 10000);
};
