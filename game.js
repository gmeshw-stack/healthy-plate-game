let startTime = 0;
let timerInterval = null;
let placedCount = 0;
let gameStarted = false;

const plate = document.getElementById("plate");
const foodsArea = document.getElementById("foods");
const timerText = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message"); // 顯示提示訊息

startBtn.onclick = startGame;
resetBtn.onclick = resetGame;

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  startBtn.disabled = true;
  resetBtn.disabled = false;
  message.innerText = "";
  message.style.color = "black";
  document.getElementById("instruction").innerText =
    "拖曳食物到正確的分類區域";

  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);

  buildPlate();
  buildFoods();
}

function resetGame() {
  clearInterval(timerInterval);
  timerText.innerText = "時間：0 秒";
  message.innerText = "";
  placedCount = 0;
  gameStarted = false;
  startBtn.disabled = false;
  resetBtn.disabled = true;
  plate.innerHTML = "";
  foodsArea.innerHTML = "";
  document.getElementById("instruction").innerText =
    "請點擊「開始遊戲」，再將食物拖曳到正確的分類";
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
          message.innerText = `完成！你花了 ${Math.floor((Date.now() - startTime) / 1000)} 秒`;
          message.style.color = "blue";
        }
      } else {
        message.innerText = "錯誤，請再試試看！";
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
