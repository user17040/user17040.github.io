let books = [
    [[7, 7]],
    [[7, 7], [8, 8]],
    //开局
    [[7, 7], [7, 8], [8, 8]],
    [[7, 7], [8, 8], [8, 6]],
    //浦月
    [[7, 7], [8, 8], [8, 6], [6, 8], [9, 6]],
    //浦月最强防G9
    [[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [6, 6], [9, 7]],
    [[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [6, 7], [9, 8]],
    [[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [7, 6], [9, 7]],
    [[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [7, 8], [9, 8]],
    [[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [7, 9], [9, 7]],
    [[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [8, 7], [10, 6]],
    [[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [9, 7], [10, 6]],
    [[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [9, 8], [7, 8]],
    [[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [10, 6], [7, 8]],
    [[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [10, 8], [9, 8]],
];
function rotate90(steps, boardSize) {
    const center = (boardSize - 1) / 2;
    return steps.map(([x, y]) => {
        const newX = center + (center - y);
        const newY = center - (center - x);
        return [newX, newY];
    });
}
function rotate180(steps, boardSize) {
    return steps.map(([x, y]) => {
        const newX = boardSize - 1 - x;
        const newY = boardSize - 1 - y;
        return [newX, newY];
    });
}
function rotate270(steps, boardSize) {
    const center = (boardSize - 1) / 2;
    return steps.map(([x, y]) => {
        const newX = center - (center - y);
        const newY = center + (center - x);
        return [newX, newY];
    });
}
function flipHorizontal(steps, boardSize) {
    return steps.map(([x, y]) => {
        return [x, boardSize - 1 - y];
    });
}