/*
帮我用JS写一个 Evaluate 类，作用是进行五子棋评分，原理是通过遍历棋盘上的每个点，计算出每个点的得分，最后将所有点的得分相加，得到当前棋盘的总得分。计算分数的规则如下：
- 每一个点的得分都是通过计算这个点在横、竖、左斜、右斜四个方向上的得分，这些得分按照连五、活四、冲四、活三、眠三、活二、眠二，存储在不同的数组中，最后将这些数组的得分相加，得到当前点的总得分。
- 每一个方向上，都通过匹配模式串的方式计算分数。
- 只计算空位的得分，不计算已经有棋子的得分。
这个类要记住当前棋盘状态，提供如下方法：
- 提供 move 和 undo 方法，用于模拟下棋和悔棋，并且同步更新当前棋盘状态和得分。
- 提供 evaluate 方法，用于计算当前棋盘的得分。
- 提供 evaluatePoint 方法，用于计算某个点的得分。
*/

const FIVE = 100000;
const LONG = 1000000;
const FOUR = 25000;
const BLOCK_FOUR = 4000;
const THREE = 750;
const BLOCK_THREE = 150;
const TWO = 30;
const BLOCK_TWO = 6;
const ONE = 1;

const shapes = {
  6: LONG,
  5: FIVE / 5,
  4: FOUR / 4,
  40: BLOCK_FOUR / 4,
  4312: BLOCK_FOUR / 4 * 2,
  4222: BLOCK_FOUR / 4 * 2,
  4132: BLOCK_FOUR / 4 * 2,
  431: BLOCK_FOUR / 4,
  422: BLOCK_FOUR / 4,
  413: BLOCK_FOUR / 4,
  3: THREE / 3 + 50,
  30: THREE / 3 + 25,
  321: THREE / 3,
  312: THREE / 3,
  300: BLOCK_THREE / 3,
  3210: BLOCK_THREE / 3,
  3120: BLOCK_THREE / 3,
  3021: BLOCK_THREE / 3,
  3012: BLOCK_THREE / 3,
  30111: BLOCK_THREE / 3,
  31110: BLOCK_THREE / 3,
  2: TWO / 2 + 4,
  21: TWO / 2 + 2,
  211: TWO / 2,
  20: BLOCK_TWO / 2,
  210: BLOCK_TWO / 2,
  2110: BLOCK_TWO / 2,
  1: ONE,
  0: 0
}


const allDirections = [
  [0, 1],  // Horizontal
  [1, 0],  // Vertical
  [1, 1],  // Diagonal \
  [1, -1]  // Diagonal /
];

const direction2index = (ox, oy) => {
  if (ox === 0) return 0; // |
  if (oy === 0) return 1; // -
  if (ox === oy) return 2; // \
  if (ox !== oy) return 3; // /
};

// const shape2score = {
//   [shapes.FIVE]: FIVE,
//   [shapes.BLOCK_FIVE]: BLOCK_FIVE,
//   [shapes.FOUR]: FOUR,
//   [shapes.FOUR_FOUR]: FOUR_FOUR, // 双冲四
//   [shapes.FOUR_THREE]: FOUR_THREE, // 冲四活三
//   [shapes.THREE_THREE]: THREE_THREE, // 双三
//   [shapes.BLOCK_FOUR]: BLOCK_FOUR,
//   [shapes.THREE]: THREE,
//   [shapes.BLOCK_THREE]: BLOCK_THREE,
//   [shapes.TWO_TWO]: TWO_TWO, // 双活二
//   [shapes.TWO]: TWO,
//   [shapes.NONE]: 0,
// };

const performance = {
  updateTime: 0,
  getPointsTime: 0,
}

