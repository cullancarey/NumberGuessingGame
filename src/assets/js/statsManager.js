export default class StatsManager {
    constructor() {
        try {
            this.guessesLeft = 6;
            this.gamesPlayed = 0;
            this.gamesWon = 0;
            this.currentStreak = 0;
            this.maxStreak = 0;
        } catch (e) {
            console.error("An error occurred in the constructor:", e);
        }
    }

    loadUserStats = () => {
        try {
            this.gamesPlayed = localStorage.getItem('gamesPlayed') || 0;
            this.gamesWon = localStorage.getItem('gamesWon') || 0;
            this.currentStreak = localStorage.getItem('currentStreak') || 0;
            this.maxStreak = localStorage.getItem('maxStreak') || 0;
        } catch (e) {
            console.error("An error occurred while loading user stats:", e);
        }
    };

    saveUserStats = () => {
        try {
            localStorage.setItem('gamesPlayed', this.gamesPlayed);
            localStorage.setItem('gamesWon', this.gamesWon);
            localStorage.setItem('currentStreak', this.currentStreak);
            localStorage.setItem('maxStreak', this.maxStreak);
        } catch (e) {
            console.error("An error occurred while saving user stats:", e);
        }
    };

    clearStats = () => {
        try {
            this.gamesPlayed = 0;
            this.gamesWon = 0;
            this.currentStreak = 0;
            this.maxStreak = 0;
            localStorage.clear(); // This will clear everything in localStorage for this domain
            this.updateGameStats();
        } catch (e) {
            console.error("An error occurred while clearing stats:", e);
        }
    };

    updateGameStats = () => {
        try {
            document.getElementById('gamesPlayed').textContent = this.gamesPlayed;
            document.getElementById('gamesWon').textContent = this.gamesWon;

            // Calculate and display the percentage win
            const percentageWin = this.gamesPlayed === 0 ? 0 : ((this.gamesWon / this.gamesPlayed) * 100).toFixed(2);
            document.getElementById('percentageWin').textContent = `${percentageWin}%`;

            document.getElementById('currentStreak').textContent = this.currentStreak;
            document.getElementById('maxStreak').textContent = this.maxStreak;
        } catch (e) {
            console.error("An error occurred while updating game stats:", e);
        }
    };
}
