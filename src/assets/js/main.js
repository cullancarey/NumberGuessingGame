// main.js
import GameManager from './gameManager.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        new GameManager();
    } catch (e) {
        console.error("An error occurred while initializing GameManager:", e);
    }
});
