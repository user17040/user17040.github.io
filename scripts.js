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

        guess.split('').forEach((char, index) => {
            const box = document.createElement('div');
            box.className = 'box';
            box.textContent = char;

            // 添加四角号码
            const corners = get_4corners(char);
            const solutionCorners = get_4corners(solution[index]);

            for (let i = 0; i < corners.length; i++) {
                let className = '';
                if (corners[i] === solutionCorners[i]) {
                    className = 'green';
                } else if (solutionCorners.includes(corners[i])) {
                    className = 'yellow';
                }

                const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'right-middle'];
                box.innerHTML += `<div class="corner ${positions[i]} ${className}">${corners[i]}</div>`;
            }

            if (char === solution[index]) {
                box.classList.add('correct');
            } else if (solution.includes(char)) {
                box.classList.add('present');
            }

            guessRow.appendChild(box);
        });

        guesses.appendChild(guessRow);

        // 滚动到最新的猜测记录
        guesses.scrollTop = guesses.scrollHeight;
    }

    function generateSolution() {
        const idioms = data1.split(' ').concat(Object.keys(data2));
        return idioms[Math.floor(Math.random() * idioms.length)];
    }

    function get_4corners(char){
        if(!isNaN(char)) return '     ';
        let index=data3.indexOf(char);
        if(index===-1) return '     ';
        let res = '';
        for(let i=index-6;i<index-1;i++){
            res+=data3[i];
        }
        return res;
    }
});
