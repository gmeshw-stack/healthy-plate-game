let startTime = 0;
let timerInterval = null;
let placedCount = 0;
let gameStarted = false;

const plate = document.getElementById("plate");
const foodsArea = document.getElementById("foods");
const timerText = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");

startBtn.onclick = startGame;
resetBtn.onclick = resetGame;

/* 像素級定位（對齊你的餐盤圖） */
const positions = {
  dairy: {      // 左上 淺藍
    top: "10px",
    left: "10px",
    width: "78px",
    height: "80px"
  },
  fruit: {      // 左下 橘色
    top: "95px",
    left: "10px",
    width: "78px",
    height: "208px"
  },
  vegetable: {  // 中間 綠色
    top: "12px",
    left: "96px",
    width: "120px",
    height: "291px"
  },
  grain: {      // 右上 黃色
    top: "102px",
    left: "224px",
    width: "186px",
    height: "86px"
  },
  protein: {    // 右下 紅色
    top: "206px",
    left: "224px",
    width: "186px",
    height: "90px"
  }
};

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  startBtn.disabled = true;
  resetBtn.disabled = false;
  message.innerText = "";
  placedCount = 0;

  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);

  buildPlate();
  buildFoods();
}

function resetGame() {
  clearInterval(timerInterval);
  timerText.innerText = "時間：0 秒";
  message.innerText = "";
  gameStarted = false;
  placedCount = 0;
  startBtn.disabled = false;
  resetBtn.disabled = true;
  plate.innerHTML = "";
  foodsArea.innerHTML = "";
}

function updateTimer() {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  timerText.innerText = `時間：${seconds} 秒`;
}

function buildPlate() {
  plate.innerHTML = "";

  gameData.categories.forEach(cat => {
    const zone = document.createElement("div");
    zone.className = "plate-zone";
    zone.innerText = cat.name;
    zone.dataset.accept = cat.id;

    zone.style.top = positions[cat.id].top;
    zone.style.left = positions[cat.id].left;
    zone.style.width = positions[cat.id].width;
    zone.style.height = positions[cat.id].height;

    zone.ondragover = e => e.preventDefault();
    zone.ondrop = e => {
      const foodId = e.dataTransfer.getData("text");
      const food = document.getElementById(foodId);

      if (food.dataset.category === zone.dataset.accept) {
        zone.appendChild(food);
        food.draggable = false;
        placedCount++;
        message.innerText = "正確！";
        message.style.color = "green";

        if (placedCount === gameData.foods.length) {
          clearInterval(timerInterval);
          message.innerText =
            `完成！你花了 ${Math.floor((Date.now() - startTime)/1000)} 秒`;
          message.style.color = "blue";
        }
      } else {
        message.innerText = "錯誤，請再試一次";
        message.style.color = "red";
      }
    };

    plate.appendChild(zone);
  });
}

function buildFoods() {
  foodsArea.innerHTML = "";

  gameData.foods.forEach((f, i) => {
    const food = document.createElement("div");
    food.className = "food";
    food.id = "food" + i;
    food.innerText = f.name;
    food.dataset.category = f.category;
    food.draggable = true;

    food.ondragstart = e => {
      e.dataTransfer.setData("text", food.id);
    };

    foodsArea.appendChild(food);
  });
}
