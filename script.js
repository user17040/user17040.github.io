function balanceEquation() {
    const input = document.getElementById('equationInput').value.trim();
    if (!input) {
        alert('请输入化学方程式');
        return;
    }

    const balancedCoefficients = balanceChemicalEquation(input);
    document.getElementById('output').textContent = balancedCoefficients;

}
// 求最大公约数
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}
function lcm(a, b) {
    return a * b / gcd(a, b);
}
class Fraction {
    constructor(numerator, denominator = 1) {
        this.numerator = numerator;
        this.denominator = denominator;
        this.reduce(); // 初始化时约简分数
    }

    // 约简分数
    reduce() {
        const g = gcd(this.numerator, this.denominator);
        this.numerator /= g;
        this.denominator /= g;
        // 如果分母为负数，则移动负号到分子上
        if (this.denominator < 0) {
            this.numerator *= -1;
            this.denominator *= -1;
        }
        return this;
    }


    // 加法
    add(other) {
        const numerator = this.numerator * other.denominator + other.numerator * this.denominator;
        const denominator = this.denominator * other.denominator;
        return new Fraction(numerator, denominator);
    }

    // 减法
    subtract(other) {
        const numerator = this.numerator * other.denominator - other.numerator * this.denominator;
        const denominator = this.denominator * other.denominator;
        return new Fraction(numerator, denominator);
    }

    // 乘法
    multiply(other) {
        const numerator = this.numerator * other.numerator;
        const denominator = this.denominator * other.denominator;
        return new Fraction(numerator, denominator);
    }

    // 除法
    divide(other) {
        const numerator = this.numerator * other.denominator;
        const denominator = this.denominator * other.numerator;
        return new Fraction(numerator, denominator);
    }
    // 转为字符串
    toString() {
        if (this.denominator === 1) {
            return this.numerator.toString();
        } else {
            return `${this.numerator}/${this.denominator}`;
        }
    }
}

// 解线性方程组并保留分数形式
function solveLinearEquations(coefficientsMatrix) {
    const n = coefficientsMatrix.length; // 方程数量
    const m = coefficientsMatrix[0].length - 1; // 变量数量

    // 高斯消元法求解
    for (let i = 0; i < n; i++) {
        // 寻找当前列的主元
        let pivotRow = i;
        while (pivotRow < n && coefficientsMatrix[pivotRow][i].numerator === 0) {
            pivotRow++;
        }

        if (pivotRow === n) {
            continue; // 当前列全为零，继续下一列
        }

        // 将找到的主元所在行交换到当前行
        if (pivotRow !== i) {
            [coefficientsMatrix[i], coefficientsMatrix[pivotRow]] = [coefficientsMatrix[pivotRow], coefficientsMatrix[i]];
        }

        // 将当前列的主元缩放为1
        let pivot = coefficientsMatrix[i][i];
        for (let j = i; j <= m; j++) {
            coefficientsMatrix[i][j] = coefficientsMatrix[i][j].divide(pivot);
        }

        // 消元，将当前列其他行元素消为0
        for (let k = 0; k < n; k++) {
            if (k !== i && coefficientsMatrix[k][i].numerator !== 0) {
                let factor = coefficientsMatrix[k][i];
                for (let j = i; j <= m; j++) {
                    let subtracted = coefficientsMatrix[i][j].multiply(factor);
                    coefficientsMatrix[k][j] = coefficientsMatrix[k][j].subtract(subtracted);
                }
            }
        }
    }

    // 提取解
    const solutions = [];
    for (let i = 0; i < n; i++) {
        solutions.push(coefficientsMatrix[i][m]);
    }

    return solutions;
}


