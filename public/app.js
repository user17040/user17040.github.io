const targetNumberElement = document.getElementById('targetNumber');
const useNumberElement = document.getElementById('useNumber');
const leaderboardElement = document.getElementById('leaderboard');
const expressionInput = document.getElementById('expression');
const submitButton = document.getElementById('submit');

// 获取目标数字
fetch('/api/target')
    .then(res => res.json())
    .then(data => {
        targetNumberElement.textContent = data.targetNumber;
        useNumberElement.textContent = data.useNumber;
    });

// 提交成绩
submitButton.addEventListener('click', () => {
    const expression = expressionInput.value.trim();
    const targetNumber = parseInt(targetNumberElement.textContent);
    const useNumber = parseInt(useNumberElement.textContent);
    try {
        const result = evaluateExpression(expression, useNumber);
        if (Math.abs(result.result - targetNumber)>10**-12) {
            alert('表达式未达成目标数字！');
            return;
        }

        const username = prompt('请输入你的用户名：');
        if (!username) {
            alert('用户名不能为空！');
            return;
        }

        fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                xCount: result.xCount,
                smallScore: result.smallScore,
            }),
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                updateLeaderboard(data.leaderboard);
            });
    } catch (err) {
        alert(err.message);
    }
});

// 更新排行榜
function updateLeaderboard(leaderboard) {
    leaderboardElement.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `#${index + 1} ${entry.username} - x数: ${entry.xCount}, 小分: ${entry.smallScore}`;
        leaderboardElement.appendChild(li);
    });
}

// 本地表达式求值函数
function evaluateExpression(expression, targetNumber) {
    try {
        for (let i = 0; i < expression.length; i++) {
            let char = expression[i];
            if (/\d/.test(char) && char !== targetNumber.toString()) {
                throw new Error("用了不该用的数字");
            }
        }

        expression = expression.replace(/[^0-9+\-*/()^!√]/g, '');
        const xCount = (expression.match(/[0-9]/g) || []).length;
        const addSubCount = (expression.match(/[+-]/g) || []).length;
        const mulDivCount = (expression.match(/[*\/]/g) || []).length;
        const complexOpCount = (expression.match(/\^|√/g) || []).length;

        expression = expression.replace('√', 'Math.sqrt');
        expression = expression.replace(/\^/g, '**');
        expression = expression.replace(/(\d+)!/g, (match, n) => {
            let r = 1;
            for (let i = 2; i <= n; i++) r *= i;
            return r;
        });

        const result = new Function(`return (${expression})`)();
        const smallScore = addSubCount + mulDivCount * 2 + complexOpCount * 3;

        return { result, xCount, smallScore };
    } catch (err) {
        throw new Error('表达式无效: ' + err.message);
    }
}
