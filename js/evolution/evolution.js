const target = "METHINKS IT IS LIKE A WEASEL";
const alphabet = "abcdefghijklmnopqrstuvwxyz ";
const genSize = 100;

const startButton = document.querySelector('.startButton');

startButton.addEventListener('click', function(e) {
    main(createRandomString(target.length));
});

function createRandomString(len) {
    let str = '';
    for (let i = 0; i < len; i++) {
        str += randomChar();
    }
    return str;
}

function randomChar() {
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function distance(str) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i].toLowerCase() !== target[i].toLowerCase()) {
            count++;
        }
    }
    return count;
}

function mutate(parent) {
    let result = '';
    for (let i = 0; i < parent.length; i++) {
        result += Math.random() < 0.05 ? randomChar() : parent[i];
    }
    return result;
}

function nextGeneration(parent) {
    let bestDist = distance(parent);
    let best = parent;
    for (let i = 0; i < genSize; i++) {
        const mutation = mutate(best);
        const dist = distance(mutation);
        if (dist < bestDist) {
            bestDist = dist;
            best = mutation;
        }
    }
    return best;
}

let count = 0;
function main(child) {
    do {
        child = nextGeneration(child);
        console.log(child)
    } while (child !== target && count++ < 1000);
    console.log(child.toUpperCase())
}
