let placedCount = 0;
let startTime = 0;
let timerInterval = null;

const plate = document.getElementById("plate");
const foodsArea = document.getElementById("foods");
const timerText = document.getElementById("timer");
const message = document.getElementById("message");

document.getElementById("startBtn").onclick = startGame;
document.getElementById("resetBtn").onclick = resetGame;

// 百分比座標系統，相對於餐盤圖片寬高
const positions = {
  dairy: { top: "3%", left: "3%", width: "25%", height: "28%" },
  fruit: { top: "28%", left: "10%", width: "16%", height: "65%" },
  vegetable: { top: "28%", left: "28%", width: "22%", height: "65%" },
  protein: { top: "25%", left: "55%", width: "40%", height: "30%" },
  grain: { top: "58%", left: "55%", width: "40%", height: "38%" },
  nuts: { top: "45%", left: "50%", width: "10%", height: "10%" }
};

function startGame() {
  placedCount = 0;
  plate.innerHTML = "";
  foodsArea.innerHTML = "";
  message.innerText = "";
  document.getElementById("startBtn").disabled = true;
  document.getElementById("resetBtn").disabled = false;
  clearInterval(timerInterval);
  startTime = Date.now();
  timerInterval = setInterval(() => {
    timerText.innerText = "時間：" + Math.floor((Date.now() - startTime) / 1000) + " 秒";
  }, 1000);
  buildPlate();
  buildFoods();
}

function resetGame() {
  clearInterval(timerInterval);
  timerText.innerText = "時間：0 秒";
  plate.innerHTML = "";
  foodsArea.innerHTML = "";
  message.innerText = "";
  document.getElementById("startBtn").disabled = false;
  document.getElementById("resetBtn").disabled = true;
}

function buildPlate() {
  gameData.categories.forEach(cat => {
    const zone = document.createElement("div");
    zone.className = "plate-zone";
    zone.dataset.accept = cat.id;
    const pos = positions[cat.id];
    zone.style.top = pos.top;
    zone.style.left = pos.left;
    zone.style.width = pos.width;
    zone.style.height = pos.height;

    // 加入分類文字
    zone.innerHTML = `<div class="category-name">${cat.name}</div>`;

    zone.ondragover = e => e.preventDefault();
    zone.ondrop = e => {
      e.preventDefault();
      const foodId = e.dataTransfer.getData("text");
      const food = document.getElementById(foodId);
      if (food && food.dataset.category === cat.id) {
        zone.appendChild(food);
        food.draggable = false;
        food.style.fontSize = "14px";
        food.style.padding = "5px";
        placedCount++;
        message.innerText = "正確！";
        message.style.color = "green";
        if (placedCount === gameData.foods.length) {
          clearInterval(timerInterval);
          message.innerText = "完成！用時 " + Math.floor((Date.now() - startTime) / 1000) + " 秒";
        }
      } else {
        message.innerText = "放錯位置了，再試試看！";
        message.style.color = "red";
      }
    };
    plate.appendChild(zone);
  });
}

function buildFoods() {
  const foods = [...gameData.foods].sort(() => Math.random() - 0.5);
  foods.forEach((f, i) => {
    const food = document.createElement("div");
    food.className = "food";
    food.id = "food" + i;
    food.dataset.category = f.category;
    food.draggable = true;
    food.innerText = f.name;
    food.ondragstart = e => e.dataTransfer.setData("text", food.id);
    foodsArea.appendChild(food);
  });
}