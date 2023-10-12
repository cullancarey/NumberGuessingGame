let randomNumber = String(Math.floor(Math.random() * 900) + 100); // Ensures a three-digit number
let guessesLeft = 6;
// Define variables to track game statistics
let gamesPlayed = 0;
let gamesWon = 0;
let currentStreak = 0;
let maxStreak = 0;

// Call generateNumberButtons() when the page loads.
// document.addEventListener('DOMContentLoaded', generateNumberButtons);
// Call loadUserStats() when the page loads to load previously saved user stats
document.addEventListener('DOMContentLoaded', function () {
    generateNumberButtons();
    loadUserStats();
    updateGameStats();
    if (!isIPhone()) {
        document.getElementById('userGuess').focus();
    }
});


const userGuess = document.getElementById("userGuess");
userGuess.addEventListener('input', function () {
    if (this.value.length > 3) {
        this.value = this.value.slice(0, 3);
    }
});
userGuess.addEventListener('keydown', function (event) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'];
    if ((event.key < '0' || event.key > '9') && !allowedKeys.includes(event.key)) {
        event.preventDefault();
    }
});





function loadUserStats() {
    gamesPlayed = localStorage.getItem('gamesPlayed') || 0;
    gamesWon = localStorage.getItem('gamesWon') || 0;
    currentStreak = localStorage.getItem('currentStreak') || 0;
    maxStreak = localStorage.getItem('maxStreak') || 0;
}

function saveUserStats() {
    localStorage.setItem('gamesPlayed', gamesPlayed);
    localStorage.setItem('gamesWon', gamesWon);
    localStorage.setItem('currentStreak', currentStreak);
    localStorage.setItem('maxStreak', maxStreak);
}

function clearStats() {
    gamesPlayed = 0;
    gamesWon = 0;
    currentStreak = 0;
    maxStreak = 0;
    localStorage.clear(); // This will clear everything in localStorage for this domain
    updateGameStats();
}

function checkGuess() {
    let userGuess = document.getElementById('userGuess').value;

    if (userGuess.length !== 3 || isNaN(userGuess)) {
        alert("Please enter a three-digit number");
        return;
    }

    let feedback = [];
    let userGuessArray = userGuess.split('');
    let randomNumberArray = [...randomNumber.split('')]; // Create a copy instead of mutating the original
    updateNumberButtons(userGuessArray);

    userGuessArray.forEach((digit, index) => {
        if (randomNumberArray[index] === digit) {
            feedback[index] = 'green';
            randomNumberArray[index] = null; // Set the matched digit to null to avoid multiple matches
        } else {
            feedback[index] = null; // Default value
        }
    });

    userGuessArray.forEach((digit, index) => {
        let digitIndexInRandom = randomNumberArray.indexOf(digit);
        if (digitIndexInRandom !== -1 && feedback[index] === null) {
            feedback[index] = 'yellow';
            randomNumberArray[digitIndexInRandom] = null; // Set the matched digit to null to avoid multiple matches
        } else if (feedback[index] === null) {
            feedback[index] = 'grey';
        }
    });

    guessesLeft--;
    updateGuessesLeft();

    if (feedback.every(color => color === 'green') || guessesLeft === 0) {
        endGame(feedback.every(color => color === 'green'));
    }
    displayFeedback(feedback, userGuessArray); // Pass userGuessArray as an argument to the displayFeedback function
    // Clear the userGuess input area after each guess
    document.getElementById('userGuess').value = '';
}

function displayFeedback(feedback, userGuessArray) { // Accept userGuessArray as a parameter
    const feedbackContainers = document.querySelectorAll('.feedback-container');
    let currentContainer = feedbackContainers[5 - guessesLeft];

    feedback.forEach((color, index) => {
        let circle = currentContainer.querySelectorAll('.circle')[index];
        circle.classList.add(color);
        // Add the user's guess digit to the circle
        circle.innerText = userGuessArray[index];
    });
}

function updateGuessesLeft() {
    document.getElementById('guessesLeft').innerText = `Guesses Left: ${guessesLeft}`;
}

function endGame(isWinner) {
    document.getElementById('userGuess').disabled = true;
    document.querySelector('.keyboard-button').disabled = true;
    document.getElementById('resetButton').style.display = 'block';

    // Update game statistics
    gamesPlayed++;
    if (isWinner) {
        gamesWon++;
        currentStreak++;
        if (currentStreak > maxStreak) {
            maxStreak = currentStreak;
        }
    } else {
        currentStreak = 0;
    }
    updateGameStats();
    saveUserStats();

    let message = isWinner ? 'Congratulations! You won!' : 'Sorry, you lost. The number was ' + randomNumber;
    document.getElementById('resultMessage').innerText = message;


    document.getElementById('shareButton').style.display = 'block';
}

