/*==================================================
 KOŞ BETON KOŞ v2
 SCRIPT.JS
 BÖLÜM 1
==================================================*/


//=========================
// CANVAS
//=========================

const canvas =
document.getElementById("gameCanvas");

const ctx =
canvas.getContext("2d");


function resizeCanvas(){

    canvas.width =
    window.innerWidth;

    canvas.height =
    window.innerHeight;

    groundY =
    canvas.height - 150;

}


window.addEventListener(
"resize",
resizeCanvas
);



//=========================
// EKRANLAR
//=========================

const loading =
document.getElementById("loading");


const intro =
document.getElementById("intro");


const menu =
document.getElementById("menu");


const game =
document.getElementById("game");


const gameOver =
document.getElementById("gameOver");



//=========================
// BUTONLAR
//=========================


const playBtn =
document.getElementById("playBtn");


const restartBtn =
document.getElementById("restartBtn");


const menuBtn =
document.getElementById("menuBtn");



const achievementBtn =
document.getElementById("achievementBtn");


const scoreBtn =
document.getElementById("scoreBtn");


const helpBtn =
document.getElementById("helpBtn");



const backButtons =
document.querySelectorAll(".backButton");



//=========================
// HUD
//=========================


const scoreValue =
document.getElementById("scoreValue");


const distanceValue =
document.getElementById("distanceValue");


const noteValue =
document.getElementById("noteValue");


const recordValue =
document.getElementById("recordValue");


const lifeBar =
document.getElementById("lifeBar");



//=========================
// OYUN DEĞİŞKENLERİ
//=========================


let running=false;


let score=0;


let distance=0;


let notes=0;


let records=0;


let lives=3;


let gameSpeed=8;


let gravity=0.8;


let groundY=0;



//=========================
// OYUNCU
//=========================


const player={


x:150,


y:0,


width:90,


height:120,


velocityY:0,


jumpPower:-17,


doubleJumpPower:-25,


jumping:false,


doubleJump:false,


runFrame:0,


invincible:false

};





function resetPlayer(){


player.y =
groundY-player.height;


player.velocityY=0;


player.jumping=false;


player.doubleJump=false;


}






//=========================
// DİZİLER
//=========================


const obstacles=[];


const items=[];


const particles=[];



//=========================
// BAŞLANGIÇ
//=========================


resizeCanvas();


resetPlayer();



// Yükleme

setTimeout(()=>{


loading.classList.add("hidden");


},1500);



// Intro

setTimeout(()=>{


intro.classList.add("hidden");


menu.classList.remove("hidden");


},3000);



//=========================
// MENÜ
//=========================


playBtn.onclick=()=>{


menu.classList.add("hidden");


game.classList.remove("hidden");


running=true;


score=0;

distance=0;

notes=0;

records=0;

lives=3;


obstacles.length=0;

items.length=0;

particles.length=0;


resetPlayer();


gameLoop();


};




restartBtn.onclick=()=>{


gameOver.classList.add("hidden");


playBtn.click();


};




menuBtn.onclick=()=>{


running=false;


gameOver.classList.add("hidden");


game.classList.add("hidden");


menu.classList.remove("hidden");


};



// Alt menüler

achievementBtn.onclick=()=>{

menu.classList.add("hidden");

document.getElementById("achievementMenu")
.classList.remove("hidden");

};


scoreBtn.onclick=()=>{

menu.classList.add("hidden");

document.getElementById("highScoreMenu")
.classList.remove("hidden");

};


helpBtn.onclick=()=>{

menu.classList.add("hidden");

document.getElementById("helpMenu")
.classList.remove("hidden");

};



backButtons.forEach(btn=>{

btn.onclick=()=>{

document.querySelectorAll(".screen")
.forEach(e=>e.classList.add("hidden"));

menu.classList.remove("hidden");

};

});/*==================================================
 KOŞ BETON KOŞ v2
 SCRIPT.JS
 BÖLÜM 2
==================================================*/


//=========================
// KARAKTER ÇİZİMİ
//=========================


