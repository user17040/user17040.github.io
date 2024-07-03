
const MAX = FIVE + 1;

const cache = new Cache(); // 放在这里，则minmax, vct和vcf会共用同一个缓存
const factory = () => {
  // depth 表示总深度，cDepth表示当前搜索深度
  const helper = (board, role, depth, cDepth = 0, path = [], alpha = -MAX, beta = MAX, isChong = false) => {
    const ev = board.evaluate(role);
    if (ev >= FIVE) {
      return [FIVE - path.length, [...path]];
    }
    if (ev <= -FIVE) {
      return [-FIVE + path.length, [...path]];
    }
    if (cDepth >= depth) {
      return [ev, [...path]];
    }
    if (!isChong) {
      let [currentValue, currentPath] = helper(board, -role, depth - 2, cDepth + 1, [...path], -beta, -beta + 1, false);
      if (-currentValue >= beta) {
        return [beta, [...path]];
      }
    }
    const hash = board.hash();
    const prev = cache.get(hash);
    if (prev && prev.role === role) {
      if (prev.depth >= depth - cDepth) {
        if (prev.flag === 0 && prev.value <= alpha) [prev.value, [...path, ...prev.path]];
        if (prev.flag === 1 && prev.value >= beta) [prev.value, [...path, ...prev.path]];
        if (prev.flag === 2) return [prev.value, [...path, ...prev.path]];
      }
    }
    let bestValue = -MAX;
    let bestPath = [...path]; // Copy the current path
    let points = board.getValuableMoves(role);
    let flag = 0;
    let newcDepth;
    // board.display(points);
    if (points.length === 0) {
      // points = board.getValidMoves(role);
      return [board.evaluate(role), [...path]];
    }
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      if (point[2] >= THREE / 3) { newcDepth = cDepth; isChong = true }
      else { newcDepth = cDepth + 1; isChong = false }
      board.put(point[0], point[1], role);
      let newPath = [...path, [point[0], point[1]]]; // Add current move to path
      if (bestValue > -MAX) {
        [currentValue, currentPath] = helper(board, -role, depth, newcDepth, newPath, -alpha - 1, -alpha, isChong);
        if (-currentValue > alpha && -currentValue < beta) {
          [currentValue, currentPath] = helper(board, -role, depth, newcDepth, newPath, -beta, -alpha, isChong);
        }
      } else {
        [currentValue, currentPath] = helper(board, -role, depth, newcDepth, newPath, -beta, -alpha, isChong);
      }
      currentValue *= -1;
      board.undo();
      if (currentValue > bestValue) {
        bestValue = currentValue;
        bestPath = currentPath;
      }
      if (currentValue > alpha) {
        alpha = currentValue;
        flag = 2;
      }
      if (alpha >= beta) {
        flag = 1;
        break;
      }
    }
    // 缓存
    if (!prev || prev.depth < depth - cDepth) {
      cache.put(hash, {
        depth: depth - cDepth, // 剩余搜索深度
        value: bestValue,
        role,
        path: bestPath.slice(cDepth), // 剩余搜索路径
        flag
      });
    }
    const res = [bestValue, bestPath];
    return res;
  }
  return helper;
}

const _minmax = factory();

const minmax = (board, role, maxtime = 2000) => {
  return new Promise((resolve) => {
    const d = new Date();
    let depth = 1;

    const loop = () => {
      const startTime = new Date();
      const res = _minmax(board, role, depth);
      res.push(depth, new Date() - d);
      document.getElementById('info').value = '计算|深度：' + res[2] + '|分数：' + res[0] + '（' + situation(role , res[0]) + '）|路径：' + convertCoordinates(res[1]) + '|时间：' + res[3] + '\n' + document.getElementById('info').value;
      if (new Date() - d > maxtime) {
        resolve(res);
        return;
      }

      depth++;
      setTimeout(loop, 1);
    };

    loop();
  });
};
const situation = (role, score) => {
  let nscore = role * score;
  if (-FIVE + 1000 >= nscore) return '白必胜';
  if (-FIVE + 1000 < nscore && nscore < -800) return '白近胜';
  if (-800 < nscore && nscore <= -400) return '白大优';
  if (-400 < nscore && nscore <= -200) return '白小优';
  if (-200 < nscore && nscore <= -100) return '偏白';
  if (-100 <= nscore && nscore <= 100) return '平衡';
  if (100 < nscore && nscore <= 200) return '偏黑';
  if (200 < nscore && nscore <= 400) return '黑小优';
  if (400 < nscore && nscore <= 800) return '黑大优';
  if (800 < nscore && nscore < FIVE - 1000) return '黑近胜';
  if (FIVE - 1000 <= nscore) return '黑必胜';
}
