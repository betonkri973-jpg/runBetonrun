/*==================================================
 KOŞ BETON KOŞ
 Script.js
 Bölüm 1
==================================================*/

// Canvas

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// Loading ekranını kapat

const loading = document.getElementById("loading");

if(loading){

    setTimeout(()=>{

        loading.style.display = "none";

    },1000);

}
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    groundY = canvas.height - 180;
}

window.addEventListener("resize", resizeCanvas);

let groundY = 0;
resizeCanvas();


// ==============================
// Yükleme Ekranı
// ==============================

const loading = document.getElementById("loading");

window.addEventListener("load",()=>{

    setTimeout(()=>{

        if(loading){
            loading.classList.add("hidden");
        }

    },1000);

});

// ==============================
// Sayfalar
// ==============================

const intro = document.getElementById("intro");
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const gameOverScreen = document.getElementById("gameOver");

const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");

const achievementBtn = document.getElementById("achievementBtn");
const scoreBtn = document.getElementById("scoreBtn");
const helpBtn = document.getElementById("helpBtn");

const achievementMenu = document.getElementById("achievementMenu");
const highScoreMenu = document.getElementById("highScoreMenu");
const helpMenu = document.getElementById("helpMenu");

const backButtons = document.querySelectorAll(".backButton");

// ==============================
// Ses
// ==============================

const music = document.getElementById("bgMusic");

// ==============================
// Karakter
// ==============================

const playerImage = new Image();
playerImage.src = "karakter.png";

// ==============================
// Oyun Değişkenleri
// ==============================

let running = false;

let score = 0;
let distance = 0;

let notes = 0;
let records = 0;

let lives = 3;

let gameSpeed = 8;

let gravity = 0.85;

// Fever

let feverMode = false;
let feverTimer = 0;

// Legendary

let legendaryMode = false;
let legendaryTimer = 0;

// Boss

let bossMode = false;
let bossDistance = 5000;

// ==============================
// Oyuncu
// ==============================

const player = {

x:150,

y:0,

width:120,

height:120,

velocityY:0,

jumpPower:-18,

doubleJumpPower:-26,

jumping:false,

doubleJump:false,

banana:false,

shield:false,

invincible:false

};

player.y = groundY;

// ==============================
// Diziler
// ==============================

const obstacles = [];
const collectibles = [];
const particles = [];

// ==============================
// Dokunma
// ==============================

let lastTap = 0;

// ==============================
// Rastgele
// ==============================

function random(min,max){

return Math.random()*(max-min)+min;

}

// ==============================
// Çarpışma
// ==============================

function collide(a,b){

return(

a.x < b.x + b.width &&
a.x + a.width > b.x &&
a.y < b.y + b.height &&
a.y + a.height > b.y

);

}

// ==============================
// Açılış
// ==============================

setTimeout(()=>{

intro.classList.add("hidden");
menu.classList.remove("hidden");

},3000);// ==================================================
// MENÜ BUTONLARI
// ==================================================

playBtn.onclick = () => {

    menu.classList.add("hidden");
    game.classList.remove("hidden");

    running = true;

    score = 0;
    distance = 0;
    lives = 3;

    obstacles.length = 0;
    collectibles.length = 0;
    particles.length = 0;

    player.y = groundY;
    player.velocityY = 0;

    music.play().catch(()=>{});

    gameLoop();

};


// Yeniden başlat

restartBtn.onclick = () => {

    gameOverScreen.classList.add("hidden");

    playBtn.click();

};


// Menüye dön

menuBtn.onclick = () => {

    gameOverScreen.classList.add("hidden");

    game.classList.add("hidden");
    menu.classList.remove("hidden");

    running = false;

};


// ==================================================
// ALT MENÜLER
// ==================================================

achievementBtn.onclick = ()=>{

    menu.classList.add("hidden");
    achievementMenu.classList.remove("hidden");

};


scoreBtn.onclick = ()=>{

    menu.classList.add("hidden");
    highScoreMenu.classList.remove("hidden");

};


