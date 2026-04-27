let capture;
let handpose;
let predictions = [];
let bubbles = []; // 儲存所有水泡的陣列

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 擷取攝影機影像
  capture = createCapture(VIDEO);
  // 隱藏預設產生的 HTML 影片元件，我們要在畫布上繪製
  capture.hide();

  // 初始化 ml5.js 手勢偵測模型
  handpose = ml5.handpose(capture, () => console.log("Handpose Model Ready"));
  // 當偵測到手部時，將結果存入 predictions 變數
  handpose.on("predict", results => { predictions = results; });
}

function draw() {
  // 設定背景顏色為 e7c6ff
  background('#e7c6ff');

  // 1. 在整個畫布上方中間加上文字
  fill(0); // 文字顏色為黑色
  noStroke();
  textSize(32);
  textAlign(CENTER, TOP);
  text("414XXX183 王o崴", width / 2, 20);

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

  // 繪製手部關節連線
  if (predictions.length > 0) {
    noFill();
    stroke(0, 255, 0); // 設定線條顏色（例如綠色，較為明顯）
    strokeWeight(2);
    
    // 定義關節群組索引 (大拇指, 食指, 中指, 無名指, 小指)
    let fingerGroups = [[0, 4], [5, 8], [9, 12], [13, 16], [17, 20]];

    for (let hand of predictions) {
      for (let group of fingerGroups) {
        for (let i = group[0]; i < group[1]; i++) {
          let x1 = map(hand.landmarks[i][0], 0, capture.width, x, x + vW);
          let y1 = map(hand.landmarks[i][1], 0, capture.height, y, y + vH);
          let x2 = map(hand.landmarks[i + 1][0], 0, capture.width, x, x + vW);
          let y2 = map(hand.landmarks[i + 1][1], 0, capture.height, y, y + vH);
          line(x1, y1, x2, y2);
        }
      }

      // 2. 在關鍵點 4, 8, 12, 16, 20 產生水泡
      let tips = [4, 8, 12, 16, 20];
      for (let tipIndex of tips) {
        let tipX = map(hand.landmarks[tipIndex][0], 0, capture.width, x, x + vW);
        let tipY = map(hand.landmarks[tipIndex][1], 0, capture.height, y, y + vH);
        
        // 每隔幾格影格產生一個新水泡，避免過多
        if (frameCount % 3 === 0) {
          bubbles.push(new Bubble(tipX, tipY));
        }
      }
    }
  }

  // 3. 更新並繪製所有水泡
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    bubbles[i].display();
    // 如果水泡太淡（破掉）或超出螢幕，則移除
    if (bubbles[i].isFinished()) {
      bubbles.splice(i, 1);
    }
  }
}

function windowResized() {
  // 當視窗大小改變時，自動調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
}

// 水泡類別
class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(8, 16);
    this.speed = random(2, 5);
    this.alpha = 200; // 透明度，用來模擬破掉前的消失過程
  }
  update() {
    this.y -= this.speed; // 往上升
    this.x += random(-1, 1); // 輕微晃動
    this.alpha -= 3; // 隨時間變淡，模擬自動破掉
  }
  display() {
    stroke(255, this.alpha); // 白色邊框
    strokeWeight(1);
    noFill();
    circle(this.x, this.y, this.size);
  }
  isFinished() {
    return this.alpha <= 0;
  }
}