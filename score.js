const scores = {
    LONG: -1,
    FIVE: 1000000,
    FOUR: 20000,
    B_FOUR: 3000,
    THREE: 500,
    B_THREE: 100,
    TWO: 20,
}
const directions = [
    { dx: 1, dy: 0 },  // 横向
    { dx: 0, dy: 1 },  // 纵向
    { dx: 1, dy: 1 },  // 斜向 \
    { dx: 1, dy: -1 }  // 斜向 /
  ];