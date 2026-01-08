let placedCount = 0;
let startTime = 0;
let timerInterval = null;

const plate = document.getElementById("plate");
const foodsArea = document.getElementById("foods");
const timerText = document.getElementById("timer");
const message = document.getElementById("message");

document.getElementById("startBtn").onclick = startGame;
document.getElementById("resetBtn").onclick = resetGame;

/* 像素級定位（對齊你的餐盤圖） */
const positions = {
  dairy: { top: "10px", left: "10px", width: "93px", height: "85px" },
  fruit: { top: "100px", left: "65px", width: "78px", height: "200px" },
  vegetable: { top: "95px", left: "146px", width: "90px", height: "209px" },
  protein: { top: "87px", left: "239px", width: "176px", height: "81px" },
  grain: { top: "191px", left: "239px", width: "176px", height: "105px" }

};

function startGame() {
  placedCount = 0;
  plate.innerHTML = "";
  foodsArea.innerHTML = "";
  message.innerText = "";
  clearInterval(timerInterval);

  startTime = Date.now();
  timerInterval = setInterval(() => {
    timerText.innerText =
      "時間：" + Math.floor((Date.now() - startTime) / 1000) + " 秒";
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
}

function buildPlate() {
  gameData.categories.forEach(cat => {
    const zone = document.createElement("div");
    zone.className = "plate-zone";
    zone.dataset.accept = cat.id;

    Object.assign(zone.style, positions[cat.id]);

    // zone.innerHTML = `<div class="category-name">${cat.name}</div>`; 

    zone.ondragover = e => e.preventDefault();
    //
    zone.ondrop = e => {
      const food = document.getElementById(e.dataTransfer.getData("text"));
      if (food.dataset.category === cat.id) {
        zone.appendChild(food);
        food.draggable = false;
        placedCount++;
        message.innerText = "正確！";
        message.style.color = "green";

        if (placedCount === gameData.foods.length) {
          clearInterval(timerInterval);
          message.innerText =
            "完成！用時 " +
            Math.floor((Date.now() - startTime) / 1000) +
            " 秒";
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