helpBtn.onclick = ()=>{

    menu.classList.add("hidden");
    helpMenu.classList.remove("hidden");

};


backButtons.forEach(btn=>{

btn.onclick=()=>{

achievementMenu.classList.add("hidden");
highScoreMenu.classList.add("hidden");
helpMenu.classList.add("hidden");

menu.classList.remove("hidden");

};

});


// ==================================================
// ZIPLAMA
// ==================================================

function jump(){

if(!running) return;


if(!player.jumping){

player.velocityY = player.jumpPower;

player.jumping=true;

}

else if(!player.doubleJump){

player.velocityY = player.doubleJumpPower;

player.doubleJump=true;

}

}


document.addEventListener("keydown",e=>{

if(e.code==="Space"){

jump();

}

});


// Mobil dokunma

canvas.addEventListener("touchstart",()=>{


let now = Date.now();


if(now-lastTap < 300){

jump();

}

else{

jump();

}


lastTap = now;


});


// ==================================================
// OYUNCU HAREKET
// ==================================================

function updatePlayer(){


player.velocityY += gravity;

player.y += player.velocityY;



if(player.y >= groundY-player.height){

player.y = groundY-player.height;

player.velocityY=0;

player.jumping=false;

player.doubleJump=false;

}


}


// ==================================================
// ENGEL OLUŞTURMA
// ==================================================

let obstacleTimer = 0;


function createObstacle(){


let obstacle={

x:canvas.width,

y:groundY-70,

width:70,

height:70,

type:"rock"

};


obstacles.push(obstacle);


}


// ==================================================
// NOTA OLUŞTURMA
// ==================================================

let noteTimer=0;


function createNote(){


let note={

x:canvas.width,

y:random(groundY-250,groundY-100),

width:45,

height:45

};


collectibles.push(note);


      }// ==================================================
// ENGELLERİ HAREKET ETTİRME
// ==================================================

function updateObstacles(){

for(let i=obstacles.length-1;i>=0;i--){

let obs = obstacles[i];

obs.x -= gameSpeed;


// Çarpışma

if(collide(player,obs)){


if(!player.invincible && !player.shield){


lives--;

createParticles(player.x,player.y);


obs.x = -200;



if(lives <=0){

gameOver();

}


}

else if(player.shield){

player.shield=false;

obs.x=-200;

}


}



// Ekrandan çıkınca sil

if(obs.x < -100){

obstacles.splice(i,1);

}


}


}



// ==================================================
// NOTALARI HAREKET ETTİRME
// ==================================================

function updateCollectibles(){


for(let i=collectibles.length-1;i>=0;i--){


let note = collectibles[i];


note.x -= gameSpeed;



if(collide(player,note)){


notes++;

score += 50;


createParticles(note.x,note.y);


collectibles.splice(i,1);



}


// Ekrandan çıkınca sil

if(note.x < -100){

collectibles.splice(i,1);

}


}


}



// ==================================================
// MESAFE VE SKOR
// ==================================================

function updateScore(){


distance += gameSpeed/10;


score += 1;



// Fever açılması

if(notes >=20 && !feverMode){


feverMode=true;

feverTimer=600;


gameSpeed+=5;


}



if(feverMode){

feverTimer--;


if(feverTimer<=0){

feverMode=false;

gameSpeed-=5;

}


}


// Legendary

if(score>=10000 && !legendaryMode){

legendaryMode=true;

legendaryTimer=800;

gameSpeed+=8;

}


if(legendaryMode){

legendaryTimer--;


if(legendaryTimer<=0){

legendaryMode=false;

gameSpeed-=8;

}


}


// Boss zamanı

if(distance>=bossDistance){

bossMode=true;

}


}



// ==================================================
// PARÇACIK EFEKTİ
// ==================================================

function createParticles(x,y){


for(let i=0;i<15;i++){


particles.push({

x:x,

y:y,

size:random(5,12),

speedX:random(-4,4),

speedY:random(-5,2),

life:60

});


}


}



