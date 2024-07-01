const scores = {
    LONG: -1,
    FIVE: 1000000,
    D_B_FOUR: 12000,
    FOUR: 40000,
    B_FOUR: 6000,
    THREE: 1000,
    B_THREE: 200,
    TWO: 40,
    B_TWO: 10,
    ONE: 1
}
const directions = [
    { dx: 1, dy: 0 },  // 横向
    { dx: 0, dy: 1 },  // 纵向
    { dx: 1, dy: 1 },  // 斜向 \
    { dx: 1, dy: -1 }  // 斜向 /
];
const map = {
    6: scores.LONG,
    5: scores.FIVE,
    4: scores.FOUR,
    40: scores.B_FOUR,
    4312: scores.D_B_FOUR,
    4222: scores.D_B_FOUR,
    4132: scores.D_B_FOUR,
    431: scores.B_FOUR,
    422: scores.B_FOUR,
    413: scores.B_FOUR,
    3: scores.THREE,
    30: scores.THREE,
    321: scores.THREE,
    312: scores.THREE,
    300: scores.B_THREE,
    3210: scores.B_THREE,
    3120: scores.B_THREE,
    3021: scores.B_THREE,
    3012: scores.B_THREE,
    30111: scores.B_THREE,
    31110: scores.B_THREE,
    2: scores.TWO,
    21: scores.TWO,
    211: scores.TWO,
    20: scores.B_TWO,
    210: scores.B_TWO,
    2110: scores.B_TWO,
    1: scores.ONE,
    0: 0
}
const NOT_DISTHREE = 0.125;