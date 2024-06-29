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