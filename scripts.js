
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
    function wordleFeedback(solution, guess) {
        if (solution.length !== guess.length) {
            return "The length of solution and guess must be the same.";
        }

        const green = Array(solution.length).fill(false);
        const yellow = Array(solution.length).fill(false);
        const solutionCharCount = {};

        // 标记正确位置的字符为绿，并统计每个字符的数量
        for (let i = 0; i < solution.length; i++) {
            if (guess[i] === solution[i]) {
                green[i] = true;
            } else {
                solutionCharCount[solution[i]] = (solutionCharCount[solution[i]] || 0) + 1;
            }
        }

        // 标记存在于字符串中但位置不正确的字符为黄
        for (let i = 0; i < guess.length; i++) {
            if (!green[i] && solutionCharCount[guess[i]]) {
                yellow[i] = true;
                solutionCharCount[guess[i]]--;
            }
        }

        return { green, yellow };
    }
    function evaluateGuess(guess) {
        const guessRow = document.createElement('div');
        guessRow.className = 'guess';

        // 获取反馈
        const feedback = wordleFeedback(solution, guess);
        const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'right-middle'];

        for (let index = 0; index < 4; index++) {
            const box = document.createElement('div');
            box.className = 'box';
            box.textContent = guess[index]; // 添加字符内容

            // 设置颜色标记
            if (feedback.green[index]) {
                box.classList.add('green');
            } else if (feedback.yellow[index]) {
                box.classList.add('yellow');
            }else{
                box.classList.add('black'); 
            }

            guessRow.appendChild(box);
        }

        for (let i = 0; i < 5; i++) {
            const guessCorners = get_4corners(guess[0])[i] + get_4corners(guess[1])[i] + get_4corners(guess[2])[i] + get_4corners(guess[3])[i];
            const solutionCorners = get_4corners(solution[0])[i] + get_4corners(solution[1])[i] + get_4corners(solution[2])[i] + get_4corners(solution[3])[i];
            const feedbackCorners = wordleFeedback(solutionCorners, guessCorners);

            for (let index = 0; index < 4; index++) {
                const box = guessRow.children[index];
                let className = 'black';
                if (feedbackCorners.green[index]) {
                    className = 'green';
                } else if (feedbackCorners.yellow[index]) {
                    className = 'yellow';
                }
                box.innerHTML += `<div class="corner ${positions[i]} ${className}">${get_4corners(guess[index])[i]}</div>`;
            }
        }

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