function drawPlayer(){


let x = player.x;
let y = player.y;


// Koşma animasyonu

let run =
Math.sin(player.runFrame)*5;



// Bacaklar

ctx.strokeStyle="#111";

ctx.lineWidth=8;


ctx.beginPath();

ctx.moveTo(
x+35,
y+85
);

ctx.lineTo(
x+25,
y+115+run
);


ctx.moveTo(
x+60,
y+85
);

ctx.lineTo(
x+75,
y+115-run
);

ctx.stroke();



// Ayakkabı

ctx.fillStyle="#ffffff";


ctx.fillRect(
x+10,
y+110+run,
25,
10
);


ctx.fillRect(
x+70,
y+110-run,
25,
10
);



// Siyah pantolon


ctx.fillStyle="#111";


ctx.fillRect(
x+25,
y+70,
45,
35
);



// Mavi kapüşonlu


ctx.fillStyle="#167dff";


ctx.beginPath();


ctx.roundRect(
x+15,
y+35,
65,
50,
12
);


ctx.fill();



// Kollar


ctx.strokeStyle="#167dff";

ctx.lineWidth=10;


ctx.beginPath();


ctx.moveTo(
x+20,
y+45
);


ctx.lineTo(
x,
y+70+run
);



ctx.moveTo(
x+75,
y+45
);


ctx.lineTo(
x+95,
y+65-run
);


ctx.stroke();



// Boyun


ctx.fillStyle="#f1c27d";


ctx.fillRect(
x+42,
y+25,
15,
15
);



// Yüz


ctx.beginPath();


ctx.arc(
x+50,
y+15,
22,
0,
Math.PI*2
);


ctx.fillStyle="#f1c27d";


ctx.fill();



// Mavi saç


ctx.beginPath();


ctx.arc(
x+50,
y+5,
23,
Math.PI,
Math.PI*2
);


ctx.fillStyle="#0099ff";


ctx.fill();



// Saç uçları


ctx.fillRect(
x+25,
y+5,
10,
15
);


ctx.fillRect(
x+65,
y+3,
10,
18
);



// Gözler


ctx.fillStyle="#000";


ctx.beginPath();


ctx.arc(
x+42,
y+15,
4,
0,
Math.PI*2
);


ctx.arc(
x+58,
y+15,
4,
0,
Math.PI*2
);


ctx.fill();



// Gülümseme


ctx.strokeStyle="#000";

ctx.lineWidth=2;


ctx.beginPath();


ctx.arc(
x+50,
y+23,
8,
0,
Math.PI
);


ctx.stroke();



// Animasyon ilerletme


player.runFrame+=0.25;



}




//=========================
// ZIPLAMA
//=========================


function jump(){


if(!running)return;



if(!player.jumping){


player.velocityY=
player.jumpPower;


player.jumping=true;


}

else if(!player.doubleJump){


player.velocityY=
player.doubleJumpPower;


player.doubleJump=true;


}


}




// Klavye

document.addEventListener(
"keydown",
e=>{


if(e.code==="Space" ||
e.code==="ArrowUp"){


jump();


}


});



// Telefon

canvas.addEventListener(
"touchstart",
()=>{


jump();


});





//=========================
// OYUNCU HAREKETİ
//=========================


function updatePlayer(){



player.velocityY+=gravity;



player.y+=player.velocityY;



if(player.y >= groundY-player.height){


player.y =
groundY-player.height;


player.velocityY=0;


player.jumping=false;


player.doubleJump=false;


}


}/*==================================================
 KOŞ BETON KOŞ v2
 SCRIPT.JS
 BÖLÜM 3
==================================================*/


//=========================
// ÇARPIŞMA
//=========================

function collision(a,b){

return (

a.x < b.x + b.width &&

a.x + a.width > b.x &&

a.y < b.y + b.height &&

a.y + a.height > b.y

);

}



//=========================
// ENGEL SİSTEMİ
//=========================


let obstacleTimer=0;


function createObstacle(){


let types=[

"rock",
"box",
"spike"

];


let type=
types[
Math.floor(Math.random()*types.length)
];



let obstacle={


type:type,


x:canvas.width,


y:groundY-60,


width:60,


height:60


};




if(type==="spike"){


obstacle.height=50;


obstacle.y=groundY-50;


}




if(type==="box"){


obstacle.width=70;


obstacle.height=70;


obstacle.y=groundY-70;


}



obstacles.push(obstacle);


}





