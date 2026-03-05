/* matrix.js */
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const codingWords = ['printf()', 'for', 'while', 'if', 'else', 'return', 'void', 'int', 'main', 'const', 'let'];
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/%=<>!&|^~?.';
const fontSize = 14; 

const columns = Math.floor(canvas.width / (fontSize * 0.7));
const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -150; 
}

function draw() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FF4500'; 
    ctx.font = 'bold ' + fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        let text;
        const randomChoice = Math.random();
        
        if (randomChoice > 0.85) {
            text = codingWords[Math.floor(Math.random() * codingWords.length)];
        } else {
            text = chars.charAt(Math.floor(Math.random() * chars.length));
        }

        ctx.fillText(text, i * (fontSize * 0.7), drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.90) {
            drops[i] = 0;
        }
        drops[i] += 0.5; 
    }
}

setInterval(draw, 33);