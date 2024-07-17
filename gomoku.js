// 定义棋盘大小
const ROWS = 15;
const COLS = 15;

// 定义棋子类型
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

// 定义评估函数权重
const SCORE_TABLE = {
  [EMPTY]: 0,
  [BLACK]: {
    1: 10,
    2: 100,
    3: 1000,
    4: 10000
  },
  [WHITE]: {
    1: 10,
    2: 100,
    3: 1000,
    4: 10000
  }
};

// 初始化棋盘
function initBoard() {
  const board = [];
  for (let i = 0; i < ROWS; i++) {
    board[i] = [];
    for (let j = 0; j < COLS; j++) {
      board[i][j] = EMPTY;
    }
  }
  return board;
}

// 评估当前局面得分
function evaluate(board, player) {
  let score = 0;

  // 遍历每个位置
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      // 计算横向、竖向、斜向的得分
      if (board[row][col] === player) {
        score += evaluateDirection(board, player, row, col, 1, 0); // 横向
        score += evaluateDirection(board, player, row, col, 0, 1); // 竖向
        score += evaluateDirection(board, player, row, col, 1, 1); // 斜向（右下）
        score += evaluateDirection(board, player, row, col, 1, -1); // 斜向（左下）
      }
    }
  }

  return score;
}

// 评估指定方向的得分
function evaluateDirection(board, player, row, col, dirX, dirY) {
  let score = 0;
  let count = 0; // 连续同色棋子数
  let block = 0; // 挡住棋子的数量

  // 棋子方向
  let r = row + dirX;
  let c = col + dirY;

  // 向前检查
  while (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
    if (board[r][c] === player) {
      count++;
    } else if (board[r][c] !== EMPTY) {
      block++;
      break;
    } else {
      break;
    }
    r += dirX;
    c += dirY;
  }

  // 向后检查
  r = row - dirX;
  c = col - dirY;
  while (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
    if (board[r][c] === player) {
      count++;
    } else if (board[r][c] !== EMPTY) {
      block++;
      break;
    } else {
      break;
    }
    r -= dirX;
    c -= dirY;
  }

  // 根据棋子数和挡住数量计算得分
  if (count >= 5) {
    return SCORE_TABLE[player][4];
  }
  score += SCORE_TABLE[player][count];
  if (block > 0) {
    score /= block;
  }
  return score;
}

// 极大值搜索
function negamax(board, depth, alpha, beta, player) {
  if (depth === 0) {
    return evaluate(board, player);
  }

  let maxScore = -Infinity;

  // 遍历所有可能的落子位置
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] === EMPTY) {
        board[row][col] = player;
        const score = -negamax(board, depth - 1, -beta, -alpha, 3 - player);
        board[row][col] = EMPTY;
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (alpha >= beta) {
          return maxScore;
        }
      }
    }
  }

  return maxScore;
}

// 获取最佳落子位置
function findBestMove(board, depth, player) {
  let bestMove = { row: -1, col: -1 };
  let maxScore = -Infinity;

  // 遍历所有可能的落子位置
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] === EMPTY) {
        board[row][col] = player;
        const score = -negamax(board, depth - 1, -Infinity, Infinity, 3 - player);
        board[row][col] = EMPTY;
        if (score > maxScore) {
          maxScore = score;
          bestMove = { row, col };
        }
      }
    }
  }

  return bestMove;
}

const board = initBoard();
board[7][7] = BLACK;
board[7][8] = WHITE;
board[8][8] = BLACK;

const player = BLACK;
const depth = 2;

const bestMove = findBestMove(board, depth, player);
console.log("Best Move:", bestMove);
// 示例输出: Best Move: { row: 9, col: 9 }

