class RenjuBoardTool {
    static EMPTY_STONE = '.'; //空
    static BORDER = '$'; //边界
    static BLACK_STONE = 'b'; //黑棋
    static WHITE_STONE = 'w'; //白棋
    static WHITE_FIVE = 1;
    static BLACK_FIVE = 2;
    static BLACK_FORBIDDEN = 4;

    static directions = {
        '|': [[+1, 0], [-1, 0]],   //下，上
        '-': [[0, +1], [0, -1]],   //前，后
        '\\': [[+1, +1], [-1, -1]], //右下，左上
        '/': [[+1, -1], [-1, +1]]  //左下，右上
    };

    constructor(init = '') {
        this.board = [
            ['$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$'], //border
            ['$', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '$'], //1
            ['$', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '$'], //2
            ['$', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '$'], //3
            ['$', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '$'], //4
            ['$', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '$'], //5
            ['$', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '$'], //6
            ['$', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '$'], //7
            ['$', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '$'], //8
            ['$', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '$'], //9
            ['$', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '$'], //10
            ['$', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '$'], //11
            ['$', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '$'], //12
            ['$', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '$'], //13
            ['$', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '$'], //14
            ['$', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '$'], //15
            ['$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$', '$']  //border
        ];
        this.current = [1, 1];

        let arrStones = init.length > 0 ? Array.from(new Set(init.match(/.{1,2}/g))) : [];
        let stone = RenjuBoardTool.BLACK_STONE;

        arrStones.forEach(onestone => {
            let coordinate = this.pos2coordinate(onestone);
            this.board[coordinate[0]][coordinate[1]] = stone;
            stone = (stone === RenjuBoardTool.WHITE_STONE) ? RenjuBoardTool.BLACK_STONE : RenjuBoardTool.WHITE_STONE;
        });
    }

    _debug_board() {
        return this.board.map(row => row.join('')).join('\n');
    }

    pos2coordinate(position) {
        return [
            parseInt(position[0], 16),
            parseInt(position[1], 16)
        ];
    }

    moveTo(to = [8, 8]) {
        if (to[0] >= 1 && to[0] <= 15 && to[1] >= 1 && to[1] <= 15) {
            this.current = to;
        }
        return this._();
    }

    setStone(stone = '.', coordinate = []) {
        if (coordinate.length === 0) {
            coordinate = this.current;
        }
        this.board[coordinate[0]][coordinate[1]] = stone;
    }

    moveDirection(direction) {
        let next = [
            this.current[0] + direction[0],
            this.current[1] + direction[1]
        ];
        let next_stone = this._(next);
        if (next_stone === RenjuBoardTool.BORDER) {
            return false;
        }
        this.current = next;
        return next_stone;
    }

    _(coordinate = []) {
        if (coordinate.length === 0) {
            coordinate = this.current;
        }
        return this.board[coordinate[0]][coordinate[1]];
    }

    count_stone(coordinate, shape) {
        let color = this._(coordinate);
        if (color === RenjuBoardTool.BLACK_STONE || color === RenjuBoardTool.WHITE_STONE) {
            let count = 1;
            RenjuBoardTool.directions[shape].forEach(direction => {
                this.moveTo(coordinate);
                while (color === this.moveDirection(direction)) {
                    count++;
                }
            });
            return count;
        }
        return 0;
    }

    isFive(coordinate, color, shape = '', rule = 'renju') {
        let t = this.board[coordinate[0]][coordinate[1]];
        this.setStone(color, coordinate);
        let result = false;
        if (shape) {
            let count = this.count_stone(coordinate, shape);
            result = this.count_as_five(count, color, rule);
        } else {
            for (let s in RenjuBoardTool.directions) {
                let count = this.count_stone(coordinate, s);
                if (result = this.count_as_five(count, color, rule)) {
                    break;
                }
            }
        }
        this.setStone(t, coordinate);
        return result;
    }