function resetGame() {
    // Hide the "New Game" button
    document.getElementById('resetButton').style.display = 'none';

    // Enable user input and submission button
    document.getElementById('userGuess').disabled = false;
    document.querySelector('.keyboard-button').disabled = false;

    // Generate a new random number
    randomNumber = String(Math.floor(Math.random() * 900) + 100);

    // Reset the number of guesses left
    guessesLeft = 6;
    document.getElementById('guessesLeft').innerText = `Guesses Left: ${guessesLeft}`;

    // Clear the user's previous guess
    document.getElementById('userGuess').value = '';

    // Clear the result message
    document.getElementById('resultMessage').innerText = '';

    // Reset the color states of number buttons
    resetNumberButtons();

    // Reset the feedback display
    resetFeedbackContainers();

    // Reset game statistics
    updateGameStats();

    // Reset the color states array
    colorStates = Array(10).fill('');
    if (!isIPhone()) {
        document.getElementById('userGuess').focus();
    }

}

function resetFeedbackContainers() {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        let feedbackContainer = document.createElement('div');
        feedbackContainer.className = 'feedback-container';
        for (let j = 0; j < 3; j++) {
            let circle = document.createElement('div');
            circle.className = 'circle';
            feedbackContainer.appendChild(circle);
        }
        resultContainer.appendChild(feedbackContainer);
    }
}

// Generate the number buttons and add event listeners to them
function generateNumberButtons() {
    const keyboardContainer = document.getElementById('keyboardContainer');
    const userGuessInput = document.getElementById('userGuess');
    // Update keyboard layout to include backspace and enter buttons
    const keyboardLayout = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        ['<-', 0, '↵']
    ];

    // Generate the keyboard buttons
    keyboardLayout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.style.display = 'flex';
        rowDiv.style.justifyContent = 'center';

        row.forEach(item => {
            const button = document.createElement('button');
            button.innerText = item;

            if (item !== '↵' && item !== '<-') {
                button.className = 'keyboard-button';
            } else {
                button.className = 'keyboard-keys';
            }

            // Number buttons
            if (typeof item === 'number') {
                button.id = 'btn' + item;
                button.addEventListener('click', function () {
                    if (userGuessInput.value.length < 3) {
                        userGuessInput.value += item; // Append the number to the input value
                    }
                });
            }

            // Backspace button
            if (item === '<-') {
                button.addEventListener('click', function () {
                    userGuessInput.value = handleBackspace(userGuessInput.value);
                });
            }

            // Enter (Submit) button
            if (item === '↵') {
                button.addEventListener('click', function () {
                    checkGuess()
                });
            }

            rowDiv.appendChild(button);
        });

        keyboardContainer.appendChild(rowDiv);
    });
}

// This will reset the colors of the number buttons when the game is reset.
function resetNumberButtons() {
    for (let i = 0; i <= 9; i++) {
        let button = document.getElementById('btn' + i);
        if (button) { // Check if the button actually exists
            button.className = 'keyboard-button'; // Reset the class name
            button.disabled = false; // Enable the button
            button.removeAttribute('data-correctlyGuessed'); // Remove the data attribute
        }
    }
}




// This should be defined outside of your function to retain its value across multiple calls.
let colorStates = Array(10).fill(''); // Initializing color states for each button. '' denotes uncolored.

