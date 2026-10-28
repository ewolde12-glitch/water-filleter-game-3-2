// =====================================
// 1. GAME SETTINGS
// =====================================

// Store the settings for each difficulty level.

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

// Store information about the game objects.

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
// 3. CONNECT JAVASCRIPT TO HTML
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

const progressContainer =
    document.getElementById("progressContainer");

// =====================================
// 4. UPDATE THE SCOREBOARD
// =====================================

function updateDisplay() {

    // Display the current game information.

    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    goalDisplay.textContent = goal;

    // Calculate progress toward the goal.

    const progress = Math.min(
        100,
        Math.max(0, (score / goal) * 100)
    );

    // Update the progress bar.

    progressBar.style.width = progress + "%";

    progressText.textContent =
        "Progress: " + Math.round(progress) + "%";

    progressContainer.setAttribute(
        "aria-valuenow",
        Math.round(progress)
    );
}

// =====================================
// 5. CREATE RANDOM GAME OBJECTS
// =====================================

function createGameItem() {

    // Do not create objects if the game has ended.

    if (!gameRunning) {
        return;
    }

    // Choose a random object from the gameItems array.

    const randomIndex = Math.floor(
        Math.random() * gameItems.length
    );

    const itemData = gameItems[randomIndex];

    // Create a new button using the DOM.

    const item = document.createElement("button");

    item.classList.add("game-item");

    item.textContent = itemData.emoji;

    item.type = "button";

    item.setAttribute(
        "aria-label",
        itemData.name + ", " + itemData.points + " points"
    );

    // Store the object's information.

    item.dataset.name = itemData.name;
    item.dataset.points = itemData.points;

    // Calculate a random position inside the game area.

    const maxX = Math.max(0, gameArea.clientWidth - 60);
    const maxY = Math.max(0, gameArea.clientHeight - 60);

    item.style.left = Math.random() * maxX + "px";
    item.style.top = Math.random() * maxY + "px";

    // =====================================
    // 6. HANDLE PLAYER CLICKS
    // =====================================

    item.addEventListener("click", function () {

        // Ignore clicks after the game ends.

        if (!gameRunning) {
            return;
        }

        // Read the object's information.

        const points = Number(item.dataset.points);
        const itemName = item.dataset.name;

        // Remove the clicked object.

        item.remove();

        // Update the score without allowing negative scores.

        score = Math.max(0, score + points);

        // Give the player feedback.

        if (itemName === "water") {

            message.textContent =
                "Great job! Clean water +10 points! 💧";

        } else if (itemName === "germ") {

            message.textContent =
                "Oh no! Germs cost you 5 points! 🦠";

        } else {

            message.textContent =
                "Watch out! Trash cost you 10 points! 🗑️";
        }

        // Refresh the scoreboard.

        updateDisplay();

        // Check if the player has won.

        checkWinCondition();
    });

    // Add the object to the game area.

    gameArea.appendChild(item);

    // Keep no more than 12 objects on the screen.

    const items = gameArea.querySelectorAll(".game-item");

    if (items.length > 12) {
        items[0].remove();
    }
}

// =====================================
// 7. CHECK THE WINNING CONDITION
// =====================================

function checkWinCondition() {

    if (score >= goal && gameRunning) {

        // Stop the game.

        endGame(true);

        // Show the winning message.

        message.textContent =
            "🎉 YOU WIN! You reached the clean water goal! 🏆";

        // Celebrate the player's achievement.

        showCelebration();
    }
}

// =====================================
// 8. CELEBRATE A WIN
// =====================================

