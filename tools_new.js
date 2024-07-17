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
        this.a5 = 5000;
        this.a4 = 1500;
        this.b4 = 350;
        this.a3 = 100;
        this.b3 = 30;
        this.a2 = 7.5;
        this.b2 = 2.5;
        this.a1 = 0.5;
        this.forbidden = 0.25;
        this.score = Array.from({ length: 17 }, () => Array.from({ length: 17 }, () => [0, 0]));;
        this.current = [1, 1];
        let arrStones = init.length > 0 ? Array.from(new Set(init.match(/.{1,2}/g))) : [];
        let stone = RenjuBoardTool.BLACK_STONE;

        arrStones.forEach(onestone => {
            let coordinate = this.pos2coordinate(onestone);
            this.board[coordinate[0]][coordinate[1]] = stone;
            stone = (stone === RenjuBoardTool.WHITE_STONE) ? RenjuBoardTool.BLACK_STONE : RenjuBoardTool.WHITE_STONE;
        });
        this.update_all();
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
                if (this.isFive(this.current, RenjuBoardTool.BLACK_STONE, shape)) {
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
        if (!this.isFive(coordinate) && (this.isOverline(coordinate) || this.isDoubleFour(coordinate) || this.isDoubleThree(coordinate))) {
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
    isIn(coordinate) {
        return coordinate[0] >= 1 && coordinate[0] <= 15 && coordinate[1] >= 1 && coordinate[1] <= 15;
    }
    evaluate_point(color, coordinate) {

        let score = 0;
        for (let s in RenjuBoardTool.directions) {
            if (this.isFive(coordinate, color, s)) score += this.a5;
            if (color === RenjuBoardTool.BLACK_STONE) {
                if (this.isOpenFour(coordinate, s)) score += this.a4;
                else score += this.isFour(coordinate, s) * this.b4;
                if (this.isOpenThree(coordinate, s)) score += this.a3;
                else if (this.isThree(coordinate, s)) score += this.b3;
                if (this.isOpenTwo(coordinate, s)) score += this.a2;
                else if (this.isTwo(coordinate, s)) score += this.b2;
                if (this.isOpenOne(coordinate, s)) score += this.a1;
            } else {
                if (this.isFour_White(coordinate, s)) score += this.a4;
                else score += this.isFour_White(coordinate, s) * this.b4;
                if (this.isOpenThree_White(coordinate, s)) score += this.a3;
                else if (this.isThree_White(coordinate, s)) score += this.b3;
                if (this.isOpenTwo_White(coordinate, s)) score += this.a2;
                else if (this.isTwo_White(coordinate, s)) score += this.b2;
                if (this.isOpenOne_White(coordinate, s)) score += this.a1;
            }
        }
        return score;
    }
    update(coordinate, depth) {
        if (depth === 0) return;
        let [x, y] = coordinate;
        for (let s in RenjuBoardTool.directions) {
            for (let i = -5; i < 6; i++) {
                let nx = x + i * RenjuBoardTool.directions[s][0][0];
                let ny = y + i * RenjuBoardTool.directions[s][0][1];
                if (!(this.isIn([nx, ny]))) continue;
                let color = this.board[nx][ny];
                if (color === RenjuBoardTool.EMPTY_STONE) {
                    let isF = this.isForbidden(coordinate);
                    let evB = this.evaluate_point(RenjuBoardTool.BLACK_STONE, [nx, ny]);
                    this.score[nx][ny] = [isF ? evB + this.forbidden : evB, this.evaluate_point(this.WHITE_STONE, [nx, ny])];
                    if (isF) {
                        this.update([nx, ny], depth - 1);
                    }
                } else {
                    this.score[nx][ny] = this.evaluate_point(color, [nx, ny]) * color;
                }
            }
        }
    }
    update_all() {
        for (let x = 1; x <= 15; x++) {
            for (let y = 1; y <= 15; y++) {
                let color = this.board[x][y];
                if (color === RenjuBoardTool.EMPTY_STONE) {
                    let isF = this.isForbidden([x, y]);
                    let evB = this.evaluate_point(RenjuBoardTool.BLACK_STONE, [x, y]);
                    this.score[x][y] = [isF ? evB + this.forbidden : evB, this.evaluate_point(this.WHITE_STONE, [x, y])];
                } else {
                    this.score[x][y] = this.evaluate_point(color, [x, y]) * (color === RenjuBoardTool.BLACK_STONE ? 1 : -1);
                }
            }
        }
    }
    evaluate_board(color) {
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
        for (let x = 1; x <= 15; x++) {
            for (let y = 1; y <= 15; y++) {
                if (this.board[x][y] !== RenjuBoardTool.EMPTY_STONE) {
                    if (this.score[x][y] >= this.a5) b5++;
                    else if (this.score[x][y] >= this.a4) b4++;
                    else if (this.score[x][y] >= this.b4 * 2) b44++;
                    else if (this.score[x][y] >= this.b4 + this.a3) b43++;
                    else if (this.score[x][y] >= this.b4) bb4++;
                    else if (this.score[x][y] >= this.a3 * 2) b33++;
                    else if (this.score[x][y] >= this.a3) b3++;
                    if (this.score[x][y] <= -this.a5) w5++;
                    else if (this.score[x][y] <= -this.a4) w4++;
                    else if (this.score[x][y] <= -this.b4 * 2) w44++;
                    else if (this.score[x][y] <= -this.b4 - this.a3) w43++;
                    else if (this.score[x][y] <= -this.b4) wb4++;
                    else if (this.score[x][y] <= -this.a3 * 2) w33++;
                    else if (this.score[x][y] <= -this.a3) w3++;
                    this.score[x][y] >= 0 ? bscore += this.score[x][y] : wscore -= this.score[x][y];
                    console.log(bscore)
                }
            }
        }
        if (color === RenjuBoardTool.BLACK_STONE) {
            if (b5 > 0) {
                return 5 * this.a5;
            }
            else if (w5 > 0) {
                return - 5 * this.a5;
            }
            else if (w5 === 0 && (b4 + bb4 > 0 || b44 > 0)) {
                return 5 * this.a5 - 250;
            }
            else if (b4 + b44 + b43 + bb4 === 0 && w4 > 0) {
                return -5 * this.a5 + 500;
            }
            else if (w4 + w44 + w43 + wb4 === 0 && b3 > 0) {
                return 5 * this.a5 - 750;
            }
            else if (b4 + b44 + b43 + bb4 === 0 && (w43 > 0 || (b3 + b33 === 0 && w33 > 0))) {
                return -5 * this.a5 + 1000;
            }
        }
        else {
            if (w5 > 0) {
                return 5 * this.a5;
            }
            else if (b5 > 0) {
                return - 5 * this.a5;
            }
            else if (b5 === 0 && (w4 + wb4 > 0 || w44 > 0)) {
                return 5 * this.a5 - 250;
            }
            else if (b4 + b44 + b43 + bb4 === 0 && w4 > 0) {
                return -5 * this.a5 + 500;
            }
            else if (w4 + w44 + w43 + wb4 === 0 && b4 > 0) {
                return -5 * this.a5 + 500;
            }
            else if (b4 + b44 + b43 + bb4 === 0 && w3 > 0) {
                return 5 * this.a5 - 750;
            }
            else if (w4 + w44 + w43 + wb4 === 0 && (b43 > 0 || (w3 + w33 === 0 && b33 > 0))) {
                return -5 * this.a5 + 1000;
            }
        }
        return color === RenjuBoardTool.BLACK_STONE ? 2 * bscore - wscore : 2 * wscore - bscore;
    }
    gen_move(color) {
        let score;
        let moves = [];
        let temp = [];
        let temp2 = [];
        let temp3 = [];
        let temp4 = [];
        let temp5 = [];
        let temp6 = [];
        let opp4 = false;
        for (let x = 1; x <= 15; x++) {
            for (let y = 1; y <= 15; y++) {
                if (this.board[x][y] === RenjuBoardTool.EMPTY_STONE) {
                    let s1, s2;
                    if (color === RenjuBoardTool.BLACK_STONE) {
                        s1 = this.score[x][y][0]; s2 = this.score[x][y][1];
                    } else {
                        s1 = this.score[x][y][1]; s2 = this.score[x][y][0];
                    }
                    if (s1 % 1 === this.forbidden) continue;
                    score = 2 * s1 + s2;
                    if (s1 >= this.a5) {
                        return [{ x, y, s1, s2, score }];
                    }
                    else if (s1 >= this.b4 * 2) {
                        temp2.push({ x, y, s1, s2, score });
                    }
                    else if (s1 >= this.b4 + this.a3) {
                        temp3.push({ x, y, s1, s2, score });
                    }
                    else if (s1 >= this.b4) {
                        temp4.push({ x, y, s1, s2, score });
                    }
                    else if (s1 >= this.a3 * 2) {
                        temp5.push({ x, y, s1, s2, score });
                    }
                    if (s2 >= this.a5) {
                        temp.push({ x, y, s1, s2, score });
                    }
                    else if (s2 >= this.b4) {
                        if (s2 >= this.a4) opp4 = true;
                        temp6.push({ x, y, s1, s2, score })
                    }
                    if (s1 >= this.b2 || s2 >= this.b2) {
                        moves.push({ x, y, s1, s2, score });
                    }
                }
            }
        }
        if (temp.length > 0) return [temp[0]];//挡冲四
        if (temp2.length > 0) return [temp2[0]];//走活四
        if (temp3.length > 0) return [temp3[0]];//走四三
        if (temp6.length > 0 && opp4) return [...temp4, ...temp6].sort((a, b) => b.score - a.score);//挡活三
        if (temp6.length === 0 && temp5.length > 0) return [temp5[0]];//走三三
        return moves.sort((a, b) => b.score - a.score);
    }
    negamax(depth, color, path, alpha, beta) {
        let score = this.evaluate_board(color);
        if (score >= 5 * this.a5) {
            return { score: score - path.length, path: [...path] };
        }
        if (score <= -5 * this.a5) {
            return { score: score + path.length, path: [...path] };
        }
        if (depth === 0) {
            return { score, path: [...path] };
        }
        let moves = this.gen_move(color);
        if (moves.length === 0) {
            return { score: 0, path: [...path] };
        }
        let maxScore = -5*this.a5 - 1;
        let bestPath = [...path];
        for (let move of moves) {
            this.setStone(color, [move.x, move.y]);
            this.update([move.x, move.y], 2);
            let result = this.negamax(depth - 1, color === RenjuBoardTool.BLACK_STONE ? RenjuBoardTool.WHITE_STONE : RenjuBoardTool.BLACK_STONE, [...path, { x: move.x, y: move.y }], -beta, -alpha);
            console.log(move,result)
            let score = -result.score;
            this.setStone(RenjuBoardTool.EMPTY_STONE, [move.x, move.y]);
            this.update([move.x, move.y], 2);
            if (score > maxScore) {
                maxScore = score;
                bestPath = result.path;
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
    deeping(color, maxtime) {
        let d = new Date();
        let res;
        for (let depth = 1; ; depth++) {
            res = this.negamax(depth, color, [], -5 * this.a5 - 1, 5 * this.a5 + 1);
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
        str += String.fromCharCode(i[0] + 64) + i[1] + ' ';
    }
    return str;
}