function updateParticles(){


for(let i=particles.length-1;i>=0;i--){


let p=particles[i];


p.x+=p.speedX;

p.y+=p.speedY;

p.speedY+=0.2;

p.life--;


if(p.life<=0){

particles.splice(i,1);/*==================================================
 SCRIPT.JS
 Bölüm 4
 Çizimler + Boss + Game Loop
==================================================*/


// ==================================================
// ARKA PLAN ÇİZİMİ
// ==================================================

function drawBackground(){


ctx.fillStyle="#111";

ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);


// Zemin

ctx.fillStyle="#333";

ctx.fillRect(
0,
groundY,
canvas.width,
canvas.height-groundY
);


// Yol çizgileri

ctx.fillStyle="#777";


for(let i=0;i<canvas.width;i+=100){

ctx.fillRect(
i,
groundY+50,
50,
10
);

}


}



// ==================================================
// KARAKTER ÇİZİMİ
// ==================================================

function drawPlayer(){


if(playerImage.complete){


ctx.drawImage(

playerImage,

player.x,

player.y,

player.width,

player.height

);


}

else{


ctx.fillStyle="white";


ctx.fillRect(

player.x,

player.y,

player.width,

player.height

);


}



// Fever efekti

if(feverMode){


ctx.strokeStyle="#ffcc00";

ctx.lineWidth=8;


ctx.strokeRect(

player.x-10,

player.y-10,

player.width+20,

player.height+20

);


}


// Legendary efekt

if(legendaryMode){


ctx.strokeStyle="#ff00ff";

ctx.lineWidth=12;


ctx.strokeRect(

player.x-20,

player.y-20,

player.width+40,

player.height+40

);


}


}



// ==================================================
// ENGEL ÇİZİMİ
// ==================================================

function drawObstacles(){


obstacles.forEach(obs=>{


ctx.fillStyle="#552200";


ctx.beginPath();

ctx.arc(

obs.x+35,

obs.y+35,

35,

0,

Math.PI*2

);

ctx.fill();



});


}



// ==================================================
// NOTA ÇİZİMİ
// ==================================================

function drawCollectibles(){


collectibles.forEach(note=>{


ctx.fillStyle="#00ffff";


ctx.beginPath();


ctx.arc(

note.x+20,

note.y+20,

20,

0,

Math.PI*2

);


ctx.fill();



ctx.fillRect(

note.x+35,

note.y,

5,

25

);



});


}



// ==================================================
// PARÇACIK ÇİZİMİ
// ==================================================

function drawParticles(){


particles.forEach(p=>{


ctx.fillStyle="white";


ctx.fillRect(

p.x,

p.y,

p.size,

p.size

);



});


}



// ==================================================
// BOSS SİSTEMİ
// ==================================================

const boss={


x:0,

y:0,

width:180,

height:180,

active:false,

health:100


};



function startBoss(){


boss.active=true;

boss.x=canvas.width-250;

boss.y=groundY-180;


boss.health=100;


}



function updateBoss(){


if(!bossMode)return;


if(!boss.active){

startBoss();

}



boss.x-=2;



if(boss.x<canvas.width-350){

boss.x=canvas.width-350;

}



}



// ==================================================
// BOSS ÇİZİM
// ==================================================

function drawBoss(){


if(!boss.active)return;


ctx.fillStyle="#990000";


ctx.beginPath();


ctx.arc(

boss.x+90,

boss.y+90,

90,

0,

Math.PI*2

);


ctx.fill();



ctx.fillStyle="white";


ctx.font="30px Arial";


ctx.fillText(

"BOSS",

boss.x+45,

boss.y-20

);


}



// ==================================================
// BİLGİLER
// ==================================================

function drawUI(){


ctx.fillStyle="white";

ctx.font="28px Arial";


ctx.fillText(

"Skor: "+score,

30,

50

);



ctx.fillText(

"🎵 "+notes,

30,

90

);



ctx.fillText(

"❤️ "+lives,

30,

130

);



if(feverMode){

ctx.fillText(

"FEVER!",

canvas.width/2-60,

60

);

}



if(legendaryMode){

ctx.fillText(

"LEGENDARY!",

canvas.width/2-100,

100

);

}



}



// ==================================================
// OYUN DÖNGÜSÜ
// ==================================================

function gameLoop(){


if(!running)return;



ctx.clearRect(

0,

0,

canvas.width,

canvas.height

);



updatePlayer();


obstacleTimer--;

noteTimer--;


if(obstacleTimer<=0){

createObstacle();

obstacleTimer=random(80,150);

}



if(noteTimer<=0){

createNote();

noteTimer=random(60,130);

}



updateObstacles();

updateCollectibles();

updateParticles();

updateScore();


if(bossMode){

updateBoss();

}



drawBackground();

drawObstacles();

drawCollectibles();

drawParticles();

drawPlayer();

drawBoss();

drawUI();



requestAnimationFrame(gameLoop);


  }

}


}


  }/*==================================================
 SCRIPT.JS
 Bölüm 5
 Game Over + Kayıt + Güçler + Son
==================================================*/


