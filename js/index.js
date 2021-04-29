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

canvas.width = 1400;
canvas.height = 620;

let
    fps = 1000/40, // fps
    gameStarted = false, // did game start?
    directionChanged = false, // to change direction only once at a loop
    score = bestScore = 0,  // score and best score in game
    timerId,  // timer id of main loop
    tail = [], // array of tail
    tailSize = 4, // size of snake tail
    size = 10; // apple/snakeSingleBox  width and height
    rows = canvas.width / size,
    cols = canvas.height / size,
    snakePosition = {  // position of the snake
        x:  Math.floor(canvas.width / 2),
        y:  Math.floor(canvas.height / 2)
    },
    applePosition = {}, // coords of the apple
    direction = 'right'; // movement direction

//load your best score

bestScore = localStorage.getItem('bestSnakeScore') || 0;
bestScoreEl.textContent = bestScore;

// game start

function startGame(e) {
    // fill start tail of the snake
    for(let i = 0; i < tailSize; i++) {
        tail.push({ x: snakePosition.x - size * i, y: snakePosition.y});
    }

    // hide menu
    menu.style.display = 'none';

    // add listener on directions changing
    window.addEventListener('keydown', changeDirection);

    gameStarted = true;
    timerId = setInterval(loop, fps);
    spawnApple(); // spawn first apple
}

//main game loop

function loop() {
    directionChanged = false;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

        if(score >= bestScore) localStorage.setItem('bestSnakeScore', score);

        clearInterval(timerId);
        window.removeEventListener('keydown', changeDirection);
    }

    //collision with itself tail

    for(let i = 1; i < tail.length; i++) {
        if(snakePosition.x < tail[i].x + size &&
            snakePosition.x + size > tail[i].x &&
            snakePosition.y < tail[i].y + size &&
            snakePosition.y + size > tail[i].y) {

            gameOver.style.display = 'flex';
            gameOverScore.textContent = score;

            if(score >= bestScore)
                localStorage.setItem('bestSnakeScore', score);

            clearInterval(timerId);
            window.removeEventListener('keydown', changeDirection);
            break;
        }
    }
}

//change direction of the snake

function changeDirection(e) {
    if(!directionChanged) {
        if(e.keyCode == 65 && direction != 'right') {
            direction = 'left';
        } else if(e.keyCode == 87 && direction != 'bot') {
            direction = 'top';
        } else if(e.keyCode == 68 && direction != 'left') {
            direction = 'right';
        } else if(e.keyCode == 83 && direction != 'top') {
            direction = 'bot';
        }
        directionChanged = true;
    }
}

//restart game

function restartGame(e) {
    if(e.keyCode == 82 && gameStarted) {
        clearInterval(timerId);
        window.removeEventListener('keydown', changeDirection);

        if(score >= bestScore) localStorage.setItem('bestSnakeScore', score);

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

        startGame(e);
    }
}

//apple spawner

function spawnApple() {
    let intersects;

    do {
        intersects = false;
        applePosition.x = Math.floor(Math.random() * (rows - 1) + 1) * size;
        applePosition.y = Math.floor(Math.random() * (cols - 1) + 1) * size;

        for(let partOfTail of tail){
            if((partOfTail.x == applePosition.x) && (partOfTail.y == applePosition.y))
            {
                intersects = true;
                break;
            }
        }

    } while(intersects);

    console.log(applePosition);
}

//add event on start button

startBtn.addEventListener('click', startGame);

//add event on exit button

exitBtn.addEventListener('click', (e) => {
    window.close();
});

window.addEventListener('keydown', restartGame);