function updateObstacles(){



for(let i=obstacles.length-1;i>=0;i--){


let o=obstacles[i];


o.x-=gameSpeed;



if(collision(player,o)){


if(!player.invincible){


lives--;


player.invincible=true;



setTimeout(()=>{


player.invincible=false;


},1200);



}



if(lives<=0){


endGame();


}



obstacles.splice(i,1);



}



if(o.x<-100){


obstacles.splice(i,1);


}



}



}





function drawObstacles(){


obstacles.forEach(o=>{


if(o.type==="rock"){


ctx.fillStyle="#555";


ctx.beginPath();


ctx.arc(

o.x+30,

o.y+30,

30,

0,

Math.PI*2

);


ctx.fill();


}



if(o.type==="box"){


ctx.fillStyle="#8b4513";


ctx.fillRect(

o.x,

o.y,

o.width,

o.height

);


}




if(o.type==="spike"){


ctx.fillStyle="#ddd";


ctx.beginPath();


ctx.moveTo(

o.x,

o.y+o.height

);


ctx.lineTo(

o.x+o.width/2,

o.y

);


ctx.lineTo(

o.x+o.width,

o.y+o.height

);


ctx.fill();


}



});



}




//=========================
// TOPLANABİLİR NESNELER
//=========================



let itemTimer=0;



function createItem(){


let types=[

"note",
"record",
"banana",
"heart",
"star"

];



let type=

types[

Math.floor(Math.random()*types.length)

];



items.push({


type:type,


x:canvas.width,


y:
groundY-100-Math.random()*150,


width:40,


height:40


});



}





function updateItems(){



for(let i=items.length-1;i>=0;i--){


let item=items[i];


item.x-=gameSpeed;



if(collision(player,item)){



switch(item.type){



case "note":

notes++;

score+=10;

break;



case "record":

records++;

score+=100;

break;



case "banana":


player.jumpPower=-25;


setTimeout(()=>{


player.jumpPower=-17;


},5000);


break;



case "heart":


if(lives<3){

lives++;

}


break;



case "star":


player.invincible=true;


setTimeout(()=>{


player.invincible=false;


},5000);


break;



}



items.splice(i,1);



}



if(item.x<-100){


items.splice(i,1);


}



}



}





function drawItems(){



ctx.font="35px Arial";



items.forEach(item=>{



let emoji="";



if(item.type==="note")
emoji="🎵";


if(item.type==="record")
emoji="📀";


if(item.type==="banana")
emoji="🍌";


if(item.type==="heart")
emoji="💙";


if(item.type==="star")
emoji="⭐";



ctx.fillText(

emoji,

item.x,

item.y

);



});



}/*==================================================
 KOŞ BETON KOŞ v2
 SCRIPT.JS
 BÖLÜM 4
==================================================*/


//=========================
// ARKA PLAN
//=========================


let cloudX=0;


function drawBackground(){


// Gökyüzü

let sky =
ctx.createLinearGradient(
0,
0,
0,
canvas.height
);


sky.addColorStop(
0,
"#63d8ff"
);


sky.addColorStop(
1,
"#e9fbff"
);



ctx.fillStyle=sky;


ctx.fillRect(
0,
0,
canvas.width,
canvas.height
);



// Dağlar


ctx.fillStyle="#78a87a";


ctx.beginPath();


ctx.moveTo(
0,
groundY
);


ctx.lineTo(
150,
groundY-180
);


ctx.lineTo(
300,
groundY
);


ctx.fill();



ctx.beginPath();


ctx.moveTo(
250,
groundY
);


ctx.lineTo(
450,
groundY-220
);


ctx.lineTo(
650,
groundY
);


ctx.fill();




// Bulutlar


ctx.fillStyle="white";


for(let i=0;i<5;i++){


let x =
(i*250)-cloudX;


ctx.beginPath();


ctx.arc(
x,
120,
35,
0,
Math.PI*2
);


ctx.arc(
x+40,
120,
45,
0,
Math.PI*2
);


ctx.arc(
x+80,
120,
35,
0,
Math.PI*2
);


ctx.fill();


}



cloudX+=0.5;



if(cloudX>250){

cloudX=0;

}



// Zemin


ctx.fillStyle="#4caf50";


ctx.fillRect(

0,

groundY,

canvas.width,

canvas.height-groundY

);



// Yol


ctx.fillStyle="#555";


ctx.fillRect(

0,

groundY+40,

canvas.width,

80

);



}


//=========================
// PARÇACIK
//=========================


