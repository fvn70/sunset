// ************ Sunset *************
// 15.02.2021
// Иммитация восхода и захода солнца над морем
// Запуск процесса по щелчку мыши на картинке
// Используемые приемы:
//	- рисование фигур прямоугольник и элипс;
//	- перемещение солнца изменением координаты Y 
//		в цикле таймера;
//	- использование двух таймеров для движения солнца
//		и изменения цвета неба;
//	- для отражения используется высота солнца над горизонтом
//		с учетом коэффициента искажения 0.5;
// 	- вычисляется диаметр отражения при пересечении линии горизонта;
//	- для затемнения неба изменяется канал Brightness в
//		цветовой модели HSB;
//	- отключается реакция на щелчки во время работы таймеров;
		
let sea_color = "#00A"
let sky_color = "#05F"
let sun_color = "#FC0"

let sunTimer;
let skyTimer;

// направление движения солнца
let upDown = -1; 
// Высота солнца и его отражения текущая, min и max
let sunY;
let sun2Y;
let sunMin;
let sunMax;
let sun2Min;
let sun2Max;

// высота горизонта
let hSky;
// коэффициент отражения
let k;
// диаметр солнца
let d0;

function setup() {
  let canvas = createCanvas(600, 400);
  noStroke();

  d0 = 100;
  
  hSky = height*2/3;
  sunY = height/3;
  sunMin = sunY;
  sunMax = height*2/3 + d0/2;
  sun2Y = height*5/6;
  sun2Min = height*2/3;
  sun2Max = sun2Y;
  k = 1/2;

  sunMove();
  canvas.mousePressed(startSunTimer);
  
}

function startSunTimer() {
  if (!sunTimer) {
    upDown = -upDown;
    sunMove();
    sunTimer = setInterval(sunMove, 50);
  }
}

function sunMove() {
  let sky;
  let sun;
  let sun2;
  let sea;

  fill(sky_color);
  sky = rect(0, 0, width, hSky);
  
  
  fill(sun_color);
  sun = ellipse(width/2, sunY, d0, d0);
 
  if (sunY <= sunMin || sunY >= sunMax) {
    if (sunY >= sunMax && !skyTimer) {
// Изменить цвет неба
        skyTimer = setInterval(skyColor, 50);
    }
    if (sunTimer > 0) {
      clearInterval(sunTimer); 
      sunTimer = false;
    }

  }
    

  sunY = sunY + upDown;
  sunY = min(sunY, sunMax);
  sunY = max(sunY, sunMin);
  
  fill(sea_color);
  sea = rect(0, hSky, width, height/3);
  
  let h = sunY - hSky;
  sun2Y = sunY - h * (1 + k);
  sun2Y = min(sun2Y, sun2Max);
  sun2Y = max(sun2Y, sun2Min);  

  let d2 = d0;
  if (h > 0) { // солнце на горизонте
    d2 = d0*sqrt(1-4*h*h/d0/d0)*upDown;
  }
  d2 += random(-3, 3); // дрожание
	
  fill(sun_color);   
  sun2 = ellipse(width/2, sun2Y, d2, d2*k);    
  
}

function skyColor() {
  // Цвет неба в HSB
  let ch = hue(sky_color);
  let cs = saturation(sky_color);
  let cbr = brightness(sky_color);

  colorMode(HSB);
  cbr = cbr - upDown;
  if (cbr < 50 || cbr > 100) {
    clearInterval(skyTimer); 
    skyTimer = false;
  }      
  sky_color = color(ch, cs, cbr);
	
  fill(sky_color);
  rect(0, 0, width, height*2/3);
}
  