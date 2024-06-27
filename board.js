class Gomoku {
  constructor(size = 15) {
    this.size = size;
    this.board = Array.from({ length: size }, () => Array(size).fill(0));
    this.boardScore = Array.from({ length: size }, () => Array(size).fill(0));
    this.history = [];
    this.black_score = 0; // 初始化评估分值
    this.white_score = 0;
  }

  // 放置棋子
  placePiece(x, y, player) {
    if (this.board[x][y] === 0) {
      this.board[x][y] = player;
      this.history.push({ x, y });
      this.updateEval(x, y);
    }
  }

  // 撤销棋子
  undoPiece() {
    const lastMove = this.history.pop();
    if (lastMove) {
      this.board[lastMove.x][lastMove.y] = 0;
      this.updateEval(lastMove.x, lastMove.y);
    }
  }

  // 打印棋盘（可选）
  printBoard() {
    console.log(this.board.map(row => row.map(cell => (cell === 1 ? '●' : cell === -1 ? '○' : '·')).join(' ')).join('\n'));
  }
  countConsecutive(x, y, dx, dy, player) {
    let count = 1;
    let rightJumpCount = 0;
    let leftJumpCount = 0;
    let rightJump2Count = 0;
    let leftJump2Count = 0;
    let rightBlock = 2;//2:没挡，1:跳挡，0:直接挡
    let leftBlock = 2;
    let isJump = 0;
    for (let i = 1; i < 6; i++) {
      const nx = x + i * dx;
      const ny = y + i * dy;
      if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size && this.board[nx][ny] === player) {
        if (isJump === 2) {
          rightJump2Count++;
        }
        else if (isJump === 1) {
          rightJumpCount++;
        } else {
          count++;
        }
      } else if (!(nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) || this.board[nx][ny] === -player) {
        if (this.board[nx - dx][ny - dy] === player) {
          rightBlock = 0;
        } else {
          rightBlock = 1;
        }
        break;
      } else {
        if (isJump === 2) {
          break;
        }
        isJump++;
      }
    }
    isJump = false;
    for (let i = 1; i < 6; i++) {
      const nx = x - i * dx;
      const ny = y - i * dy;
      if (nx >= 0 && nx < this.size && ny >= 0 && ny < this.size && this.board[nx][ny] === player) {
        if (isJump === 2) {
          leftJump2Count++;
        }
        else if (isJump === 1) {
          leftJumpCount++;
        } else {
          count++;
        }
      } else if (!(nx >= 0 && nx < this.size && ny >= 0 && ny < this.size) || this.board[nx][ny] === -player) {
        if (this.board[nx + dx][ny + dy] === player) {
          leftBlock = 0;
        } else {
          leftBlock = 1;
        }
        break;
      } else {
        if (isJump === 2) {
          break;
        }
        isJump++;
      }
    }
    //(1)11111
    if (count >= 6 && player === 1) return scores.LONG
    //(1)1111
    if (count >= 5) return scores.FIVE;
    if (count === 4) {
      //0(1)1110
      if (leftBlock >= 1 && leftJumpCount === 0 && rightBlock >= 1 && rightJumpCount === 0 && player === 1) return scores.FOUR;
      if (leftBlock >= 1 && rightBlock >= 1 && player !== 1) return scores.FOUR;
      //2(1)1110
      if ((leftBlock >= 1 && leftJumpCount === 0) || (rightBlock >= 1 && rightJumpCount === 0) && player === 1) return scores.B_FOUR;
      if ((leftBlock >= 1 || rightBlock >= 1) && player !== 1) return scores.B_FOUR;
    }
    else if (count === 3) {
      //(1)1101
      if ((leftJumpCount === 1 || rightJumpCount === 1) && player === 1) return scores.B_FOUR;
      if ((leftJumpCount >= 1 || rightJumpCount >= 1) && player !== 1) return scores.B_FOUR;
      //0(1)1100
      let left = leftBlock - (leftJump2Count >= 1);
      let right = rightBlock - (rightJump2Count >= 1);
      if (leftJumpCount === 0 && rightJumpCount === 0 && left >= 1 && right >= 1 && !(left === 1 && right === 1) && player === 1) return scores.THREE + 250;
      if (rightBlock >= 1 && rightBlock >= 1 && !(rightBlock === 1 && rightBlock === 1) && player !== 1) return scores.THREE = 250;
      //2(1)1100
      if (leftJumpCount === 0 && rightJumpCount === 0 && left + right === 2 && player === 1) return scores.B_THREE;
      if (leftJumpCount === 0 && rightJumpCount === 0 && leftBlock + rightBlock === 2 && player !== 1) return scores.B_THREE;
    }
    else if (count === 2) {
      //(1)1011
      if ((leftJumpCount === 2 || rightJumpCount === 2) && player === 1) return scores.B_FOUR;
      if ((leftJumpCount >= 2 || rightJumpCount >= 2) && player !== 1) return scores.B_FOUR;
      //0(1)1010
      if ((leftJumpCount === 1 || rightJumpCount === 1) && leftBlock >= 1 && rightBlock >= 1 && !(leftJump2Count >= 1 && rightJump2Count >= 1) && player === 1) return scores.THREE;
      if ((leftJumpCount === 1 || rightJumpCount === 1) && leftBlock >= 1 && rightBlock >= 1 && player !== 1) return scores.THREE;
      //(1)1001
      if (leftJumpCount === 0 && rightJumpCount === 0 && (leftJump2Count === 1 || rightJump2Count === 1) && player === 1) return scores.B_THREE;
      if (leftJumpCount === 0 && rightJumpCount === 0 && (leftJump2Count >= 1 || rightJump2Count >= 1) && player !== 1) return scores.B_THREE;
      //(1)1011
      if ((leftJumpCount === 2 || rightJumpCount === 2) && player === 1) return scores.B_FOUR;
      if ((leftJumpCount >= 2 || rightJumpCount >= 2) && player !== 1) return scores.B_FOUR;
      //0(1)1000
      if (leftBlock + rightBlock >= 3) return scores.TWO + 10;

    }
    else if (count === 1) {
      //(1)0111
      if ((leftJumpCount === 3 || rightJumpCount === 3) && player === 1) return scores.B_FOUR;
      if ((leftJumpCount >= 3 || rightJumpCount >= 3) && player !== 1) return scores.B_FOUR;
      //0(1)0110
      if ((leftJumpCount === 2 || rightJumpCount === 2) && leftBlock >= 1 && rightBlock >= 1 && !(leftJump2Count >= 1 && rightJump2Count >= 1) && player === 1) return scores.THREE;
      if ((leftJumpCount === 2 || rightJumpCount === 2) && leftBlock >= 1 && rightBlock >= 1 && player !== 2) return scores.THREE;
      //2(1)0110
      if ((leftJumpCount === 2 || rightJumpCount === 2) && (leftBlock >= 1 || rightBlock >= 1) && !(leftJump2Count >= 1 && rightJump2Count >= 1) && player === 1) return scores.B_THREE;
      if ((leftJumpCount === 2 || rightJumpCount === 2) && (leftBlock >= 1 || rightBlock >= 1) && player !== 2) return scores.B_THREE;
      //1100(1)
      if (leftJumpCount === 0 && rightJumpCount === 0 && (leftJump2Count === 2 || rightJump2Count === 2) && player === 1) return scores.B_THREE;
      if (leftJumpCount === 0 && rightJumpCount === 0 && (leftJump2Count >= 2 || rightJump2Count >= 2) && player !== 1) return scores.B_THREE;
      //10(1)01
      if (leftJumpCount === 1 && rightJumpCount === 1 && player === 1) return scores.B_THREE;
      if (leftJumpCount >= 1 && rightJumpCount >= 1 && player !== 1) return scores.B_THREE;
      //(1)0101
      if (((leftJumpCount === 1 && leftJump2Count === 1) || (rightJumpCount === 1 && rightJump2Count === 1)) && player === 1) return scores.B_THREE;
      if (((leftJumpCount === 1 && leftJump2Count >= 1) || (rightJumpCount === 1 && rightJump2Count >= 1)) && player !== 1) return scores.B_THREE;
      //0(1)0100
      if ((leftJumpCount === 1 || rightJumpCount === 1) && leftBlock + rightBlock >= 3) return scores.TWO + 5;
      //0(1)0010
      if (leftJumpCount === 0 && rightJumpCount === 0 && (leftJump2Count === 1 || rightJump2Count === 1) && leftBlock + rightBlock >= 3) return scores.TWO;
    }
    return 0;
  };
  evaluatePoint(x, y, player) {
    let score = 0;
    for (const { dx, dy } of directions) {
      const consecutive = this.countConsecutive(x, y, dx, dy, player);
      score += consecutive;
    }
    return score;
  };

  checkBan(x, y, player) {
    if (player !== 1) return false;
    let score = 0;
    let long = 0;
    let five = 0;
    let four = 0;
    let three = 0;
    for (const { dx, dy } of directions) {
      const consecutive = this.countConsecutive(x, y, dx, dy, player);
      if (consecutive === scores.LONG) long++;
      else if (consecutive === scores.FIVE) five++;
      else if (consecutive === scores.FOUR || score === scores.B_FOUR) four++;
      else if (consecutive === scores.THREE || consecutive === scores.THREE + 250) three++;
    }
    return five === 0 && (long >= 1 || four >= 2 || three >= 2);
  };
  evaluateBoard(player) {

    let score = 0;


    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        score += this.boardScore[x][y];
      }
    }
    return score * player;
  }
  updateEval(x, y) {
    for (const { dx, dy } of directions) {
      for (let i = -5; i < 6; i++) {
        const nx = x + i * dx;
        const ny = y + i * dy;
        if (!(nx >= 0 && nx < this.size && ny >= 0 && ny < this.size)) continue;
        const color = this.board[nx][ny];
        if (color === 0) {
          this.boardScore[nx][ny] = 0;
        } else {
          this.boardScore[nx][ny] = this.evaluatePoint(nx, ny, color) * color;
        }
      }
    }
  }

  genMove(player) {
    let score;
    let moves = [];
    let temp = [];
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (this.board[x][y] === 0 && !this.checkBan(x, y, player)) {
          let s1 = this.evaluatePoint(x, y, player); let s2 = this.evaluatePoint(x, y, -player);
          if (s1 >= scores.FIVE) return [{ x, y, score: 2 * s1 + s2 }];
          if (s2 >= scores.FIVE) temp.push({ x, y, score: 2 * s1 + s2 });
          score = 2 * s1 + s2;
          if (score > 0) {
            moves.push({ x, y, score });
          }
        }
      }
    }
    if (temp.length > 0) return temp;
    return moves.sort((a, b) => b.score - a.score);
  }

  negamax(maxdepth, depth, player, alpha, beta) {
    let score = this.evaluateBoard(player);
    if (score >= 1000000) {
      return { score: 1000000 - maxdepth + depth, path: [] };
    }
    if (score <= -1000000) {
      return { score: -1000000 + maxdepth - depth, path: [] };
    }
    if (depth === 0) {
      return { score, path: [] };
    }
    let moves = this.genMove(player);
    let maxScore = -Infinity;
    let bestPath = [];
    for (let { x, y } of moves) {
      this.placePiece(x, y, player);
      let result = this.negamax(maxdepth, depth - 1, -player, -beta, -alpha);
      let score = -result.score;
      this.undoPiece();
      if (score > maxScore) {
        maxScore = score;
        bestPath = [{ x, y }, ...result.path];
      }
      if (score > alpha) {
        alpha = score;
      }
      if (alpha >= beta) {
        break;
      }
    }
    return { score: maxScore, path: bestPath };
  }
}

