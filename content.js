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
  