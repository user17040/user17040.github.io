const map = {
    '1': 0,
    '2': 1,
    '3': 2,
    '4': 3,
    '5': 4,
    '6': 5,
    '7': 6,
    '8': 7,
    '9': 8,
    'a': 9,
    'b': 10,
    'c': 11,
    'd': 12,
    'e': 13,
    'f': 14
};
function str2arr(str) {
    var array = new Array(15).fill(0);

    for (var i = 0; i < 15; i++) {
        array[i] = new Array(15).fill(0);
    }
    for (var i = 0; i < str.length; i += 2) {
        array[map[str[i]]][map[str[i + 1]]] = i % 4 == 0 ? 1 : -1;
    }
    return array;
}