function parseChemicalFormula(formula) {
    let elementCounts = {}; // 存储每个元素的数量的对象

    let i = 0;
    const n = formula.length;

    while (i < n) {
        if (/[A-Z]/.test(formula[i])) {
            let element = formula[i]; // 大写字母开头，表示元素名称
            i++;

            // 检查后续小写字母，以构成完整的元素名称
            while (i < n && /[a-z]/.test(formula[i])) {
                element += formula[i];
                i++;
            }

            // 查找元素后面的数字（可能是多位数）
            let numStr = '';
            while (i < n && /[0-9]/.test(formula[i])) {
                numStr += formula[i];
                i++;
            }

            let count = parseInt(numStr || '1', 10); // 默认为1

            if (elementCounts[element]) {
                // 元素已经存在，累加数量
                elementCounts[element] += count;
            } else {
                // 元素第一次出现，初始化数量
                elementCounts[element] = count;
            }
        } else if (formula[i] === '(') {
            // 处理括号内的化学式
            let stack = [];
            i++;

            while (i < n && formula[i] !== ')') {
                if (/[A-Z]/.test(formula[i])) {
                    let subElement = formula[i];
                    i++;

                    // 获取完整的元素名称
                    while (i < n && /[a-z]/.test(formula[i])) {
                        subElement += formula[i];
                        i++;
                    }

                    // 获取元素后面的数字（可能是多位数）
                    let subNumStr = '';
                    while (i < n && /[0-9]/.test(formula[i])) {
                        subNumStr += formula[i];
                        i++;
                    }

                    let subCount = parseInt(subNumStr || '1', 10); // 默认为1
                    stack.push({ element: subElement, count: subCount });
                } else if (formula[i] === '(') {
                    // 处理嵌套括号
                    // 此处可以递归处理括号内的化学式，这里简化为暂存
                    i++;
                }
            }

            // 处理括号外的数字（括号外的系数）
            let multiplier = '';
            i++;
            while (i < n && /[0-9]/.test(formula[i])) {
                multiplier += formula[i];
                i++;
            }

            let factor = parseInt(multiplier || '1', 10); // 默认为1

            // 对栈中的元素数量乘以系数并添加到总数量中
            while (stack.length > 0) {
                let { element, count } = stack.pop();
                if (elementCounts[element]) {
                    elementCounts[element] += count * factor;
                } else {
                    elementCounts[element] = count * factor;
                }
            }
        } else {
            i++;
        }
    }

    return elementCounts;
}

function extractChemicalElements(str) {
    // 定义正则表达式来匹配化学元素符号
    const elementRegex = /[A-Z][a-z]?/g;

    let elements = [];
    let match;

    // 使用正则表达式在字符串中查找匹配项
    while ((match = elementRegex.exec(str)) !== null) {
        elements.push(match[0]);
    }

    // 使用 Set 来去重化学元素
    return [...new Set(elements)];
}

function addDictionaryValues(dict1, dict2, m) {
    for (let key in dict1) {
        if (dict2[key]) {
            dict1[key].push(dict2[key] * m);
        } else {
            dict1[key].push(0);
        }
    }
    return dict1;
}

function balanceChemicalEquation(equation) {
    //获取方程式左右两边
    const left = equation.split('=')[0];
    const right = equation.split('=')[1];
    //拆分每一项
    const left_term = left.split('+');
    const right_term = right.split('+');

    const ALL = extractChemicalElements(equation);
    let count = {};
    for (let i = 0; i < ALL.length; i++) {
        count[ALL[i]] = [];
    }
    for (let i = 1; i < left_term.length; i++) {
        let t = parseChemicalFormula(left_term[i]);
        count = addDictionaryValues(count, t, 1);
    }
    for (let i = 0; i < right_term.length; i++) {
        let t = parseChemicalFormula(right_term[i]);
        count = addDictionaryValues(count, t, -1);
    }
    let t = parseChemicalFormula(left_term[0]);
    count = addDictionaryValues(count, t, -1);
    let coeffs = [];
    for (let key in count) {
        let l = [];
        for (let i = 0; i < count[key].length; i++) {
            l.push(new Fraction(count[key][i]));
        }
        coeffs.push(l);
    }
    let eq_coeffs = solveLinearEquations(coeffs);
    let g = 1;
    for (let i = 0; i < eq_coeffs.length; i++) {
        g = lcm(g, eq_coeffs[i].denominator);
    }
    eq_coeffs.unshift(new Fraction(g));
    for (let i = 1; i < eq_coeffs.length; i++) {
        eq_coeffs[i] = eq_coeffs[i].multiply(new Fraction(g));
    }
    return formatBalancedEquation(left_term, right_term, eq_coeffs);
}

function formatBalancedEquation(left, right, coefficients) {
    let res = ''
    for (var i = 0; i < left.length; i++) {
        res += coefficients[i].toString() + left[i];
        if (i < left.length - 1) {
            res += '+';
        }
    }
    res += '=';
    for (var i = 0; i < right.length; i++) {
        res += coefficients[left.length + i].toString() + right[i];
        if (i < right.length - 1) {
            res += '+';
        }
    }
    return res;
}
