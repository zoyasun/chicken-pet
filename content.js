var feedposition = [];

// 檢查是否已經添加過電子寵物
if (!document.getElementById('pet-container')) {
    // 創建容器
    const petContainer = document.createElement('div');
    petContainer.id = 'pet-container';
    document.body.appendChild(petContainer);
  
    // 添加電子寵物圖像
    const petImage = document.createElement('img');
    petImage.src = chrome.runtime.getURL('./gif/Rooster.gif');
    petImage.alt = 'pet';
    petImage.style.width = '100px';
    petImage.style.height = '100px';
    petImage.style.transform = 'scaleX(1)'; // 預設朝右
    petImage.style.transition = 'transform 0.2s';
    petContainer.appendChild(petImage);
  
    console.log("ready to motion");
    motion(petContainer, petImage);
}

function motion(divin, imgin){
console.log("enter motion");
let direction = 1;
const speed = 1;

    function walkaround(){
        console.log("walkaround");
        const currentLeft = divin.offsetLeft;
        direction = imgin.style.transform == "scaleX(-1)" ? -1 : 1;
        if (currentLeft >= window.innerWidth - 100 || currentLeft <= 0) {
        //取得雞目前的方向
        direction *= -1;
        imgin.style.transform = `scaleX(${direction})`; // 翻轉圖片
        }
        divin.style.left = `${currentLeft + (direction * speed)}px`;
    }

    function foodevent() {
        console.log("foodevent");
        const chickenLeft = divin.offsetLeft; // 取得雞的水平位置
        console.log("chickenLeft: ", chickenLeft);
    
        const distances = []; // 宣告一個陣列來儲存雞與每個飼料的距離
    
        for (let i = 0; i < feedposition.length; i++) {
            // 修改這裡，從 food 元素物件中取得水平位置
            const foodLeft = parseFloat(feedposition[i].style.left); // 從 food 元素物件取得水平位置
            const distance = Math.abs(chickenLeft - foodLeft); // 計算水平距離 (取絕對值)
            console.log(`Food ${i} Left: ${foodLeft}, Distance: ${distance}`); // 印出飼料位置和距離，方便除錯
            distances.push(distance); // 將距離加入 distances 陣列
        }
    
        let minDistance = Math.min(...distances); // 找出最小距離
        console.log("minDistance: ", minDistance);
    
        let closestFoodIndex = distances.indexOf(minDistance); // 找出最小距離在 distances 陣列中的索引
        console.log("closestFoodIndex: ", closestFoodIndex);
    
        // 修改這裡，從 food 元素物件中取得水平位置
        let closestFoodLeft = parseFloat(feedposition[closestFoodIndex].style.left); // 從 food 元素物件取得水平位置
        console.log("closestFoodLeft: ", closestFoodLeft);

        let direction = closestFoodLeft > chickenLeft ? 1 : -1; // 判斷雞要往左走還是往右走
        imgin.style.transform = `scaleX(${direction})`; // 翻轉圖片
        divin.style.left = `${chickenLeft + (direction * speed * 3)}px`;

        // 如果雞和飼料的水平距離小於 10px，就視為吃到飼料
        if (minDistance < 10) {
            // 在這裡將飼料元素從網頁上移除
            feedposition[closestFoodIndex].remove(); // 移除 food 元素
            feedposition.splice(closestFoodIndex, 1); // 從 feedposition 陣列中移除被吃掉的飼料位置
        }
    
    
        console.log("Chicken moved to food!");
        console.log("feedposition after eat: ", feedposition);
    }

    function loop(){
        if(feedposition.length == 0){
            walkaround();
        }
        else{
            foodevent();
        }
        requestAnimationFrame(loop);
    }
    console.log("start loop");
    loop();
}
  

document.addEventListener("click", (event) => {
  // 創建飼料元素
  const food = document.createElement("img");
  food.src = chrome.runtime.getURL("feed.png"); // 替換成你的飼料圖片
  food.alt = "feed";
  food.style.position = "fixed";
  food.style.left = `${event.clientX}px`;
  food.style.top = `${event.clientY}px`;
  food.style.width = "10px";
  food.style.pointerEvents = "none"; // 防止影響點擊事件
  document.body.appendChild(food);

  fall(food); // 傳入 food 物件，啟動掉落
});
  
  
//v = gt
//h = 1/2gt^2
function fall(food) { // 讓 fall() 接受 food 參數
  let acceleration = 0.05; // px/ms² (模擬重力)
  let velocity = 0; // 初始速度
  let startTime = performance.now(); // 記錄開始時間

  function animate() {
    let currentTime = performance.now();
    let timeElapsed = (currentTime - startTime) / 1000; // 轉換為秒

    // 計算新位置
    let currentTop = parseFloat(food.style.top);
    //s = v0 * t + 0.5 * a * t² , s:位移 v0:初始速度 t:時間 a:加速度
    let displacement = velocity * timeElapsed + 0.5 * acceleration * Math.pow(timeElapsed, 2);
    // console.log(displacement);
    let newTop = currentTop + displacement;

    // 更新速度（v = v0 + at）
    velocity += acceleration * timeElapsed * 1000;

    // 如果還沒到底部，繼續移動
    if (newTop < window.innerHeight - 10) {
        food.style.top = `${newTop}px`;
        requestAnimationFrame(animate);
    } 
    else {
        food.style.top = `${window.innerHeight - 10}px`; // 保持在地面
        feedposition.push(food); 
        feedposition.sort((a, b) => parseFloat(a.style.left) - parseFloat(b.style.left)); // 修改排序方式
    }    
  }

  animate(); // 啟動動畫
}