    isFour(coordinate, shape = '|') {
        let result = 0;
        let t = this.board[coordinate[0]][coordinate[1]];
        this.setStone(RenjuBoardTool.BLACK_STONE, coordinate);
        let count_black = 1;
        RenjuBoardTool.directions[shape].forEach(direction => {
            this.moveTo(coordinate);
            while (RenjuBoardTool.BLACK_STONE === this.moveDirection(direction)) {
                count_black++;
            }
            if (this._() === RenjuBoardTool.EMPTY_STONE) {
                if (this.isFive(this.current, RenjuBoardTool.BLACK_STONE, shape)) {
                    result++;
                }
            }
        });
        if (count_black === 4 && result === 2) {
            result = 1;
        }
        this.setStone(t, coordinate);
        return result;
    }

    isFour_White(coordinate, shape = '|') {
        let result = 0;
        let t = this.board[coordinate[0]][coordinate[1]];
        this.setStone(RenjuBoardTool.WHITE_STONE, coordinate);
        let count_white = 1;
        RenjuBoardTool.directions[shape].forEach(direction => {
            this.moveTo(coordinate);
            while (RenjuBoardTool.WHITE_STONE === this.moveDirection(direction)) {
                count_white++;
            }
            if (this._() === RenjuBoardTool.EMPTY_STONE) {
                if (this.isFive(this.current, RenjuBoardTool.WHITE_STONE, shape)) {
                    result++;
                }
            }
        });
        if (count_white === 4 && result === 2) {
            result = 1;
        }
        this.setStone(t, coordinate);
        return result;
    }

    isOpenFour(coordinate, shape = '|') {
        let count_active = 0;
        let count_black = 1;
        let t = this.board[coordinate[0]][coordinate[1]];
        this.setStone(RenjuBoardTool.BLACK_STONE, coordinate);
        RenjuBoardTool.directions[shape].forEach(direction => {
            this.moveTo(coordinate);
            while (RenjuBoardTool.BLACK_STONE === this.moveDirection(direction)) {
                count_black++;
            }
            if (this._() === RenjuBoardTool.EMPTY_STONE) {
                if (this.isFive(this.current, RenjuBoardTool.BLACK_STONE, shape)) {
                    count_active++;
                }
            } else {
                return;
            }
        });
        if (count_black === 4 && count_active === 2) {
            if (this.isForbidden(coordinate)) {
                this.setStone(t, coordinate);
                return false;
            }
            this.setStone(t, coordinate);
            return true;
        }
        this.setStone(t, coordinate);
        return false;
    }

    isOpenFour_White(coordinate, shape = '|') {
        let count_active = 0;
        let count_white = 1;
        let t = this.board[coordinate[0]][coordinate[1]];
        this.setStone(RenjuBoardTool.WHITE_STONE, coordinate);
        RenjuBoardTool.directions[shape].forEach(direction => {
            this.moveTo(coordinate);
            while (RenjuBoardTool.WHITE_STONE === this.moveDirection(direction)) {
                count_white++;
            }
            if (this._() === RenjuBoardTool.EMPTY_STONE) {
                if (this.isFive(this.current, RenjuBoardTool.WHITE_STONE, shape)) {
                    count_active++;
                }
            } else {
                return;
            }
        });
        this.setStone(t, coordinate);
        if (count_white === 4 && count_active === 2) {
            return true;
        }
        return false;
    }

    isOpenThree(coordinate, shape = '|') {
        let result = false;
        let t = this.board[coordinate[0]][coordinate[1]];
        this.setStone(RenjuBoardTool.BLACK_STONE, coordinate);
        RenjuBoardTool.directions[shape].forEach(direction => {
            this.moveTo(coordinate);
            while (RenjuBoardTool.BLACK_STONE === this.moveDirection(direction)) {
                null;
            }
            if (this._() === RenjuBoardTool.EMPTY_STONE) {
                if (this.isOpenFour(this.current, shape)) {
                    result = true;
                    return;
                }
            } else {
                return;
            }
        });
        this.setStone(t, coordinate);
        return result;
    }