function updateNumberButtons(userGuessArray) {
    let originalRandomNumberArray = randomNumber.split('');

    console.log("originalRandomNumberArray: ", originalRandomNumberArray);
    console.log("userGuessArray: ", userGuessArray);

    for (let i = 0; i < 10; i++) {
        let button = document.getElementById('btn' + i);

        let isDigitInTarget = originalRandomNumberArray.includes(i.toString());
        let isDigitInGuess = userGuessArray.includes(i.toString());
        let targetIndex = originalRandomNumberArray.indexOf(i.toString());
        let guessIndex = userGuessArray.indexOf(i.toString());

        console.log(`Digit ${i} - isDigitInTarget: ${isDigitInTarget}, isDigitInGuess: ${isDigitInGuess}, targetIndex: ${targetIndex}, guessIndex: ${guessIndex}`);

        button.classList.remove('grey', 'green', 'yellow'); // Remove all color classes initially
        if (colorStates[i]) button.classList.add(colorStates[i]); // Set to the previous color state if it exists

        if (!isDigitInTarget && isDigitInGuess) {
            button.classList.remove('green', 'yellow');
            button.classList.add('grey');
            colorStates[i] = 'grey';
            console.log(`Digit ${i} button is colored grey`);
        }

        if (isDigitInTarget && isDigitInGuess) {
            if (targetIndex === guessIndex) {
                button.classList.remove('grey', 'yellow');
                button.classList.add('green');
                colorStates[i] = 'green';
                console.log(`Digit ${i} button is colored green`);
            } else {
                if (colorStates[i] !== 'green') {
                    button.classList.remove('grey');
                    button.classList.add('yellow');
                    colorStates[i] = 'yellow';
                    console.log(`Digit ${i} button is colored yellow`);
                }
            }
        }
    }
}

// Add an event listener for the keydown event
document.getElementById('userGuess').addEventListener('keydown', function (event) {
    if (event.key === 'Backspace') {
        // Handle backspace key press
        handleBackspace(event);
    } else if (event.key === 'Enter') {
        // Handle enter key press and prevent default form submission
        handleEnter(event);
    }
});

function handleBackspace(inputString) {
    if (inputString.length > 0) {
        return inputString.substring(0, inputString.length - 1);
    } else {
        return inputString;
    }
}



function handleEnter(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    // Trigger the checkGuess function when enter is pressed
    checkGuess();
}

// Function to update game statistics in the HTML
function updateGameStats() {
    document.getElementById('gamesPlayed').textContent = gamesPlayed;
    document.getElementById('gamesWon').textContent = gamesWon;

    // Calculate and display the percentage win
    const percentageWin = gamesPlayed === 0 ? 0 : ((gamesWon / gamesPlayed) * 100).toFixed(2);
    document.getElementById('percentageWin').textContent = `${percentageWin}%`;

    document.getElementById('currentStreak').textContent = currentStreak;
    document.getElementById('maxStreak').textContent = maxStreak;
}

function isIPhone() {
    return (/iPhone|iPod/i.test(navigator.userAgent) && !window.MSStream);
}

function shareResults() {
    const title = "NumberGuessingGame";
    const url = "https://numberguessinggame.com";
    const separator = '------';
    const actualGuessesMade = 6 - guessesLeft;

    // Create a string that mimics the feedback using emojis.
    const feedbackContainers = document.querySelectorAll('.feedback-container');
    let feedbackStr = '';
    let count = 0;

    feedbackContainers.forEach(container => {
        if (count < actualGuessesMade) { // Only include rows up to the number of actual guesses made
            let circles = container.querySelectorAll('.circle');
            let guessLine = '';

            circles.forEach(circle => {
                let color = '';
                if (circle.classList.contains('green')) {
                    color = '🟩';
                } else if (circle.classList.contains('yellow')) {
                    color = '🟨';
                } else {
                    color = '⬛';
                }
                guessLine += color;
            });

            feedbackStr += guessLine + '\n';
            count++;
        }
    });

    const text = `
${separator}
Games Played: ${gamesPlayed}
Games Won: ${gamesWon}
Current Streak: ${currentStreak}
Max Streak: ${maxStreak}
${separator}
${feedbackStr}
`;

    // Check if the Web Share API is supported
    if (isIPhone() && navigator.share) {
        // Mobile devices with Web Share API support
        navigator.share({
            title: title,
            text: text.trim(),
            url: url,
        })
            .then(() => console.log('Successfully shared!'))
            .catch((error) => console.log('Error sharing:', error));
    } else {
        // Desktop devices or mobile devices without Web Share API
        navigator.clipboard.writeText(`${title}\n${url}\n${text.trim()}`)
            .then(() => {
                console.log('Results copied to clipboard!');
                alert('Results copied to clipboard! Share them anywhere you like.');
            })
            .catch((err) => {
                console.error('Could not copy text: ', err);
                alert('Unable to copy results to clipboard. Please copy your results manually.');
            });
    }
}



// Assume you have a share button with id 'shareButton'
document.getElementById('shareButton').addEventListener('click', shareResults);
document.getElementById('clearStatsButton').addEventListener('click', clearStats);
document.getElementById('resetButton').addEventListener('click', resetGame);
