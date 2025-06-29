// canvas variables
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Hud variables
var hudHeightOffset = 600;
var hudHeight = canvas.height - hudHeightOffset;

// System variables
var updateRate = 300; // ms

// Grid properties
var gridSize = 25;
var tileSize = canvas.width / gridSize;
var consumableSize = 8;
var powerupSize = 12;

var state = {
    current: "gameloop",
    menu: {
        title: "Blocky",
        start: "Press Enter To Start"
    },
    gameloop: {
        score: 0,
        lives: 3,
    },
    gameover: {
        title: "Game Over",
        reset: "Press Enter To Restart"
    }
};

// Define Map
var gameMap = [
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 1, 0],
  [0, 1, 3, 1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 3, 1, 0],
  [0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0],
  [0, 1, 3, 1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 3, 1, 0],
  [0, 1, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 3, 1, 0],
  [0, 1, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 1, 0],
  [0, 1, 1, 1, 3, 3, 1, 4, 3, 1, 1, 3, 3, 3, 1, 1, 3, 4, 1, 3, 3, 1, 1, 1, 0],
  [0, 0, 0, 1, 3, 3, 1, 3, 3, 1, 3, 3, 3, 3, 3, 1, 3, 3, 1, 3, 3, 1, 0, 0, 0],
  [0, 0, 0, 1, 3, 3, 1, 3, 3, 1, 3, 0, 0, 0, 3, 1, 3, 3, 1, 3, 3, 1, 0, 0, 0],
  [0, 0, 0, 1, 3, 3, 1, 3, 3, 1, 3, 0, 0, 0, 3, 1, 3, 3, 1, 3, 3, 1, 0, 0, 0],
  [1, 1, 1, 1, 3, 3, 1, 3, 3, 1, 3, 3, 3, 3, 3, 1, 3, 3, 1, 3, 3, 1, 1, 1, 1],
  [0, 0, 0, 0, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 0, 0, 0, 0],
  [1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1],
  [0, 0, 0, 1, 3, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 3, 1, 0, 0, 0],
  [0, 0, 0, 1, 3, 1, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 1, 3, 1, 0, 0, 0],
  [0, 0, 0, 1, 3, 1, 3, 1, 3, 3, 3, 3, 4, 3, 3, 3, 3, 1, 3, 1, 3, 1, 0, 0, 0],
  [0, 1, 1, 1, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 1, 1, 1, 0],
  [0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0],
  [0, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 0],
  [0, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 3, 1, 3, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 0],
  [0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0],
  [0, 1, 3, 1, 1, 3, 1, 1, 1, 1, 4, 1, 1, 1, 4, 1, 1, 1, 1, 3, 1, 1, 3, 1, 0],
  [0, 1, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
];

var gameMapBU = { ...gameMap };

// Player variables
var playerPos = {x: 12, y: 13};
var playerDirection = "up";
var playerPowerup = true;

// Ghost variables
var ghosts = [
    {x: 12, y: 9, color: "red", path: [], active: false},
    {x: 11, y: 9, color: "pink", path: [], active: false},
    {x: 13, y: 9, color: "cyan", path: [], active: false},
    {x: 12, y: 10, color: "orange", path: [], active: false},
]
var ghostPredictionRange = 4;
var ghostActivationDelay = 5000; // ms

// Helper functions
function drawText(text, x, y, fontSize = "20px", color = "white", font = "Arial", align = "center") {
    ctx.fillStyle = color;
    ctx.font = `${fontSize} ${font}`;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
}

function drawRect(x, y, width, height, color = "white") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height)
}

function eatConsumable(x, y) {
    if (gameMap[y][x] == 3) {
        gameMap[y][x] = 0;
        state.gameloop.score += 10;
    } else if (gameMap[y][x] == 4) {
        gameMap[y][x] = 0;
        state.gameloop.score += 50;
        playerPowerup = true;
        setTimeout(() => {
            playerPowerup = false;
        }, 7000); // Power-up lasts for 10 seconds
    }
}

function drawHud() {
    drawRect(0, hudHeightOffset, canvas.width, canvas.height - hudHeightOffset, "black");
    drawText(`Score: ${state.gameloop.score}`, 10, hudHeightOffset + (hudHeight/2), "20px", "white", "Arial", "left");
    drawText(`Lives: ${state.gameloop.lives}`, canvas.width - 10, hudHeightOffset + (hudHeight/2), "20px", "white", "Arial", "right");
}

function drawPlayer() {
    if (playerPowerup) {
        drawRect(playerPos.x * tileSize, playerPos.y * tileSize, tileSize, tileSize, "purple");
    } else {
        drawRect(playerPos.x * tileSize, playerPos.y * tileSize, tileSize, tileSize, "yellow");
    }
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        drawRect(ghost.x * tileSize, ghost.y * tileSize, tileSize, tileSize, ghost.color);
    });
}

