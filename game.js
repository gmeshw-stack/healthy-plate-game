let placedCount = 0;
let startTime = 0;
let timerInterval = null;

const plate = document.getElementById("plate");
const foodsArea = document.getElementById("foods");
const timerText = document.getElementById("timer");
const message = document.getElementById("message");

document.getElementById("startBtn").onclick = startGame;
document.getElementById("resetBtn").onclick = resetGame;

/* 針對 600px 寬度校準的座標 */
const positions = {
  dairy: { top: "15px", left: "15px", width: "150px", height: "140px" },
  fruit: { top: "140px", left: "95px", width: "115px", height: "290px" },
  vegetable: { top: "135px", left: "210px", width: "135px", height: "305px" },
  protein: { top: "125px", left: "350px", width: "235px", height: "130px" },
  grain: { top: "275px", left: "350px", width: "235px", height: "155px" },
  nuts: { top: "215px", left: "308px", width: "65px", height: "65px" } // 堅果圓圈
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
    Object.assign(zone.style, positions[cat.id]);

    // 加入分類文字
    zone.innerHTML = `<div class="category-name">${cat.name}</div>`;

    zone.ondragover = e => e.preventDefault();
    zone.ondrop = e => {
      const foodId = e.dataTransfer.getData("text");
      const food = document.getElementById(foodId);
      if (food.dataset.category === cat.id) {
        zone.appendChild(food);
        food.draggable = false;
        food.style.fontSize = "14px";
        food.style.padding = "4px";
        placedCount++;
        message.innerText = "正確！";
        message.style.color = "green";

        if (placedCount === gameData.foods.length) {
          clearInterval(timerInterval);
          message.innerText = "恭喜完成！用時 " + Math.floor((Date.now() - startTime) / 1000) + " 秒";
        }
      } else {
        message.innerText = "錯誤，再試一次";
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