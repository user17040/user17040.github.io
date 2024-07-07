document.addEventListener('DOMContentLoaded', function () {
    const solution = generateSolution();
    const guesses = document.getElementById('guesses');
    const idiomInput = document.getElementById('idiomInput');
    const submitGuess = document.getElementById('submitGuess');
    let currentGuess = '';
    // 提交按钮功能
    submitGuess.addEventListener('click', () => {
        currentGuess = idiomInput.value.trim();
        if (currentGuess.length === 4) {
            evaluateGuess(currentGuess);
            idiomInput.value = '';  // 清空输入框
        }
    });
    function evaluateGuess(guess) {
        const guessRow = document.createElement('div');
        guessRow.className = 'guess';

        // 跟踪已经被标记过的位置
        const solutionMarked = Array(4).fill(false);
        const guessMarked = Array(4).fill(false);
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
                } else {
                    // 检查其他位置是否有相同的四角号码
                    for (let j = 0; j < solutionCorners.length; j++) {
                        if (index !== j && corners[i] === solutionCorners[j][i] && !cornersMarked[j][i]) {
                            className = 'yellow';
                            cornersMarked[j][i] = true;
                            break;
                        }
                    }
                }

                const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'right-middle'];
                box.innerHTML += `<div class="corner ${positions[i]} ${className}">${corners[i]}</div>`;
            }

            // 标记整个字（格子）
            if (char === solution[index] && !solutionMarked[index]) {
                box.classList.add('correct');
                solutionMarked[index] = true;
            } else if (!solutionMarked[index] && solution.split('').some((solChar, solIndex) => solChar === char && !solutionMarked[solIndex])) {
                box.classList.add('present');
                solutionMarked[solution.split('').findIndex((solChar, solIndex) => solChar === char && !solutionMarked[solIndex])] = true;
            }

            guessRow.appendChild(box);
        });

        // 保留绿色标记的条件
        guessRow.childNodes.forEach(box => {
            if (box.classList.contains('present')) {
                box.classList.add('correct');
            }
        });

        guesses.appendChild(guessRow);

        // 滚动到最新的猜测记录
        guesses.scrollTop = guesses.scrollHeight;
    }

    function generateSolution() {
        const idioms = data1.split(' ').concat(Object.keys(data2));
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