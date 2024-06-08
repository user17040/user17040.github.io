document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('polynomial-form');
    const resultDisplay = document.getElementById('result-display');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const pol = new Polynomial(document.getElementById('pol').value);
        const hfd = Number(document.getElementById('hfd').value);
        try {
            const remainder = calculatePolynomial(pol, hfd, []);
            resultDisplay.innerHTML = '';
            katex.render(remainder, resultDisplay);
        } catch (error) {
            resultDisplay.innerHTML = `<span style="color: red;">${error.message}</span>`;
        }
    });
});

function getFactors(num, b) {
    num = Math.abs(num);
    let factors = [];
    for (let i = 1; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            factors.push(i);
            if (b) {
                factors.push(-i);
            }
            if (i !== num / i) {
                factors.push(num / i);
                if (b) {
                    factors.push(-num / i);
                }
            }
        }
    }
    if (b) {
        factors.push(0);
    }
    return factors.sort((a, b) => Math.abs(a) - Math.abs(b));
}

function combine(arr) {
    let results = [];

    function helper(temp, i) {
        if (i === arr.length) {
            results.push(temp.slice());
            return;
        }
        for (let j = 0; j < arr[i].length; j++) {
            temp.push(arr[i][j]);
            helper(temp, i + 1);
            temp.pop();
        }
    }

    helper([], 0);
    return results;
}

function calculatePolynomial_k(pol, k) {
    if (k == 1) {
        if (pol.eval(1) == 0) {
            return [new Polynomial([-1, 1]), pol.div(new Polynomial([-1, 1])), true];
        }
    }
    let c = [];
    for (var i = 0; i <= k; i++) {
        if (i == k) {
            c.push(getFactors(pol.eval(i), false));
        } else {
            c.push(getFactors(pol.eval(i), true));
        }
    }
    let com = combine(c);
    for (let p of com) {
        if (pol.mod(p) == 0) {
            return [p, pol.div(p), true];
        }
    }
    return ['', '', false];
}

function calculatePolynomial(pol, hfd, get) {
    for (var k = 1; k <= pol.degree() / 2 && k <= hfd; k++) {
        const res = calculatePolynomial_k(pol, k);
        if (res[2]) {
            get.push(res[0]);
            return calculatePolynomial(res[1], hfd, get);
        }
    }
    get.push(pol);
    let s = ''
    for (let p of get.sort((a, b) => new Polynomial(a).degree() - new Polynomial(b).degree())) {
        if (new Polynomial(p).toString() == '1') {
            continue;
        }
        if (new Polynomial(p).toString().length == 1) {
            s += new Polynomial(p).toString();
        } else {
            s += '(' + new Polynomial(p).toString() + ')';
        }
    }
    return s;
}

