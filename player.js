/*==================================================
KOŞ BETON KOŞ
PLAYER.JS
==================================================*/

//=========================
// OYUNCU
//=========================

const player = {

    x: 150,
    y: 0,

    width: 110,
    height: 110,

    velocityY: 0,

    jumpPower: -18,
    doubleJumpPower: -25,

    jumping: false,
    doubleJump: false,

    shield: false,
    banana: false,
    invincible: false

};

//=========================
// BAŞLANGIÇ
//=========================

function resetPlayer(){

    player.x = 150;

    player.y = groundY - player.height;

    player.velocityY = 0;

    player.jumping = false;
    player.doubleJump = false;

    player.shield = false;
    player.banana = false;
    player.invincible = false;

}

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
// FİZİK
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

}

//=========================
// ÇİZİM
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

        ctx.fillStyle="#ffffff";

        ctx.fillRect(

            player.x,

            player.y,

            player.width,

            player.height

        );

    }

    // Kalkan

    if(player.shield){

        ctx.strokeStyle="#00ffff";

        ctx.lineWidth=5;

        ctx.beginPath();

        ctx.arc(

            player.x+player.width/2,

            player.y+player.height/2,

            70,

            0,

            Math.PI*2

        );

        ctx.stroke();

    }

}

//=========================
// ÇARPIŞMA
//=========================

function collide(a,b){

    return(

        a.x < b.x+b.width &&

        a.x+a.width > b.x &&

        a.y < b.y+b.height &&

        a.y+a.height > b.y

    );

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

let lastTap = 0;

document.addEventListener("touchstart",()=>{

    let now = Date.now();

    if(now-lastTap<250){

        jump();

    }else{

        jump();

    }

    lastTap = now;

});

//=========================
// HAZIRLA
//=========================

window.addEventListener("load",()=>{

    resetPlayer();

});
