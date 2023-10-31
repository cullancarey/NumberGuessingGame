import StatsManager from "./statsManager.js";
import { generateRandomNumber } from "./utils.js";


export default class GameManager {
    constructor() {
        this.stats = new StatsManager();
        this.randomNumber = generateRandomNumber();
        this.colorStates = Array(10).fill('');
        this.init();
    }

    init = () => {
        this.attachEventListeners();
        this.generateNumberButtons();
        this.stats.loadUserStats();
        this.stats.updateGameStats();
        if (!this.isIPhone()) {  // Assuming isIPhone is also a method on this class
            document.getElementById('userGuess').focus();
        }
    };

    attachEventListeners = () => {
        try {
            const shareButton = document.getElementById('shareButton');
            const clearStatsButton = document.getElementById('clearStatsButton');
            const resetButton = document.getElementById('resetButton');
            const userGuess = document.getElementById("userGuess");

            if (shareButton && clearStatsButton && resetButton && userGuess) {
                shareButton.addEventListener('click', this.shareResults);
                clearStatsButton.addEventListener('click', this.stats.clearStats);
                resetButton.addEventListener('click', this.resetGame);

                userGuess.addEventListener('input', function () {
                    if (this.value.length > 3) {
                        this.value = this.value.slice(0, 3);
                    }
                });

                userGuess.addEventListener('keydown', (event) => {
                    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
                    if ((event.key < '0' || event.key > '9') && !allowedKeys.includes(event.key)) {
                        event.preventDefault();
                    } else if (event.key === 'Enter') {
                        // Handle enter key press and prevent default form submission
                        this.handleEnter(event);
                    }
                });
            } else {
                console.warn("One or more elements not found in the DOM. Event listeners not added.");
            }
        } catch (e) {
            console.error("Error within attachEventListeners:", e);
        }
    };


    isIPhone = () => {
        try {
            return (/iPhone|iPod/i.test(navigator.userAgent) && !window.MSStream);
        } catch (e) {
            console.error("Error within isIPhone:", e);
            return false;  // Default to false if an error occurs
        }
    };

    handleBackspace = (inputString) => {
        try {
            if (typeof inputString !== "string") {
                console.warn("handleBackspace: Expected a string but received:", inputString);
                return "";  // Return empty string if not a valid input
            }
            if (inputString.length > 0) {
                return inputString.substring(0, inputString.length - 1);
            } else {
                return inputString;
            }
        } catch (e) {
            console.error("Error within handleBackspace:", e);
            return "";  // Return empty string if an error occurs
        }
    };

    handleEnter = (event) => {
        try {
            event.preventDefault();  // Prevent the default form submission behaviors
            // Trigger the checkGuess function when enter is pressed
            this.checkGuess();
        } catch (e) {
            console.error("Error within handleEnter:", e);
        }
    };


    checkGuess = () => {
        try {
            let userGuess = document.getElementById('userGuess').value;

            // Basic input validation
            if (!userGuess || userGuess.length !== 3 || isNaN(userGuess)) {
                console.warn("Invalid user guess:", userGuess);
                alert("Please enter a three-digit number");
                return;
            }

            let feedback = [];
            let userGuessArray = userGuess.split('');

            // Assume randomNumber is a class property or global variable
            let randomNumberArray = [...this.randomNumber.split('')];

            // Call to another method, assuming it exists and is error-free
            this.updateNumberButtons(userGuessArray);

            userGuessArray.forEach((digit, index) => {
                if (randomNumberArray[index] === digit) {
                    feedback[index] = 'green';
                    randomNumberArray[index] = null;
                } else {
                    feedback[index] = null;
                }
            });

            userGuessArray.forEach((digit, index) => {
                let digitIndexInRandom = randomNumberArray.indexOf(digit);
                if (digitIndexInRandom !== -1 && feedback[index] === null) {
                    feedback[index] = 'yellow';
                    randomNumberArray[digitIndexInRandom] = null;
                } else if (feedback[index] === null) {
                    feedback[index] = 'grey';
                }
            });

            // Assume guessesLeft is a class property or global variable
            this.stats.guessesLeft--;
            this.updateGuessesLeft();

            if (feedback.every(color => color === 'green') || this.stats.guessesLeft === 0) {
                this.endGame(feedback.every(color => color === 'green'));
            }

            this.displayFeedback(feedback, userGuessArray);

            document.getElementById('userGuess').value = '';

        } catch (e) {
            console.error("Error occurred in checkGuess:", e);
        }
    };


