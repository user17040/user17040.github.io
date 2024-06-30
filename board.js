
class Zobrist {
  constructor(size) {
    this.size = size;
    this.zobristTable = this.initializeZobristTable(size);
    this.hash = BigInt(0);
  }

  initializeZobristTable(size) {
    let table = [];
    for (let i = 0; i < size; i++) {
      table[i] = [];
      for (let j = 0; j < size; j++) {
        table[i][j] = {
          "1": BigInt(this.randomBitString(64)), // black
          "-1": BigInt(this.randomBitString(64))  // white
        };
      }
    }
    return table;
  }

  randomBitString(length) {
    let str = "0b";
    for (let i = 0; i < length; i++) {
      str += Math.round(Math.random()).toString();
    }
    return str;
  }

  togglePiece(x, y, role) {
    this.hash ^= this.zobristTable[x][y][role];
  }

  getHash() {
    return this.hash;
  }
}

class Cache {
  constructor(capacity = scores.FIVE) {
    this.capacity = capacity;
    this.cache = [];
    this.map = new Map();
  }

  // 获取一个键的值
  get(key) {
    if (this.map.has(key)) {
      return this.map.get(key);
    }
    return null;
  }

  // 设置或插入一个值
  put(key, value) {
    if (this.cache.length >= this.capacity) {
      const oldestKey = this.cache.shift();  // 移除最老的键
      this.map.delete(oldestKey);  // 从map中也删除它
    }

    if (!this.map.has(key)) {
      this.cache.push(key);  // 将新键添加到cache数组
    }
    this.map.set(key, value);  // 更新或设置键值
  }

  // 检查缓存中是否存在某个键
  has(key) {
    if (!config.enableCache) return false;
    return this.map.has(key);
  }
}
class Gomoku {
  constructor(size = 15) {
    this.size = size;
    this.board = Array.from({ length: size }, () => Array(size).fill(0));
    this.boardScore = Array.from({ length: size }, () => Array.from({ length: size }, () => [0, 0]));;
    this.black_score = 0; // 初始化评估分值
    this.white_score = 0;
    this.zobrist = new Zobrist(this.size);
    this.cache = new Cache();
    this.p = 2;
    this.steps = [];
  }

  // 放置棋子
  placePiece(x, y, player) {
    this.board[x][y] = player;
    this.steps.push([x, y]);
    this.updateEval(x, y);
    this.zobrist.togglePiece(x, y, player);
  }