function createParticle(x,y){


for(let i=0;i<10;i++){


particles.push({


x:x,


y:y,


size:Math.random()*8+3,


speedX:
Math.random()*6-3,


speedY:
Math.random()*-5,


life:50


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


particles.splice(i,1);


}


}



}



function drawParticles(){


ctx.fillStyle="#fff";


particles.forEach(p=>{


ctx.fillRect(

p.x,

p.y,

p.size,

p.size

);


});


}



//=========================
// HUD
//=========================


function updateHUD(){


scoreValue.innerHTML=
Math.floor(score);


distanceValue.innerHTML=
Math.floor(distance);


noteValue.innerHTML=
notes;


recordValue.innerHTML=
records;



lifeBar.innerHTML=
"💙".repeat(lives);



}




//=========================
// SKOR
//=========================


function updateScore(){


distance+=gameSpeed/10;


score+=1;



if(distance%1000<1){


gameSpeed+=0.5;


}



}




//=========================
// GAME OVER
//=========================


function endGame(){


running=false;



game.classList.add("hidden");


gameOver.classList.remove("hidden");



document.getElementById("finalScore")
.innerHTML=
Math.floor(score);



document.getElementById("finalDistance")
.innerHTML=
Math.floor(distance)+" m";



saveHighScore();



}




//=========================
// REKOR
//=========================


function saveHighScore(){


let best =
localStorage.getItem(
"betonBest"
)||0;



if(score>best){


localStorage.setItem(
"betonBest",
Math.floor(score)
);


}



}



function loadHighScore(){


let best =
localStorage.getItem(
"betonBest"
)||0;



document.getElementById(
"bestScore"
).innerHTML=best;



}


loadHighScore();/*==================================================
 KOŞ BETON KOŞ v2
 SCRIPT.JS
 BÖLÜM 5 - SON
==================================================*/


//=========================
// BAŞARIM SİSTEMİ
//=========================


const achievements=[

{
name:"İlk Koşu",
check:()=>distance>=100
},

{
name:"Nota Toplayıcı",
check:()=>notes>=50
},

{
name:"Plak Ustası",
check:()=>records>=10
},

{
name:"Uzun Mesafe",
check:()=>distance>=5000
},

{
name:"Yıldız Gücü",
check:()=>player.invincible
}

];



let unlockedAchievements =
JSON.parse(
localStorage.getItem("achievements")
) || [];



function checkAchievements(){


achievements.forEach(a=>{


if(
a.check()
&&
!unlockedAchievements.includes(a.name)
){


unlockedAchievements.push(a.name);



}


});



localStorage.setItem(
"achievements",
JSON.stringify(unlockedAchievements)
);



}





//=========================
// BAŞARIM GÖSTER
//=========================


function showAchievements(){


const list =
document.getElementById(
"achievementList"
);



list.innerHTML="";



unlockedAchievements.forEach(a=>{


let p =
document.createElement("p");


p.innerHTML=
"🏆 "+a;


list.appendChild(p);



});


}



achievementBtn.onclick=()=>{


menu.classList.add("hidden");


document
.getElementById("achievementMenu")
.classList.remove("hidden");


showAchievements();


};






//=========================
// ANA OYUN DÖNGÜSÜ
//=========================


function gameLoop(){


if(!running)
return;



ctx.clearRect(

0,

0,

canvas.width,

canvas.height

);




// Güncelleme


updateScore();


updatePlayer();


updateObstacles();


updateItems();


updateParticles();





// Oluşturma


obstacleTimer--;


itemTimer--;



if(obstacleTimer<=0){


createObstacle();


obstacleTimer =
Math.random()*80+80;


}



if(itemTimer<=0){


createItem();


itemTimer =
Math.random()*120+80;


}





// Çizimler


drawBackground();


drawObstacles();


drawItems();


drawParticles();


drawPlayer();



updateHUD();


checkAchievements();




requestAnimationFrame(
gameLoop
);



}






//=========================
// DURAKLATMA
//=========================


let paused=false;



document.addEventListener(
"keydown",
e=>{


if(e.key==="p"){


paused=!paused;


if(!paused){

gameLoop();

}


}



});





//=========================
// BAŞLATMA DÜZENİ
//=========================


window.addEventListener(
"load",
()=>{


resizeCanvas();


loadHighScore();



}
);





console.log(
"KOŞ BETON KOŞ v2 hazır!"
);
