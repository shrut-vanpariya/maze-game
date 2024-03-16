const MAZE_SIZE = 10
const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

var maze = [];
var visited = [];
var graph = [];

const BODY = document.body
const MAZE = document.getElementById('maze');
const SOLVE_BTN = document.getElementById('solution');
const ROOT = document.querySelector(':root');

// console.log(ROOT.style);
var rs = getComputedStyle(ROOT);
ROOT.style.setProperty('--maze-size', MAZE_SIZE)
console.log(rs.getPropertyValue('--maze-size'));
// Alert the value of the --blue variable

var TOGGLE_SOLUTION = false

var cells = []

var CURRENT_POSITION = [0, 0]
var PREVIOUS_POSITION = [-1, -1]
var PLAYER_PATH = [0]


function main() {

    MAZE.innerHTML = null

    maze = [];
    visited = [];
    graph = [];

    cells = []

    CURRENT_POSITION = [0, 0]
    PREVIOUS_POSITION = [-1, -1]
    PLAYER_PATH = [0]

    // Create maze grid
    var cnt = 0;
    for (let i = 0; i < MAZE_SIZE; i++) {
        const cellList = []
        for (let j = 0; j < MAZE_SIZE; j++) {
            const cell = document.createElement("div");
            cell.id = `${cnt}`
            cell.classList.add("cell");
            cellList.push(cell);
            // cell.innerText = cnt;
            if (Math.random() > 0.5 && Math.random() > 0.5 && Math.random() > 0.5) {
                cell.innerText = '🍑';
            }
            cell.style.fontSize = "var(--food-size)"
            MAZE.appendChild(cell);
            cnt++;
        }
        cells.push(cellList);
    }
    cells[0][0].innerText = "S"
    cells[MAZE_SIZE - 1][MAZE_SIZE - 1].innerText = "E"

    cnt = 0;
    for (let i = 0; i < MAZE_SIZE; i++) {
        maze.push([]);
        visited.push([]);
        for (let j = 0; j < MAZE_SIZE; j++) {
            maze[i][j] = cnt++;
            visited[i][j] = false;
            graph.push([]);
        }
    }

    randomizedDFS(0, 0)
    // findPath(0, 99)
}

const fun = async (e) => {
    // console.log(e.key);
    // e.preventDefault()
    // e = e || window.event;
    const player = document.createElement('p');
    player.innerText = '😃'
    player.style.fontSize = 'var(--player-size)'
    player.style.position = 'relative'
    // player.style.animation = "text-up 2s 1"

    // console.log(cells[CURRENT_POSITION[0]][CURRENT_POSITION[1]].style.borderLeftStyle, maze[CURRENT_POSITION[0]][CURRENT_POSITION[1]]);
    if (e.key === "ArrowLeft") { // Left key
        // console.log('L');
        if (isValid(CURRENT_POSITION[0] + 0, CURRENT_POSITION[1] - 1) && cells[CURRENT_POSITION[0] + 0][CURRENT_POSITION[1] - 1].style.borderRightStyle == "none") {
            PREVIOUS_POSITION = CURRENT_POSITION;
            CURRENT_POSITION = [CURRENT_POSITION[0] + 0, CURRENT_POSITION[1] - 1]
            player.style.animation = "text-left 500ms cubic-bezier(0.085, 0.735, 0.365, 1.050) 1"
        }

    }
    else if (e.key === "ArrowUp") { // Up key
        // console.log('U');
        if (isValid(CURRENT_POSITION[0] - 1, CURRENT_POSITION[1] - 0) && cells[CURRENT_POSITION[0] - 1][CURRENT_POSITION[1] - 0].style.borderBottomStyle == "none") {
            PREVIOUS_POSITION = CURRENT_POSITION;
            CURRENT_POSITION = [CURRENT_POSITION[0] - 1, CURRENT_POSITION[1] - 0]
            player.style.animation = "text-up 500ms cubic-bezier(0.085, 0.735, 0.365, 1.050) 1"
        }
    }
    else if (e.key === "ArrowRight") { // Right key
        // console.log('R');
        if (isValid(CURRENT_POSITION[0] + 0, CURRENT_POSITION[1] + 1) && cells[CURRENT_POSITION[0]][CURRENT_POSITION[1]].style.borderRightStyle == "none") {
            PREVIOUS_POSITION = CURRENT_POSITION;
            CURRENT_POSITION = [CURRENT_POSITION[0] + 0, CURRENT_POSITION[1] + 1]
            player.style.animation = "text-right 500ms cubic-bezier(0.085, 0.735, 0.365, 1.050) 1"
        }
    }
    else if (e.key === "ArrowDown") {  // Down key
        // console.log('D');
        if (isValid(CURRENT_POSITION[0] + 1, CURRENT_POSITION[1] - 0) && cells[CURRENT_POSITION[0]][CURRENT_POSITION[1]].style.borderBottomStyle == "none") {
            PREVIOUS_POSITION = CURRENT_POSITION;
            CURRENT_POSITION = [CURRENT_POSITION[0] + 1, CURRENT_POSITION[1] - 0]
            player.style.animation = "text-down 500ms cubic-bezier(0.085, 0.735, 0.365, 1.050) 1"
        }
    }
    else {
        // console.log('other');
    }
    // console.log(CURRENT_POSITION);
    // console.log(PREVIOUS_POSITION);

    // await sleep(500)

    cells[CURRENT_POSITION[0]][CURRENT_POSITION[1]].replaceChildren(player)
    // cells[CURRENT_POSITION[0]][CURRENT_POSITION[1]].appendChild('🍑')


    // cells[CURRENT_POSITION[0]][CURRENT_POSITION[1]].innerText = '😃'
    // cells[CURRENT_POSITION[0]][CURRENT_POSITION[1]].style.fontSize = "25px"
    if (PREVIOUS_POSITION[0] !== -1 && PREVIOUS_POSITION[1] !== -1) {
        // cells[PREVIOUS_POSITION[0]][PREVIOUS_POSITION[1]].innerText = ''
        cells[PREVIOUS_POSITION[0]][PREVIOUS_POSITION[1]].innerHTML = ''
    }
    if (CURRENT_POSITION[0] === MAZE_SIZE - 1 && CURRENT_POSITION[1] === MAZE_SIZE - 1) {
        // location.reload()
        main()
    }
    // console.log(e.code);
}