    displayFeedback = (feedback, userGuessArray) => {
        try {
            if (!feedback || !userGuessArray || feedback.length !== userGuessArray.length) {
                console.warn("Invalid parameters:", { feedback, userGuessArray });
                return;
            }

            const feedbackContainers = document.querySelectorAll('.feedback-container');
            if (!feedbackContainers || feedbackContainers.length === 0) {
                console.warn("No feedback containers found");
                return;
            }

            let currentContainer = feedbackContainers[5 - this.stats.guessesLeft]; // Using "this.guessesLeft" assuming it's a class property
            if (!currentContainer) {
                console.warn("Current feedback container not found");
                return;
            }

            feedback.forEach((color, index) => {
                let circle = currentContainer.querySelectorAll('.circle')[index];
                if (!circle) {
                    console.warn(`Circle at index ${index} not found`);
                    return;
                }
                circle.classList.add(color);
                circle.innerText = userGuessArray[index];
            });

        } catch (e) {
            console.error("Error occurred in displayFeedback:", e);
        }
    };

    updateGuessesLeft = () => {
        try {
            const guessesLeftElement = document.getElementById('guessesLeft');
            if (!guessesLeftElement) {
                console.warn("Element with ID 'guessesLeft' not found");
                return;
            }

            guessesLeftElement.innerText = `Guesses Left: ${this.stats.guessesLeft}`; // Using "this.guessesLeft" assuming it's a class property

        } catch (e) {
            console.error("Error occurred in updateGuessesLeft:", e);
        }
    };


    endGame = (isWinner) => {
        try {
            const userGuessElement = document.getElementById('userGuess');
            const keyboardButtonElement = document.querySelector('.keyboard-keys');
            const resetButtonElement = document.getElementById('resetButton');
            const resultMessageElement = document.getElementById('resultMessage');
            const shareButtonElement = document.getElementById('shareButton');

            if (!userGuessElement || !keyboardButtonElement || !resetButtonElement || !resultMessageElement || !shareButtonElement) {
                console.warn("One or more required elements not found");
                return;
            }

            userGuessElement.disabled = true;
            keyboardButtonElement.disabled = true;
            this.disableNumberButtons();
            resetButtonElement.style.display = 'block';

            // Assuming these are class properties. If they are not, you might need to adjust the code.
            this.stats.gamesPlayed++;
            if (isWinner) {
                this.stats.gamesWon++;
                this.stats.currentStreak++;
                if (this.stats.currentStreak > this.stats.maxStreak) {
                    this.stats.maxStreak = this.stats.currentStreak;
                }
            } else {
                this.stats.currentStreak = 0;
            }

            if (this.stats) {
                this.stats.updateGameStats();
                this.stats.saveUserStats();
            } else {
                console.warn("stats object is not available");
            }

            let message = isWinner ? 'Congratulations! You won!' : 'Sorry, you lost. The number was ' + this.randomNumber; // Assuming randomNumber is a class property
            resultMessageElement.innerText = message;

            shareButtonElement.style.display = 'block';
        } catch (e) {
            console.error("An error occurred in endGame:", e);
        }
    };


