const dinosaur = document.getElementById("dinosaur");
const start = document.getElementById("start");
const hrLine = document.querySelector(".hrLine");
const imgGameOver = document.getElementById("imgGameOver");
const score = document.getElementById("score");
const bottomRestart = document.getElementById("restart"); 
let currentPosition = 45;
let moveObstacle = 70;
let timerID;
let obstaclesIntervalID;
let appearanceTime = 4000;
let seconds = 0, minutes = 0, hours = 0;
let puncture = 0;
let jump = true;
let continueJump = true;

function removeClone() {
    let cloneObstacles = document.querySelectorAll(".obstacles .move");
    cloneObstacles.forEach(function(clone) {
        clone.parentNode.removeChild(clone);
    });
}

function gameOver() {
    removeClone();
    dinosaur.style.display = "none";
    hrLine.style.display = "none";
    imgGameOver.style.display = "block";
    bottomRestart.style.display = "block";
    score.textContent = "Score: " + puncture + " seconds";
    score.style.display = "block";
    puncture = 0;
    seconds = 0;
    minutes = 0;
    hours = 0;
    clearInterval(timerID);
    clearInterval(obstaclesIntervalID);
    appearanceTime = 4000;
    moveObstacle = 70;
    currentPosition = 45;
    const startingPosition = 45;
    dinosaur.style.top = startingPosition + "%";
}

function collisionObjects(clone) {
    const rect1 = dinosaur.getBoundingClientRect();
    const rect2 = clone.getBoundingClientRect();
    if (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    ) {
        gameOver();
        continueJump = false;
    }
}

function moveObstacleDecTime() {
    const maxSpeedForMoving = 40;
    if (moveObstacle > maxSpeedForMoving) {
        moveObstacle -= 0.5;
    }
    const minTime = 1700, decreasesTheTime = 100;
    if (appearanceTime > minTime) {
        appearanceTime -= decreasesTheTime;
    }
    clearInterval(obstaclesIntervalID);
    obstaclesIntervalID = setInterval(obstacles, appearanceTime);
}

function obstacles() {
    let imgObstacles = document.querySelector(".obstacles");
    let obstaclesContainer = [
    document.getElementById("obstacle1"),
    document.getElementById("obstacle2"),
    document.getElementById("obstacle3"),
    document.getElementById("obstacle4")
    ];
    let indexImg = Math.floor(Math.random() * obstaclesContainer.length);
    let clone = obstaclesContainer[indexImg].cloneNode(true);
    clone.classList.add("move");
    clone.style.visibility = "visible";
    let currentPoObstacle = 2;
    imgObstacles.appendChild(clone);
    const decreasesTheMaxPosition = 92;
    let interval = setInterval(function() {
        if (currentPoObstacle <= decreasesTheMaxPosition) {
            ++currentPoObstacle;
            clone.style.right = currentPoObstacle + "%";
        } else {
            clearInterval(interval);
            imgObstacles.removeChild(clone);
        }
        collisionObjects(clone);
    }, moveObstacle);
}

function moveDown() {
    const maxPosition = 44, timeMovingDinosaur = 55;
    const interval = setInterval(function() {
        if (currentPosition <= maxPosition) {
            ++currentPosition;
            dinosaur.style.top = currentPosition + "%";
        } else if (currentPosition > maxPosition || continueJump === false) {
            clearInterval(interval);
        }
    }, timeMovingDinosaur);
    const dinosaurCanBeMoved = 850;
    setTimeout(function() {
        jump = true;
    }, dinosaurCanBeMoved);
}

function dinosaurKey() {
    const timeMovingDinosaur = 55;
    document.addEventListener("keydown", function(event) {
        if (event.key === " " && jump === true) { 
            jump = false;
            const interval = setInterval(function() {
                currentPosition -= 1;
                dinosaur.style.top = currentPosition + "%";
                const minPosition = 30;
                if (currentPosition === minPosition || continueJump === false) {
                    clearInterval(interval);
                }
            }, timeMovingDinosaur);
            const retrievingTheDinosaurFall = 1000;
            setTimeout(function() { 
                moveDown();
            }, retrievingTheDinosaurFall);
        } 
    })
}

function pad(value) {
    const theNamberOfDigits = 2;
    return value.toString().padStart(theNamberOfDigits, "0");
}

function startTimer() {
    const convertMinutes = 60, convertHours = 60, timeModification = 5, recallToTheSecond = 1000;
    timerID = setInterval(function() {
        ++seconds;
        ++puncture;
        if (seconds % timeModification === 0) {
            moveObstacleDecTime();
        }
        if (seconds === convertMinutes) {
            seconds = 0;
            ++minutes;
        }
        if (minutes === convertHours) {
            minutes = 0;
            ++hours;
        } 
        let time = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
        document.getElementById("timer").textContent = time;
    }, recallToTheSecond);
    obstacles();
    setTimeout(function() {
        obstacles
    }, appearanceTime);
}

function main() {
    start.style.display = "none";
    hrLine.style.display = "block";
    dinosaur.style.display = "block";
    dinosaurKey();
    startTimer();
}

function restart() {
    startTimer();
    score.style.display = "none";
    imgGameOver.style.display = "none";
    bottomRestart.style.display = "none";
    dinosaur.style.display = "block";
    hrLine.style.display = "block";
    continueJump = true;
}
