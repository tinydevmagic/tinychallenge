import { images } from './images.js';
let currentCards = [];
let flippedCards = [];
let gameEnded = false;

function startGame() {
    document.getElementById("splashScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "flex";
    document.getElementById("endScreen").style.display = "none";
    initGame();
}

function initGame() {
    flippedCards = [];
    gameEnded = false;
    currentCards = shuffle(images).slice(0, 6);
    renderCards();
    updateStatus("Pick 2 cards");
    document.getElementById("endScreen").style.display = "none";
}

function renderCards() {
    const board = document.getElementById("gameBoard");
    board.innerHTML = "";

    currentCards.forEach((cardData, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.id = cardData.id;

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">
                    <img src="${cardData.img}" alt="${cardData.id}" class="card-img"/>
                </div>
            </div>
        `;

        card.addEventListener("click", () => flipCard(card));
        board.appendChild(card);
    });
}

function flipCard(card) {
    if (gameEnded || flippedCards.includes(card)) return;

    card.classList.add("flipped", "clicked");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        gameEnded = true;
        setTimeout(() => {
            showEndScreen();
        }, 800);
    } else {
        updateStatus("Pick your 2nd card");
    }
}

function showEndScreen() {
    const chosenContainer = document.getElementById("chosenCards");
    chosenContainer.innerHTML = "";

    flippedCards.forEach(card => {
        const img = card.querySelector("img").cloneNode();
        const imageData = images.find(img => img.id === Number(card.querySelector("img").alt));

        const wrapper = document.createElement("div");
        wrapper.classList.add("end-card");
        wrapper.appendChild(img);

        if (imageData) {
            const authorLink = document.createElement("a");
            authorLink.href = imageData.authorUrl;
            authorLink.textContent = `@${imageData.author}`;
            authorLink.target = "_blank";
            authorLink.rel = "noopener noreferrer";
            authorLink.classList.add("author-link");

            wrapper.appendChild(authorLink);
        }
        chosenContainer.appendChild(wrapper);
    });

    document.getElementById("endScreen").style.display = "flex";
    updateStatus("");
    launchConfetti();
}

function resetGame() {
    document.getElementById("splashScreen").style.display = "flex";
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("endScreen").style.display = "none";
}

function updateStatus(msg) {
    document.getElementById("status").textContent = msg;
}

function shuffle(array) {
    return array.slice().sort(() => 0.5 - Math.random());
}

function launchConfetti() {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 100,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 100,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

function downloadSelection() {
    const container = document.querySelector('.chosen-cards');

    html2canvas(container, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
        allowTaint: false
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "tinychallenge.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startBtn").addEventListener("click", startGame);
    document.getElementById("resetBtn").addEventListener("click", resetGame);
    document.getElementById("backBtn").addEventListener("click", resetGame);
    document.getElementById("downloadBtn").addEventListener("click", downloadSelection);
});

