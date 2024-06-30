let books = [[[7, 7]], [[7, 7], [8, 8]], [[7, 7], [7, 8], [8, 8]], [[7, 7], [8, 8], [8, 6]]];
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