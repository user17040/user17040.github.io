
const countShape = (board, x, y, offsetX, offsetY, role) => {
  let count = 1;
  let rightJumpCount = 0;
  let leftJumpCount = 0;
  let rightJump2Count = 0;
  let leftJump2Count = 0;
  let rightBlock = 2;//2:没挡，1:跳挡，0:直接挡
  let leftBlock = 2;
  let isJump = 0;
  for (let i = 1; i < 6; i++) {
    const nx = x + i * offsetX + 1;
    const ny = y + i * offsetY + 1;
    if (board[nx][ny] === role) {
      if (isJump === 2) {
        rightJump2Count++;
      }
      else if (isJump === 1) {
        rightJumpCount++;
      } else {
        count++;
      }
    } else if (board[nx][ny] === 2 || board[nx][ny] === -role) {
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
    const nx = x - i * offsetX + 1;
    const ny = y - i * offsetY + 1;
    if (board[nx][ny] === role) {
      if (isJump === 2) {
        leftJump2Count++;
      }
      else if (isJump === 1) {
        leftJumpCount++;
      } else {
        count++;
      }
    } else if (board[nx][ny] === 2 || board[nx][ny] === -role) {
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

  return {
    count,
    rightBlock,
    leftBlock,
    rightJumpCount,
    leftJumpCount,
    rightJump2Count,
    leftJump2Count
  };
}




// 使用遍历位置的方式实现的形状检测，速度较快，大约是字符串速度的2倍 但理解起来会稍微复杂一些
const getShapeFast = (board, x, y, offsetX, offsetY, role) => {

  const {
    count,
    rightBlock,
    leftBlock,
    rightJumpCount,
    leftJumpCount,
    rightJump2Count,
    leftJump2Count
  } = countShape(board, x, y, offsetX, offsetY, role);
  //(1)11111
  if (count >= 6 && role === 1) return 6
  //(1)1111
  if (count >= 5) return 5;
  if (count === 4) {
    //0(1)1110
    if (leftBlock >= 1 && leftJumpCount === 0 && rightBlock >= 1 && rightJumpCount === 0 && role === 1) return 4;
    if (leftBlock >= 1 && rightBlock >= 1 && role !== 1) return 4;
    //2(1)1110
    if ((leftBlock >= 1 && leftJumpCount === 0) || (rightBlock >= 1 && rightJumpCount === 0) && role === 1) return 40;
    if ((leftBlock >= 1 || rightBlock >= 1) && role !== 1) return 40;
  }
  else if (count === 3) {
    //(1)1101
    if (leftJumpCount === 1 && rightJumpCount === 1 && role === 1) return 4312;
    if (leftJumpCount >= 1 && rightJumpCount >= 1 && role !== 1) return 4312;
    if ((leftJumpCount === 1 || rightJumpCount === 1) && role === 1) return 431;
    if ((leftJumpCount >= 1 || rightJumpCount >= 1) && role !== 1) return 431;
    //0(1)1100
    let left = leftBlock - (leftJump2Count >= 1);
    let right = rightBlock - (rightJump2Count >= 1);
    if (leftJumpCount === 0 && rightJumpCount === 0 && left + right === 4 && role === 1) return 3;
    if (leftJumpCount === 0 && rightJumpCount === 0 && leftBlock + rightBlock === 4 && role !== 1) return 3;
    if (leftJumpCount === 0 && rightJumpCount === 0 && left + right === 3 && role === 1) return 30;
    if (leftJumpCount === 0 && rightJumpCount === 0 && leftBlock + rightBlock === 3 && role !== 1) return 30;
    //2(1)1100
    if (leftJumpCount === 0 && rightJumpCount === 0 && left + right === 2 && role === 1) return 300;
    if (leftJumpCount === 0 && rightJumpCount === 0 && leftBlock + rightBlock === 2 && role !== 1) return 300;
  }
  else if (count === 2) {
    //(1)1011
    if (leftJumpCount === 2 && rightJumpCount === 2 && role === 1) return 4222;
    if (leftJumpCount >= 2 && rightJumpCount >= 2 && role !== 1) return 4222;
    if ((leftJumpCount === 2 || rightJumpCount === 2) && role === 1) return 422;
    if ((leftJumpCount >= 2 || rightJumpCount >= 2) && role !== 1) return 422;
    //0(1)1010
    if ((leftJumpCount === 1 || rightJumpCount === 1) && leftBlock >= 1 && rightBlock >= 1 && !(leftJump2Count >= 1 && rightJump2Count >= 1) && role === 1) return 321;
    if ((leftJumpCount === 1 || rightJumpCount === 1) && leftBlock >= 1 && rightBlock >= 1 && role !== 1) return 321;
    //2(1)1010
    if ((leftJumpCount === 1 || rightJumpCount === 1) && (leftBlock >= 1 || rightBlock >= 1) && !(leftJump2Count >= 1 && rightJump2Count >= 1) && role === 1) return 3210;
    if ((leftJumpCount === 1 || rightJumpCount === 1) && (leftBlock >= 1 || rightBlock >= 1) && role !== 1) return 3210;
    //(1)1001
    if (leftJumpCount === 0 && rightJumpCount === 0 && (leftJump2Count === 1 || rightJump2Count === 1) && role === 1) return 3021;
    if (leftJumpCount === 0 && rightJumpCount === 0 && (leftJump2Count >= 1 || rightJump2Count >= 1) && role !== 1) return 3021;
    //0(1)1000
    if (leftJumpCount === 0 && rightJumpCount === 0 && leftJump2Count === 0 && rightJump2Count === 0 && leftBlock + rightBlock >= 3) return 2;
    //2(1)1000
    if ((leftBlock === 2 && rightBlock === 0) || (leftBlock === 0 && rightBlock === 2)) return 20;
  }
  else if (count === 1) {
    //(1)0111
    if (leftJumpCount === 3 && rightJumpCount === 3 && role === 1) return 4132;
    if (leftJumpCount >= 3 && rightJumpCount >= 3 && role !== 1) return 4132;
    if ((leftJumpCount === 3 || rightJumpCount === 3) && role === 1) return 413;
    if ((leftJumpCount >= 3 || rightJumpCount >= 3) && role !== 1) return 413;
    //0(1)0110
    if ((leftJumpCount === 2 || rightJumpCount === 2) && leftBlock >= 1 && rightBlock >= 1 && !(leftJump2Count >= 1 && rightJump2Count >= 1) && role === 1) return 312;
    if ((leftJumpCount === 2 || rightJumpCount === 2) && leftBlock >= 1 && rightBlock >= 1 && role !== 2) return 312;
    //2(1)0110
    if ((leftJumpCount === 2 || rightJumpCount === 2) && (leftBlock >= 1 || rightBlock >= 1) && !(leftJump2Count >= 1 && rightJump2Count >= 1) && role === 1) return 3120;
    if ((leftJumpCount === 2 || rightJumpCount === 2) && (leftBlock >= 1 || rightBlock >= 1) && role !== 2) return 3120;
    //1100(1)
    if (leftJumpCount === 0 && rightJumpCount === 0 && (leftJump2Count === 2 || rightJump2Count === 2) && role === 1) return 3012;
    if (leftJumpCount === 0 && rightJumpCount === 0 && (leftJump2Count >= 2 || rightJump2Count >= 2) && role !== 1) return 3012;
    //10(1)01
    if (leftJumpCount === 1 && rightJumpCount === 1 && role === 1) return 30111
    if (leftJumpCount >= 1 && rightJumpCount >= 1 && role !== 1) return 30111;
    //(1)0101
    if (((leftJumpCount === 1 && leftJump2Count === 1) || (rightJumpCount === 1 && rightJump2Count === 1)) && role === 1) return 31110;
    if (((leftJumpCount === 1 && leftJump2Count >= 1) || (rightJumpCount === 1 && rightJump2Count >= 1)) && role !== 1) return 31110;
    //0(1)0100
    if ((leftJumpCount === 1 || rightJumpCount === 1) && leftBlock + rightBlock >= 3) return 21;
    //2(1)0100
    if ((leftJumpCount === 1 || rightJumpCount === 1) && ((leftBlock === 2 && rightBlock === 0) || (leftBlock === 0 && rightBlock === 2))) return 210;
    //0(1)0010
    if (leftJumpCount === 0 && rightJumpCount === 0 && (leftJump2Count === 1 || rightJump2Count === 1) && leftBlock + rightBlock >= 3) return 211;
    //2(1)0010
    if (leftJumpCount === 0 && rightJumpCount === 0 && (leftJump2Count === 1 || rightJump2Count === 1) && ((leftBlock === 2 && rightBlock === 0) || (leftBlock === 0 && rightBlock === 2))) return 2110;
    //0(1)0000
    if (leftJumpCount === 0 && rightJumpCount === 0 && leftJump2Count === 0 && rightJump2Count === 0 && leftBlock + rightBlock >= 3) return 1;
  }
  return 0;
}
const isLong = (shape) => {
  return shape === 6;
};
const isFive = (shape) => {
  return shape === 5;
};

const isFour = (shape) => {
  return map[shape] === FOUR || map[shape] === BLOCK_FOUR;
};

const getAllShapesOfPoint = (shapeCache, x, y, role) => {
  const roles = role ? [role] : [1, -1];
  const result = [];
  for (const r of roles) {
    for (const d of [0, 1, 2, 3]) {
      const shape = shapeCache[r][d][x][y];
      if (shape > 0) {
        result.push(shape);
      }
    }
  }
  return result;
}