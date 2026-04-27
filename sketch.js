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

  // 顯示影像
  image(capture, x, y, vW, vH);
}

function windowResized() {
  // 當視窗大小改變時，自動調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
}