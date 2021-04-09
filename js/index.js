const
    clientWidth = document.documentElement.clientWidth,
    clientHeight = document.documentElement.clientHeight,
    startBtn = document.querySelector('.start-btn'),
    exitBtn = document.querySelector('.exit-btn'),
    menu = document.querySelector('.menu'),
    scoreEl = document.querySelector('.current-score__digit'),
    bestScoreEl = document.querySelector('.best-score__digit'),
    gameOver = document.querySelector('.game-over'),
    gameOverScore = document.querySelector('.game-over__digit'),
    canvas = document.querySelector('#myCanvas'),
    ctx = canvas.getContext("2d"),
    snakeColor = '#12e03b',
    appleColor = '#e31033';

let
    fps = 1000/50, // fps
    gameStarted = false, // did game start?
    firstLoop = true, // is it first drawing loop?
    score = bestScore = 0,  // score and best score in game
    timerId,  // timer id of main loop
    tail = [], // array of tail
    tailSize = 4, // size of snake tail
    size = 3; // apple/snakeSingleBox  width and height
    snakePosition = {  // position of the snake
        x:  Math.floor(canvas.width / 2),
        y:  Math.floor(canvas.height / 2)
    },
    applePosition = {}, // coords of the apple
    direction = 'right'; // movement direction



//load your best score

bestScore = localStorage.getItem('bestSnakeScore') || 0;
bestScoreEl.textContent = bestScore;



//main game loop

function loop() {

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // fill start tail of the snake
    if(firstLoop) {
        for(let i = 0; i < tailSize; i++) {
            tail.push({ x: snakePosition.x - size * i, y: snakePosition.y});
        }
        firstLoop = false;
    }

    //drawing tail of the snake

    for(let i = 0; i < tail.length; i++) {
        ctx.fillStyle = snakeColor;
        ctx.fillRect(tail[i].x, tail[i].y, size, size);
    }

    direction == 'right' ? snakePosition = { x: tail[0].x + size, y: tail[0].y } :
    direction == 'left' ? snakePosition = { x: tail[0].x - size, y: tail[0].y } :
    direction == 'top' ? snakePosition = { x: tail[0].x, y: tail[0].y - size } : snakePosition = { x: tail[0].x, y: tail[0].y + size};

    tail.unshift({ x: snakePosition.x, y: snakePosition.y });

    //drawing apple

    ctx.fillStyle = appleColor;
    ctx.fillRect(applePosition.x, applePosition.y, size, size);

    //eating apple

    if(snakePosition.x < (applePosition.x + size)
        && snakePosition.x + size > applePosition.x
        && snakePosition.y < (applePosition.y + size)
        && snakePosition.y + size > applePosition.y) {

        score++;
        scoreEl.textContent = score;

        if(score > bestScore) {
            bestScore++;
            bestScoreEl.textContent = bestScore;
        }

        spawnApple();
    } else {
        tail.pop();
    }

    //collision with the wall

    if(snakePosition.x >= canvas.width ||
        snakePosition.x + size <= 0 ||
        snakePosition.y >= canvas.height ||
        snakePosition.y + size <= 0) {

        gameOver.style.display = 'flex';
        gameOverScore.textContent = score;

        if(score >= bestScore)
            localStorage.setItem('bestSnakeScore', score);

        clearInterval(timerId);
    }
}

//change direction of the snake

function changeDirection(e) {

    if(e.keyCode == 65 && direction != 'right') {
        direction = 'left';
    } else if(e.keyCode == 87 && direction != 'bot') {
        direction = 'top';
    } else if(e.keyCode == 68 && direction != 'left') {
        direction = 'right';
    } else if(e.keyCode == 83 && direction != 'top') {
        direction = 'bot';
    }

    if(e.keyCode == 82 && gameStarted) {
        clearInterval(timerId);

        if(score >= bestScore)
            localStorage.setItem('bestSnakeScore', score);

        firstLoop = true;
        score = 0;
        snakePosition = {
            x:  Math.floor(canvas.width / 2),
            y:  Math.floor(canvas.height / 2)
        },
        tail = [];
        applePosition = {};
        direction = 'right';

        gameOver.style.display = 'none';
        scoreEl.textContent = 0;

        timerId = setInterval(loop, fps);
        spawnApple();
    }
}

//apple spawner

function spawnApple() {
    applePosition.x = Math.floor(Math.random() * canvas.width + 1);
    applePosition.y = Math.floor(Math.random() * canvas.height + 1);
}

//add event on start button

startBtn.addEventListener('click', (e) => {
    menu.style.display = 'none';

    window.addEventListener('keydown', changeDirection);

    gameStarted = true;
    timerId = setInterval(loop, fps);
    spawnApple();
});

//add event on exit button

exitBtn.addEventListener('click', (e) => {
    window.close();
});
