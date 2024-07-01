class XiangqiGame {
    constructor() {
        this.pieceValue = [
            [	// 帅（与兵合并）
                [9, 9, 9, 11, 13, 11, 9, 9, 9],
                [19, 24, 34, 42, 44, 42, 34, 24, 19],
                [19, 24, 32, 37, 37, 37, 32, 24, 19],
                [19, 23, 27, 29, 30, 29, 27, 23, 19],
                [14, 18, 20, 27, 29, 27, 20, 18, 14],
                [7, 0, 13, 0, 16, 0, 13, 0, 7],
                [7, 0, 7, 0, 15, 0, 7, 0, 7],
                [0, 0, 0, 1, 1, 1, 0, 0, 0],
                [0, 0, 0, 2, 2, 2, 0, 0, 0],
                [0, 0, 0, 11, 15, 11, 0, 0, 0]
            ], [	// 仕（相）
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 20, 0, 0, 0, 20, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [18, 0, 0, 20, 23, 20, 0, 0, 18],
                [0, 0, 0, 0, 23, 0, 0, 0, 0],
                [0, 0, 20, 20, 0, 20, 20, 0, 0]
            ], [	// 马
                [90, 90, 90, 96, 90, 96, 90, 90, 90],
                [90, 96, 103, 97, 94, 97, 103, 96, 90],
                [92, 98, 99, 103, 99, 103, 99, 98, 92],
                [93, 108, 100, 107, 100, 107, 100, 108, 93],
                [90, 100, 99, 103, 104, 103, 99, 100, 90],
                [90, 98, 101, 102, 103, 102, 101, 98, 90],
                [92, 94, 98, 95, 98, 95, 98, 94, 92],
                [93, 92, 94, 95, 92, 95, 94, 92, 93],
                [85, 90, 92, 93, 78, 93, 92, 90, 85],
                [88, 85, 90, 88, 90, 88, 90, 85, 88]
            ], [	// 车
                [206, 208, 207, 213, 214, 213, 207, 208, 206],
                [206, 212, 209, 216, 233, 216, 209, 212, 206],
                [206, 208, 207, 214, 216, 214, 207, 208, 206],
                [206, 213, 213, 216, 216, 216, 213, 213, 206],
                [208, 211, 211, 214, 215, 214, 211, 211, 208],
                [208, 212, 212, 214, 215, 214, 212, 212, 208],
                [204, 209, 204, 212, 214, 212, 204, 209, 204],
                [198, 208, 204, 212, 212, 212, 204, 208, 198],
                [200, 208, 206, 212, 200, 212, 206, 208, 200],
                [194, 206, 204, 212, 200, 212, 204, 206, 194]
            ], [	// 炮
                [100, 100, 96, 91, 90, 91, 96, 100, 100],
                [98, 98, 96, 92, 89, 92, 96, 98, 98],
                [97, 97, 96, 91, 92, 91, 96, 97, 97],
                [96, 99, 99, 98, 100, 98, 99, 99, 96],
                [96, 96, 96, 96, 100, 96, 96, 96, 96],
                [95, 96, 99, 96, 100, 96, 99, 96, 95],
                [96, 96, 96, 96, 96, 96, 96, 96, 96],
                [97, 96, 100, 99, 101, 99, 100, 96, 97],
                [96, 97, 98, 98, 98, 98, 98, 97, 96],
                [96, 96, 97, 99, 99, 99, 97, 96, 96]
            ]
        ];
        this.initBoard();
    }

    initBoard() {
        const initialFEN = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR r";
        this.loadFEN(initialFEN);
    }

    loadFEN(fen) {
        const parts = fen.split(" ");
        const rows = parts[0].split('/');
        this.currentTurn = parts[1];
        this.chessboard = rows.map(row => {
            const rowCells = [];
            for (const char of row) {
                if (!isNaN(char)) {
                    rowCells.push(...Array(parseInt(char)).fill(''));
                } else {
                    rowCells.push(char);
                }
            }
            return rowCells;
        });
        this.history = [];
        this.eat = [];
        this.eval = this.evaluateBoard();
    }

    generateFEN() {
        let fen = this.chessboard.map(row => {
            let count = 0;
            return row.reduce((acc, cell) => {
                if (cell === '') count++;
                else {
                    if (count > 0) {
                        acc += count;
                        count = 0;
                    }
                    acc += cell;
                }
                return acc;
            }, '') + (count > 0 ? count : '');
        }).join('/');
        fen += " " + this.currentTurn;
        return fen;
    }

    makeMove(move) {
        const [fromX, fromY] = move.from;
        const [toX, toY] = move.to;
        const piece = this.chessboard[fromX][fromY];
        this.history.push(move);
        this.eat.push(this.chessboard[toX][toY]);
        this.eval -= this.getPieceValue(toX, toY, this.chessboard[toX][toY]);
        this.eval -= this.getPieceValue(fromX, fromY, this.chessboard[fromX][fromY]);
        this.eval += this.getPieceValue(toX, toY, this.chessboard[fromX][fromY]);
        this.chessboard[toX][toY] = piece;
        this.chessboard[fromX][fromY] = '';
        this.currentTurn = this.currentTurn === 'r' ? 'b' : 'r';
    }

    undoMove() {
        if (this.history.length > 0) {
            const { from, to } = this.history.pop();
            const [fromX, fromY] = from;
            const [toX, toY] = to;
            this.eval -= this.getPieceValue(fromX, fromY, this.chessboard[fromX][fromY]);
            this.eval -= this.getPieceValue(toX, toY, this.chessboard[toX][toY]);
            this.eval += this.getPieceValue(fromX, fromY, this.chessboard[toX][toY]);
            this.eval += this.getPieceValue(toX, toY, this.eat[this.eat.length - 1]);
            this.chessboard[fromX][fromY] = this.chessboard[toX][toY];
            this.chessboard[toX][toY] = this.eat[this.eat.length - 1];
            this.eat.pop();
            this.currentTurn = this.currentTurn === 'r' ? 'b' : 'r';
            return true;
        }
        return false;
    }
    quiescence(depth, alpha, beta, path) {
        if (beta <= -9000) {
            return { score: -10000 + path.length, path: [...path] };
        }
        let ev = this.currentTurn === 'r' ? this.eval : -this.eval;
        if (depth === 0) {
            return { score: ev, path: [...path] };
        }
        let maxEval = -10000;
        let moves = this.generateLegalMoves();
        let ischecked = this.checked();
        if (!ischecked) {
            if (ev > maxEval) {
                if (ev >= beta) {
                    return { score: ev, path: [...path] };
                }
                maxEval = ev;
                if (ev > alpha) {
                    alpha = ev;
                }
            }
        }
        let bestPath = [...path];
        for (let move of moves) {
            if (!move.eat && !ischecked) continue;
            this.makeMove(move);
            const result = this.quiescence(depth - 1, -beta, -alpha, [...path, move]);
            let score = -result.score;
            this.undoMove();
            if (score > maxEval) {
                if (score >= beta) {
                    return { score, path: [...path] };
                }
                maxEval = score;
                bestPath = [...result.path];
                if (score > alpha) {
                    alpha = score;
                }
            }
        }
        if (maxEval === -10000) return { score: -10000 + path.length, path: [...path] };
        return { score: maxEval, path: bestPath };
    }
    negamax(depth, alpha, beta, path) {
        if (depth === 0) {
            let qreuslt = this.quiescence(4, alpha, beta, [...path]);
            return { score: qreuslt.score, path: [...qreuslt.path] };
        }

        let maxEval = -10000;
        let bestPath = [];
        const moves = this.generateLegalMoves();
        for (const move of moves) {
            this.makeMove(move);
            if (this.checked()) {
                this.undoMove();
                continue;
            }
            const result = this.negamax(depth - 1, -beta, -alpha, [...path, move]);
            let score = -result.score;
            this.undoMove();
            if (score > maxEval) {
                maxEval = score;
                if (score >= beta) {
                    break;
                }
                if (score > alpha) {
                    alpha = score;
                    bestPath = [...result.path];
                }
            }
        }
        if (maxEval === -10000) return { score: -10000 + path.length, path };
        return { score: maxEval, path: bestPath };
    }
    generateLegalMoves() {
        let moves = [];
        for (let x = 0; x < this.chessboard.length; x++) {
            for (let y = 0; y < this.chessboard[x].length; y++) {
                const piece = this.chessboard[x][y];
                if (piece && this.isOwnPiece(piece)) {
                    switch (piece.toLowerCase()) {
                        case 'k':
                            moves.push(...this.generateKMoves(x, y, piece));
                            break;
                        case 'r':
                            moves.push(...this.generateRMoves(x, y, piece));
                            break;
                        case 'c':
                            moves.push(...this.generateCMoves(x, y, piece));
                            break;
                        case 'n':
                            moves.push(...this.generateNMoves(x, y, piece));
                            break;
                        case 'b':
                            moves.push(...this.generateBMoves(x, y, piece));
                            break;
                        case 'a':
                            moves.push(...this.generateAMoves(x, y, piece));
                            break;
                        case 'p':
                            moves.push(...this.generatePMoves(x, y, piece));
                            break;
                    }
                }
            }
        }
        return moves;
    }
    isEmptyPiece(piece) {
        return piece === '';
    }
    isOwnPiece(piece) {
        return piece !== '' && ((this.currentTurn === 'r' && piece === piece.toUpperCase()) || (this.currentTurn === 'b' && piece === piece.toLowerCase()));
    }
    isOppPiece(piece) {
        return piece !== '' && ((this.currentTurn === 'b' && piece === piece.toUpperCase()) || (this.currentTurn === 'r' && piece === piece.toLowerCase()));
    }
    isInRiver(x) {
        if (this.currentTurn === 'b' && x < 5) return true;
        if (this.currentTurn === 'r' && x > 4) return true;
        return false;
    }
    isInFortress(x, y) {
        const minY = 3, maxY = 5;
        const maxX = this.currentTurn === 'b' ? 2 : 9;
        const minX = this.currentTurn === 'b' ? 0 : 7;
        return x >= minX && x <= maxX && y >= minY && y <= maxY;
    }
    generateKMoves(x, y, piece) {
        const moves = [];
        const directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0]
        ];

        directions.forEach(dir => {
            const nx = x + dir[0];
            const ny = y + dir[1];
            if (this.isInFortress(nx, ny) && !this.isOwnPiece(this.chessboard[nx][ny])) {
                moves.push({ from: [x, y], to: [nx, ny], piece, eat: this.isOppPiece(this.chessboard[nx][ny]) });
            }
        });

        return moves;
    }
    generateRMoves(x, y, piece) {
        const moves = [];
        const directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0]
        ];

        directions.forEach(dir => {
            let nx = x;
            let ny = y;
            while (true) {
                nx += dir[0];
                ny += dir[1];
                if (!this.isInsideBoard(nx, ny) || this.isOwnPiece(this.chessboard[nx][ny])) {
                    break;
                }
                if (this.isOppPiece(this.chessboard[nx][ny])) {
                    moves.push({ from: [x, y], to: [nx, ny], piece, eat: this.isOppPiece(this.chessboard[nx][ny]) });
                    break;
                }
                moves.push({ from: [x, y], to: [nx, ny], piece, eat: this.isOppPiece(this.chessboard[nx][ny]) });
            }
        });

        return moves;
    }
    generateCMoves(x, y, piece) {
        const moves = [];
        const directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0]
        ];

        directions.forEach(dir => {
            let nx = x;
            let ny = y;
            let overPiece = false;

            while (true) {
                nx += dir[0];
                ny += dir[1];
                if (!this.isInsideBoard(nx, ny)) {
                    break;
                }
                if (!this.isEmptyPiece(this.chessboard[nx][ny])) {
                    if (overPiece) {
                        if (this.isOppPiece(this.chessboard[nx][ny])) {
                            moves.push({ from: [x, y], to: [nx, ny], piece, eat: this.isOppPiece(this.chessboard[nx][ny]) });
                        }
                        break;
                    } else {
                        overPiece = true;
                    }
                } else {
                    if (!overPiece) {
                        moves.push({ from: [x, y], to: [nx, ny], piece, eat: this.isOppPiece(this.chessboard[nx][ny]) });
                    }
                }
            }
        });

        return moves;
    }
    generateNMoves(x, y, piece) {
        const moves = [];
        const directions = [
            [2, 1], [2, -1], [-2, 1], [-2, -1],
            [1, 2], [1, -2], [-1, 2], [-1, -2]
        ];
        const legBlocks = [
            [1, 0], [1, 0], [-1, 0], [-1, 0],
            [0, 1], [0, -1], [0, 1], [0, -1]
        ];

        directions.forEach((dir, index) => {
            const nx = x + dir[0];
            const ny = y + dir[1];
            const lx = x + legBlocks[index][0];
            const ly = y + legBlocks[index][1];
            if (this.isInsideBoard(nx, ny) && this.isInsideBoard(lx, ly) && this.isEmptyPiece(this.chessboard[lx][ly]) && !this.isOwnPiece(this.chessboard[nx][ny])) {
                moves.push({ from: [x, y], to: [nx, ny], piece, eat: this.isOppPiece(this.chessboard[nx][ny]) });
            }
        });
        return moves;
    }
    generateBMoves(x, y, piece) {
        const moves = [];
        const directions = [
            [2, 2], [2, -2], [-2, 2], [-2, -2]
        ];
        const legBlocks = [
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];

        directions.forEach((dir, index) => {
            const nx = x + dir[0];
            const ny = y + dir[1];
            const lx = x + legBlocks[index][0];
            const ly = y + legBlocks[index][1];
            if (this.isInsideBoard(nx, ny) && this.isInsideBoard(lx, ly) && this.isInRiver(nx) && this.isEmptyPiece(this.chessboard[lx][ly]) && !this.isOwnPiece(this.chessboard[nx][ny])) {
                moves.push({ from: [x, y], to: [nx, ny], piece, eat: this.isOppPiece(this.chessboard[nx][ny]) });
            }
        });

        return moves;
    }
    generateAMoves(x, y, piece) {
        const moves = [];
        const directions = [
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];

        directions.forEach(dir => {
            const nx = x + dir[0];
            const ny = y + dir[1];
            if (this.isInFortress(nx, ny) && !this.isOwnPiece(this.chessboard[nx][ny])) {
                moves.push({ from: [x, y], to: [nx, ny], piece, eat: this.isOppPiece(this.chessboard[nx][ny]) });
            }
        });

        return moves;
    }
    generatePMoves(x, y, piece) {
        const moves = [];
        const forward = this.currentTurn === 'r' ? -1 : 1;
        const crossedRiver = !this.isInRiver(x);

        if (this.isInsideBoard(x + forward, y) && !this.isOwnPiece(this.chessboard[x + forward][y])) {
            moves.push({ from: [x, y], to: [x + forward, y], piece, eat: this.isOppPiece(this.chessboard[x + forward][y]) });
        }

        if (crossedRiver) {
            const sideMoves = [-1, 1];
            sideMoves.forEach(sideMove => {
                if (this.isInsideBoard(x, y + sideMove) && !this.isOwnPiece(this.chessboard[x][y + sideMove])) {
                    moves.push({ from: [x, y], to: [x, y + sideMove], piece, eat: this.isOppPiece(this.chessboard[x][y + sideMove]) });
                }
            });
        }

        return moves;
    }
    getPieceValue(x, y, piece) {
        switch (piece) {
            case 'K': return this.pieceValue[0][x][y];
            case 'R': return this.pieceValue[3][x][y];
            case 'C': return this.pieceValue[4][x][y];
            case 'N': return this.pieceValue[2][x][y];
            case 'B': return this.pieceValue[1][x][y];
            case 'A': return this.pieceValue[1][x][y];
            case 'P': return this.pieceValue[0][x][y];
            case 'k': return -this.pieceValue[0][9 - x][y];
            case 'r': return -this.pieceValue[3][9 - x][y];
            case 'c': return -this.pieceValue[4][9 - x][y];
            case 'n': return -this.pieceValue[2][9 - x][y];
            case 'b': return -this.pieceValue[1][9 - x][y];
            case 'a': return -this.pieceValue[1][9 - x][y];
            case 'p': return -this.pieceValue[0][9 - x][y];
            default: return 0;
        }
    }
    evaluateBoard() {
        let ev = 0;
        for (let x = 0; x < this.chessboard.length; x++) {
            for (let y = 0; y < this.chessboard[x].length; y++) {
                ev += this.getPieceValue(x, y, this.chessboard[x][y]);
            }
        }
        return ev;
    }
    isInsideBoard(x, y) {
        return x >= 0 && x < this.chessboard.length && y >= 0 && y < this.chessboard[0].length;
    }
    // 移动的中文描述
    getChineseMoveDescription(move) {
        const fromX = move.from[0];
        const fromY = move.from[1];
        const toX = move.to[0];
        const toY = move.to[1];
        const pieceType = move.piece;
        const chinese = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        let moveType = '';
        let moveDistance;
        if (move.piece === move.piece.toUpperCase()) {
            moveDistance = chinese[Math.abs(toX - fromX)];
        } else {
            moveDistance = Math.abs(toX - fromX);
        }
        if (move.piece === move.piece.toUpperCase()) {
            moveType = toX < fromX ? '进' : (toX > fromX ? '退' : '平');
        } else {
            moveType = toX > fromX ? '进' : (toX < fromX ? '退' : '平');
        }
        const chineseColumnsRed = ['九', '八', '七', '六', '五', '四', '三', '二', '一'];
        const chineseColumnsBlack = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const pieceName = this.getChinesePieceName(pieceType);
        let columnFrom;
        let columnTo;
        if (move.piece === move.piece.toUpperCase()) {
            columnFrom = chineseColumnsRed[fromY];
            columnTo = chineseColumnsRed[toY];
        } else {
            columnFrom = chineseColumnsBlack[fromY];
            columnTo = chineseColumnsBlack[toY];
        }

        if (moveType === '平' || pieceType.toLowerCase() === 'n' || pieceType.toLowerCase() === 'b' || pieceType.toLowerCase() === 'a') {
            return `${pieceName}${columnFrom}${moveType}${columnTo}`;
        } else {
            return `${pieceName}${columnFrom}${moveType}${moveDistance}`;
        }
    }

    // 获取棋子的中文名称
    getChinesePieceName(piece) {
        switch (piece) {
            case 'k': return '将';
            case 'r': return '车';
            case 'c': return '炮';
            case 'n': return '马';
            case 'b': return '象';
            case 'a': return '士';
            case 'p': return '卒';
            case 'K': return '帅';
            case 'R': return '车';
            case 'C': return '炮';
            case 'N': return '马';
            case 'B': return '相';
            case 'A': return '仕';
            case 'P': return '兵';
            default: return '';
        }
    }
    checked() {
        const directions_N = [
            [2, 1], [2, -1], [-2, 1], [-2, -1],
            [1, 2], [1, -2], [-1, 2], [-1, -2]
        ];
        const directions_RC = [
            [0, 1], [0, -1], [1, 0], [-1, 0]
        ];
        const legBlocks = [
            [1, 1], [1, -1], [-1, 1], [-1, -1],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
        for (let x = 0; x < this.chessboard.length; x++) {
            for (let y = 0; y < this.chessboard[x].length; y++) {
                const piece = this.chessboard[x][y];
                if (piece && !this.isOwnPiece(piece) && piece.toLowerCase() === 'k') {
                    if (this.currentTurn === 'r') {
                        if (this.isInsideBoard(x + 1, y) && this.chessboard[x + 1][y] === 'P') return true;
                        if (this.isInsideBoard(x, y + 1) && this.chessboard[x][y + 1] === 'P') return true;
                        if (this.isInsideBoard(x, y - 1) && this.chessboard[x][y - 1] === 'P') return true;
                    }
                    else if (this.currentTurn === 'b') {
                        if (this.isInsideBoard(x - 1, y) && this.chessboard[x - 1][y] === 'p') return true;
                        if (this.isInsideBoard(x, y + 1) && this.chessboard[x][y + 1] === 'p') return true;
                        if (this.isInsideBoard(x, y - 1) && this.chessboard[x][y - 1] === 'p') return true;
                    }
                    for (let index = 0; index < directions_N.length; index++) {
                        const nx = x + directions_N[index][0];
                        const ny = y + directions_N[index][1];
                        const lx = x + legBlocks[index][0];
                        const ly = y + legBlocks[index][1];
                        if (this.isInsideBoard(nx, ny) && this.isInsideBoard(lx, ly) && this.isEmptyPiece(this.chessboard[lx][ly])) {
                            if (this.currentTurn === 'r' && this.chessboard[nx][ny] === 'N') return true;
                            if (this.currentTurn === 'b' && this.chessboard[nx][ny] === 'n') return true;
                        }
                    };

                    for (let dir of directions_RC) {
                        let nx = x;
                        let ny = y;
                        while (true) {
                            nx += dir[0];
                            ny += dir[1];
                            if (!this.isInsideBoard(nx, ny)) {
                                break;
                            }
                            if (this.currentTurn === 'r' && this.chessboard[nx][ny] === 'R') return true;
                            if (this.currentTurn === 'b' && this.chessboard[nx][ny] === 'r') return true;
                            if (this.currentTurn === 'r' && this.chessboard[nx][ny] === 'K') return true;
                            if (this.currentTurn === 'b' && this.chessboard[nx][ny] === 'k') return true;
                            if (!this.isEmptyPiece(this.chessboard[nx][ny])) {
                                break;
                            }
                        }
                        while (true) {
                            nx += dir[0];
                            ny += dir[1];
                            if (!this.isInsideBoard(nx, ny)) {
                                break;
                            }
                            if (this.currentTurn === 'r' && this.chessboard[nx][ny] === 'C') return true;
                            if (this.currentTurn === 'b' && this.chessboard[nx][ny] === 'c') return true;
                            if (!this.isEmptyPiece(this.chessboard[nx][ny])) {
                                break;
                            }
                        }
                    };
                    return false;
                }
            }
        }
        return false;
    }
    deeping(time) {
        let result; let path; let d = new Date();
        for (let i = 1; ; i++) {
            result = this.negamax(i, -10000, 10000, []);
            path = '';
            result.path.forEach((element) => path += this.getChineseMoveDescription(element) + ' ');
            console.log('深度：' + i + '|分数：' + result.score + '|路线：' + path + '|时间：' + (new Date() - d));
            if (new Date() - d > time) break;
        }
        return result;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    let flip = false;
    const game = new XiangqiGame();
    const chessboardElement = document.getElementById('chessboard');
    const undoButton = document.getElementById('undoButton');
    let selected = null;
    let selectedPiece = null;
    const pieceMap = {
        'R': { img: 'rR.svg', name: '车' },
        'N': { img: 'rN.svg', name: '马' },
        'B': { img: 'rB.svg', name: '相' },
        'A': { img: 'rA.svg', name: '仕' },
        'K': { img: 'rK.svg', name: '帅' },
        'P': { img: 'rP.svg', name: '兵' },
        'C': { img: 'rC.svg', name: '炮' },
        // 为黑方棋子添加映射
        'r': { img: 'bR.svg', name: '车' },
        'n': { img: 'bN.svg', name: '马' },
        'b': { img: 'bB.svg', name: '象' },
        'a': { img: 'bA.svg', name: '士' },
        'k': { img: 'bK.svg', name: '将' },
        'p': { img: 'bP.svg', name: '卒' },
        'c': { img: 'bC.svg', name: '炮' }
    };
    function setupBoard() {
        chessboardElement.innerHTML = '';
        game.chessboard.forEach((row, x) => {
            row.forEach((cell, y) => {
                const cellElement = document.createElement('div');
                cellElement.className = 'cell';
                if (cell) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = 'piece';
                    pieceElement.classList.add(cell === cell.toLowerCase() ? 'flipped' : 'notflipped');
                    pieceElement.style.backgroundImage = `url('img/${pieceMap[cell].img}')`; // 需要对应棋子的图片
                    cellElement.appendChild(pieceElement);
                }
                cellElement.addEventListener('click', () => handleCellClick(x, y));
                chessboardElement.appendChild(cellElement);
            });
        });
    }

    function handleCellClick(x, y) {
        let moves = game.generateLegalMoves();
        if (selected && arrayContains(moves, [selectedPiece, [x, y]])) {
            game.makeMove({ from: selectedPiece, to: [x, y], piece: selected });
            selected = null;
            selectedPiece = null;
            setupBoard();
            updateURL(game.generateFEN());
        } else if (game.chessboard[x][y] && ((game.currentTurn === 'r' && game.chessboard[x][y] === game.chessboard[x][y].toUpperCase()) || (game.currentTurn === 'b' && game.chessboard[x][y] === game.chessboard[x][y].toLowerCase()))) {
            selected = game.chessboard[x][y];
            selectedPiece = [x, y];
        }
    }

    function updateURL(fen) {
        const url = new URL(window.location);
        url.searchParams.set('fen', fen);
        window.history.pushState({}, '', url);
    }
    newButton.addEventListener('click', function () {
        game.initBoard();
        updateURL(game.generateFEN());
        setupBoard();
    });
    undoButton.addEventListener('click', function () {
        if (game.undoMove()) {
            setupBoard();
            updateURL(game.generateFEN());
        }
    });
    flipBoardButton.addEventListener('click', function () {
        flip = !flip;
        chessboardElement.classList.toggle('flipped');
        // 同时反转所有棋子，以保持正确的朝向
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.toggle('flipped');
        });
        setupBoard()
    });
    calcButton.addEventListener('click', function () {
        let result = game.deeping(2000);
        game.makeMove(result.path[0]);
        setupBoard();
        updateURL(game.generateFEN());
    });
    const params = new URLSearchParams(window.location.search);
    const fen = params.get('fen');
    if (fen) {
        game.loadFEN(fen);
    } else {
        game.initBoard();
    }

    // 初始化棋盘显示
    setupBoard();
});
function arrayContains(arr, target) {
    for (let subarr of arr) {
        if (subarr.from[0] === target[0][0] && subarr.from[1] === target[0][1] && subarr.to[0] === target[1][0] && subarr.to[1] === target[1][1]) return true;
    }
    return false;
}