class Evaluate {
  constructor(size = 15) {
    this.size = size;
    this.board = Array.from({ length: size + 2 }).map((_, i) =>
      Array.from({ length: size + 2 }).map((_, j) =>
        (i === 0 || j === 0 || i === size + 1 || j === size + 1) ? 2 : 0
      )
    );
    this.initPoints();
    this.history = []; // 记录历史 [position, role]
  }
  move(x, y, role) {

    // 清空记录
    for (const d of [0, 1, 2, 3]) {
      this.shapeCache[role][d][x][y] = 0;
      this.shapeCache[-role][d][x][y] = 0;
    }

    // 更新分数
    this.board[x + 1][y + 1] = role; // Adjust for the added wall
    this.updatePoint(x, y);
    this.history.push([coordinate2Position(x, y, this.size), role]);
  }

  undo(x, y) {
    this.board[x + 1][y + 1] = 0; // Adjust for the added wall
    this.updatePoint(x, y);
    this.history.pop();
  }

  initPoints() {
    // 缓存每个点位的分数，避免重复计算
    // 结构： [role][direction][x][y] = shape
    this.shapeCache = {};
    for (let role of [1, -1]) {
      this.shapeCache[role] = {};
      for (let direction of [0, 1, 2, 3]) {
        this.shapeCache[role][direction] = Array.from({ length: this.size }).map(() => Array.from({ length: this.size }).fill(0));
      }
    }

  }


  // 当一个位置发生变时候，要更新这个位置的四个方向上得分，更新规则是：
  // 1. 如果这个位置是空的，那么就重新计算这个位置的得分
  // 2. 如果碰到了边界或者对方的棋子，那么就停止计算
  // 3. 如果超过2个空位，那么就停止计算
  // 4. 要更新自己的和对方的得分
  updatePoint(x, y) {
    const start = new Date();
    this.updateSinglePoint(x, y, 1);
    this.updateSinglePoint(x, y, -1);

    for (let [ox, oy] of allDirections) {
      for (let sign of [1, -1]) { // -1 for negative direction, 1 for positive direction
        // let emptyCount = 0;
        for (let step = 1; step <= 5; step++) {
          let reachEdge = false;
          for (let role of [1, -1]) {
            const [nx, ny] = [x + sign * step * ox + 1, y + sign * step * oy + 1]; // +1 to adjust for wall
            // 到达边界停止
            if (this.board[nx][ny] === 2) {
              // Stop if wall or opponent's piece is found
              reachEdge = true;
              break;
            } else if (this.board[nx][ny] === -role) { // 达到对方棋子，则转换角色
              this.updateSinglePoint(nx - 1, ny - 1, -role, [ox, oy]);  // -1 to adjust back from wall
              continue;
            } else if (this.board[nx][ny] === 0) {
              this.updateSinglePoint(nx - 1, ny - 1, role, [ox, oy]);  // -1 to adjust back from wall
              // 这里不能跳过，可能会在悔棋时漏掉一些待更新的点位
              // emptyCount++;
              // if (emptyCount >= 3) {
              //   // Stop if more than 2 empty spaces
              //   break;
              // }
            }
          }
          if (reachEdge) break;
        }
      }
    }
    performance.updateTime += new Date() - start;
  }

  /*
   计算单个点的得分
   计算原理是：
   在当前位置放一个当前角色的棋子，遍历四个方向，生成四个方向上的字符串，用patters来匹配字符串, 匹配到的话，就将对应的得分加到scores上
   四个方向的字符串生成规则是：向两边都延伸5个位置，如果遇到边界或者对方的棋子，就停止延伸
   在更新周围棋子时，只有一个方向需要更新，因此可以传入direction参数，只更新一个方向
   */
  updateSinglePoint(x, y, role, direction = undefined) {
    let directions = []
    if (direction) {
      directions.push(direction);
    } else {
      directions = allDirections;
    }
    const shapeCache = this.shapeCache[role];

    // 先清除缓存
    for (let [ox, oy] of directions) {
      shapeCache[direction2index(ox, oy)][x][y] = 0;
    }


    for (let [ox, oy] of directions) {
      const intDirection = direction2index(ox, oy);
      let shape = getShapeFast(this.board, x, y, ox, oy, role);
      shapeCache[intDirection][x][y] = shape;
    }
  }