    isOpenThree_White(coordinate, shape = '|') {
        let result = false;
        let t = this.board[coordinate[0]][coordinate[1]];
        this.setStone(RenjuBoardTool.WHITE_STONE, coordinate);
        RenjuBoardTool.directions[shape].forEach(direction => {
            this.moveTo(coordinate);
            while (RenjuBoardTool.WHITE_STONE === this.moveDirection(direction)) {
                null;
            }
            if (this._() === RenjuBoardTool.EMPTY_STONE) {
                if (this.isOpenFour_White(this.current, shape)) {
                    result = true;
                    return;
                }
            } else {
                return;
            }
        });
        this.setStone(t, coordinate);
        return result;
    }

    isThree(coordinate, shape = '|') {
        let result = false;
        let t = this.board[coordinate[0]][coordinate[1]];
        this.setStone(RenjuBoardTool.BLACK_STONE, coordinate);
        let count_black = 1;
        RenjuBoardTool.directions[shape].forEach(direction => {
            this.moveTo(coordinate);
            while (RenjuBoardTool.BLACK_STONE === this.moveDirection(direction)) {
                count_black++;
            }
            if (this._() === RenjuBoardTool.EMPTY_STONE) {
                if (this.isFour(this.current, shape)) {
                    result = true;
                }
            }
        });
        this.setStone(t, coordinate);
        return result;
    }

    isThree_White(coordinate, shape = '|') {
        let result = false;
        let t = this.board[coordinate[0]][coordinate[1]];
        this.setStone(RenjuBoardTool.WHITE_STONE, coordinate);
        let count_black = 1;
        RenjuBoardTool.directions[shape].forEach(direction => {
            this.moveTo(coordinate);
            while (RenjuBoardTool.WHITE_STONE === this.moveDirection(direction)) {
                count_black++;
            }
            if (this._() === RenjuBoardTool.EMPTY_STONE) {
                if (this.isFour_White(this.current, shape)) {
                    result = true;
                }
            }
        });
        this.setStone(t, coordinate);
        return result;
    }

    isOpenTwo(coordinate, shape = '|') {
        let result = false;
        let t = this.board[coordinate[0]][coordinate[1]];
        this.setStone(RenjuBoardTool.BLACK_STONE, coordinate);
        RenjuBoardTool.directions[shape].forEach(direction => {
            this.moveTo(coordinate);
            while (RenjuBoardTool.BLACK_STONE === this.moveDirection(direction)) {
                null;
            }
            if (this._() === RenjuBoardTool.EMPTY_STONE) {
                if (this.isOpenThree(this.current, shape)) {
                    result = true;
                    return;
                }
            } else {
                return;
            }
        });
        this.setStone(t, coordinate);
        return result;
    }

    isOpenTwo_White(coordinate, shape = '|') {
        let result = false;
        let t = this.board[coordinate[0]][coordinate[1]];
        this.setStone(RenjuBoardTool.WHITE_STONE, coordinate);
        RenjuBoardTool.directions[shape].forEach(direction => {
            this.moveTo(coordinate);
            while (RenjuBoardTool.WHITE_STONE === this.moveDirection(direction)) {
                null;
            }
            if (this._() === RenjuBoardTool.EMPTY_STONE) {
                if (this.isOpenThree_White(this.current, shape)) {
                    result = true;
                    return;
                }
            } else {
                return;
            }
        });
        this.setStone(t, coordinate);
        return result;
    }

    isTwo(coordinate, shape = '|') {
        let result = false;
        let t = this.board[coordinate[0]][coordinate[1]];
        this.setStone(RenjuBoardTool.BLACK_STONE, coordinate);
        let count_black = 1;
        RenjuBoardTool.directions[shape].forEach(direction => {
            this.moveTo(coordinate);
            while (RenjuBoardTool.BLACK_STONE === this.moveDirection(direction)) {
                count_black++;
            }
            if (this._() === RenjuBoardTool.EMPTY_STONE) {
                if (this.isThree(this.current, shape)) {
                    result = true;
                }
            }
        });
        this.setStone(t, coordinate);
        return result;
    }

