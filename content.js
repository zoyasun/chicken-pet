// 檢查是否已經添加過電子寵物
if (!document.getElementById('pet-container')) {
    // 創建容器
    const petContainer = document.createElement('div');
    petContainer.id = 'pet-container';

    document.body.appendChild(petContainer);
  
    // 添加電子寵物圖像
    const petImage = document.createElement('img');
    petImage.src = chrome.runtime.getURL('pet.png');
    petImage.alt = 'pet';
    petImage.style.width = '100px';
    petImage.style.height = '100px';
    petImage.style.transform = 'scaleX(-1)'; // 預設朝右
    petImage.style.transition = 'transform 0.2s';
    petContainer.appendChild(petImage);
  
    // 添加簡單的移動動畫
    let direction = 1;
    const speed = 1;
    setInterval(() => {
    //   const currentLeft = parseInt(petContainer.style.left);
      const currentLeft = petContainer.offsetLeft;
      if (currentLeft >= window.innerWidth - 100 || currentLeft <= 0) {
        direction *= -1;
        petImage.style.transform = `scaleX(${-direction})`; // 翻轉圖片
      }
      petContainer.style.left = `${currentLeft + (direction * speed)}px`;
    }, 20);
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
      } else {
          food.style.top = `${window.innerHeight - 10}px`; // 保持在地面
      }
  }

  animate(); // 啟動動畫
}