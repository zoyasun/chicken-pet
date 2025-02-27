// content.js
(function() { //  使用 IIFE 包裹程式碼的開始

  // 動態生成唯一的 ID
  function generateUniqueId() {
    return 'pet-container-' + Date.now() + '-' + Math.random().toString(36).substring(2, 15);
  }

  // 創建容器 (不再檢查是否已存在，每次都創建新的)
  const petContainer = document.createElement('div');
  petContainer.id = generateUniqueId(); // 使用動態生成的唯一 ID
  petContainer.style.position = 'fixed';
  petContainer.style.bottom = '50px';
  petContainer.style.left = '100px';
  petContainer.style.zIndex = '1000';

  document.body.appendChild(petContainer);

  // 添加電子寵物圖像
  const petImage = document.createElement('img');
  petImage.src = chrome.runtime.getURL('/gif/Rooster.gif');
  petImage.alt = 'pet';
  petImage.style.width = '100px';
  petImage.style.height = '100px';
  petImage.style.transform = 'scaleX(1)'; // 預設朝左
  petImage.style.transition = 'transform 0.2s';
  petContainer.appendChild(petImage);

  // 添加簡單的移動動畫
  let direction = 1;
  const speed = 1;
  setInterval(() => {
    const currentLeft = petContainer.offsetLeft;
    if (currentLeft >= window.innerWidth - 100 || currentLeft <= 0) {
      direction *= -1;
      petImage.style.transform = `scaleX(${direction})`; // 翻轉圖片
    }
    petContainer.style.left = `${currentLeft + (direction * speed)}px`;
  }, 20);

})(); //  使用 IIFE 包裹程式碼的結束 (注意這裡的括號)