    isTwo_White(coordinate, shape = '|') {
        let result = false;
        let t = this.board[coordinate[0]][coordinate[1]];
        this.setStone(RenjuBoardTool.WHITE_STONE, coordinate);
        let count_black = 1;
        RenjuBoardTool.directions[shape].forEach(direction => {
            this.moveTo(coordinate);
            while (RenjuBoardTool.WHITE_STONE === this.moveDirection(direction)) {
                count_black++;
            }
            if (this._() === RenjuBoardTool.EMPTY_STONE) {
                if (this.isThree_White(this.current, shape)) {
                    result = true;
                }
            }
        });
        this.setStone(t, coordinate);
        return result;
    }

    isOpenOne(coordinate, shape = '|') {
        let result = false;
        let t = this.board[coordinate[0]][coordinate[1]];
        this.setStone(RenjuBoardTool.BLACK_STONE, coordinate);
        RenjuBoardTool.directions[shape].forEach(direction => {
            this.moveTo(coordinate);
            while (RenjuBoardTool.BLACK_STONE === this.moveDirection(direction)) {
                null;
            }
            if (this._() === RenjuBoardTool.EMPTY_STONE) {
                if (this.isOpenTwo(this.current, shape)) {
                    result = true;
                    return;
                }
            } else {
                return;
            }
        });
        this.setStone(t, coordinate);
        return result;
    }

    isOpenOne_White(coordinate, shape = '|') {
        let result = false;
        let t = this.board[coordinate[0]][coordinate[1]];
        this.setStone(RenjuBoardTool.WHITE_STONE, coordinate);
        RenjuBoardTool.directions[shape].forEach(direction => {
            this.moveTo(coordinate);
            while (RenjuBoardTool.WHITE_STONE === this.moveDirection(direction)) {
                null;
            }
            if (this._() === RenjuBoardTool.EMPTY_STONE) {
                if (this.isOpenTwo_White(this.current, shape)) {
                    result = true;
                    return;
                }
            } else {
                return;
            }
        });
        this.setStone(t, coordinate);
        return result;
    }

    isOne(coordinate, shape = '|') {
        let result = false;
        let t = this.board[coordinate[0]][coordinate[1]];
        this.setStone(RenjuBoardTool.BLACK_STONE, coordinate);
        let count_black = 1;
        RenjuBoardTool.directions[shape].forEach(direction => {
            this.moveTo(coordinate);
            while (RenjuBoardTool.BLACK_STONE === this.moveDirection(direction)) {
                count_black++;
            }
            if (this._() === RenjuBoardTool.EMPTY_STONE) {
                if (this.isTwo(this.current, shape)) {
                    result = true;
                }
            }
        });
        this.setStone(t, coordinate);
        return result;
    }

    isOne_White(coordinate, shape = '|') {
        let result = false;
        let t = this.board[coordinate[0]][coordinate[1]];
        this.setStone(RenjuBoardTool.WHITE_STONE, coordinate);
        let count_black = 1;
        RenjuBoardTool.directions[shape].forEach(direction => {
            this.moveTo(coordinate);
            while (RenjuBoardTool.WHITE_STONE === this.moveDirection(direction)) {
                count_black++;
            }
            if (this._() === RenjuBoardTool.EMPTY_STONE) {
                if (this.isTwo_White(this.current, shape)) {
                    result = true;
                }
            }
        });
        this.setStone(t, coordinate);
        return result;
    }

    isDoubleThree(coordinate) {
        let count = 0;
        for (let s in RenjuBoardTool.directions) {
            if (this.isOpenThree(coordinate, s)) {
                count++;
                if (count >= 2) {
                    return true;
                }
            }
        }
        return false;
    }

    isDoubleFour(coordinate) {
        let count = 0;
        for (let s in RenjuBoardTool.directions) {
            count += this.isFour(coordinate, s);
            if (count >= 2) {
                return true;
            }
        }
        return false;
    }

