let capture;

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設產生的 HTML 影片元件，我們要在畫布上繪製
  capture.hide();
}

function draw() {
  // 設定背景顏色為 e7c6ff
  background('#e7c6ff');

  // 計算影像寬高（全螢幕的 50%）
  let vW = width * 0.5;
  let vH = height * 0.5;
  
  // 計算置中座標
  let x = (width - vW) / 2;
  let y = (height - vH) / 2;

  // 載入攝影機的像素資料
  capture.loadPixels();

  // 設定點的間距
  let stepSize = 12;

  for (let cy = 0; cy < capture.height; cy += stepSize) {
    for (let cx = 0; cx < capture.width; cx += stepSize) {
      // 計算像素索引 (RGBA)
      let i = (cy * capture.width + cx) * 4;
      let r = capture.pixels[i];
      let g = capture.pixels[i + 1];
      let b = capture.pixels[i + 2];

      fill(r, g, b);
      noStroke();
      
      // 將攝影機座標對應到畫布上的置中位置
      let drawX = map(cx, 0, capture.width, x, x + vW);
      let drawY = map(cy, 0, capture.height, y, y + vH);
      
      // 繪製圓點
      circle(drawX, drawY, stepSize * (vW / capture.width));
    }
  }
}

function windowResized() {
  // 當視窗大小改變時，自動調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
}