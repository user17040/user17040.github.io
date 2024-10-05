<!DOCTYPE html>
<html>

<body>
    <h1>五子棋先手必胜（有禁手，黑棋不走33、44、长连）</h1>
    <div id="board"></div>
    <button onclick="undoMove();undoMove()">回退</button>
    <h2>计算结果</h2>
    <table class="info-table">
        <thead>
            <tr>
                <th>情况</th>
            </tr>
        <tbody id="result-body">
            <!-- 计算结果会被动态添加到这里 -->
        </tbody>
        </thead>
    </table>
</body>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Gomoku Board</title>
    <style>
        table {
            border-collapse: collapse;
            margin: 20px;
        }

        td {
            width: 16px;
            height: 16px;
            text-align: center;
            vertical-align: middle;
            font-size: 12px;
            border: 1px solid #000;
            background-color: #ccc;
            /* 灰色背景 */
            position: relative;
        }

        td::before {
            content: '';
            display: block;
            width: 80%;
            height: 80%;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1;
        }


        .black {
            color: #000;
            /* 白色数字 */
        }

        .white {
            color: #fff;
            /* 黑色数字 */
        }

        .red {
            color: #f00;
            /* 黑色数字 */
        }

        .empty {
            color: transparent;
            /* 空格无数字显示 */
        }

        .info-table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }

        .info-table th,
        .info-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
        }

        .info-table th {
            background-color: #f2f2f2;
        }
    </style>
    <script src="gomocalc.js"></script>
    <script>
        let board = Array(15).fill().map(() => Array(15).fill(null)); // 15x15 empty board
        let moveHistory = []; // Stores the move history for undo
        let currentMove = 1; // Move counter
        let gomocalcInitialized = false; // Flag to track if gomocalc is initialized
        let path = "";
        let best;
        function convertCoordinate(coordinate) {
            const columnLetter = coordinate[0]; // 获取列字母
            const rowNumber = parseInt(coordinate.slice(1, coordinate.length), 10); // 获取行数字

            const columnNumber = columnLetter.charCodeAt(0) - 'A'.charCodeAt(0);

            const rowNumberConverted = 15 - rowNumber;
            return [rowNumberConverted, columnNumber];
        }
        function callback(o) {
            if (o.pos && best === null) {
                makeMove(o.pos[1], o.pos[0]);
                updateTable(" +M1");
            }
            if (o.msg) {
                if (o.msg.includes("Speed")) {
                    makeMove(best[0], best[1]);
                } else {
                    console.log(o.msg);
                    let s = o.msg.split("|");
                    best = convertCoordinate(s[3].split(" ")[1]);
                    if (Number(s[0].slice(6, s[0].length).split('-')[0]) >= 30) { gomocalc.stopThinking(); makeMove(best[0], best[1]); }
                    updateTable(s[1].slice(5, s[1].length));
                }
            }
        }

        function drawBoard() {
            let table = "<table>";
            // Add coordinates on the top row
            table += "<tr><td></td>";
            for (let i = 0; i < 15; i++) {
                table += `<td class="red">${String.fromCharCode(65 + i)}</td>`; // A-O
            }
            table += "</tr>";
            for (let i = 0; i < 15; i++) {
                table += `<tr><td class="red">${15 - i}</td>`; // Row numbers 15-1 on the left
                for (let j = 0; j < 15; j++) {
                    let cellClass = board[i][j] ? (board[i][j].side === 1 ? "black" : "white") : "empty";
                    table += `<td class="${cellClass}" onclick="makeMove(${i}, ${j})">`;
                    if (board[i][j]) {
                        table += board[i][j].move; // Display move number
                    }
                    table += "</td>";
                }
                table += "</tr>";
            }
            document.getElementById('board').innerHTML = table;
        }

        function makeMove(i, j) {
            if (board[i][j] !== null) return; // If already occupied, return
            let side = currentMove % 2 === 1 ? 1 : 2; // Alternates between 1 (black) and 2 (white)
            board[i][j] = { side, move: currentMove }; // Store side and move number
            moveHistory.push({ i, j, side, move: currentMove, path });
            currentMove++;
            drawBoard();
            path += ` ${j},${i},${side}`;
            if (side !== 1) {
                const result = findMatchingMove(moveHistory.map(x => [x.i, x.j]), books, 15);
                console.log(result);
                if (result === null) {
                    think();
                    makeMove(best[0], best[1]);
                } else {
                    makeMove(result.m[0], result.m[1]);
                    updateTable(` +M${result.l}`)
                }
            }
        }

        function undoMove() {
            if (moveHistory.length === 0) return;
            let lastMove = moveHistory.pop();
            board[lastMove.i][lastMove.j] = null; // Clear last move
            path = lastMove.path;
            currentMove--;
            drawBoard();
            updateTable("-");
        }

        function think() {
            best = null;
            if (!gomocalcInitialized) {
                // Initialize gomocalc only when the first "计算" is pressed
                initGomocalc().then(() => {
                    performThink();
                });
            } else {
                performThink();
            }
        }

        function performThink() {
            // The actual think process starts here
            gomocalc.sendCommand('RELOADCONFIG config-220723.toml');
            gomocalc.sendCommand('INFO HASH_SIZE 262144');
            gomocalc.sendCommand('INFO RULE 2');
            gomocalc.sendCommand('INFO THREAD_NUM 1');
            gomocalc.sendCommand('INFO CAUTION_FACTOR 3');
            gomocalc.sendCommand('INFO STRENGTH 100');
            gomocalc.sendCommand('INFO TIMEOUT_TURN 86400000');
            gomocalc.sendCommand('INFO TIMEOUT_MATCH 86400000');
            gomocalc.sendCommand('INFO MAX_DEPTH 225');
            gomocalc.sendCommand('INFO MAX_NODE 0');
            gomocalc.sendCommand('INFO SHOW_DETAIL 3');
            gomocalc.sendCommand('INFO PONDERING 0');
            gomocalc.sendCommand('INFO SWAPABLE 1');
            gomocalc.sendCommand('START 15');
            gomocalc.sendCommand('INFO TIME_LEFT 86400000');
            if (currentMove % 2 === 1) {
                gomocalc.sendCommand(`YXBOARD${path} DONE`);
            } else {
                let s = path.split(' ');
                gomocalc.sendCommand(`YXBOARD${s.slice(0, s.length - 1).join(' ')} DONE`);
                gomocalc.sendCommand(`TURN ${s[s.length - 1]}`);
            }
            gomocalc.sendCommand('YXNBEST 1');
        }

        function initGomocalc() {
            return new Promise((resolve, reject) => {
                gomocalc.init(o => {
                    gomocalcInitialized = true;
                    o && o.ok && resolve(o);
                    callback(o);
                });
            });
        }
        // 更新表格显示深度、分数、路线
        function updateTable(score) {
            let tableBody = document.getElementById('result-body');
            tableBody.innerHTML = ''; // 清空原有内容，防止重复添加
            let newRow = document.createElement('tr');
            newRow.innerHTML = `<td>${score[1] === '+' && score[2] === 'M' ? score.slice(3, score.length) + ' 手内获胜' : '-'}</td>`;
            tableBody.appendChild(newRow);
        }
        // Draw the board on page load
        drawBoard();
        makeMove(7, 7);
        updateTable(" +M35");
        //---book---
        let books = [
            [[[7, 7]], 35],
            //开局
            [[[7, 7], [7, 8], [8, 8]], 31],
            [[[7, 7], [8, 8], [8, 6]], 33],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6]], 31],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [4, 8], [9, 7]], 19],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [5, 8], [7, 8]], 23],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [6, 6], [9, 7]], 29],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [6, 7], [9, 7]], 29],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [7, 5], [10, 6]], 21],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [7, 6], [9, 7]], 27],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [7, 8], [9, 8]], 23],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [7, 9], [9, 7]], 21],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [8, 5], [7, 6]], 21],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [8, 7], [10, 6]], 23],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [9, 5], [7, 6]], 23],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [9, 7], [10, 6]], 23],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [9, 8], [7, 8]], 29],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [10, 6], [7, 8]], 27],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [10, 8], [9, 8]], 23],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [4, 8], [9, 7], [6, 7], [10, 8]], 17],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [6, 6], [9, 7], [6, 7], [6, 5]], 27],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [6, 7], [9, 7], [6, 6], [6, 5]], 27],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [7, 6], [9, 7], [9, 8], [10, 8]], 25],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [7, 6], [9, 7], [10, 8], [9, 8]], 17],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [7, 8], [9, 8], [9, 7], [10, 6]], 21],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [8, 5], [7, 6], [6, 6], [7, 8]], 19],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [8, 7], [10, 6], [7, 6], [9, 8]], 21],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [9, 5], [7, 6], [6, 6], [9, 8]], 23],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [9, 8], [7, 8], [7, 6], [8, 7]], 27],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [9, 8], [7, 8], [8, 7], [7, 5]], 25],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [4, 8], [9, 7], [6, 7], [10, 8], [7, 5], [9, 8]], 15],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [6, 6], [9, 7], [6, 7], [6, 5], [9, 8], [7, 8]], 25],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [6, 7], [9, 7], [6, 6], [6, 5], [9, 8], [7, 8]], 25],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [7, 6], [9, 7], [9, 8], [10, 8], [5, 8], [7, 8]], 21],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [7, 6], [9, 7], [9, 8], [10, 8], [7, 8], [5, 8]], 23],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [7, 6], [9, 7], [10, 8], [9, 8], [9, 5], [8, 7]], 15],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [7, 8], [9, 8], [9, 7], [10, 6], [11, 6], [8, 5]], 19],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [8, 5], [7, 6], [6, 6], [7, 8], [7, 5], [8, 7]], 17],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [8, 7], [10, 6], [7, 6], [9, 8], [11, 6], [9, 5]], 13],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [9, 8], [7, 8], [7, 6], [8, 7], [6, 10], [6, 9]], 21],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [6, 6], [9, 7], [6, 7], [6, 5], [9, 8], [7, 8], [10, 8], [9, 5]], 19],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [6, 7], [9, 7], [6, 6], [6, 5], [9, 8], [7, 8], [10, 8], [9, 5]], 19],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [7, 6], [9, 7], [10, 8], [9, 8], [9, 5], [8, 7], [6, 7], [8, 9]], 9],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [8, 5], [7, 6], [6, 6], [7, 8], [7, 5], [8, 7], [10, 5], [6, 5]], 15],
            [[[7, 7], [8, 8], [8, 6], [6, 8], [9, 6], [9, 8], [7, 8], [7, 6], [8, 7], [6, 10], [6, 9], [9, 8], [7, 6]], 19],

        ];
        function rotate90(steps, boardSize) {
            const center = (boardSize - 1) / 2;
            return steps.map(([x, y]) => {
                const newX = center + (center - y);
                const newY = center - (center - x);
                return [newX, newY];
            });
        }
        function rotate180(steps, boardSize) {
            return steps.map(([x, y]) => {
                const newX = boardSize - 1 - x;
                const newY = boardSize - 1 - y;
                return [newX, newY];
            });
        }
        function rotate270(steps, boardSize) {
            const center = (boardSize - 1) / 2;
            return steps.map(([x, y]) => {
                const newX = center - (center - y);
                const newY = center + (center - x);
                return [newX, newY];
            });
        }
        function flipHorizontal(steps, boardSize) {
            return steps.map(([x, y]) => {
                return [x, boardSize - 1 - y];
            });
        }
        function findMatchingMove(inputSequence, books, boardSize) {
            const n = inputSequence.length;

            // 检查是否有匹配的序列
            for (let i = 0; i < books.length; i++) {
                const bookSequence = books[i][0];
                const l = books[i][1];
                // 如果长度不匹配，跳过
                if (bookSequence.length - 1 !== n) continue;
                // 检查正向匹配
                if (JSON.stringify(bookSequence.slice(0, n)) === JSON.stringify(inputSequence)) {
                    return { m: bookSequence[n], l };
                }

                // 检查旋转90度匹配
                const rotated90 = rotate90(bookSequence.slice(0, n), boardSize);
                if (JSON.stringify(rotated90) === JSON.stringify(inputSequence)) {
                    return { m: rotate90([bookSequence[n]], boardSize)[0], l }; // 返回旋转后的点
                }

                // 检查旋转180度匹配
                const rotated180 = rotate180(bookSequence.slice(0, n), boardSize);
                if (JSON.stringify(rotated180) === JSON.stringify(inputSequence)) {
                    return { m: rotate180([bookSequence[n]], boardSize)[0], l }; // 返回旋转后的点
                }

                // 检查旋转270度匹配
                const rotated270 = rotate270(bookSequence.slice(0, n), boardSize);
                if (JSON.stringify(rotated270) === JSON.stringify(inputSequence)) {
                    return { m: rotate270([bookSequence[n]], boardSize)[0], l }; // 返回旋转后的点
                }

                // 检查水平翻转匹配
                const flippedHorizontal = flipHorizontal(bookSequence.slice(0, n), boardSize);
                if (JSON.stringify(flippedHorizontal) === JSON.stringify(inputSequence)) {
                    return { m: flipHorizontal([bookSequence[n]], boardSize)[0], l }; // 返回翻转后的点
                }

                // 检查水平翻转 + 旋转90度匹配
                const flippedHorizontalRotated90 = rotate90(flippedHorizontal, boardSize);
                if (JSON.stringify(flippedHorizontalRotated90) === JSON.stringify(inputSequence)) {
                    return { m: flipHorizontal(rotate90([bookSequence[n]], boardSize)[0], boardSize)[0], l }; // 返回旋转后的点
                }

                // 检查水平翻转 + 旋转180度匹配
                const flippedHorizontalRotated180 = rotate180(flippedHorizontal, boardSize);
                if (JSON.stringify(flippedHorizontalRotated180) === JSON.stringify(inputSequence)) {
                    return { m: flipHorizontal(rotate180([bookSequence[n]], boardSize)[0], boardSize)[0], l }; // 返回旋转后的点
                }

                // 检查水平翻转 + 旋转270度匹配
                const flippedHorizontalRotated270 = rotate270(flippedHorizontal, boardSize);
                if (JSON.stringify(flippedHorizontalRotated270) === JSON.stringify(inputSequence)) {
                    return { m: flipHorizontal(rotate270([bookSequence[n]], boardSize)[0], boardSize)[0], l }; // 返回旋转后的点
                }
            }

            // 如果没有找到匹配
            return null;
        }



    </script>
</head>


</html>