    isOverline(coordinate) {
        this.setStone(RenjuBoardTool.BLACK_STONE, coordinate);
        for (let s in RenjuBoardTool.directions) {
            let count = this.count_stone(coordinate, s);
            if (count > 5) {
                this.setStone(RenjuBoardTool.EMPTY_STONE, coordinate);
                return true;
            }
        }
        this.setStone(RenjuBoardTool.EMPTY_STONE, coordinate);
        return false;
    }

    isForbidden(coordinate) {
        if (this.isOverline(coordinate) || this.isDoubleFour(coordinate) || this.isDoubleThree(coordinate)) {
            return RenjuBoardTool.BLACK_FORBIDDEN;
        }
        return false;
    }

    count_as_five(count, color, rule = 'renju') {
        switch (rule) {
            case 'renju':
                if (color === RenjuBoardTool.BLACK_STONE && count > 5) {
                    return false;
                }
                return count === 5;
            case 'free':
                return count === 5;
        }
    }
}

class RenjuEvaluator {
    constructor(boardTool) {
        this.boardTool = boardTool;
        this.boardSize = 15; // Renju board size is 15x15
        this.evs = this.evaluate_b_w(boardTool);
        this.directions = [['|', 1, 0], ['-', 0, 1], ['/', 1, 1], ['\\', 1, -1]]
    }
    update_scores(coordinate) {
        const radius = 5; // 更新半径
        const t = this.boardTool._(coordinate)
        for (let direction of this.directions) {
            for (let d = -radius; d <= radius; d++) {
                const x = coordinate[0] + d * direction[1];
                const y = coordinate[1] + d * direction[2];
                if (x >= 1 && x <= 15 && y >= 1 && y <= 15) {
                    const color = this.boardTool._([x, y]);
                    if (color !== RenjuBoardTool.EMPTY_STONE) {
                        const player = color === RenjuBoardTool.BLACK_STONE ? 'black' : 'white';
                        this.evs[player] += this.evaluateLine([x, y], color, direction[0]);
                        this.boardTool.setStone(RenjuBoardTool.EMPTY_STONE, coordinate);
                        this.evs[player] -= this.evaluateLine([x, y], color, direction[0]);
                        this.boardTool.setStone(t, coordinate);
                    }
                }
            }
        }
    }
    generateMoves(color) {
        const moves = [];
        for (let i = 1; i <= 15; i++) {
            for (let j = 1; j <= 15; j++) {
                if (this.boardTool._([i, j]) === RenjuBoardTool.EMPTY_STONE && !(color === RenjuBoardTool.BLACK_STONE && this.boardTool.isForbidden([i, j]))) {
                    moves.push([i, j]);
                }
            }
        }
        return moves;
    }
    evaluate_b_w() {
        let b = 0;
        let w = 0;
        // Evaluate current board state
        for (let i = 1; i <= this.boardSize; i++) {
            for (let j = 1; j <= this.boardSize; j++) {
                let coordinate = [i, j];
                let stone = this.boardTool._(coordinate);

                if (stone === RenjuBoardTool.EMPTY_STONE) {
                    continue;
                }
                if (stone === RenjuBoardTool.BLACK_STONE) {
                    // Evaluate for black stones (AI's stones)
                    b += this.evaluatePosition(coordinate, RenjuBoardTool.BLACK_STONE);
                } else if (stone === RenjuBoardTool.WHITE_STONE) {
                    // Evaluate for white stones (opponent's stones)
                    w += this.evaluatePosition(coordinate, RenjuBoardTool.WHITE_STONE);
                }
            }
        }
        return { 'black': b, 'white': w };
    }
    evaluate(color) {
        if (color === RenjuBoardTool.BLACK_STONE) {
            return this.evs['black'] - this.evs['white'] * 0.5;
        } else if (color === RenjuBoardTool.WHITE_STONE) {
            return this.evs['white'] - this.evs['black'] * 0.5;
        }
    }

