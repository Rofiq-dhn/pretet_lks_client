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
        for(let i = 0; i < canvas.width; i += 50){
            ctx.beginpath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
            ctx.beginpath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }
    }

    const connectionGroup = new Map();

    for (let conn of connections) {
        const from = points.find(p => p.id === conn.fromId);
        const to = points.find(p => p.id === conn.toId);
        if (!from || !to) continue;

        const key = conn.fromId < conn.toId
        ? `${conn.fromId}-${conn.toId}`
        : `${conn.toId}-${conn.fromId}`;

        if(!connectionGroup.has(key)) connectionGroup.set(key, []);
        connectionGroup.get(key).push({ conn, from, to });
    }

    for (let[key, group] of connectionGroup) {
        const totalLines = group.length;

        for(let index = 0; index < totallines; index++) {
            const { conn, from, to } = group[index];

            const p1 = {x: from.x * scaleX, y: from.y * scaleY };
            const p2 = {x: to.x * scaleX, y: to.y * scaleY };

            let offsetAmount = 0;
            if(totalLines > 1) {
                const spacing = 8;
                const mid = (totalLines - 1) / 2;
                offsetAmount = (index - mid) * spacing;
            }

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.x
            const length = Math.hypot(dx, dy);

            if(length > 0 && offsetAmount !== 0 ){
                const perpX = -d / length;
                const perpY = d / length;

                p1.x += perpX * offsetAmount;
                p1.y += perpY * offsetAmount;
                p2.x += perpX * offsetAmount;
                p2.y += perpY * offsetAmount;                
            }

            ctx.beginpath()
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = conn.color;
            ctx.lineWidth = 3;
            ctx.stroke();

            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            let textOffsetY = 0;
            if(totalLines > 1) {
                textOffsetY = (index - (totalLines - 1) / 2) * 12;
            }

            ctx.fillStyle = "black";
            ctx.font =  "11px Arial";
            ctx.shadowBlur = 2;
            ctx.filltext(`${conn.distance} km`, midX, midY - 8 + textOffsetY);
            ctx.shadowBlur = 0;

        }
    }

    for (let point of points) {
        const x = point.x * scaleX;
        const y = point.y * scaleY;
    
    }
}

