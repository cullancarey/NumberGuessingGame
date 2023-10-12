export function generateRandomNumber() {
    return String(Math.floor(Math.random() * 900) + 100); // Ensures a three-digit number
}