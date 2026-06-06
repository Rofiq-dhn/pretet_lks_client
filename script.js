let points = [];
let connections = [];
let nextPointId = 1;
let nextConnId = 1;
let ConnectingFromId = null;
let selectedConnectionId = null;
let currentSort = "time";
let offsetX = 0, offsetY = 0;
let isDragging = false;
let dragStartX = 0, dragStartY = 0,

const IMG_WIDTH = 982;
const IMG_HEIGHT = 450;
const transport = {
    train: {color: "#33E339", speed: 120, costPerKm: 500, name: "Kereta"},
    train: {color: "#A83BE8", speed: 80, costPerKm: 100, name: "Bus"},
    train: {color: "#000000", speed: 800, costPerKm: 1000, name: "Pesawat"}
}
const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");
const container = document.querySelector(".map-container");
const inputDari = document.getElementById("dari");
const inputKe = document.getElementById("ke");
const cariRute = document.getElementById("cariRute");
const HasilRute = document.getElementById("hasilRute");
const btnUrutWaktu = document.getElementById("urutWaktu");
const btnUrutBiaya = document.getElementById("urutBiaya");
const resetSemuaBtn = document.getElementById("resetSemuaBtn");
const routeWindow = document.getElementById("routeWindow");
const openRouteBtn = document.getElementById("openRouteBtn");
const closeRouteBtn = document.getElementById("closeRouteBtn");
const windowHeader  = document.getElementById("windowHeader");

let bgImage = null;

function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    draw();
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

function worldToCanvas(x,y) {
    const scaleX = canvas.width / IMG_WIDTH;
    const scaleY = canvas.height / IMG_HEIGHT;
    return {
        x: (x - offsetX) / offsetX,
        y: (y - offsetY) / offsetY
    };
}

function canvasToWorld(x,y){
    const scaleX = canvas.width / IMG_WIDTH;
    const scaleY = canvas.height / IMG_HEIGHT;
    return {
        x: (x - offsetX) / offsetX,
        y: (y - offsetY) / offsetY
    }; 
}

function draw() {
    if(!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / IMG_WIDTH;
    const scaleY = canvas.height / IMG_HEIGHT;
   
    ctx.save();
    ctx.translate(offsetX, offsetY);

    if(bgImage) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    }else {
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.stokeStyle = "#2a2a4e";
        ctx.lineWidth = 1;
    }
}