let startTime = 0;
let timerInterval = null;
let placedCount = 0;
let gameStarted = false;

const plate = document.getElementById("plate");
const foodsArea = document.getElementById("foods");
const timerText = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

startBtn.onclick = startGame;
resetBtn.onclick = resetGame;

function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  startBtn.disabled = true;
  resetBtn.disabled = false;
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

        if (placedCount === gameData.foods.length) {
          clearInterval(timerInterval);
          alert(
            `完成！你花了 ${Math.floor(
              (Date.now() - startTime) / 1000
            )} 秒`
          );
        }
      } else {
        alert("這個分類不正確，再試試看！");
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