    resetGame = () => {
        try {
            // Find essential elements
            const resetButtonElement = document.getElementById('resetButton');
            const userGuessElement = document.getElementById('userGuess');
            const keyboardButtonElement = document.querySelector('.keyboard-button');
            const guessesLeftElement = document.getElementById('guessesLeft');
            const resultMessageElement = document.getElementById('resultMessage');

            // Validate elements exist
            if (!resetButtonElement || !userGuessElement || !keyboardButtonElement || !guessesLeftElement || !resultMessageElement) {
                console.warn("One or more required elements not found");
                return;
            }

            // Hide the "New Game" button
            resetButtonElement.style.display = 'none';

            // Enable user input and submission button
            userGuessElement.disabled = false;
            keyboardButtonElement.disabled = false;

            // Generate a new random number, assuming randomNumber is a class property
            this.randomNumber = generateRandomNumber();

            // Reset the number of guesses left, assuming guessesLeft is a class property
            this.stats.guessesLeft = 6;
            guessesLeftElement.innerText = `Guesses Left: ${this.stats.guessesLeft}`;

            // Clear the user's previous guess
            userGuessElement.value = '';

            // Clear the result message
            resultMessageElement.innerText = '';

            // Reset the color states of number buttons and feedback display
            this.resetNumberButtons();
            this.resetFeedbackContainers();

            // Update game statistics, assuming stats is a class property
            if (this.stats) {
                this.stats.updateGameStats();
            } else {
                console.warn("stats object is not available");
            }

            // Reset the color states array, assuming colorStates is a class property
            this.colorStates = Array(10).fill('');

            if (!this.isIPhone()) {
                userGuessElement.focus();
            }
        } catch (e) {
            console.error("An error occurred in resetGame:", e);
        }
    };


    resetFeedbackContainers = () => {
        try {
            // Find and validate the result container
            const resultContainer = document.getElementById('result');
            if (!resultContainer) {
                console.warn("result container not found");
                return;
            }

            // Clear existing content
            resultContainer.innerHTML = '';

            // Loop to create feedback containers
            for (let i = 0; i < 6; i++) {
                let feedbackContainer = document.createElement('div');
                feedbackContainer.className = 'feedback-container';

                // Loop to create circles within each feedback container
                for (let j = 0; j < 3; j++) {
                    let circle = document.createElement('div');
                    circle.className = 'circle';
                    feedbackContainer.appendChild(circle);
                }

                // Append the newly created feedback container to the result container
                resultContainer.appendChild(feedbackContainer);
            }
        } catch (e) {
            console.error("An error occurred in resetFeedbackContainers:", e);
        }
    };