// document.addEventListener('keypress', fun)
document.addEventListener('keydown', fun)


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isValid(i, j) {
    return i >= 0 && j >= 0 && i < MAZE_SIZE && j < MAZE_SIZE;
}

function getRandomUnvisitedNeighbors(x, y) {
    const neighbors = [];
    for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        if (isValid(newX, newY) && !visited[newX][newY]) {
            neighbors.push([newX, newY]);
        }
    }
    return neighbors.sort(() => Math.random() - 0.5);
}

function removeBorder(i, j, x, y) {
    for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        if (isValid(newX, newY) && i === newX && j === newY) {
            // console.log(maze[i][j], maze[x][y], { dx, dy }, { newX, newY }, cells[i][j].innerText, cells[x][y].innerText);
            if (dx === 0 && dy === 1) {
                cells[x][y].style.borderRight = 'none'
                cells[i][j].style.borderLeft = 'none'
            }
            else if (dx === 1 && dy === 0) {
                cells[x][y].style.borderBottom = 'none'
                cells[i][j].style.borderTop = 'none'
            }
            else if (dx === 0 && dy === -1) {
                cells[x][y].style.borderLeft = 'none'
                cells[i][j].style.borderRight = 'none'
            }
            else { // [-1, 0]
                cells[y][x].style.borderTop = 'none'
                cells[i][j].style.borderBottom = 'none'
            }
        }
    }
}

async function randomizedDFS(x, y) {
    const stack = [[x, y, -1, -1]];
    let cnt = 0;

    while (stack.length > 0) {
        const [curX, curY, parX, parY] = stack.pop();
        if (!visited[curX][curY]) {
            if (parX !== -1 && parY !== -1) {
                graph[maze[curX][curY]].push(maze[parX][parY]);
                graph[maze[parX][parY]].push(maze[curX][curY]);
                // cells[curX][curY].innerText = "*"
                removeBorder(curX, curY, parX, parY)
                removeBorder(parX, parY, curX, curY)
                // await sleep(250)
                // cells[curX][curY].innerText = ""
            }
            visited[curX][curY] = true;
        }

        const neighbors = getRandomUnvisitedNeighbors(curX, curY);

        for (const [newX, newY] of neighbors) {
            if (!visited[newX][newY]) {
                stack.push([newX, newY, curX, curY]);
            }
        }
    }
}

async function findPath(s, e) {
    const vis = new Array(MAZE_SIZE * MAZE_SIZE).fill(false);
    const parent = new Array(MAZE_SIZE * MAZE_SIZE).fill(-1);
    const st = [[s, -1]];
    const path = [];

    while (st.length > 0) {
        const [v, par] = st.pop();

        if (!vis[v]) {
            vis[v] = true;
            parent[v] = par;
        }

        for (const child of graph[v]) {
            if (!vis[child]) {
                st.push([child, v]);
            }
        }
    }

    while (parent[e] !== -1) {
        path.push(e);
        e = parent[e];
    }
    path.push(s);
    path.reverse();
    for (let i = 0; i < path.length; i++) {
        const cell = document.getElementById(`${path[i]}`);
        // await sleep(200)
        if (TOGGLE_SOLUTION) {
            cell.style.background = 'lightgreen'
        }
        else {
            cell.style.background = ''
        }
        // cell.innerText = `🍑`
    }
    // console.log(path.join(' '));

    // for (let i = 0; i < path.length; i++) {
    //     const cell = document.getElementById(`${path[i]}`);
    //     cell.innerText = `😃`
    //     cell.style.fontSize = '30px'
    //     await sleep(300)
    //     cell.innerText = ``

    //     // cell.style.background = 'lightgreen'

    // }
}


main()
SOLVE_BTN.addEventListener('click', (e) => {
    TOGGLE_SOLUTION = !TOGGLE_SOLUTION
    findPath(0, MAZE_SIZE * MAZE_SIZE - 1);
})

// console.log(graph);



//================================== CONTROLS =============================================

const ctrl_left = document.getElementById('left');
const ctrl_right = document.getElementById('right');
const ctrl_up = document.getElementById('up');
const ctrl_down = document.getElementById('down');

// console.log(ctrl_left, ctrl_right, ctrl_up, ctrl_down);

// Function to simulate keydown event
function simulateKeyDown(key) {
    const event = new KeyboardEvent('keydown', {
        key: key,
        bubbles: true,
        cancelable: true,
    });

    // Dispatch the event on the document
    document.dispatchEvent(event);
}

// Add click event listeners to the buttons
ctrl_left.addEventListener('click', () => {
    simulateKeyDown('ArrowLeft');
});

ctrl_right.addEventListener('click', () => {
    simulateKeyDown('ArrowRight');
});

ctrl_up.addEventListener('click', () => {
    simulateKeyDown('ArrowUp');
});

ctrl_down.addEventListener('click', () => {
    simulateKeyDown('ArrowDown');
});
