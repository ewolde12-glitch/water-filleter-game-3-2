// =====================================
// 1. GAME SETTINGS
// =====================================

const gameSettings = {
    easy: {
        time: 30,
        goal: 70,
        spawnSpeed: 1000
    },
    normal: {
        time: 30,
        goal: 100,
        spawnSpeed: 800
    },
    hard: {
        time: 30,
        goal: 150,
        spawnSpeed: 550
    }
};

const gameItems = [
    {
        name: "water",
        emoji: "💧",
        points: 10
    },
    {
        name: "germ",
        emoji: "🦠",
        points: -5
    },
    {
        name: "trash",
        emoji: "🗑️",
        points: -10
    }
];

// =====================================
// 2. GAME VARIABLES
// =====================================

let score = 0;
let timeLeft = 30;
let goal = 100;
let gameRunning = false;

let timerInterval = null;
let spawnInterval = null;

// =====================================
// 3. CONNECT TO HTML ELEMENTS
// =====================================

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const goalDisplay = document.getElementById("goal");

const message = document.getElementById("message");
const gameArea = document.getElementById("gameArea");

const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");

const difficultySelect = document.getElementById("difficulty");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const progressContainer = document.getElementById("progressContainer");

// =====================================
// 4. UPDATE THE SCOREBOARD
// =====================================

function updateDisplay() {
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    goalDisplay.textContent = goal;

    const progress = Math.min(
        100,
        Math.max(0, (score / goal) * 100)
    );

    progressBar.style.width = progress + "%";
    progressText.textContent = "Progress: " + Math.round(progress) + "%";
    progressContainer.setAttribute("aria-valuenow", Math.round(progress));
}

// =====================================
// 5. GENERATE GAME ITEMS
// =====================================

function createGameItem() {
    if (!gameRunning) {
        return;
    }

    const randomIndex = Math.floor(Math.random() * gameItems.length);
    const itemData = gameItems[randomIndex];

    const item = document.createElement("button");
    item.classList.add("game-item");
    item.textContent = itemData.emoji;
    item.type = "button";
    item.setAttribute("aria-label", itemData.name + ", " + itemData.points + " points");

    item.dataset.name = itemData.name;
    item.dataset.points = itemData.points;

    const maxX = Math.max(0, gameArea.clientWidth - 60);
    const maxY = Math.max(0, gameArea.clientHeight - 60);

    item.style.left = Math.random() * maxX + "px";
    item.style.top = Math.random() * maxY + "px";

    item.addEventListener("click", function () {
        if (!gameRunning) {
            return;
        }

        const points = Number(item.dataset.points);
        const itemName = item.dataset.name;

        item.remove();
        score = Math.max(0, score + points);

        if (itemName === "water") {
            message.textContent = "Great job! Clean water +10 points! 💧";
        } else if (itemName === "germ") {
            message.textContent = "Oh no! Germs cost you 5 points! 🦠";
        } else {
            message.textContent = "Watch out! Trash cost you 10 points! 🗑️";
        }

        updateDisplay();
        checkWinCondition();
    });

    gameArea.appendChild(item);

    const items = gameArea.querySelectorAll(".game-item");

    if (items.length > 12) {
        items[0].remove();
    }
}

// =====================================
// 6. CHECK WINNING CONDITIONS
// =====================================

function checkWinCondition() {
    if (score >= goal && gameRunning) {
        endGame(true);
        message.textContent = "🎉 YOU WIN! You reached the clean water goal! 🏆";
        showCelebration();
    }
}

// =====================================
// 7. WIN CELEBRATION
// =====================================

function showCelebration() {
    const celebrationEmojis = ["🎉", "💧", "⭐", "🏆"];

    for (let i = 0; i < 20; i++) {
        const celebration = document.createElement("span");
        celebration.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
        celebration.style.position = "fixed";
        celebration.style.left = Math.random() * 95 + "vw";
        celebration.style.top = Math.random() * 80 + "vh";
        celebration.style.fontSize = "25px";
        celebration.style.pointerEvents = "none";
        celebration.style.zIndex = "1000";

        document.body.appendChild(celebration);

        setTimeout(function () {
            celebration.remove();
        }, 2000);
    }
}

// =====================================
// 8. END THE GAME
// =====================================

function endGame(won) {
    gameRunning = false;

    clearInterval(timerInterval);
    clearInterval(spawnInterval);
    gameArea.replaceChildren();
    startButton.disabled = false;

    if (won) {
        message.textContent = "🎉 Congratulations! You won with " + score + " points!";
    } else {
        message.textContent = "⏰ Time is up! Your score is " + score + ". Press Start to try again!";
    }
}

// =====================================
// 9. START THE GAME
// =====================================

function startGame() {
    if (gameRunning) {
        return;
    }

    const selectedDifficulty = difficultySelect.value;
    const settings = gameSettings[selectedDifficulty];

    score = 0;
    timeLeft = settings.time;
    goal = settings.goal;
    gameRunning = true;

    gameArea.replaceChildren();
    updateDisplay();

    message.textContent = "Game started! Catch the clean water! 💧";

    startButton.disabled = true;
    difficultySelect.disabled = true;

    createGameItem();

    spawnInterval = setInterval(createGameItem, settings.spawnSpeed);

    timerInterval = setInterval(function () {
        if (!gameRunning) {
            return;
        }

        timeLeft--;
        updateDisplay();

        if (timeLeft <= 0) {
            timeLeft = 0;
            updateDisplay();
            endGame(false);
        }
    }, 1000);
}

// =====================================
// 10. RESET THE GAME
// =====================================

function resetGame() {
    clearInterval(timerInterval);
    clearInterval(spawnInterval);

    gameRunning = false;

    score = 0;
    timeLeft = 30;
    goal = 100;

    gameArea.replaceChildren();
    startButton.disabled = false;
    difficultySelect.disabled = false;
    difficultySelect.value = "normal";

    updateDisplay();
    message.textContent = "Game reset! Press Start Game to play again.";
}

// =====================================
// 11. EVENT LISTENERS
// =====================================

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

difficultySelect.addEventListener("change", function () {
    if (!gameRunning) {
        const settings = gameSettings[difficultySelect.value];
        timeLeft = settings.time;
        goal = settings.goal;
        updateDisplay();
        message.textContent = "Difficulty changed to " + difficultySelect.value + ". Press Start Game to play.";
    }
});

// =====================================
// 12. INITIALIZE THE GAME
// =====================================

resetGame();
