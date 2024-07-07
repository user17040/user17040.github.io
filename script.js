document.addEventListener('DOMContentLoaded', function () {
    const solution = generateSolution();
    const guesses = document.getElementById('guesses');
    const currentGuessElement = document.querySelectorAll('#currentGuess .box');
    const keyboard = document.getElementById('keyboard');
    const submitGuess = document.getElementById('submitGuess');
    const deleteButton = document.getElementById('deleteButton'); // 获取删除按钮
    let currentGuess = '';

    // 初始化键盘
    for (let i = 0; i < 10; i++) {
        const key = document.createElement('button');
        key.textContent = i;
        key.className = 'button'; // 添加按钮类
        key.addEventListener('click', () => addDigitToGuess(i));
        keyboard.appendChild(key);
    }

    // 添加删除按钮功能
    deleteButton.addEventListener('click', () => {
        if (currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1); // 删除最后一个字符
            currentGuessElement[currentGuess.length].textContent = ''; // 清除对应的格子显示
        }
    });

    function addDigitToGuess(digit) {
        if (currentGuess.length < 5) {  // 确保输入不超过五个数字
            currentGuess += digit;
            currentGuessElement[currentGuess.length - 1].textContent = digit;  // 更新对应的格子显示
        }
    }

    submitGuess.addEventListener('click', () => {
        if (currentGuess.length === 5) {
            evaluateGuess(currentGuess);
            currentGuess = '';  // 重置当前猜测
            currentGuessElement.forEach((box, index) => {
                if (index < 5) {
                    box.textContent = '';  // 清空前五个数字格子
                } else {
                    box.textContent = '?';  // 重置结果提示
                }
            });
        }
    });

    function evaluateGuess(guess) {
        const result = calculateBullsAndCows(guess, solution);
        const guessRow = document.createElement('div');
        guessRow.className = 'guess';
        // 显示猜测数字
        guess.split('').forEach(digit => {
            const box = document.createElement('div');
            box.className = 'box';
            box.textContent = digit;
            guessRow.appendChild(box);
        });
        // 添加间隔
        const gap = document.createElement('div');
        gap.className = 'gap';
        guessRow.appendChild(gap);
        // 显示A的数量
        const aBox = document.createElement('div');
        aBox.className = 'box correct';
        aBox.textContent = result.bulls;
        guessRow.appendChild(aBox);
        // 显示B的数量
        const bBox = document.createElement('div');
        bBox.className = 'box present';
        bBox.textContent = result.cows;
        guessRow.appendChild(bBox);

        guesses.appendChild(guessRow);
    }

    function calculateBullsAndCows(guess, solution) {
        let bulls = 0;
        let cows = 0;
        const counts = {};
        for (let i = 0; i < solution.length; i++) {
            counts[solution[i]] = (counts[solution[i]] || 0) + 1;
        }
        for (let i = 0; i < guess.length; i++) {
            if (guess[i] === solution[i]) {
                bulls++;
                counts[solution[i]]--;
            }
        }
        for (let i = 0; i < guess.length; i++) {
            if (guess[i] !== solution[i] && counts[guess[i]] > 0) {
                cows++;
                counts[guess[i]]--;
            }
        }
        return { bulls, cows };
    }

    function generateSolution() {
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += Math.floor(Math.random() * 10); // 生成一个0到9之间的随机数
        }
        return result;
    }
});