function activateGhostInQueue() {
    ghosts.forEach(ghost => {
        if (!ghost.active) {
            ghost.active = true;
            return;
        }
    });
}

function requestNewGhostPath(ghost) {
    switch (ghost.color) {
        case "red":
            ghost.path = bfs(ghost, playerPos);
            break;
        case "pink":
            if (ghost.x - playerPos.x <= ghostPredictionRange && ghost.y - playerPos.y <= ghostPredictionRange) {
                ghost.path = bfs(ghost, playerPos);
                break;
            }
            switch (playerDirection) {
                case "up":
                    ghost.path = bfs(ghost, {x: playerPos.x, y: playerPos.y - ghostPredictionRange});
                    break;
                case "down":
                    ghost.path = bfs(ghost, {x: playerPos.x, y: playerPos.y + ghostPredictionRange});
                    break;
                case "left":
                    ghost.path = bfs(ghost, {x: playerPos.x - ghostPredictionRange, y: playerPos.y});
                    break;
                case "right":
                    ghost.path = bfs(ghost, {x: playerPos.x + ghostPredictionRange, y: playerPos.y});
                    break;
            }
            break;
        case "cyan":
            if (ghost.x - playerPos.x <= ghostPredictionRange && ghost.y - playerPos.y <= ghostPredictionRange) {
                ghost.path = bfs(ghost, playerPos);
                break;
            }
            switch (playerDirection) {
                case "up":
                    ghost.path = bfs(ghost, {x: playerPos.x, y: playerPos.y + ghostPredictionRange});
                    break;
                case "down":
                    ghost.path = bfs(ghost, {x: playerPos.x, y: playerPos.y - ghostPredictionRange});
                    break;
                case "left":
                    ghost.path = bfs(ghost, {x: playerPos.x + ghostPredictionRange, y: playerPos.y});
                    break;
                case "right":
                    ghost.path = bfs(ghost, {x: playerPos.x - ghostPredictionRange, y: playerPos.y});
                    break;
            }
            break;
        case "orange":
            if (Math.random() < 0.5) {
                ghost.path = bfs(ghost, {x: Math.floor(Math.random() * gridSize), y: Math.floor(Math.random() * gridSize)});
            } else {
                ghost.path = bfs(ghost, playerPos);
            }
            break;
    }
}

function bfs(start, goal) {
    const directions = [
        { x: 0, y: -1, move: "up" },
        { x: 0, y: 1, move: "down" },
        { x: -1, y: 0, move: "left" },
        { x: 1, y: 0, move: "right" }
    ];
    const queue = [];
    const visited = Array.from({ length: gameMap.length }, () => Array(gameMap[0].length).fill(false));
    const parent = Array.from({ length: gameMap.length }, () => Array(gameMap[0].length).fill(null));

    queue.push({ x: start.x, y: start.y });
    visited[start.y][start.x] = true;

    while (queue.length > 0) {
        const current = queue.shift();
        if (current.x === goal.x && current.y === goal.y) {
            // Reconstruct path
            const path = [];
            let node = goal;
            while (node.x !== start.x || node.y !== start.y) {
                const prev = parent[node.y][node.x];
                if (!prev) break;
                if (prev.x === node.x && prev.y === node.y - 1) path.unshift("down");
                else if (prev.x === node.x && prev.y === node.y + 1) path.unshift("up");
                else if (prev.x === node.x - 1 && prev.y === node.y) path.unshift("right");
                else if (prev.x === node.x + 1 && prev.y === node.y) path.unshift("left");
                node = prev;
            }
            return path;
        }
        for (const dir of directions) {
            const nx = current.x + dir.x;
            const ny = current.y + dir.y;
            if (
                ny >= 0 && ny < gameMap.length &&
                nx >= 0 && nx < gameMap[0].length &&
                !visited[ny][nx] &&
                gameMap[ny][nx] !== 1
            ) {
                visited[ny][nx] = true;
                parent[ny][nx] = { x: current.x, y: current.y };
                queue.push({ x: nx, y: ny });
            }
        }
    }
    return []; // No path found
}

function checkCollisionPlayerGhost() {
    ghosts.forEach(ghost => {
        if (ghost.x === playerPos.x && ghost.y === playerPos.y && ghost.active) {
            if (playerPowerup) {
                // Eat ghost
                ghost.x = 12;
                ghost.y = 9;
                ghost.path = [];
                ghost.active = false;
                state.gameloop.score += 200;
            } else {
                // Lose life
                state.gameloop.lives -= 1;
                playerPos = {x: 12, y: 13};
                playerDirection = "up";
                ghosts.forEach(g => { g.path = [];});
                if (state.gameloop.lives <= 0) {
                    state.current = "gameover";
                    resetGame();
                }
            }
        }
    });
}

