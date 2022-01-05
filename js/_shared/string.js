export function createRandomString(len, src) {
    let str = '';
    for (let i = 0; i < len; i++) {
        str += randomChar(src);
    }
    return str;
}

export function randomChar(src) {
    return src[Math.floor(Math.random() * src.length)];
}
