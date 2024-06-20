function numToLetter(num) {
    return String.fromCharCode(num + 65); // 将数字转换为对应的字母（A=1, B=2, ..., Z=26）
}

function convertCoordinate(coordinate) {
    const [col, row] = coordinate;
    return numToLetter(col) + (row+1);
}

function convertCoordinates(coordinates) {
    return coordinates.map(convertCoordinate).join(' ');
}