function teleportPlayer() {
    if (playerPos.x < 0) {
        playerPos.x = gridSize - 1;
    } else if (playerPos.x >= gridSize) {
        playerPos.x = 0;
    }
}

function resetGame() {
    state.gameloop.score = 0;
    state.gameloop.lives = 3;
    playerPos = {x: 13, y: 13};
    playerDirection = "up";
    ghosts.forEach(ghost => {
        ghost.x = 12;
        ghost.y = 9;
        ghost.path = [];
        ghost.active = false;
    });
    gameMap = { ...gameMapBU };
}

// Draw map
function drawMap() {
    for (let row = 0; row < gameMap.length; row++) {
        for (let col = 0; col < gameMap[row].length; col++) {
            if (gameMap[row][col] == 1) { // Walls
                drawRect(col * tileSize, row * tileSize, tileSize, tileSize, "blue");
            } else if (gameMap[row][col] == 2) { // Player(?)
                drawRect(col * tileSize, row * tileSize, tileSize, tileSize, "yellow");
            } else if (gameMap[row][col] == 3) { // Consumables
                drawRect(col * tileSize + (tileSize/2) - (consumableSize/2), row * tileSize + (tileSize/2)  - (consumableSize/2), consumableSize, consumableSize, "green");
            } else if (gameMap[row][col] == 4) { // Power-ups
                drawRect(col * tileSize + (tileSize/2) - (powerupSize/2), row * tileSize + (tileSize/2)  - (powerupSize/2), powerupSize, powerupSize, "orange");
            }
        }
    }
}

// Game loop
function gameLoop() {
    // Calculations phase
    // Check collisions with ghosts
    checkCollisionPlayerGhost();

    // Eat consumable if on one
    eatConsumable(playerPos.x, playerPos.y);

    // TP player if out of bounds
    teleportPlayer();

    //Update player position
    switch (playerDirection) {
        case "up":
            if (gameMap[playerPos.y - 1][playerPos.x] != 1) {
                playerPos.y -= 1;
            }
            break;
        case "down":
            if (gameMap[playerPos.y + 1][playerPos.x] != 1) {
                playerPos.y += 1;
            }
            break;
        case "left":
            if (gameMap[playerPos.y][playerPos.x - 1] != 1) {
                playerPos.x -= 1;
            }
            break;
        case "right":
            if (gameMap[playerPos.y][playerPos.x + 1] != 1) {
                playerPos.x += 1;
            }
            break;
    }

    // Update ghost positions
    ghosts.forEach(ghost => {
        if (ghost.path.length == 0 && ghost.active) {
            requestNewGhostPath(ghost);
        }
        if (ghost.path.length > 0) {
            const nextMove = ghost.path.shift();
            switch (nextMove) {
                case "up":
                    ghost.y -= 1;
                    break;
                case "down":
                    ghost.y += 1;
                    break;
                case "left":
                    ghost.x -= 1;
                    break;
                case "right":
                    ghost.x += 1;
                    break;
            }
        }
    });

    // Draw phase
    // Draw map
    drawMap();

    // Draw player
    drawPlayer();

    //draw ghosts
    drawGhosts();

    // Draw hud
    drawHud();
}

// Main loop
function mainLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (state.current) {
        case "menu":
            // Draw title
            drawText(state.menu.title, canvas.width / 2, canvas.height / 2, "30px", "white");
            // Draw start text
            if (Math.round((Date.now() / 1000)) % 2 == 0) {
                drawText(state.menu.start, canvas.width / 2, canvas.height - canvas.height / 4, "30px", "white");
            }
            break;
        case "gameloop":
            gameLoop();
            break;
        case "gameover":
            // Draw game over text
            drawText(state.gameover.title, canvas.width / 2, canvas.height / 2, "30px", "white");
            // Draw reset text
            if (Math.round((Date.now() / 1000)) % 2 == 0) {
                drawText(state.gameover.reset, canvas.width / 2, canvas.height - canvas.height / 4, "30px", "white");
            }
            break;
    }
}

// Execute main loop
setInterval(mainLoop, updateRate);

// Activate ghosts after delay
setInterval(activateGhostInQueue, ghostActivationDelay);

// Input handling
document.addEventListener("keydown", keyMapper);
// Key mapping
function keyMapper (event) {
    // Menu bindings
    if (state.current == "menu" || state.current == "gameover") {
        switch (event.key) {
            case "Enter":
                state.current = "gameloop"
                break;
        }
    }

    // Gameplay bindings
    if (state.current == "gameloop") {
        switch(event.key) {
            case "ArrowUp":
                playerDirection = "up"
                break;
            case "ArrowDown":
                playerDirection = "down"
                break;
            case "ArrowLeft":
                playerDirection = "left"
                break;
            case "ArrowRight":
                playerDirection = "right"
                break;
            case "R":
            case "r":
                state.current = "menu"
                break;
        }
    }
}