  // 撤销棋子
  undoPiece(x, y, player) {
    this.board[x][y] = 0;
    this.steps.pop();
    this.updateEval(x, y);
    this.zobrist.togglePiece(x, y, player);
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
        if (isJump === 1 && rightJumpCount === 0) {
          rightBlock = 1;
        } else if (isJump === 2 && rightJump2Count === 0) {
          rightBlock = 2;
        }
        else {
          rightBlock = 0;
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
        if (isJump === 1 && leftJumpCount === 0) {
          leftBlock = 1;
        } else if (isJump === 2 && leftJump2Count === 0) {
          leftBlock = 2;
        }
        else {
          leftBlock = 0;
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
      if (leftJumpCount === 1 && rightJumpCount === 1 && player === 1) return scores.D_B_FOUR;
      if (leftJumpCount >= 1 && rightJumpCount >= 1 && player !== 1) return scores.D_B_FOUR;
      if ((leftJumpCount === 1 || rightJumpCount === 1) && player === 1) return scores.B_FOUR;
      if ((leftJumpCount >= 1 || rightJumpCount >= 1) && player !== 1) return scores.B_FOUR;
      //0(1)1100
      let left = leftBlock - (leftJump2Count >= 1);
      let right = rightBlock - (rightJump2Count >= 1);
      if (leftJumpCount === 0 && rightJumpCount === 0 && left + right > 2 && player === 1) return scores.THREE + 500;
      if (leftJumpCount === 0 && rightJumpCount === 0 && leftBlock + rightBlock > 2 && player !== 1) return scores.THREE + 500;
      //2(1)1100
      if (leftJumpCount === 0 && rightJumpCount === 0 && left + right === 2 && player === 1) return scores.B_THREE;
      if (leftJumpCount === 0 && rightJumpCount === 0 && leftBlock + rightBlock === 2 && player !== 1) return scores.B_THREE;
    }
    else if (count === 2) {
      //(1)1011
      if (leftJumpCount === 2 && rightJumpCount === 2 && player === 1) return scores.D_B_FOUR;
      if (leftJumpCount >= 2 && rightJumpCount >= 2 && player !== 1) return scores.D_B_FOUR;
      if ((leftJumpCount === 2 || rightJumpCount === 2) && player === 1) return scores.B_FOUR;
      if ((leftJumpCount >= 2 || rightJumpCount >= 2) && player !== 1) return scores.B_FOUR;
      //0(1)1010
      if ((leftJumpCount === 1 || rightJumpCount === 1) && leftBlock >= 1 && rightBlock >= 1 && !(leftJump2Count >= 1 && rightJump2Count >= 1) && player === 1) return scores.THREE;
      if ((leftJumpCount === 1 || rightJumpCount === 1) && leftBlock >= 1 && rightBlock >= 1 && player !== 1) return scores.THREE;
      //2(1)1010
      if ((leftJumpCount === 1 || rightJumpCount === 1) && (leftBlock >= 1 || rightBlock >= 1) && !(leftJump2Count >= 1 && rightJump2Count >= 1) && player === 1) return scores.B_THREE;
      if ((leftJumpCount === 1 || rightJumpCount === 1) && (leftBlock >= 1 || rightBlock >= 1) && player !== 1) return scores.B_THREE;
      //(1)1001
      if (leftJumpCount === 0 && rightJumpCount === 0 && (leftJump2Count === 1 || rightJump2Count === 1) && player === 1) return scores.B_THREE;
      if (leftJumpCount === 0 && rightJumpCount === 0 && (leftJump2Count >= 1 || rightJump2Count >= 1) && player !== 1) return scores.B_THREE;
      //(1)1011
      if ((leftJumpCount === 2 || rightJumpCount === 2) && player === 1) return scores.B_FOUR;
      if ((leftJumpCount >= 2 || rightJumpCount >= 2) && player !== 1) return scores.B_FOUR;
      //0(1)1000
      if (leftJumpCount === 0 && rightJumpCount === 0 && leftJump2Count === 0 && rightJump2Count === 0 && leftBlock + rightBlock >= 3) return scores.TWO + 20;
      //2(1)1000
      if ((leftBlock === 2 && rightBlock === 0) || (leftBlock === 0 && rightBlock === 2)) return scores.B_TWO;
    }
    else if (count === 1) {
      //(1)0111
      if (leftJumpCount === 3 && rightJumpCount === 3 && player === 1) return scores.D_B_FOUR;
      if (leftJumpCount >= 3 && rightJumpCount >= 3 && player !== 1) return scores.D_B_FOUR;
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
      if ((leftJumpCount === 1 || rightJumpCount === 1) && leftBlock + rightBlock >= 3) return scores.TWO + 10;
      //2(1)0100
      if ((leftJumpCount === 1 || rightJumpCount === 1) && ((leftBlock === 2 && rightBlock === 0) || (leftBlock === 0 && rightBlock === 2))) return scores.B_TWO;
      //0(1)0010
      if (leftJumpCount === 0 && rightJumpCount === 0 && (leftJump2Count === 1 || rightJump2Count === 1) && leftBlock + rightBlock >= 3) return scores.TWO;
      //2(1)0010
      if (leftJumpCount === 0 && rightJumpCount === 0 && (leftJump2Count === 1 || rightJump2Count === 1) && ((leftBlock === 2 && rightBlock === 0) || (leftBlock === 0 && rightBlock === 2))) return scores.B_TWO;
      //0(1)0000
      if (leftJumpCount === 0 && rightJumpCount === 0 && leftJump2Count === 0 && rightJump2Count === 0 && leftBlock + rightBlock >= 3) return scores.ONE;
    }
    return 0;
  };
  evaluatePoint(x, y, player, check = false) {
    let score = 0;
    let long = 0;
    let five = 0;
    let four = 0;
    let b_four = 0;
    let three = 0;
    for (const { dx, dy } of directions) {
      const consecutive = this.countConsecutive(x, y, dx, dy, player);
      if (consecutive === scores.LONG) long++;
      else if (consecutive === scores.FIVE) five++;
      else if (consecutive === scores.FOUR) four++;
      else if (consecutive === scores.D_B_FOUR) b_four += 2;
      else if (consecutive === scores.B_FOUR) b_four++;
      else if (consecutive === scores.THREE || consecutive === scores.THREE + 500) three++;
      score += consecutive;
    }
    if (check) {
      if (player === 1 && five === 0 && (long >= 1 || b_four + four >= 2 || three >= 2)) return -1;
      if (five >= 1) return scores.FIVE;
      if (four >= 1 || b_four >= 2) return scores.FOUR;
    }
    return score;
  };
  evaluateBoard(player) {
    let bscore = 0;
    let wscore = 0;
    let b5 = 0;
    let w5 = 0;
    let b4 = 0;
    let w4 = 0;
    let b44 = 0;
    let w44 = 0;
    let b43 = 0;
    let w43 = 0;
    let bb4 = 0;
    let wb4 = 0;
    let b33 = 0;
    let w33 = 0;
    let b3 = 0;
    let w3 = 0;
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (this.board[x][y] !== 0) {
          if (this.boardScore[x][y] >= scores.FIVE) b5++;
          else if (this.boardScore[x][y] >= scores.FOUR) b4++;
          else if (this.boardScore[x][y] >= scores.B_FOUR * 2) b44++;
          else if (this.boardScore[x][y] >= scores.B_FOUR + scores.THREE) b43++;
          else if (this.boardScore[x][y] >= scores.B_FOUR) bb4++;
          else if (this.boardScore[x][y] >= scores.THREE * 2) b33++;
          else if (this.boardScore[x][y] >= scores.THREE) b3++;
          if (this.boardScore[x][y] <= -scores.FIVE) w5++;
          else if (this.boardScore[x][y] <= -scores.FOUR) w4++;
          else if (this.boardScore[x][y] <= -scores.B_FOUR * 2) w44++;
          else if (this.boardScore[x][y] <= -scores.B_FOUR - scores.THREE) w43++;
          else if (this.boardScore[x][y] <= -scores.B_FOUR) wb4++;
          else if (this.boardScore[x][y] <= -scores.THREE * 2) w33++;
          else if (this.boardScore[x][y] <= -scores.THREE) w3++;
          this.boardScore[x][y] >= 0 ? bscore += this.boardScore[x][y] : wscore -= this.boardScore[x][y];
        }
      }
    }
    if (player === 1) {
      if (b5 > 0) {
        return scores.FIVE;
      }
      else if (w5 > 0) {
        return - scores.FIVE;
      }
      else if (w5 === 0 && (b4 + bb4 > 0 || b44 > 0)) {
        return scores.FIVE - 250;
      }
      else if (b4 + b44 + b43 + bb4 === 0 && w4 > 0) {
        return -scores.FIVE + 500;
      }
      else if (w4 + w44 + w43 + wb4 === 0 && b3 > 0) {
        return scores.FIVE - 750;
      }
      else if (b4 + b44 + b43 + bb4 === 0 && (w43 > 0 || (b3 + b33 === 0 && w33 > 0))) {
        return -scores.FIVE + 1000;
      }
    }
    else if (player === -1) {
      if (w5 > 0) {
        return scores.FIVE;
      }
      else if (b5 > 0) {
        return - scores.FIVE;
      }
      else if (b5 === 0 && (w4 + wb4 > 0 || w44 > 0)) {
        return scores.FIVE - 250;
      }
      else if (b4 + b44 + b43 + bb4 === 0 && w4 > 0) {
        return -scores.FIVE + 500;
      }
      else if (w4 + w44 + w43 + wb4 === 0 && b4 > 0) {
        return -scores.FIVE + 500;
      }
      else if (b4 + b44 + b43 + bb4 === 0 && w3 > 0) {
        return scores.FIVE - 750;
      }
      else if (w4 + w44 + w43 + wb4 === 0 && (b43 > 0 || (w3 + w33 === 0 && b33 > 0))) {
        return -scores.FIVE + 1000;
      }
    }
    return player === 1 ? this.p * bscore - wscore : this.p * wscore - bscore;
  }
  updateEval(x, y) {
    for (const { dx, dy } of directions) {
      for (let i = -5; i < 6; i++) {
        const nx = x + i * dx;
        const ny = y + i * dy;
        if (!(nx >= 0 && nx < this.size && ny >= 0 && ny < this.size)) continue;
        const color = this.board[nx][ny];
        if (color === 0) {
          this.boardScore[nx][ny] = [this.evaluatePoint(nx, ny, 1, true), this.evaluatePoint(nx, ny, -1, true)];
        } else {
          this.boardScore[nx][ny] = this.evaluatePoint(nx, ny, color) * color;
        }
      }
    }
  }

  genMove(player, only) {
    let score;
    let moves = [];
    let temp = [];
    let temp2 = [];
    let temp3 = [];
    let temp4 = [];
    let temp5 = [];
    let temp6 = [];
    let opponent4 = false;
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (this.board[x][y] === 0) {
          let s1, s2;
          if (player === 1) {
            s1 = this.boardScore[x][y][0]; s2 = this.boardScore[x][y][1];
          } else {
            s1 = this.boardScore[x][y][1]; s2 = this.boardScore[x][y][0];
          }
          if (s1 === -1) continue;
          score = 2 * s1 + s2;
          if (s1 >= scores.FIVE) {
            return [{ x, y, s1, s2, score }];
          }
          else if (s1 >= scores.B_FOUR * 2) {
            temp2.push({ x, y, s1, s2, score });
          }
          else if (s1 >= scores.B_FOUR + scores.THREE) {
            temp3.push({ x, y, s1, s2, score });
          }
          else if (s1 >= scores.B_FOUR) {
            temp4.push({ x, y, s1, s2, score });
          }
          else if (s1 >= scores.THREE * 2) {
            temp5.push({ x, y, s1, s2, score });
          }
          if (s2 >= scores.FIVE) {
            temp.push({ x, y, s1, s2, score });
          }
          else if (s2 >= scores.B_FOUR) {
            temp6.push({ x, y, s1, s2, score })
            if (s2 >= scores.FOUR) {
              opponent4 = true;
            }
          }
          if (only === 0) {
            if (s1 >= scores.B_TWO || s2 >= scores.B_TWO) {
              moves.push({ x, y, s1, s2, score });
            }
          }
        }
      }
    }
    if (temp.length > 0) return [temp[0]];//挡冲四
    if (temp2.length > 0) return [temp2[0]];//走活四
    if (temp3.length > 0) return [temp3[0]];//走四三
    if (opponent4 && only <= 0) return [...temp4, ...temp6].sort((a, b) => b.score - a.score);//挡活三
    if (temp6.length === 0 && temp5.length > 0) return [temp5[0]];//走三三
    return moves.sort((a, b) => b.score - a.score);
  }

  negamax(depth, cdepth, player, path, alpha, beta) {
    const hash = this.zobrist.getHash();
    const prev = this.cache.get(hash);
    if (prev && prev.player === player && prev.depth >= depth - cdepth) {
      if (prev.flag === 0 && prev.score <= alpha) return { score: prev.score, path: [...path, ...prev.path] }
      if (prev.flag === 1 && prev.score >= beta) return { score: prev.score, path: [...path, ...prev.path] }
      if (prev.flag === 2) return { score: prev.score, path: [...path, ...prev.path] }
    }
    let score = this.evaluateBoard(player);
    if (score >= scores.FIVE) {
      return { score: score - path.length, path: [...path] };
    }
    if (score <= -scores.FIVE) {
      return { score: score + path.length, path: [...path] };
    }
    if (cdepth >= depth) {
      return { score, path: [...path] };
    }
    let result = this.negamax(depth - 2, cdepth + 1, -player, [...path], -beta, -beta + 1);
    if (-result.score >= beta) {
      return { score: beta, path: [...path] };
    }
    let moves = this.genMove(player, 0);
    if (moves.length === 0) {
      return { score: 0, path: [...path] };
    }
    let maxScore = -scores.FIVE - 250;
    let bestPath = [...path];
    let flag = 0;
    for (let move of moves) {
      this.placePiece(move.x, move.y, player);
      if (maxScore > -scores.FIVE - 250) {
        result = this.negamax(depth, move.s1 >= scores.THREE ? cdepth : cdepth + 1, -player, [...path, { x: move.x, y: move.y }], -alpha - 1, -alpha);
        if (-result.score > alpha && -result.score < beta) {
          result = this.negamax(depth, move.s1 >= scores.THREE ? cdepth : cdepth + 1, -player, [...path, { x: move.x, y: move.y }], -beta, -alpha);
        }
      } else {
        result = this.negamax(depth, move.s1 >= scores.THREE ? cdepth : cdepth + 1, -player, [...path, { x: move.x, y: move.y }], -beta, -alpha);
      }
      let score = -result.score;
      this.undoPiece(move.x, move.y, player);
      if (score > maxScore) {
        maxScore = score;
        bestPath = result.path;
      }
      if (score > alpha) {
        flag = 2;
        alpha = score;
      }
      if (alpha >= beta) {
        flag = 1;
        break;
      }
    }
    if (!prev || prev.depth < depth - cdepth) {
      this.cache.put(hash, {
        depth: depth - cdepth,
        path: bestPath.slice(cdepth),
        score: maxScore,
        player,
        flag
      })
    }
    return { score: maxScore, path: bestPath };
  }
  match(rotate) {
    let s;
    if(rotate===0) s=this.steps;
    else if(rotate===1) s=rotate90(this.steps,this.size);
    else if(rotate===2) s=rotate180(this.steps,this.size);
    else if(rotate===3) s=rotate270(this.steps,this.size);
    let b = s.filter((element, index) => index % 2 === 0)
    b.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
    let w = s.filter((element, index) => index % 2 === 1)
    w.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
    let r;
    for (let book of books) {
      if (book.length - 1 != s.length) continue;
      if(rotate===0) r=book[s.length]
      else if(rotate===1) r = rotate90([book[s.length]],this.size)[0];
      else if(rotate===2) r = rotate180([book[s.length]],this.size)[0];
      else if(rotate===3) r = rotate270([book[s.length]],this.size)[0];
      let nbook = book.slice(0, s.length);
      nbook.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
      let bookb = nbook.filter((element, index) => index % 2 === 0);
      let bookw = nbook.filter((element, index) => index % 2 === 1);
      let flag = true
      for (let i = 0; i < bookb.length; i++) {
        if (bookb[i][0] != b[i][0] || bookb[i][1] != b[i][1]) {
          flag = false;
          break;
        }
        if (i < bookw.length && (bookw[i][0] != w[i][0] || bookw[i][1] != w[i][1])) {
          flag = false;
          break;
        }
      }
      if (flag) return { x: r[0], y: r[1] };
    }
    return false;
  }
  deeping(player, maxtime) {
    let d = new Date();
    let res = {};
    for(let i=0;i<4;i++){
      let bookres = this.match(i);
      if (bookres) {
        res.path = [bookres]; res.score = '查谱'; res.depth = 0; res.time = new Date() - d;
        console.log('查谱|路径：' + path_t(res.path))
        return res
      }
    }
    for (let depth = 1; ; depth++) {
      res = this.negamax(depth, 0, player, [], -scores.FIVE - 250, scores.FIVE + 250);
      res.depth = depth; res.time = new Date() - d;
      console.log('计算|深度：' + depth + '|分数：' + res.score + '|路径：' + path_t(res.path) + '|时间：' + res.time)
      if (new Date() - d > maxtime) {
        return res;
      }
    }
  }
}
function path_t(array) {
  let str = ''
  for (let i of array) {
    str += String.fromCharCode(i.x + 65) + (i.y + 1) + ' ';
  }
  return str;
}
function path_t2(i) {
  return (i.x + 1).toString(16) + (i.y + 1).toString(16);
}