    evaluatePosition(coordinate, color) {
        let score = 0;

        // Evaluate based on number of stones in rows, columns, diagonals
        score += this.evaluateLine(coordinate, color, '|'); // Vertical
        score += this.evaluateLine(coordinate, color, '-'); // Horizontal
        score += this.evaluateLine(coordinate, color, '\\'); // Diagonal 1
        score += this.evaluateLine(coordinate, color, '/'); // Diagonal 2

        return score;
    }

    evaluateLine(coordinate, color, shape) {
        let score = 0;
        if (color === RenjuBoardTool.BLACK_STONE) {
            if (this.boardTool.isFive(coordinate, color, shape)) {
                score += 10000000;
            }
            if (this.boardTool.isOpenFour(coordinate, shape)) {
                score += 100000;
            }
            score += this.boardTool.isFour(coordinate, shape) * 10000;
            if (this.boardTool.isOpenThree(coordinate, shape)) {
                score += 1000;
            }
            if (this.boardTool.isThree(coordinate, shape)) {
                score += 100;
            }
            if (this.boardTool.isOpenTwo(coordinate, shape)) {
                score += 50;
            }
            if (this.boardTool.isTwo(coordinate, shape)) {
                score += 10;
            }
            if (this.boardTool.isOpenOne(coordinate, shape)) {
                score += 6;
            }
            if (this.boardTool.isOne(coordinate, shape)) {
                score += 2;
            }
        } else if (color === RenjuBoardTool.WHITE_STONE) {
            if (this.boardTool.isFive(coordinate, color, shape)) {
                score += 10000000;
            }
            if (this.boardTool.isOpenFour_White(coordinate, shape)) {
                score += 100000;
            }
            score += this.boardTool.isFour_White(coordinate, shape) * 10000;
            if (this.boardTool.isOpenThree_White(coordinate, shape)) {
                score += 1000;
            }
            if (this.boardTool.isThree_White(coordinate, shape)) {
                score += 100;
            }
            if (this.boardTool.isOpenTwo_White(coordinate, shape)) {
                score += 50;
            }
            if (this.boardTool.isTwo_White(coordinate, shape)) {
                score += 10;
            }
            if (this.boardTool.isOpenOne_White(coordinate, shape)) {
                score += 6;
            }
            if (this.boardTool.isOne_White(coordinate, shape)) {
                score += 2;
            }
        }
        return score;
    }
    search(maxdepth, depth, alpha, beta, color) {
        let ev = this.evaluate(color);
        if (ev >= 1000000) {
            return { ev: 1000000 - maxdepth + depth, path: [] };
        }
        if (ev <= -1000000) {
            return { ev: -1000000 + maxdepth - depth, path: [] };
        }
        if (depth === 0) {
            return { ev: ev, path: [] };
        }

        const moves = this.generateMoves(color);
        let maxEval = -Infinity;
        let bestPath = [];
        const evb = this.evs['black'];
        const evw = this.evs['white'];
        for (const move of moves) {
            this.boardTool.setStone(color, move);
            this.update_scores(move);
            const result = this.search(maxdepth, depth - 1, -beta, -alpha, color === RenjuBoardTool.BLACK_STONE ? RenjuBoardTool.WHITE_STONE : RenjuBoardTool.BLACK_STONE);
            if (depth == 2) { console.log(2, move, -result.ev) }
            if (depth == 1) { console.log(1, move, -result.ev) }
            const ev = -result.ev;
            const path = result.path;
            this.boardTool.setStone(RenjuBoardTool.EMPTY_STONE, move);
            this.evs = { 'black': evb, 'white': evw };
            if (ev > maxEval) {
                maxEval = ev;
                bestPath = [move, ...path];
            }
            if (ev > alpha) {
                alpha = ev;
            }
            if (alpha >= beta) {
                break;
            }
        }
        return { ev: maxEval, path: bestPath };
    }
}

function path_t(array) {
    let str = ''
    for (let i of array) {
        str += String.fromCharCode(i[0] + 64) + i[1] + ' ';
    }
    return str;
}
