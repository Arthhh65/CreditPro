let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector(".resetbtn");

let turnO = true;
let gameEnded = false;

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
};

resetBtn.addEventListener("click", () => {
    turnO = true;
    gameEnded = false;
    enableBoxes();
});

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO) {
            box.innerText = "O";
            turnO = false;
        } else {
            box.innerText = "X";
            turnO = true;
        }
        box.disabled = true;

        checkwinner();
    });
});

const checkwinner = () => {
    if (gameEnded) return;

    winPatterns.forEach((pattern) => {
        const [a, b, c] = pattern;
        if (
            boxes[a].innerText &&
            boxes[a].innerText === boxes[b].innerText &&
            boxes[b].innerText === boxes[c].innerText
        ) {
            disableBoxes();
            gameEnded = true;
            alert(`Winner is ${boxes[a].innerText}`);
        }
    });
};