// ==================================================
// GAME OVER
// ==================================================

function gameOver(){


running=false;


music.pause();


gameOverScreen.classList.remove("hidden");



const finalScore =
document.getElementById("finalScore");


if(finalScore){

finalScore.innerHTML =
"Skorun: " + score;

}



saveScore();



}



// ==================================================
// SKOR KAYDETME
// ==================================================

function saveScore(){


let highScore =
localStorage.getItem("betonHighScore") || 0;



if(score > highScore){


localStorage.setItem(

"betonHighScore",

score

);


}



}



// ==================================================
// YÜKSEK SKOR GÖSTERME
// ==================================================

function showHighScore(){


let highScore =
localStorage.getItem("betonHighScore") || 0;



const high =
document.getElementById("highScore");


if(high){

high.innerHTML =
"En yüksek skor: " + highScore;

}


}


showHighScore();



// ==================================================
// GÜÇLER
// ==================================================


// Muz gücü

function activateBanana(){


player.banana=true;


gameSpeed+=10;


setTimeout(()=>{


player.banana=false;


gameSpeed-=10;



},8000);



}



// Kalkan

function activateShield(){


player.shield=true;



setTimeout(()=>{


player.shield=false;



},10000);



}



// Yenilmezlik

function activateInvincible(){


player.invincible=true;



setTimeout(()=>{


player.invincible=false;



},5000);



}



// ==================================================
// BAŞARIM SİSTEMİ
// ==================================================

const achievements=[


{

name:"İlk Koşu",

condition:()=>score>=100

},


{

name:"Nota Ustası",

condition:()=>notes>=50

},


{

name:"Beton Efsanesi",

condition:()=>score>=10000

},


{

name:"Boss Avcısı",

condition:()=>bossMode

}


];



let unlocked=[];



function checkAchievements(){


achievements.forEach(item=>{


if(

item.condition()

&&

!unlocked.includes(item.name)

){


unlocked.push(item.name);



}

});


localStorage.setItem(

"achievements",

JSON.stringify(unlocked)

);



}



setInterval(()=>{


if(running){

checkAchievements();

}


},1000);



// ==================================================
// BAŞARIMLARI GÖSTER
// ==================================================

function loadAchievements(){


let saved =

localStorage.getItem("achievements");



if(saved){

unlocked =
JSON.parse(saved);


}



const list =
document.getElementById("achievementList");



if(list){


list.innerHTML="";


unlocked.forEach(a=>{


let li =
document.createElement("li");


li.innerHTML="🏆 "+a;


list.appendChild(li);



});


}



}



loadAchievements();



// ==================================================
// KLAVYE KONTROLLERİ
// ==================================================

document.addEventListener(
"keydown",
(e)=>{


if(e.key==="ArrowUp"){

jump();

}



if(e.key==="b"){

activateBanana();

}



if(e.key==="s"){

activateShield();

}



});



// ==================================================
// OYUN BAŞLANGICI
// ==================================================

window.onload=()=>{


resizeCanvas();


};



console.log(
"KOŞ BETON KOŞ hazır!"
);