  // 计算整个棋盘的得分
  evaluate(role) {
    let blackScore = 0;
    let whiteScore = 0;
    let b4 = 0;
    let w4 = 0;
    let bb4 = 0;
    let wb4 = 0;
    let b43 = 0;
    let w43 = 0;
    let b3 = 0;
    let w3 = 0;
    let t;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i + 1][j + 1] === 1) {
          t = shapes[this.shapeCache[1][0][i][j]] + shapes[this.shapeCache[1][1][i][j]] + shapes[this.shapeCache[1][2][i][j]] + shapes[this.shapeCache[1][3][i][j]];
          if (t >= FIVE / 5 && t < LONG) return FIVE * role;
          else if (t >= BLOCK_FOUR / 4 * 2) b4++;
          else if (t >= BLOCK_FOUR / 4 + THREE / 3 && !this.isReverse(i, j, 1)) b43++;
          else if (t >= BLOCK_FOUR / 4) bb4++;
          else if (t >= THREE / 3) b3++;
          blackScore += t;
        }
        else if (this.board[i + 1][j + 1] === -1) {
          t = shapes[this.shapeCache[-1][0][i][j]] + shapes[this.shapeCache[-1][1][i][j]] + shapes[this.shapeCache[-1][2][i][j]] + shapes[this.shapeCache[-1][3][i][j]];
          if (t >= FIVE / 5) return -FIVE * role;
          else if (t >= BLOCK_FOUR / 4 * 2) w4++;
          else if (t >= BLOCK_FOUR / 4 + THREE / 3 && !this.isReverse(i, j, -1)) w43++;
          else if (t >= BLOCK_FOUR / 4) wb4++;
          else if (t >= THREE / 3) w3++;
          whiteScore += t
        }
      }
    }
    if (role === 1) {
      if (b4 + bb4 + b43 > 0) {
        return FIVE - 250;
      }
      if (b4 + bb4 + b43 === 0 && w4 > 0) {
        return -FIVE + 500;
      }
      if (w4 + w43 + wb4 === 0 && b3 > 0) {
        return FIVE - 750;
      }
      if (b4 + bb4 + b43 === 0 && w43 > 0) {
        return -FIVE + 1000;
      }
    }
    else {
      if (w4 + wb4 + w43 > 0) {
        return FIVE - 250;
      }
      if (w4 + wb4 + w43 === 0 && b4 > 0) {
        return -FIVE + 500;
      }
      if (b4 + b43 + bb4 === 0 && w3 > 0) {
        return FIVE - 750;
      }
      if (w4 + wb4 + w43 === 0 && b43 > 0) {
        return -FIVE + 1000;
      }
    }
    return role === 1 ? 2 * blackScore - whiteScore : 2 * whiteScore - blackScore;
  }
  isReverse(x, y, role) {
    let dx; let dy; let d;
    for (let i = 0; i < 4; i++) {
      if (shapes[this.shapeCache[role][i][x][y]] >= BLOCK_FOUR / 4) {
        [dx, dy] = allDirections[i];
        d = i;
      }
    }
    for (let i = -4; i < 5; i++) {
      const nx = x + i * dx;
      const ny = y + i * dy;
      if (i === 0 || nx < 0 || nx >= this.size || ny < 0 || ny >= this.size || this.board[nx + 1][ny + 1] !== 0) continue;
      if (shapes[this.shapeCache[role][d][nx][ny]] >= BLOCK_FOUR / 4) {
        for (let i = 0; i < 4; i++) {
          if (shapes[this.shapeCache[-role][i][nx][ny]] >= BLOCK_FOUR / 4) {
            return true;
          }
        }
      }
    }
    return false;
  }
  isDis3(x, y, role) {
    let dx; let dy; let d;
    for (let i = 0; i < 4; i++) {
      if (shapes[this.shapeCache[-role][i][x][y]] >= BLOCK_FOUR / 4) {
        [dx, dy] = allDirections[i];
        d = i;
      }
    }
    for (let i = -2; i < 3; i++) {
      const nx = x + i * dx;
      const ny = y + i * dy;
      if (i === 0 || nx < 0 || nx >= this.size || ny < 0 || ny >= this.size || this.board[nx + 1][ny + 1] === 0) continue;
      if (i === 1 || i === -1) {
        if (shapes[this.shapeCache[-role][d][nx][ny]] >= THREE / 3 && shapes[this.shapeCache[-role][d][nx][ny]] < BLOCK_FOUR / 4) {
          return true;
        }
      }
      else if (this.shapeCache[-role][d][nx][ny] === 30) {
        return true;
      }
    }
    return false;
  }
  getMoves(role) {
    let res = [];
    let dis4 = [];
    let dis3 = [];
    let make4 = [];
    let make43 = [];
    let makeb4 = [];
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        let longCount = 0, fourCount = 0, threeCount = 0, score1 = 0, score2 = 0;
        for (let direction of [0, 1, 2, 3]) {
          if (this.board[i + 1][j + 1] !== 0) continue;
          const shape1 = shapes[this.shapeCache[role][direction][i][j]];
          const shape2 = shapes[this.shapeCache[-role][direction][i][j]];
          if (shape1 === FIVE / 5) return [[i, j, FIVE, 0, 2 * FIVE]];
          score1 += shape1; score2 += shape2;
          if (shape1 === LONG) longCount++;
          if (shape1 === BLOCK_FOUR / 4 * 2) fourCount += 2;
          if (shape1 === BLOCK_FOUR / 4) fourCount++;
          if (shape1 >= THREE / 3 && shape1 < BLOCK_FOUR / 4) threeCount++;
        }
        if (role === 1 && (longCount >= 1 || fourCount >= 2 || threeCount >= 2)) continue;
        if (score2 >= FIVE / 5 && score2 < LONG) dis4.push([i, j, 0, FIVE, FIVE]);
        else if (score2 >= BLOCK_FOUR / 4) {
          if (this.isDis3(i, j, role)) dis3.push([i, j, score1, score2, 2 * score1 + score2]);
        }
        if (score1 >= BLOCK_FOUR / 4 * 2) make4.push([i, j, FOUR, 0, 2 * FOUR]);
        else if (score1 >= BLOCK_FOUR / 4 + THREE / 3 && !this.isReverse(i, j, role)) make43.push([i, j, FOUR + THREE, 0, 2 * FOUR + 2 * THREE]);
        else if (score1 >= BLOCK_FOUR / 4) makeb4.push([i, j, FOUR + THREE, 0, 2 * FOUR + 2 * THREE])
        if (score1 < BLOCK_TWO / 2 && score2 < BLOCK_TWO / 2) continue;
        res.push([i, j, score1, score2, 2 * score1 + score2]);
      }
    }
    if (dis4.length > 0) return [dis4[0]];
    if (make4.length > 0) return [make4[0]];
    if (make43.length > 0) return [make43[0]];
    if (dis3.length > 0) return [...makeb4, ...dis3].sort((a, b) => b[4] - a[4]);
    return res.sort((a, b) => b[4] - a[4]);
  }
  display() {
    let result = '';
    for (let i = 1; i < this.size + 1; i++) {
      for (let j = 1; j < this.size + 1; j++) {
        switch (this.board[i][j]) {
          case 1:
            result += 'O ';
            break;
          case -1:
            result += 'X ';
            break;
          default:
            result += '- ';
            break;
        }
      }
      result += '\n';  // New line at the end of each row
    }
    console.log(result);
  }
}
