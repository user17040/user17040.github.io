/*
 * @Copyright https://github.com/takayama-lily/agari
 */
(() => {
    'use strict'
    const sum = (arr) => {
        let s = 0
        for (let i = 0; i < arr.length; i++)
            s += arr[i]
        return s
    }
    const check7 = (hai_arr) => {
        let arr = [...hai_arr[0], ...hai_arr[1], ...hai_arr[2], ...hai_arr[3]]
        let s = 0
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] % 2 != 0) return false
            s += arr[i] / 2
        }
        return s == 7
    }
    const find7pattern = (hai_arr) => {
        let arr = [...hai_arr[0], ...hai_arr[1], ...hai_arr[2], ...hai_arr[3]]
        var res = []
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] && arr[i] == 2) res.push(i % 9 + 1 + MPSZ[Math.floor(i / 9)])
            if (arr[i] && arr[i] == 4) { res.push(i % 9 + 1 + MPSZ[Math.floor(i / 9)]); res.push(i % 9 + 1 + MPSZ[Math.floor(i / 9)]) }
        }
        return res
    }
    const check13 = (hai_arr) => {
        let arr = [hai_arr[0][0], hai_arr[0][8], hai_arr[1][0], hai_arr[1][8], hai_arr[2][0], hai_arr[2][8], ...hai_arr[3]]
        return !arr.includes(0) && sum(arr) == 14
    }
    const check14 = (hai_arr) => {
        let star = 0
        for (let i = 0; i < 7; i++) {
            if (hai_arr[3][i] >= 2) return 0
            if (hai_arr[3][i] === 1) star++
        }
        let res = [false, false, false]
        for (let c = 0; c < 3; c++) {
            let t = -1
            let a = true
            for (let i = 0; i < 9; i++) {
                if (hai_arr[c][i] > 1) return 0
                if (hai_arr[c][i] === 1) {
                    if (res[i % 3]) return 0
                    if (a) t = i % 3
                    a = false
                    if (i % 3 !== t) return 0
                }
            }
            res[t] = true
        }
        if (star === 7) return 2
        if (star === 5) return 3
        return 1
    }
    const checkzuhe = (hai_arr) => {
        if (hai_arr[0][0] && hai_arr[0][3] && hai_arr[0][6]
            && hai_arr[1][1] && hai_arr[1][4] && hai_arr[1][7]
            && hai_arr[2][2] && hai_arr[2][5] && hai_arr[2][8]
            && check([[hai_arr[0][0] - 1, hai_arr[0][1], hai_arr[0][2], hai_arr[0][3] - 1, hai_arr[0][4], hai_arr[0][5], hai_arr[0][6] - 1, hai_arr[0][7], hai_arr[0][8]],
            [hai_arr[1][0], hai_arr[1][1] - 1, hai_arr[1][2], hai_arr[1][3], hai_arr[1][4] - 1, hai_arr[1][5], hai_arr[1][6], hai_arr[1][7] - 1, hai_arr[1][8]],
            [hai_arr[2][0], hai_arr[2][1], hai_arr[2][2] - 1, hai_arr[2][3], hai_arr[2][4], hai_arr[2][5] - 1, hai_arr[2][6], hai_arr[2][7], hai_arr[2][8] - 1],
            [hai_arr[3][0], hai_arr[3][1], hai_arr[3][2], hai_arr[3][3], hai_arr[3][4], hai_arr[3][5], hai_arr[3][6]]])) return true
        if (hai_arr[0][0] && hai_arr[0][3] && hai_arr[0][6]
            && hai_arr[1][2] && hai_arr[1][5] && hai_arr[1][8]
            && hai_arr[2][1] && hai_arr[2][4] && hai_arr[2][7]
            && check([[hai_arr[0][0] - 1, hai_arr[0][1], hai_arr[0][2], hai_arr[0][3] - 1, hai_arr[0][4], hai_arr[0][5], hai_arr[0][6] - 1, hai_arr[0][7], hai_arr[0][8]],
            [hai_arr[1][0], hai_arr[1][1], hai_arr[1][2] - 1, hai_arr[1][3], hai_arr[1][4], hai_arr[1][5] - 1, hai_arr[1][6], hai_arr[1][7], hai_arr[1][8] - 1],
            [hai_arr[2][0], hai_arr[2][1] - 1, hai_arr[2][2], hai_arr[2][3], hai_arr[2][4] - 1, hai_arr[2][5], hai_arr[2][6], hai_arr[2][7] - 1, hai_arr[2][8]],
            [hai_arr[3][0], hai_arr[3][1], hai_arr[3][2], hai_arr[3][3], hai_arr[3][4], hai_arr[3][5], hai_arr[3][6]]])) return true
        if (hai_arr[0][1] && hai_arr[0][4] && hai_arr[0][7]
            && hai_arr[1][2] && hai_arr[1][5] && hai_arr[1][8]
            && hai_arr[2][0] && hai_arr[2][3] && hai_arr[2][6]
            && check([[hai_arr[0][0], hai_arr[0][1] - 1, hai_arr[0][2], hai_arr[0][3], hai_arr[0][4] - 1, hai_arr[0][5], hai_arr[0][6], hai_arr[0][7] - 1, hai_arr[0][8]],
            [hai_arr[1][0], hai_arr[1][1], hai_arr[1][2] - 1, hai_arr[1][3], hai_arr[1][4], hai_arr[1][5] - 1, hai_arr[1][6], hai_arr[1][7], hai_arr[1][8] - 1],
            [hai_arr[2][0] - 1, hai_arr[2][1], hai_arr[2][2], hai_arr[2][3] - 1, hai_arr[2][4], hai_arr[2][5], hai_arr[2][6] - 1, hai_arr[2][7], hai_arr[2][8]],
            [hai_arr[3][0], hai_arr[3][1], hai_arr[3][2], hai_arr[3][3], hai_arr[3][4], hai_arr[3][5], hai_arr[3][6]]])) return true
        if (hai_arr[0][1] && hai_arr[0][4] && hai_arr[0][7]
            && hai_arr[1][0] && hai_arr[1][3] && hai_arr[1][6]
            && hai_arr[2][2] && hai_arr[2][5] && hai_arr[2][8]
            && check([[hai_arr[0][0], hai_arr[0][1] - 1, hai_arr[0][2], hai_arr[0][3], hai_arr[0][4] - 1, hai_arr[0][5], hai_arr[0][6], hai_arr[0][7] - 1, hai_arr[0][8]],
            [hai_arr[1][0] - 1, hai_arr[1][1], hai_arr[1][2], hai_arr[1][3] - 1, hai_arr[1][4], hai_arr[1][5], hai_arr[1][6] - 1, hai_arr[1][7], hai_arr[1][8]],
            [hai_arr[2][0], hai_arr[2][1], hai_arr[2][2] - 1, hai_arr[2][3], hai_arr[2][4], hai_arr[2][5] - 1, hai_arr[2][6], hai_arr[2][7], hai_arr[2][8] - 1],
            [hai_arr[3][0], hai_arr[3][1], hai_arr[3][2], hai_arr[3][3], hai_arr[3][4], hai_arr[3][5], hai_arr[3][6]]])) return true
        if (hai_arr[0][2] && hai_arr[0][5] && hai_arr[0][8]
            && hai_arr[1][0] && hai_arr[1][3] && hai_arr[1][6]
            && hai_arr[2][1] && hai_arr[2][4] && hai_arr[2][7]
            && check([[hai_arr[0][0], hai_arr[0][1], hai_arr[0][2] - 1, hai_arr[0][3], hai_arr[0][4], hai_arr[0][5] - 1, hai_arr[0][6], hai_arr[0][7], hai_arr[0][8] - 1],
            [hai_arr[1][0] - 1, hai_arr[1][1], hai_arr[1][2], hai_arr[1][3] - 1, hai_arr[1][4], hai_arr[1][5], hai_arr[1][6] - 1, hai_arr[1][7], hai_arr[1][8]],
            [hai_arr[2][0], hai_arr[2][1] - 1, hai_arr[2][2], hai_arr[2][3], hai_arr[2][4] - 1, hai_arr[2][5], hai_arr[2][6], hai_arr[2][7] - 1, hai_arr[2][8]],
            [hai_arr[3][0], hai_arr[3][1], hai_arr[3][2], hai_arr[3][3], hai_arr[3][4], hai_arr[3][5], hai_arr[3][6]]])) return true
        if (hai_arr[0][2] && hai_arr[0][5] && hai_arr[0][8]
            && hai_arr[1][1] && hai_arr[1][4] && hai_arr[1][7]
            && hai_arr[2][0] && hai_arr[2][3] && hai_arr[2][6]
            && check([[hai_arr[0][0], hai_arr[0][1], hai_arr[0][2] - 1, hai_arr[0][3], hai_arr[0][4], hai_arr[0][5] - 1, hai_arr[0][6], hai_arr[0][7], hai_arr[0][8] - 1],
            [hai_arr[1][0], hai_arr[1][1] - 1, hai_arr[1][2], hai_arr[1][3], hai_arr[1][4] - 1, hai_arr[1][5], hai_arr[1][6], hai_arr[1][7] - 1, hai_arr[1][8]],
            [hai_arr[2][0] - 1, hai_arr[2][1], hai_arr[2][2], hai_arr[2][3] - 1, hai_arr[2][4], hai_arr[2][5], hai_arr[2][6] - 1, hai_arr[2][7], hai_arr[2][8]],
            [hai_arr[3][0], hai_arr[3][1], hai_arr[3][2], hai_arr[3][3], hai_arr[3][4], hai_arr[3][5], hai_arr[3][6]]])) return true

        return false

    }
    const findzuhepattern = (hai_arr) => {
        if (hai_arr[0][0] && hai_arr[0][3] && hai_arr[0][6]
            && hai_arr[1][1] && hai_arr[1][4] && hai_arr[1][7]
            && hai_arr[2][2] && hai_arr[2][5] && hai_arr[2][8])
            return findAgariPatterns([[hai_arr[0][0] - 1, hai_arr[0][1], hai_arr[0][2], hai_arr[0][3] - 1, hai_arr[0][4], hai_arr[0][5], hai_arr[0][6] - 1, hai_arr[0][7], hai_arr[0][8]],
            [hai_arr[1][0], hai_arr[1][1] - 1, hai_arr[1][2], hai_arr[1][3], hai_arr[1][4] - 1, hai_arr[1][5], hai_arr[1][6], hai_arr[1][7] - 1, hai_arr[1][8]],
            [hai_arr[2][0], hai_arr[2][1], hai_arr[2][2] - 1, hai_arr[2][3], hai_arr[2][4], hai_arr[2][5] - 1, hai_arr[2][6], hai_arr[2][7], hai_arr[2][8] - 1],
            [hai_arr[3][0], hai_arr[3][1], hai_arr[3][2], hai_arr[3][3], hai_arr[3][4], hai_arr[3][5], hai_arr[3][6]]])
        if (hai_arr[0][0] && hai_arr[0][3] && hai_arr[0][6]
            && hai_arr[1][2] && hai_arr[1][5] && hai_arr[1][8]
            && hai_arr[2][1] && hai_arr[2][4] && hai_arr[2][7])
            return findAgariPatterns([[hai_arr[0][0] - 1, hai_arr[0][1], hai_arr[0][2], hai_arr[0][3] - 1, hai_arr[0][4], hai_arr[0][5], hai_arr[0][6] - 1, hai_arr[0][7], hai_arr[0][8]],
            [hai_arr[1][0], hai_arr[1][1], hai_arr[1][2] - 1, hai_arr[1][3], hai_arr[1][4], hai_arr[1][5] - 1, hai_arr[1][6], hai_arr[1][7], hai_arr[1][8] - 1],
            [hai_arr[2][0], hai_arr[2][1] - 1, hai_arr[2][2], hai_arr[2][3], hai_arr[2][4] - 1, hai_arr[2][5], hai_arr[2][6], hai_arr[2][7] - 1, hai_arr[2][8]],
            [hai_arr[3][0], hai_arr[3][1], hai_arr[3][2], hai_arr[3][3], hai_arr[3][4], hai_arr[3][5], hai_arr[3][6]]])
        if (hai_arr[0][1] && hai_arr[0][4] && hai_arr[0][7]
            && hai_arr[1][2] && hai_arr[1][5] && hai_arr[1][8]
            && hai_arr[2][0] && hai_arr[2][3] && hai_arr[2][6])
            return findAgariPatterns([[hai_arr[0][0], hai_arr[0][1] - 1, hai_arr[0][2], hai_arr[0][3], hai_arr[0][4] - 1, hai_arr[0][5], hai_arr[0][6], hai_arr[0][7] - 1, hai_arr[0][8]],
            [hai_arr[1][0], hai_arr[1][1], hai_arr[1][2] - 1, hai_arr[1][3], hai_arr[1][4], hai_arr[1][5] - 1, hai_arr[1][6], hai_arr[1][7], hai_arr[1][8] - 1],
            [hai_arr[2][0] - 1, hai_arr[2][1], hai_arr[2][2], hai_arr[2][3] - 1, hai_arr[2][4], hai_arr[2][5], hai_arr[2][6] - 1, hai_arr[2][7], hai_arr[2][8]],
            [hai_arr[3][0], hai_arr[3][1], hai_arr[3][2], hai_arr[3][3], hai_arr[3][4], hai_arr[3][5], hai_arr[3][6]]])
        if (hai_arr[0][1] && hai_arr[0][4] && hai_arr[0][7]
            && hai_arr[1][0] && hai_arr[1][3] && hai_arr[1][6]
            && hai_arr[2][2] && hai_arr[2][5] && hai_arr[2][8])
            return findAgariPatterns([[hai_arr[0][0], hai_arr[0][1] - 1, hai_arr[0][2], hai_arr[0][3], hai_arr[0][4] - 1, hai_arr[0][5], hai_arr[0][6], hai_arr[0][7] - 1, hai_arr[0][8]],
            [hai_arr[1][0] - 1, hai_arr[1][1], hai_arr[1][2], hai_arr[1][3] - 1, hai_arr[1][4], hai_arr[1][5], hai_arr[1][6] - 1, hai_arr[1][7], hai_arr[1][8]],
            [hai_arr[2][0], hai_arr[2][1], hai_arr[2][2] - 1, hai_arr[2][3], hai_arr[2][4], hai_arr[2][5] - 1, hai_arr[2][6], hai_arr[2][7], hai_arr[2][8] - 1],
            [hai_arr[3][0], hai_arr[3][1], hai_arr[3][2], hai_arr[3][3], hai_arr[3][4], hai_arr[3][5], hai_arr[3][6]]])
        if (hai_arr[0][2] && hai_arr[0][5] && hai_arr[0][8]
            && hai_arr[1][0] && hai_arr[1][3] && hai_arr[1][6]
            && hai_arr[2][1] && hai_arr[2][4] && hai_arr[2][7])
            return findAgariPatterns([[hai_arr[0][0], hai_arr[0][1], hai_arr[0][2] - 1, hai_arr[0][3], hai_arr[0][4], hai_arr[0][5] - 1, hai_arr[0][6], hai_arr[0][7], hai_arr[0][8] - 1],
            [hai_arr[1][0] - 1, hai_arr[1][1], hai_arr[1][2], hai_arr[1][3] - 1, hai_arr[1][4], hai_arr[1][5], hai_arr[1][6] - 1, hai_arr[1][7], hai_arr[1][8]],
            [hai_arr[2][0], hai_arr[2][1] - 1, hai_arr[2][2], hai_arr[2][3], hai_arr[2][4] - 1, hai_arr[2][5], hai_arr[2][6], hai_arr[2][7] - 1, hai_arr[2][8]],
            [hai_arr[3][0], hai_arr[3][1], hai_arr[3][2], hai_arr[3][3], hai_arr[3][4], hai_arr[3][5], hai_arr[3][6]]])
        if (hai_arr[0][2] && hai_arr[0][5] && hai_arr[0][8]
            && hai_arr[1][1] && hai_arr[1][4] && hai_arr[1][7]
            && hai_arr[2][0] && hai_arr[2][3] && hai_arr[2][6])
            return findAgariPatterns([[hai_arr[0][0], hai_arr[0][1], hai_arr[0][2] - 1, hai_arr[0][3], hai_arr[0][4], hai_arr[0][5] - 1, hai_arr[0][6], hai_arr[0][7], hai_arr[0][8] - 1],
            [hai_arr[1][0], hai_arr[1][1] - 1, hai_arr[1][2], hai_arr[1][3], hai_arr[1][4] - 1, hai_arr[1][5], hai_arr[1][6], hai_arr[1][7] - 1, hai_arr[1][8]],
            [hai_arr[2][0] - 1, hai_arr[2][1], hai_arr[2][2], hai_arr[2][3] - 1, hai_arr[2][4], hai_arr[2][5], hai_arr[2][6] - 1, hai_arr[2][7], hai_arr[2][8]],
            [hai_arr[3][0], hai_arr[3][1], hai_arr[3][2], hai_arr[3][3], hai_arr[3][4], hai_arr[3][5], hai_arr[3][6]]])

    }
    const _check = (arr, is_jihai = false) => {
        arr = [...arr]
        let s = sum(arr)
        if (s === 0)
            return true
        if (s % 3 == 2) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] >= 2)
                    arr[i] -= 2
                else
                    continue
                if (!_check(arr, is_jihai))
                    arr[i] += 2
                else
                    return true
            }
            return false
        }
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === 0) {
                continue
            } else if (arr[i] === 3) {
                delete arr[i]
                continue
            } else {
                if (is_jihai || i >= 7)
                    return false
                if (arr[i] === 4)
                    arr[i] -= 3
                arr[i + 1] -= arr[i]
                arr[i + 2] -= arr[i]
                if (arr[i + 1] < 0 || arr[i + 2] < 0)
                    return false
                arr[i] = 0
            }
        }
        return true
    }
    const check = (hai_arr) => {
        let j = 0
        for (let i = 0; i < hai_arr.length; i++) {
            if (sum(hai_arr[i]) % 3 === 1)
                return false
            j += sum(hai_arr[i]) % 3 === 2
        }
        return j === 1 && _check(hai_arr[3], true) && _check(hai_arr[0]) && _check(hai_arr[1]) && _check(hai_arr[2])
    }
    const checkAll = (hai_arr) => {
        return check7(hai_arr) || check13(hai_arr) || check14(hai_arr) || check(hai_arr) || checkzuhe(hai_arr)
    }

    const MPSZ = ['m', 'p', 's', 'z']
    const sumAll = (hai_arr) => {
        let s = 0
        for (let arr of hai_arr)
            s += sum(arr)
        return s
    }
    const findKotsu = (hai_arr) => {
        let res = []
        for (let i = 0; i < hai_arr.length; i++) {
            for (let ii = 0; ii < hai_arr[i].length; ii++) {
                if (hai_arr[i][ii] >= 3) {
                    hai_arr[i][ii] -= 3
                    if (check(hai_arr)) {
                        res.push([ii + 1 + MPSZ[i]])
                    } else {
                        hai_arr[i][ii] += 3
                    }
                }
            }
        }
        return res
    }
    const findJyuntsu = (hai_arr) => {
        let res = []
        for (let i = 0; i < hai_arr.length; i++) {
            if (i === 3)
                break
            for (let ii = 0; ii < hai_arr[i].length; ii++) {
                while (hai_arr[i][ii] >= 1 && hai_arr[i][ii + 1] >= 1 && hai_arr[i][ii + 2] >= 1) {
                    hai_arr[i][ii]--
                    hai_arr[i][ii + 1]--
                    hai_arr[i][ii + 2]--
                    if (check(hai_arr)) {
                        res.push([ii + 1 + MPSZ[i], ii + 2 + MPSZ[i], ii + 3 + MPSZ[i]])
                    } else {
                        hai_arr[i][ii]++
                        hai_arr[i][ii + 1]++
                        hai_arr[i][ii + 2]++
                        break
                    }
                }
            }
        }
        return res
    }
    const findJyanto = (hai_arr) => {
        for (let i = 0; i < hai_arr.length; i++) {
            for (let ii = 0; ii < hai_arr[i].length; ii++) {
                if (hai_arr[i][ii] >= 2) {
                    return ii + 1 + MPSZ[i]
                }
            }
        }
    }
    let res = []
    const calc = (hai_arr, j) => {
        let tmp_hai_arr = [[...hai_arr[0]], [...hai_arr[1]], [...hai_arr[2]], [...hai_arr[3]]]
        let first_res = findKotsu(tmp_hai_arr).concat(j)
        if (sumAll(tmp_hai_arr) === 2) {
            res.push(first_res.sort())
        } else if (first_res.length > 0) {
            first_res = first_res.concat(findJyuntsu(tmp_hai_arr))
            res.push(first_res.sort())
        }
        tmp_hai_arr = [[...hai_arr[0]], [...hai_arr[1]], [...hai_arr[2]], [...hai_arr[3]]]
        let second_res = findJyuntsu(tmp_hai_arr).concat(j)
        if (sumAll(tmp_hai_arr) === 2) {
            res.push(second_res.sort())
        } else {
            second_res = second_res.concat(findKotsu(tmp_hai_arr))
            res.push(second_res.sort())
        }
    }
    const findAgariPatterns = (hai_arr) => {
        hai_arr = [[...hai_arr[0]], [...hai_arr[1]], [...hai_arr[2]], [...hai_arr[3]]]
        res = []
        if (!check(hai_arr)) {
            return res
        }
        if (sumAll(hai_arr) === 2) {
            res.push([findJyanto(hai_arr)])
            return res
        }
        let j
        for (let i = 0; i < hai_arr[3].length; i++) {
            if (hai_arr[3][i] === 0) {
                hai_arr[3][i] += 2
                j = i
                break
            }
        }
        for (let i = 0; i < hai_arr.length; i++) {
            for (let ii = 0; ii < hai_arr[i].length; ii++) {
                if (i === 3 && ii === j)
                    continue
                if (hai_arr[i][ii] >= 2) {
                    hai_arr[i][ii] -= 2
                    if (check(hai_arr))
                        calc(hai_arr, ii + 1 + MPSZ[i])
                    hai_arr[i][ii] += 2
                }
            }
        }
        let final_res = []
        for (let v of res) {
            let is_duplicate = false
            for (let vv of final_res) {
                if (JSON.stringify(v) === JSON.stringify(vv))
                    is_duplicate = true
            }
            if (!is_duplicate)
                final_res.push(v)
        }
        return final_res
    }
    const findAllAgariPatterns = (hai_arr) => {
        hai_arr = [[...hai_arr[0]], [...hai_arr[1]], [...hai_arr[2]], [...hai_arr[3]]]
        res = []
        if (check7(hai_arr)) {
            res.push(find7pattern(hai_arr))
        }
        if (checkzuhe(hai_arr)) {
            res.push(findzuhepattern(hai_arr))
        }
        if (!check(hai_arr)) {
            return res
        }
        if (sumAll(hai_arr) === 2) {
            res.push([findJyanto(hai_arr)])
            return res
        }
        let j
        for (let i = 0; i < hai_arr[3].length; i++) {
            if (hai_arr[3][i] === 0) {
                hai_arr[3][i] += 2
                j = i
                break
            }
        }
        for (let i = 0; i < hai_arr.length; i++) {
            for (let ii = 0; ii < hai_arr[i].length; ii++) {
                if (i === 3 && ii === j)
                    continue
                if (hai_arr[i][ii] >= 2) {
                    hai_arr[i][ii] -= 2
                    if (check(hai_arr))
                        calc(hai_arr, ii + 1 + MPSZ[i])
                    hai_arr[i][ii] += 2
                }
            }
        }
        let final_res = []
        for (let v of res) {
            let is_duplicate = false
            for (let vv of final_res) {
                if (JSON.stringify(v) === JSON.stringify(vv))
                    is_duplicate = true
            }
            if (!is_duplicate)
                final_res.push(v)
        }
        return final_res
    }

    const exports = findAllAgariPatterns //全和了pattern(一般形限定)
    exports.check = check //一般形
    exports.check7 = check7 //七対子形
    exports.check13 = check13 //国士形
    exports.check14 = check14 //国士形
    exports.checkzuhe = checkzuhe //国士形
    exports.checkAll = checkAll //全形

    if (typeof module === 'object' && module && module.exports) {
        module.exports = exports
    }
    else if (typeof define === 'function' && define.amd) {
        define(() => {
            return exports
        })
    }
    else if (typeof self === 'object' && self) {
        self.agari = exports
    }

})()
copy = function (hai_arr) {
    let arr = []
    for (let i = 0; i < 4; i++) {
        let t = []
        for (let ii = 0; ii < 9; ii++) {
            t.push(hai_arr[i][ii])
            if (i == 3 && ii == 6) { arr.push(t); return arr }
        }
        arr.push(t)
    }
}