function showCelebration() {

    // Store celebration symbols in an array.

    const celebrationEmojis = [
        "🎉",
        "💧",
        "⭐",
        "🏆"
    ];

    // Use a loop to create 20 celebration symbols.

    for (let i = 0; i < 20; i++) {

        const celebration = document.createElement("span");

        // Choose a random celebration symbol.

        celebration.textContent =
            celebrationEmojis[
                Math.floor(
                    Math.random() * celebrationEmojis.length
                )
            ];

        // Place the symbol at a random screen position.

        celebration.style.position = "fixed";

        celebration.style.left =
            Math.random() * 95 + "vw";

        celebration.style.top =
            Math.random() * 80 + "vh";

        celebration.style.fontSize = "25px";

        celebration.style.pointerEvents = "none";

        celebration.style.zIndex = "1000";

        // Display the symbol.

        document.body.appendChild(celebration);

        // Remove it after two seconds.

        setTimeout(function () {
            celebration.remove();
        }, 2000);
    }
}

// =====================================
// 9. END THE GAME
// =====================================

function endGame(won) {

    // Stop the game.

    gameRunning = false;

    // Stop both timers.

    clearInterval(timerInterval);
    clearInterval(spawnInterval);

    // Remove the remaining game objects.

    gameArea.replaceChildren();

    // Allow the player to start another game.

    startButton.disabled = false;

    // Display the final result.

    if (won) {

        message.textContent =
            "🎉 Congratulations! You won with " +
            score + " points!";

    } else {

        message.textContent =
            "⏰ Time is up! Your score is " +
            score + ". Press Start to try again!";
    }
}

// =====================================
// 10. START THE GAME
// =====================================

function startGame() {

    // Prevent multiple games from running simultaneously.

    if (gameRunning) {
        return;
    }

    // Get the selected difficulty.

    const selectedDifficulty = difficultySelect.value;

    // Find the settings for that difficulty.

    const settings = gameSettings[selectedDifficulty];

    // Initialize the game variables.

    score = 0;
    timeLeft = settings.time;
    goal = settings.goal;

    gameRunning = true;

    // Clear the previous game area.

    gameArea.replaceChildren();

    // Update the scoreboard.

    updateDisplay();

    // Display the starting message.

    message.textContent =
        "Game started! Catch the clean water! 💧";

    // Disable the Start button and difficulty selector.

    startButton.disabled = true;
    difficultySelect.disabled = true;

    // Create the first object immediately.

    createGameItem();

    // Generate more objects repeatedly.

    spawnInterval = setInterval(
        createGameItem,
        settings.spawnSpeed
    );

    // =====================================
    // 11. COUNTDOWN TIMER
    // =====================================

    timerInterval = setInterval(function () {

        // Stop if the game is no longer running.

        if (!gameRunning) {
            return;
        }

        // Decrease the remaining time.

        timeLeft--;

        // Update the timer on the screen.

        updateDisplay();

        // End the game when time runs out.

        if (timeLeft <= 0) {

            timeLeft = 0;

            updateDisplay();

            endGame(false);
        }

    }, 1000);
}

// =====================================
// 12. RESET THE GAME
// =====================================

function resetGame() {

    // Stop any existing timers.

    clearInterval(timerInterval);
    clearInterval(spawnInterval);

    // Stop the current game.

    gameRunning = false;

    // Reset the score, time, and goal.

    score = 0;
    timeLeft = 30;
    goal = 100;

    // Remove all objects from the game area.

    gameArea.replaceChildren();

    // Enable the game controls.

    startButton.disabled = false;
    difficultySelect.disabled = false;

    // Set the default difficulty to Normal.

    difficultySelect.value = "normal";

    // Refresh the scoreboard.

    updateDisplay();

    // Display a reset message.

    message.textContent =
        "Game reset! Press Start Game to play again.";
}

// =====================================
// 13. EVENT LISTENERS
// =====================================

// Start the game when the Start button is clicked.

startButton.addEventListener("click", startGame);

// Reset the game when the Reset button is clicked.

resetButton.addEventListener("click", resetGame);

// =====================================
// 14. INITIALIZE THE GAME
// =====================================

// Set the initial scoreboard and message.

resetGame();