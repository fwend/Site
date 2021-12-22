export function createMatrix(nRows, nCols, val = 0) {
    let result = Array(nRows);
    for (let i = 0; i < result.length; i++) {
        result[i] = Array.from({length: nCols}, () => val);
    }
    return result;
}
