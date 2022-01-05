import {createRandomString, randomChar} from "../_shared/string.js";

const target = "methinks it is like a weasel";
const alphabet = "abcdefghijklmnopqrstuvwxyz ";
const genSize = 100;
const prob = 0.05;

const startButton = document.querySelector('.startButton');

startButton.addEventListener('click', function() {
    main(createRandomString(target.length, alphabet));
});

function distance(str) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] !== target[i]) {
            count++;
        }
    }
    return count;
}

function mutate(parent) {
    let result = '';
    for (let i = 0; i < parent.length; i++) {
        result += Math.random() < prob ? randomChar(alphabet) : parent[i];
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

function presentResult(table, count, result, dist) {
    const row = table.insertRow(-1);

    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    const cell3 = row.insertCell(2);
    cell1.innerHTML = count;
    cell2.innerHTML = dist === 0 ? result.toUpperCase(): result;
    cell3.innerHTML = dist;
}

function main(child) {
    const table = document.querySelector('table.evolution');
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    let count = 1, dist = 1;
    do {
        child = nextGeneration(child);
        dist = distance(child);
        presentResult(table, count, child, dist)
    } while (dist > 0 && count++ < 1000);
}
