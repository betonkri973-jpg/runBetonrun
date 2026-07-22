/*==================================================
 KOŞ BETON KOŞ
 SCRIPT.JS
 Bölüm 1
==================================================*/

//=========================
// CANVAS
//=========================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas(){

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    groundY = canvas.height - 170;

}

window.addEventListener("resize",resizeCanvas);

//=========================
// SAYFALAR
//=========================

const loading = document.getElementById("loading");
const intro = document.getElementById("intro");

const menu = document.getElementById("menu");
const game = document.getElementById("game");
const gameOver = document.getElementById("gameOver");

const achievementMenu =
document.getElementById("achievementMenu");

const highScoreMenu =
document.getElementById("highScoreMenu");

const helpMenu =
document.getElementById("helpMenu");

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
// SES
//=========================

const bgMusic =
document.getElementById("bgMusic");

//=========================
// KARAKTER RESMİ
//=========================

const playerImage =
document.getElementById("playerImage");

//=========================
// OYUN
//=========================

let running = false;

let score = 0;
let distance = 0;

let notes = 0;
let records = 0;

let lives = 3;

let gravity = 0.9;

let gameSpeed = 8;

let groundY = 0;

//=========================
// OYUNCU
//=========================

const player = {

    x:150,

    y:0,

    width:110,

    height:110,

    velocityY:0,

    jumpPower:-18,

    doubleJumpPower:-25,

    jumping:false,

    doubleJump:false,

    invincible:false,

    superJump:false

};

function resetPlayer(){

    player.x = 150;

    player.y = groundY-player.height;

    player.velocityY = 0;

    player.jumping = false;

    player.doubleJump = false;

}

//=========================
// DİZİLER
//=========================

const obstacles = [];

const items = [];

const particles = [];

//=========================
// BAŞLANGIÇ
//=========================

window.addEventListener("load",()=>{

    resizeCanvas();

    resetPlayer();

});/*==================================================
 KOŞ BETON KOŞ
 SCRIPT.JS
 Bölüm 2
==================================================*/

//=========================
// MENÜLER
//=========================

setTimeout(()=>{

    loading.classList.add("hidden");

},1000);

setTimeout(()=>{

    intro.classList.add("hidden");

    menu.classList.remove("hidden");

},3000);

//=========================
// BAŞLAT
//=========================

playBtn.onclick = ()=>{

    menu.classList.add("hidden");

    game.classList.remove("hidden");

    running = true;

    score = 0;
    distance = 0;
    notes = 0;
    records = 0;
    lives = 3;

    obstacles.length = 0;
    items.length = 0;
    particles.length = 0;

    resetPlayer();

    bgMusic.currentTime = 0;

    bgMusic.play().catch(()=>{});

    gameLoop();

};

//=========================
// YENİDEN BAŞLAT
//=========================

restartBtn.onclick = ()=>{

    gameOver.classList.add("hidden");

    playBtn.click();

};

//=========================
// MENÜYE DÖN
//=========================

menuBtn.onclick = ()=>{

    running = false;

    bgMusic.pause();

    gameOver.classList.add("hidden");

    game.classList.add("hidden");

    menu.classList.remove("hidden");

};

//=========================
// ALT MENÜLER
//=========================

achievementBtn.onclick=()=>{

    menu.classList.add("hidden");

    achievementMenu.classList.remove("hidden");

};

scoreBtn.onclick=()=>{

    menu.classList.add("hidden");

    highScoreMenu.classList.remove("hidden");

};

