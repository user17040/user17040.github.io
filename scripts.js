document.addEventListener('DOMContentLoaded', function () {
    const idioms = data1.split(' ').concat(Object.keys(data2));
    const solution = generateSolution();
    const guesses = document.getElementById('guesses');
    const idiomInput = document.getElementById('idiomInput');
    const submitGuess = document.getElementById('submitGuess');
    const allowCustomWordsCheckbox = document.getElementById('allowCustomWords');
    let currentGuess = '';
    // 提交按钮功能
    submitGuess.addEventListener('click', () => {
        currentGuess = idiomInput.value.trim();
        const allowCustomWords = allowCustomWordsCheckbox.checked;
        if (allowCustomWords || idioms.includes(currentGuess)) {
            evaluateGuess(currentGuess);
            idiomInput.value = '';  // 清空输入框
        } else {
            alert("请输入有效的成语！");
        }
    });
    // 查看正确答案按钮功能
    revealAnswer.addEventListener('click', () => {
        revealSolution();
    });
    function revealSolution() {
        const solutionRow = document.createElement('div');
        solutionRow.className = 'guess';

        solution.split('').forEach(char => {
            const box = document.createElement('div');
            box.className = 'box green';
            box.textContent = char;
            solutionRow.appendChild(box);
        });

        guesses.appendChild(solutionRow);

        // 滚动到最新的猜测记录
        guesses.scrollTop = guesses.scrollHeight;
    }
    function evaluateGuess(guess) {
        const guessRow = document.createElement('div');
        guessRow.className = 'guess';

        // 跟踪已经被标记过的位置
        const solutionMarked = Array(4).fill(false);
        const cornersMarked = Array(4).fill(null).map(() => Array(5).fill(false));

        // 创建格子并标记四角号码
        guess.split('').forEach((char, index) => {
            const box = document.createElement('div');
            box.className = 'box';
            box.textContent = char;

            const corners = get_4corners(char);
            const solutionCorners = solution.split('').map(c => get_4corners(c));

            for (let i = 0; i < corners.length; i++) {
                let className = '';

                // 标记完全正确的四角号码
                if (corners[i] === solutionCorners[index][i] && !cornersMarked[index][i]) {
                    className = 'green';
                    cornersMarked[index][i] = true;
                }

                const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'right-middle'];
                box.innerHTML += `<div class="corner ${positions[i]} ${className}">${corners[i]}</div>`;
            }

            if (char === solution[index] && !solutionMarked[index]) {
                box.classList.add('green');
                solutionMarked[index] = true;
            }

            guessRow.appendChild(box);
        });

        // 再次遍历，用于标记部分正确的字符和四角号码
        guess.split('').forEach((char, index) => {
            const box = guessRow.children[index];
            const corners = get_4corners(char);
            const solutionCorners = solution.split('').map(c => get_4corners(c));

            for (let i = 0; i < corners.length; i++) {
                for (let j = 0; j < solutionCorners.length; j++) {
                    if (index !== j && corners[i] === solutionCorners[j][i] && !cornersMarked[j][i]) {
                        box.children[i].classList.add('yellow');
                        cornersMarked[j][i] = true;
                        break;
                    }
                }
            }

            for (let i = 0; i < solution.length; i++) {
                for (let j = 0; j < solution.length; j++) {
                    if (index !== j && char === solution[j] && !solutionMarked[j][i]) {
                        box.classList.add('yellow');
                        solutionMarked[j][i] = true;
                        break;
                    }
                }
            }


        });

        guesses.appendChild(guessRow);

        // 滚动到最新的猜测记录
        guesses.scrollTop = guesses.scrollHeight;
    }

    function generateSolution() {
        return idioms[Math.floor(Math.random() * idioms.length)];
    }

    function get_4corners(char) {
        if (!isNaN(char)) return '     ';
        let index = data3.indexOf(char);
        if (index === -1) return '     ';
        let res = '';
        for (let i = index - 6; i < index - 1; i++) {
            res += data3[i];
        }
        return res;
    }
});