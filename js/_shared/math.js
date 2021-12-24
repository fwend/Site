export function range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
        result[i - start] = i;
    }
    return result;
}

export function sum(arr) {
    return arr.reduce((result, val) => result + val, 0);
}

export function randomInt(to, from = 0) {
    return Math.floor(Math.random() * to) + from;
}