helpBtn.onclick=()=>{

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

//=========================
// ZIPLAMA
//=========================

function jump(){

    if(!running) return;

    if(!player.jumping){

        player.velocityY = player.jumpPower;

        player.jumping = true;

        return;

    }

    if(!player.doubleJump){

        player.velocityY = player.doubleJumpPower;

        player.doubleJump = true;

    }

}

//=========================
// KLAVYE
//=========================

document.addEventListener("keydown",(e)=>{

    if(e.code==="Space"){

        jump();

    }

    if(e.code==="ArrowUp"){

        jump();

    }

});

//=========================
// MOBİL
//=========================

document.addEventListener("touchstart",()=>{

    jump();

});

//=========================
// OYUNCU GÜNCELLE
//=========================

function updatePlayer(){

    player.velocityY += gravity;

    player.y += player.velocityY;

    if(player.y >= groundY-player.height){

        player.y = groundY-player.height;

        player.velocityY = 0;

        player.jumping = false;

        player.doubleJump = false;

    }

}/*==================================================
 KOŞ BETON KOŞ
 SCRIPT.JS
 Bölüm 3
==================================================*/

//=========================
// ÇARPIŞMA
//=========================

function collide(a,b){

    return(

        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y

    );

}

//=========================
// ZAMANLAYICILAR
//=========================

let obstacleTimer = 0;
let itemTimer = 0;

//=========================
// ENGEL OLUŞTUR
//=========================

function createObstacle(){

    const types=["rock","box","spike"];

    const type=types[
        Math.floor(Math.random()*types.length)
    ];

    let obstacle={

        type:type,

        x:canvas.width,

        width:70,

        height:70,

        y:groundY-70

    };

    if(type==="box"){

        obstacle.width=80;
        obstacle.height=80;
        obstacle.y=groundY-80;

    }

    if(type==="spike"){

        obstacle.width=60;
        obstacle.height=60;
        obstacle.y=groundY-60;

    }

    obstacles.push(obstacle);

}

//=========================
// EŞYA OLUŞTUR
//=========================

function createItem(){

    const list=[
        "note",
        "record",
        "banana",
        "heart",
        "star"
    ];

    const type=list[
        Math.floor(Math.random()*list.length)
    ];

    items.push({

        type:type,

        x:canvas.width,

        y:groundY-120-Math.random()*170,

        width:45,

        height:45

    });

}

//=========================
// ENGELLER
//=========================

function updateObstacles(){

    for(let i=obstacles.length-1;i>=0;i--){

        const obs=obstacles[i];

        obs.x-=gameSpeed;

        if(collide(player,obs)){

            if(!player.invincible){

                lives--;

                player.invincible=true;

                setTimeout(()=>{

                    player.invincible=false;

                },1000);

                particles.push({

                    x:player.x,

                    y:player.y,

                    life:20

                });

            }

            obstacles.splice(i,1);

            if(lives<=0){

                gameOverGame();

            }

            continue;

        }

        if(obs.x<-100){

            obstacles.splice(i,1);

        }

    }

}

//=========================
// EŞYALAR
//=========================

function updateItems(){

    for(let i=items.length-1;i>=0;i--){

        const item=items[i];

        item.x-=gameSpeed;

        if(collide(player,item)){

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

                    player.superJump=true;

                    player.jumpPower=-24;

                    player.doubleJumpPower=-32;

                    setTimeout(()=>{

                        player.superJump=false;

                        player.jumpPower=-18;

                        player.doubleJumpPower=-25;

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

            particles.push({

                x:item.x,

                y:item.y,

                life:20

            });

            items.splice(i,1);

            continue;

        }

        if(item.x<-100){

            items.splice(i,1);

        }

    }/*==================================================
 KOŞ BETON KOŞ
 SCRIPT.JS
 Bölüm 4
==================================================*/

//=========================
// ARKA PLAN
//=========================

function drawBackground(){

    // Gökyüzü
    ctx.fillStyle="#7dd3ff";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Zemin
    ctx.fillStyle="#3f9b3f";
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
        70
    );

}

//=========================
// OYUNCU
//=========================

function drawPlayer(){

    if(playerImage.complete){

        ctx.drawImage(

            playerImage,

            player.x,

            player.y,

            player.width,

            player.height

        );

    }else{

        ctx.fillStyle="white";

        ctx.fillRect(

            player.x,

            player.y,

            player.width,

            player.height

        );

    }

    // Yenilmezlik efekti

    if(player.invincible){

        ctx.strokeStyle="yellow";
        ctx.lineWidth=4;

        ctx.strokeRect(

            player.x-4,
            player.y-4,
            player.width+8,
            player.height+8

        );

    }

}

//=========================
// ENGELLER
//=========================

function drawObstacles(){

    obstacles.forEach(obs=>{

        if(obs.type==="rock"){

            ctx.fillStyle="#6b6b6b";

            ctx.beginPath();

            ctx.arc(
                obs.x+35,
                obs.y+35,
                35,
                0,
                Math.PI*2
            );

            ctx.fill();

        }

        if(obs.type==="box"){

            ctx.fillStyle="#8b5a2b";

            ctx.fillRect(
                obs.x,
                obs.y,
                obs.width,
                obs.height
            );

        }

        if(obs.type==="spike"){

            ctx.fillStyle="#cccccc";

            ctx.beginPath();

            ctx.moveTo(obs.x,obs.y+obs.height);

            ctx.lineTo(obs.x+obs.width/2,obs.y);

            ctx.lineTo(obs.x+obs.width,obs.y+obs.height);

            ctx.closePath();

            ctx.fill();

        }

    });

}

//=========================
// TOPLANABİLİRLER
//=========================

function drawItems(){

    ctx.font="34px Arial";

    items.forEach(item=>{

        switch(item.type){

            case "note":
                ctx.fillText("🎵",item.x,item.y);
                break;

            case "record":
                ctx.fillText("📀",item.x,item.y);
                break;

            case "banana":
                ctx.fillText("🍌",item.x,item.y);
                break;

            case "heart":
                ctx.fillText("💙",item.x,item.y);
                break;

            case "star":
                ctx.fillText("⭐",item.x,item.y);
                break;

        }

    });

}

//=========================
// PARÇACIKLAR
//=========================

function updateParticles(){

    for(let i=particles.length-1;i>=0;i--){

        particles[i].life--;

        if(particles[i].life<=0){

            particles.splice(i,1);

        }

    }

}

function drawParticles(){

    particles.forEach(p=>{

        ctx.fillStyle="white";

        ctx.beginPath();

        ctx.arc(

            p.x,

            p.y,

            6,

            0,

            Math.PI*2

        );

        ctx.fill();

    });

}

//=========================
// HUD
//=========================

function updateHUD(){

    scoreValue.textContent=score;

    distanceValue.textContent=
    Math.floor(distance);

    noteValue.textContent=notes;

    recordValue.textContent=records;

    lifeBar.textContent=
    "💙".repeat(lives);

}

//=========================
// GAME OVER
//=========================

function gameOverGame(){

    running=false;

    bgMusic.pause();

    gameOver.classList.remove("hidden");

    document.getElementById("finalScore").textContent=score;

    document.getElementById("finalDistance").textContent=
    Math.floor(distance)+" m";

    let best=
    Number(localStorage.getItem("bestScore"))||0;

    if(score>best){

        localStorage.setItem(
            "bestScore",
            score
        );

    }

                       }/*==================================================
 KOŞ BETON KOŞ
 SCRIPT.JS
 Bölüm 5
==================================================*/

//=========================
// OYUN DÖNGÜSÜ
//=========================

function gameLoop(){

    if(!running) return;

    requestAnimationFrame(gameLoop);

    // Temizle
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Fizik

    updatePlayer();

    updateParticles();

    // Sayaçlar

    obstacleTimer--;

    itemTimer--;

    // Engel üret

    if(obstacleTimer<=0){

        createObstacle();

        obstacleTimer=
        Math.floor(Math.random()*70)+70;

    }

    // Eşya üret

    if(itemTimer<=0){

        createItem();

        itemTimer=
        Math.floor(Math.random()*90)+90;

    }

    // Güncelle

    updateObstacles();

    updateItems();

    // Mesafe

    distance+=gameSpeed/12;

    // Skor

    score++;

    // Oyun gittikçe hızlansın

    if(gameSpeed<18){

        gameSpeed+=0.0015;

    }

    // Çizimler

    drawBackground();

    drawObstacles();

    drawItems();

    drawParticles();

    drawPlayer();

    updateHUD();

}

//=========================
// YÜKSEK SKOR
//=========================

function loadHighScore(){

    let best=
    Number(localStorage.getItem("bestScore"))||0;

    document.getElementById("bestScore").textContent=best;

}

loadHighScore();

//=========================
// OYUN BAŞLANGICI
//=========================

window.onload=()=>{

    resizeCanvas();

    resetPlayer();

};

//=========================
// KONSOL
//=========================

console.log("KOŞ BETON KOŞ BAŞLATILDI");

}
