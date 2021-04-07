const
    clientWidth = document.documentElement.clientWidth,
    clientHeight = document.documentElement.clientHeight,
    startBtn = document.querySelector('.start-btn'),
    exitBtn = document.querySelector('.exit-btn'),
    menu = document.querySelector('.menu'),
    canvas = document.querySelector('#myCanvas'),
    ctx = canvas.getContext("2d");

let
    fps = 1000/60,
    timerId;

canvas.width = clientWidth - document.querySelector('.score').width;
canvas.height = clientHeight - document.querySelector('.score').height;



function loop() {
    console.log('Hello');
}



startBtn.addEventListener('click', (e) => {

});

exitBtn.addEventListener('click', (e) => {
    window.close();
});



//timerId = setInterval(loop, fps);
