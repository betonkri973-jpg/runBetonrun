/*==================================================
KOŞ BETON KOŞ
SCRIPT.JS
Ana Değişkenler
==================================================*/

// Canvas

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Sayfalar

const loading = document.getElementById("loading");
const intro = document.getElementById("intro");
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const gameOverScreen = document.getElementById("gameOver");

// Butonlar

const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");

const achievementBtn = document.getElementById("achievementBtn");
const scoreBtn = document.getElementById("scoreBtn");
const helpBtn = document.getElementById("helpBtn");

// Menüler

const achievementMenu=document.getElementById("achievementMenu");
const highScoreMenu=document.getElementById("highScoreMenu");
const helpMenu=document.getElementById("helpMenu");

// HUD

const scoreText=document.getElementById("scoreValue");
const noteText=document.getElementById("noteValue");
const recordText=document.getElementById("recordValue");
const distanceText=document.getElementById("distanceValue");
const lifeBar=document.getElementById("lifeBar");

// Ses

const bgMusic=document.getElementById("bgMusic");

// Resim

const playerImage=document.getElementById("playerImage");

// Oyun

let running=false;

let groundY=0;

let gravity=0.9;

let gameSpeed=8;

// Puanlar

let score=0;
let distance=0;

let notes=0;
let records=0;

let lives=3;

// Diziler

const obstacles=[];
const collectibles=[];
const particles=[];

// Resize

function resizeCanvas(){

canvas.width=window.innerWidth;

canvas.height=window.innerHeight;

groundY=canvas.height-170;

if(typeof resetPlayer==="function"){

resetPlayer();

}

}

window.addEventListener("resize",resizeCanvas);

// Başlangıç

window.addEventListener("load",()=>{

resizeCanvas();

});
