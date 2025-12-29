window.onload = function () {
  const canvas = document.getElementById("tri-canvas");
  const ctx = canvas.getContext("2d");

  // ORIGINAL IMAGE SIZE (important for scaling)
  const BASE_WIDTH = 700;
  const BASE_HEIGHT = 450;

  // Road/Intersection polygons (BASE coordinates)
  const roads = {
    road1: [[75,342],[253,126],[289,155],[137,341]],
    road3: [[358,128],[314,160],[440,341],[532,340]]
  };

  // Intersection ellipse (BASE coordinates)
  const intersection = {
    x: (532 + 305) / 2,
    y: (340 + 34) / 2,
    radiusX: Math.abs(532 - 305) / 2,
    radiusY: Math.abs(340 - 34) / 2
  };

  // CURRENT STATUS SHOWN ON MAP
  let triangleStatus = {
    UL1: "Free",
    UL2: "Free",
    UL3: "Free"
  };

  // DATA PLAYBACK VARIABLES
  let trafficData = [];
  let currentIndex = 0;
  let playbackTimer = null;

  // COLOR LOGIC (handles long messages)
  function getColor(status) {
    if (!status) return "rgba(0,255,0,0.5)";
    const s = status.toLowerCase();
    if (s.includes("occupied")) return "rgba(255,0,0,0.5)";
    if (s.includes("use")) return "rgba(255,255,0,0.5)";
    return "rgba(0,255,0,0.5)";
  }

  // 🔹 LOAD JSON FROM GITHUB (RAW)
  function loadTrafficData() {
    fetch("https://raw.githubusercontent.com/jumana-farid/g12-capstone-/main/trafficPredictor.json")
      .then(res => res.json())
      .then(data => {
        trafficData = data;
        currentIndex = 0;

        applyTrafficState();

        if (playbackTimer) clearInterval(playbackTimer);
        playbackTimer = setInterval(nextTrafficState, 10000); // 10 seconds
      })
      .catch(err => console.error("Traffic data error:", err));
  }

  // APPLY CURRENT STATE TO MAP
  function applyTrafficState() {
    if (!trafficData.length) return;

    const state = trafficData[currentIndex];

    triangleStatus = {
      UL1: state.UL1_status,
      UL2: state.UL2_status,
      UL3: state.UL3_status
    };

    drawMapAndRoads();
  }

  // MOVE TO NEXT STATE
  function nextTrafficState() {
    currentIndex++;
    if (currentIndex >= trafficData.length) currentIndex = 0;
    applyTrafficState();
  }

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    drawMapAndRoads();
  }

  function scaleX(x) {
    return x * canvas.width / BASE_WIDTH;
  }

  function scaleY(y) {
    return y * canvas.height / BASE_HEIGHT;
  }

  function drawMapAndRoads() {
    const img = new Image();
    img.src = "Triangular Object with Yellow Accents.png";

    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.globalAlpha = 0.4;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      // Colors
      const road1Color = getColor(triangleStatus.UL1);
      const intersectionColor = getColor(triangleStatus.UL2);
      const road3Color = getColor(triangleStatus.UL3);

      // 🔺 Road 1
      ctx.beginPath();
      ctx.moveTo(scaleX(roads.road1[0][0]), scaleY(roads.road1[0][1]));
      for (let i = 1; i < roads.road1.length; i++) {
        ctx.lineTo(scaleX(roads.road1[i][0]), scaleY(roads.road1[i][1]));
      }
      ctx.closePath();
      ctx.fillStyle = road1Color;
      ctx.fill();

      // 🔺 Road 3
      ctx.beginPath();
      ctx.moveTo(scaleX(roads.road3[0][0]), scaleY(roads.road3[0][1]));
      for (let i = 1; i < roads.road3.length; i++) {
        ctx.lineTo(scaleX(roads.road3[i][0]), scaleY(roads.road3[i][1]));
      }
      ctx.closePath();
      ctx.fillStyle = road3Color;
      ctx.fill();

      // ⚪ Intersection
      ctx.beginPath();
      ctx.ellipse(
        scaleX(intersection.x),
        scaleY(intersection.y),
        intersection.radiusX * canvas.width / BASE_WIDTH,
        intersection.radiusY * canvas.height / BASE_HEIGHT,
        0, 0, Math.PI * 2
      );
      ctx.fillStyle = intersectionColor;
      ctx.fill();
    };
  }

  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  loadTrafficData(); // 🚦 START PLAYBACK
};