    generateNumberButtons = () => {
        try {
            const containerMain = document.getElementById('container-main');
            const userGuessInput = document.getElementById('userGuess');

            if (!containerMain || !userGuessInput) {
                console.warn("Required HTML elements not found");
                return;
            }

            const keyboardLayout = [
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '<-', '↵']
            ];

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.flexWrap = 'wrap';
            buttonContainer.style.justifyContent = 'center';
            buttonContainer.style.gap = '10px'; // Spacing between buttons

            keyboardLayout.forEach(row => {
                row.forEach(item => {
                    const button = document.createElement('button');
                    button.innerText = item;

                    if (item !== '↵' && item !== '<-') {
                        button.className = 'keyboard-button';
                    } else {
                        button.className = 'keyboard-keys';
                    }

                    if (typeof item === 'number') {
                        button.id = 'btn' + item;
                        button.addEventListener('click', () => {
                            if (userGuessInput.value.length < 3) {
                                userGuessInput.value += item;
                            }
                        });
                    }

                    if (item === '<-') {
                        button.addEventListener('click', () => {
                            userGuessInput.value = this.handleBackspace(userGuessInput.value);
                        });
                    }

                    if (item === '↵') {
                        button.addEventListener('click', () => {
                            this.checkGuess();
                        });
                    }

                    buttonContainer.appendChild(button);
                });
            });

            containerMain.appendChild(buttonContainer);

        } catch (e) {
            console.error("An error occurred in generateNumberButtons:", e);
        }
    };




    resetNumberButtons = () => {
        try {
            for (let i = 0; i <= 9; i++) {
                let button = document.getElementById('btn' + i);
                if (button) { // Check if the button actually exists
                    button.className = 'keyboard-button'; // Reset the class name
                    button.disabled = false; // Enable the button
                    button.removeAttribute('data-correctlyGuessed'); // Remove the data attribute
                } else {
                    console.warn(`Button with id 'btn${i}' not found.`);
                }
            }
        } catch (e) {
            console.error("An error occurred in resetNumberButtons:", e);
        }
    };

    disableNumberButtons = () => {
        try {
            for (let i = 0; i <= 9; i++) {
                let button = document.getElementById('btn' + i);
                if (button) { // Check if the button actually exists
                    button.disabled = true;
                } else {
                    console.warn(`Button with id 'btn${i}' not found.`);
                }
            }
        } catch (e) {
            console.error("An error occurred in resetNumberButtons:", e);
        }
    };

    updateNumberButtons = (userGuessArray) => {
        try {
            let originalRandomNumberArray = this.randomNumber.split('');

            console.log("originalRandomNumberArray: ", originalRandomNumberArray);
            console.log("userGuessArray: ", userGuessArray);

            for (let i = 0; i < 10; i++) {
                let button = document.getElementById('btn' + i);

                if (!button) {
                    console.warn(`Button with id 'btn${i}' not found.`);
                    continue;
                }

                let isDigitInTarget = originalRandomNumberArray.includes(i.toString());
                let isDigitInGuess = userGuessArray.includes(i.toString());
                let targetIndex = originalRandomNumberArray.indexOf(i.toString());
                let guessIndex = userGuessArray.indexOf(i.toString());

                console.log(`Digit ${i} - isDigitInTarget: ${isDigitInTarget}, isDigitInGuess: ${isDigitInGuess}, targetIndex: ${targetIndex}, guessIndex: ${guessIndex}`);

                button.classList.remove('grey', 'green', 'yellow'); // Remove all color classes initially
                if (this.colorStates[i]) button.classList.add(this.colorStates[i]); // Set to the previous color state if it exists

                if (!isDigitInTarget && isDigitInGuess) {
                    button.classList.remove('green', 'yellow');
                    button.classList.add('grey');
                    this.colorStates[i] = 'grey';
                    console.log(`Digit ${i} button is colored grey`);
                }

                if (isDigitInTarget && isDigitInGuess) {
                    if (targetIndex === guessIndex) {
                        button.classList.remove('grey', 'yellow');
                        button.classList.add('green');
                        this.colorStates[i] = 'green';
                        console.log(`Digit ${i} button is colored green`);
                    } else {
                        if (this.colorStates[i] !== 'green') {
                            button.classList.remove('grey');
                            button.classList.add('yellow');
                            this.colorStates[i] = 'yellow';
                            console.log(`Digit ${i} button is colored yellow`);
                        }
                    }
                }
            }
        } catch (e) {
            console.error("An error occurred in updateNumberButtons:", e);
        }
    };

    shareResults = () => {
        try {
            const title = "NumberGuessingGame";
            const url = "https://numberguessinggame.com";
            const separator = '------';
            const actualGuessesMade = 6 - this.stats.guessesLeft;

            // Create a string that mimics the feedback using emojis.
            const feedbackContainers = document.querySelectorAll('.feedback-container');
            if (feedbackContainers.length === 0) {
                console.warn("No feedback containers found.");
                return;
            }

            let feedbackStr = '';
            let count = 0;

            feedbackContainers.forEach(container => {
                if (count < actualGuessesMade) { // Only include rows up to the number of actual guesses made
                    let circles = container.querySelectorAll('.circle');
                    if (circles.length === 0) {
                        console.warn("No circles found within feedback container.");
                        return;
                    }

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
Games Played: ${this.stats.gamesPlayed}
Games Won: ${this.stats.gamesWon}
Current Streak: ${this.stats.currentStreak}
Max Streak: ${this.stats.maxStreak}
${separator}
${feedbackStr}
`;

            // Check if the Web Share API is supported
            if (this.isIPhone() && navigator.share) {
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
        } catch (e) {
            console.error("An error occurred in shareResults:", e);
        }
    };

}