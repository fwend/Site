export function shuffleArray(arr) {
    let i = arr.length;
    while (--i) {
        let randomIndex = Math.floor(i * Math.random());
        if (randomIndex !== i) {
            let tmp = arr[i];
            arr[i] = arr[randomIndex];
            arr[randomIndex] = tmp;
        }
    }
}
