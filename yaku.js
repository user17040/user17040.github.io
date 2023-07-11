/*
 * Copyright (C) https://github.com/takayama-lily/riichi
 */
const checkAllowed = (o, allowed) => {
    for (let v of o.hai)
        if (!allowed.includes(v))
            return false
    for (let v of o.furo)
        for (let vv of v)
            if (!allowed.includes(vv))
                return false
    return true
}
const checkChanta = (o, allow) => {
    let hasJyuntsu = false
    for (let v of o.currentPattern) {
        if (typeof v === 'string') {
            if (!allow.includes(v))
                return false
        } else if (v.length <= 2 || v[0] === v[1]) {
            if (!allow.includes(v[0]))
                return false
        } else {
            hasJyuntsu = true
            if (!allow.includes(v[0]) && !allow.includes(v[1]) && !allow.includes(v[2]))
                return false
        }
    }
    return hasJyuntsu
}
const checkYakuhai = (o, pos) => {
    for (let v of o.currentPattern) {
        if (typeof v !== 'string' && v[0] === pos + 'z')
            return true
    }
    return false
}

const YAKU =
{
    "连七对": {
        "han": 88, "isFuroMinus": true, "check": (o) => {
            if (o.currentPattern.length !== 7) return false
            return o.currentPattern[0] === (Number(o.currentPattern[1][0]) - 1) + o.currentPattern[1][1] &&
                o.currentPattern[0] === (Number(o.currentPattern[2][0]) - 2) + o.currentPattern[2][1] &&
                o.currentPattern[0] === (Number(o.currentPattern[3][0]) - 3) + o.currentPattern[3][1] &&
                o.currentPattern[0] === (Number(o.currentPattern[4][0]) - 4) + o.currentPattern[4][1] &&
                o.currentPattern[0] === (Number(o.currentPattern[5][0]) - 5) + o.currentPattern[5][1] &&
                o.currentPattern[0] === (Number(o.currentPattern[6][0]) - 6) + o.currentPattern[6][1]
        }
    },
    "绿一色": {
        "han": 88, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let allow = ['2s', '3s', '4s', '6s', '8s', '6z']
            return checkAllowed(o, allow)
        }
    },
    "十三幺": {
        "han": 88, "check": (o) => {
            return agari.check13(o.haiArray)
        }
    },
    "九莲宝灯": {
        "han": 88, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let i = MPSZ.indexOf(o.agari[1])
            let arr = o.haiArray[i].concat()
            if (arr[0] < 3 || arr[8] < 3 || arr.includes(0))
                return false
            let res = 0
            for (let v of o.currentPattern)
                if (typeof v !== 'string' && v.length === 2)
                    res++
            return o.furo.length === res && [2, 4].includes(arr[parseInt(o.agari) - 1])
        }
    },
    "四杠": {
        "han": 88, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res1 = 0
            let res2 = 0
            for (let v of o.currentPattern)
                if (typeof v !== 'string' && v.length === 4)
                    res1++
                else if (typeof v !== 'string' && v.length === 2)
                    res2++
            return res1 + res2 === 4
        }
    },
    "大四喜": {
        "han": 88, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let need = ['1z', '2z', '3z', '4z']
            let res = 0
            for (let v of o.currentPattern) {
                if (typeof v === 'object' && need.includes(v[0]))
                    res++
            }
            return res === 4
        }
    },
    "大三元": {
        "han": 88, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let need = ['5z', '6z', '7z']
            let res = 0
            for (let v of o.currentPattern) {
                if (typeof v === 'object' && need.includes(v[0]))
                    res++
            }
            return res === 3
        }
    },
    "四暗刻": {
        "han": 64, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res = 0
            for (let v of o.currentPattern) {
                if (typeof v !== 'string' && v.length <= 2)
                    res++
            }
            return res === 4
        }
    },
    "字一色": {
        "han": 64, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let allow = ['1z', '2z', '3z', '4z', '5z', '6z', '7z']
            return checkAllowed(o, allow)
        }
    },
    "清幺九": {
        "han": 64, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let allow = ['1m', '9m', '1p', '9p', '1s', '9s']
            return checkAllowed(o, allow)
        }
    },
    "小四喜": {
        "han": 64, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let need = ['1z', '2z', '3z', '4z']
            let res = 0
            for (let v of o.currentPattern) {
                if (typeof v === 'string' && !need.includes(v))
                    return false
                if (typeof v === 'object' && need.includes(v[0]))
                    res++
            }
            return res === 3
        }
    },
    "小三元": {
        "han": 64, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let need = ['5z', '6z', '7z']
            let res = 0
            for (let v of o.currentPattern) {
                if (typeof v === 'string' && !need.includes(v))
                    return false
                if (typeof v === 'object' && need.includes(v[0]))
                    res++
            }
            return res === 2
        }
    },
    "一色双龙会": {
        "han": 64, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let arr = []
            let jiang
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    jiang = v
                else if (v.length !== 3 || v[0] === v[1]) {
                    return false
                }
                else {
                    arr.push(v[0])
                }
            }
            arr = arr.sort((a, b) => MPSZ.indexOf(a[1]) * 9 + Number(a[0]) - MPSZ.indexOf(b[1]) * 9 - Number(b[0]))
            return arr[0] === arr[1] && arr[0] === (Number(arr[2][0]) - 6).toString() + arr[2][1] &&
                arr[0] === (Number(arr[3][0]) - 6).toString() + arr[3][1] &&
                jiang == '5' + arr[0][1]
        }
    },
    "一色四节高": {
        "han": 48, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let arr = []
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if (v[0][1] === 'z' || (v.length === 3 && v[0] !== v[1]))
                    return false
                arr.push(v[0])
            }
            return arr[0] === (Number(arr[1][0]) - 1) + arr[1][1]
                && arr[0] === (Number(arr[2][0]) - 2) + arr[2][1]
                && arr[0] === (Number(arr[3][0]) - 3) + arr[3][1]
        }
    },
    "一色四同顺": {
        "han": 48, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let arr = []
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if (v.length !== 3 || v[0] === v[1])
                    return
                arr.push(v[0])
            }
            return arr[0] === arr[1] && arr[0] === arr[2] && arr[0] === arr[3]
        }
    },
    "混幺九": {
        "han": 32, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['清幺九'].check(o)) return false
            if (YAKU['字一色'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let allow = ['1m', '9m', '1p', '9p', '1s', '9s', '1z', '2z', '3z', '4z', '5z', '6z', '7z']
            return checkAllowed(o, allow)
        }
    },
    "三杠": {
        "han": 32, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res1 = 0
            let res2 = 0
            for (let v of o.currentPattern)
                if (typeof v !== 'string' && v.length === 4)
                    res1++
                else if (typeof v !== 'string' && v.length === 2)
                    res2++
            return res1 + res2 === 3
        }
    },
    "一色四步高": {
        "han": 32, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let arr = []
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if (v.length !== 3 || v[0] === v[1])
                    return false
                arr.push(v[0])
            }
            return ((arr[0][0] === (Number(arr[1][0]) - 1).toString() &&
                arr[0][0] === (Number(arr[2][0]) - 2).toString() &&
                arr[0][0] === (Number(arr[3][0]) - 3).toString()) || (arr[0][0] === (Number(arr[1][0]) - 2).toString() &&
                    arr[0][0] === (Number(arr[2][0]) - 4).toString() &&
                    arr[0][0] === (Number(arr[3][0]) - 6).toString())) &&
                arr[0][1] === arr[1][1] && arr[0][1] === arr[2][1] && arr[0][1] === arr[3][1]

        }
    },
    "清一色": {
        "name": "清一色", "han": 24, "isFuroMinus": true, "check": (o) => {
            if (YAKU['连七对'].check(o)) return false
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['一色双龙会'].check(o)) return false
            if (YAKU['字一色'].check(o)) return false
            if (YAKU['九莲宝灯'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let must = o.agari[1]
            let allow = []
            for (let i = 1; i <= 9; i++)
                allow.push(i + must)
            return checkAllowed(o, allow)
        }
    },
    "全大": {
        "han": 24, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let allow = ['7m', '8m', '9m', '7p', '8p', '9p', '7s', '8s', '9s']
            return checkAllowed(o, allow)
        }
    },
    "全中": {
        "han": 24, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let allow = ['4m', '5m', '6m', '4p', '5p', '6p', '4s', '5s', '6s']
            return checkAllowed(o, allow)
        }
    },
    "全小": {
        "han": 24, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let allow = ['1m', '2m', '3m', '1p', '2p', '3p', '1s', '2s', '3s']
            return checkAllowed(o, allow)
        }
    },
    "全双刻": {
        "han": 24, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res = 0
            let jiang
            for (let v of o.currentPattern)
                if (typeof v === 'string') jiang = v
                else if ((v.length === 1 || v[0] === v[1]) && v[0][1] !== 'z' && Number(v[0][0]) % 2 === 0)
                    res++
            return res === 4 && jiang[1] !== 'z' && Number(jiang[0]) % 2 === 0
        }
    },
    "一色三节高": {
        "han": 24, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['一色四节高'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let arr = []
            for (let v of o.currentPattern) {
                if (typeof v === 'string') continue
                if (v[0][1] === 'z' || (v.length === 3 && v[0] !== v[1]))
                    arr.push('--')
                else {
                    arr.push(v[0])
                }
            }
            let res012 = [Number(arr[0][0]), Number(arr[1][0]), Number(arr[2][0])].sort()
            let res013 = [Number(arr[0][0]), Number(arr[1][0]), Number(arr[3][0])].sort()
            let res023 = [Number(arr[0][0]), Number(arr[2][0]), Number(arr[3][0])].sort()
            let res123 = [Number(arr[1][0]), Number(arr[2][0]), Number(arr[3][0])].sort()
            return (res012[0] === res012[1] - 1 && res012[0] === res012[2] - 2 && (arr[0][1] == arr[1][1] && arr[0][1] == arr[2][1]))
                || (res013[0] === res013[1] - 1 && res013[0] === res013[2] - 2 && (arr[0][1] == arr[1][1] && arr[0][1] == arr[3][1]))
                || (res023[0] === res023[1] - 1 && res023[0] === res023[2] - 2 && (arr[0][1] == arr[2][1] && arr[0][1] == arr[3][1]))
                || (res123[0] === res123[1] - 1 && res123[0] === res123[2] - 2 && (arr[1][1] == arr[2][1] && arr[1][1] == arr[3][1]))

        }
    },
    "一色三同顺": {
        "han": 24, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['一色四同顺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let arr = []
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if (v.length !== 3 || v[0] === v[1])
                    arr.push('--')
                else {
                    arr.push(v[0])
                }
            }
            return (arr[0] != '--' && arr[0] === arr[1] && arr[0] === arr[2])
                || (arr[0] != '--' && arr[0] === arr[1] && arr[0] === arr[3])
                || (arr[0] != '--' && arr[0] === arr[2] && arr[0] === arr[3])
                || (arr[1] != '--' && arr[1] === arr[2] && arr[1] === arr[3])
        }
    },
    "七对": {
        "han": 24, "check": (o) => {
            if (YAKU['连七对'].check(o)) return false
            return o.currentPattern.length == 7
        }
    },
    "七星不靠": {
        "han": 24, "check": (o) => {
            return false
        }
    },
    "三暗刻": {
        "han": 16, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res = 0
            for (let v of o.currentPattern)
                if (typeof v !== 'string' && v.length <= 2)
                    res++
            return res === 3
        }
    },
    "三同刻": {
        "han": 16, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res = [0, 0, 0, 0, 0, 0, 0, 0, 0]
            for (let v of o.currentPattern) {
                if ((v.length === 1 || v[0] === v[1]) && !v[0].includes('z'))
                    res[parseInt(v[0]) - 1]++
                else
                    continue
            }
            return res.includes(3)
        }
    },
    "清龙": {
        "han": 16, "isFuroMinus": true, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res = [0, 0, 0, 0, 0, 0, 0, 0, 0]
            for (let v of o.currentPattern) {
                if (v.length <= 2 || v[0] === v[1])
                    continue
                if ([1, 4, 7].includes(parseInt(v[0]))) {
                    let i = MPSZ.indexOf(v[0][1]) * 3 + (parseInt(v[0]) - 1) / 3
                    res[i]++
                }
            }
            return (res[0] && res[1] && res[2]) || (res[3] && res[4] && res[5]) || (res[6] && res[7] && res[8])
        }
    },
    "一色三步高": {
        "han": 16, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['一色四步高'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let arr = []
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if (v.length !== 3 || v[0] === v[1])
                    arr.push('--')
                else {
                    arr.push(v[0])
                }
            }
            let res012 = [Number(arr[0][0]), Number(arr[1][0]), Number(arr[2][0])].sort()
            let res013 = [Number(arr[0][0]), Number(arr[1][0]), Number(arr[3][0])].sort()
            let res023 = [Number(arr[0][0]), Number(arr[2][0]), Number(arr[3][0])].sort()
            let res123 = [Number(arr[1][0]), Number(arr[2][0]), Number(arr[3][0])].sort()
            return (res012[0] === res012[1] - 1 && res012[0] === res012[2] - 2 && (arr[0][1] == arr[1][1] && arr[0][1] == arr[2][1]))
                || (res013[0] === res013[1] - 1 && res013[0] === res013[2] - 2 && (arr[0][1] == arr[1][1] && arr[0][1] == arr[3][1]))
                || (res023[0] === res023[1] - 1 && res023[0] === res023[2] - 2 && (arr[0][1] == arr[2][1] && arr[0][1] == arr[3][1]))
                || (res123[0] === res123[1] - 1 && res123[0] === res123[2] - 2 && (arr[1][1] == arr[2][1] && arr[1][1] == arr[3][1]))
                || (res012[0] === res012[1] - 2 && res012[0] === res012[2] - 4 && (arr[0][1] == arr[1][1] && arr[0][1] == arr[2][1]))
                || (res013[0] === res013[1] - 2 && res013[0] === res013[2] - 4 && (arr[0][1] == arr[1][1] && arr[0][1] == arr[3][1]))
                || (res023[0] === res023[1] - 2 && res023[0] === res023[2] - 4 && (arr[0][1] == arr[2][1] && arr[0][1] == arr[3][1]))
                || (res123[0] === res123[1] - 2 && res123[0] === res123[2] - 4 && (arr[1][1] == arr[2][1] && arr[1][1] == arr[3][1]))

        }
    },
    "三色双龙会": {
        "han": 16, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let arr = []
            let jiang
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    jiang = v
                else if (v.length !== 3 || v[0] === v[1]) {
                    return false
                }
                else {
                    arr.push(v[0])
                }
            }
            arr = arr.sort((a, b) => MPSZ.indexOf(a[1]) * 9 + Number(a[0]) - MPSZ.indexOf(b[1]) * 9 - Number(b[0]))
            return arr[0][0] === (Number(arr[1][0]) - 6).toString() && arr[0][1] === arr[1][1] &&
                arr[2][0] === (Number(arr[3][0]) - 6).toString() && arr[2][1] === arr[3][1] &&
                jiang[0] == '5' && arr[0][1] !== arr[2][1] && arr[0][1] !== jiang[1] && arr[2][1] !== jiang[1]
        }
    },
    "全带五": {
        "han": 16, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let allow = ['5m', '5p', '5s']
            return checkChanta(o, allow)
        }
    },
    "三风刻": {
        "han": 12, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['小四喜'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let need = ['1z', '2z', '3z', '4z']
            let res = 0
            for (let v of o.currentPattern) {
                if (typeof v === 'object' && need.includes(v[0]))
                    res++
            }
            return res === 3
        }
    },
    "大于五": {
        "han": 12, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            if (YAKU['全大'].check(o)) return false
            let allow = ['6m', '7m', '8m', '9m', '6p', '7p', '8p', '9p', '6s', '7s', '8s', '9s']
            return checkAllowed(o, allow)
        }
    },
    "小于五": {
        "han": 12, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            if (YAKU['全小'].check(o)) return false
            let allow = ['1m', '2m', '3m', '4m', '1p', '2p', '3p', '4p', '1s', '2s', '3s', '4s']
            return checkAllowed(o, allow)
        }
    },
    "组合龙": {
        "han": 12, "check": (o) => {
            return false
        }
    },
    "全不靠": {
        "han": 12, "check": (o) => {
            return false
        }
    },
    "推不倒": {
        "han": 8, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            for (let v of o.currentPattern)
                if (!o.allowKuitan && v.length !== 2)
                    return false
            let allow = ['1p', '2p', '3p', '4p', '5p', '8p', '9p', '2s', '4s', '5s', '6s', '8s', '9s', '7z']
            return checkAllowed(o, allow)
        }
    },
    "三色三节高": {
        "han": 8, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['清一色'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let arr = []
            for (let v of o.currentPattern) {
                if (typeof v === 'string') continue
                if (v[0][1] === 'z' || (v.length === 3 && v[0] !== v[1]))
                    arr.push('--')
                else {
                    arr.push(v[0])
                }
            }
            let res012 = [Number(arr[0][0]), Number(arr[1][0]), Number(arr[2][0])].sort()
            let res013 = [Number(arr[0][0]), Number(arr[1][0]), Number(arr[3][0])].sort()
            let res023 = [Number(arr[0][0]), Number(arr[2][0]), Number(arr[3][0])].sort()
            let res123 = [Number(arr[1][0]), Number(arr[2][0]), Number(arr[3][0])].sort()
            return (res012[0] === res012[1] - 1 && res012[0] === res012[2] - 2 && (arr[0][1] !== arr[1][1] && arr[0][1] !== arr[2][1] && arr[1][1] !== arr[2][1]))
                || (res013[0] === res013[1] - 1 && res013[0] === res013[2] - 2 && (arr[0][1] !== arr[1][1] && arr[0][1] !== arr[3][1] && arr[1][1] !== arr[3][1]))
                || (res023[0] === res023[1] - 1 && res023[0] === res023[2] - 2 && (arr[0][1] !== arr[2][1] && arr[0][1] !== arr[3][1] && arr[2][1] !== arr[3][1]))
                || (res123[0] === res123[1] - 1 && res123[0] === res123[2] - 2 && (arr[1][1] !== arr[2][1] && arr[1][1] !== arr[3][1] && arr[2][1] !== arr[3][1]))

        }
    },
    "三色三同顺": {
        "han": 8, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['清一色'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res = []
            for (let v of o.currentPattern) {
                if (v.length <= 2 || v[0] === v[1] || v[0].includes('z')) continue;

                let value = parseInt(v[0]);
                res[value] = res[value] ? res[value] : new Set();
                res[value].add(v[0][1]);
            }
            return res.some((value) => value.size === 3);
        }
    },
    "花龙": {
        "han": 8, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let arr = []
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if (v.length !== 3 || v[0] === v[1])
                    arr.push('--')
                else {
                    arr.push(v[0])
                }
            }
            let res012 = [Number(arr[0][0]), Number(arr[1][0]), Number(arr[2][0])].sort()
            let res013 = [Number(arr[0][0]), Number(arr[1][0]), Number(arr[3][0])].sort()
            let res023 = [Number(arr[0][0]), Number(arr[2][0]), Number(arr[3][0])].sort()
            let res123 = [Number(arr[1][0]), Number(arr[2][0]), Number(arr[3][0])].sort()
            return (res012[0] === res012[1] - 3 && res012[0] === res012[2] - 6 && (arr[0][1] !== arr[1][1] && arr[0][1] !== arr[2][1] && arr[1][1] !== arr[2][1]))
                || (res013[0] === res013[1] - 3 && res013[0] === res013[2] - 6 && (arr[0][1] !== arr[1][1] && arr[0][1] !== arr[3][1] && arr[1][1] !== arr[3][1]))
                || (res023[0] === res023[1] - 3 && res023[0] === res023[2] - 6 && (arr[0][1] !== arr[2][1] && arr[0][1] !== arr[3][1] && arr[2][1] !== arr[3][1]))
                || (res123[0] === res123[1] - 3 && res123[0] === res123[2] - 6 && (arr[1][1] !== arr[2][1] && arr[1][1] !== arr[3][1] && arr[2][1] !== arr[3][1]))

        }
    },
    "杠上开花": {
        "han": 8, "check": (o) => {
            let hasKantsu = false
            for (let v of o.furo) {
                if (v.length === 2 || v.length === 4) {
                    hasKantsu = true
                    break
                }
            }
            return hasKantsu && o.extra.includes('k') && o.isTsumo
        }
    },
    "抢杠和": {
        "han": 8, "check": (o) => {
            return o.extra.includes('q') && !o.isTsumo
        }
    },
    "妙手回春": {
        "han": 8, "check": (o) => {
            return o.extra.includes('c') && o.isTsumo
        }
    },
    "海底捞月": {
        "han": 8, "check": (o) => {
            return o.extra.includes('h') && !o.isTsumo
        }
    },
    "无番和": {
        "han": 8, "check": (o) => {
            if (YAKU['连七对'].check(o)) return false
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['绿一色'].check(o)) return false
            if (YAKU['九莲宝灯'].check(o)) return false
            if (YAKU['四杠'].check(o)) return false
            if (YAKU['大四喜'].check(o)) return false
            if (YAKU['大三元'].check(o)) return false
            if (YAKU['字一色'].check(o)) return false
            if (YAKU['小三元'].check(o)) return false
            if (YAKU['小四喜'].check(o)) return false
            if (YAKU['清幺九'].check(o)) return false
            if (YAKU['四暗刻'].check(o)) return false
            if (YAKU['一色四节高'].check(o)) return false
            if (YAKU['一色四同顺'].check(o)) return false
            if (YAKU['三杠'].check(o)) return false
            if (YAKU['混幺九'].check(o)) return false
            if (YAKU['一色四步高'].check(o)) return false
            if (YAKU['清一色'].check(o)) return false
            if (YAKU['全大'].check(o)) return false
            if (YAKU['全中'].check(o)) return false
            if (YAKU['全小'].check(o)) return false
            if (YAKU['全双刻'].check(o)) return false
            if (YAKU['一色三节高'].check(o)) return false
            if (YAKU['一色三同顺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['三暗刻'].check(o)) return false
            if (YAKU['三同刻'].check(o)) return false
            if (YAKU['清龙'].check(o)) return false
            if (YAKU['一色三步高'].check(o)) return false
            if (YAKU['三色双龙会'].check(o)) return false
            if (YAKU['全带五'].check(o)) return false
            if (YAKU['组合龙'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            if (YAKU['三风刻'].check(o)) return false
            if (YAKU['大于五'].check(o)) return false
            if (YAKU['小于五'].check(o)) return false
            if (YAKU['推不倒'].check(o)) return false
            if (YAKU['三色三节高'].check(o)) return false
            if (YAKU['三色三同顺'].check(o)) return false
            if (YAKU['花龙'].check(o)) return false
            if (YAKU['杠上开花'].check(o)) return false
            if (YAKU['抢杠和'].check(o)) return false
            if (YAKU['妙手回春'].check(o)) return false
            if (YAKU['海底捞月'].check(o)) return false
            if (YAKU['混一色'].check(o)) return false
            if (YAKU['五门齐'].check(o)) return false
            if (YAKU['碰碰和'].check(o)) return false
            if (YAKU['双箭刻'].check(o)) return false
            if (YAKU['双暗杠'].check(o)) return false
            if (YAKU['三色三步高'].check(o)) return false
            if (YAKU['全求人'].check(o)) return false
            if (YAKU['明暗杠'].check(o)) return false
            if (YAKU['双明杠'].check(o)) return false
            if (YAKU['不求人'].check(o)) return false
            if (YAKU['全带幺'].check(o)) return false
            if (YAKU['和绝张'].check(o)) return false
            if (YAKU['门前清'].check(o)) return false
            if (YAKU['暗杠'].check(o)) return false
            if (YAKU['双暗刻'].check(o)) return false
            if (YAKU['双同刻'].check(o)) return false
            if (YAKU['断幺'].check(o)) return false
            if (YAKU['平和'].check(o)) return false
            if (YAKU['箭刻'].check(o)) return false
            if (YAKU['明杠'].check(o)) return false
            if (YAKU['四归一'].check(o)) return false
            if (YAKU['四归一x2'].check(o)) return false
            if (YAKU['四归一x3'].check(o)) return false
            if (YAKU['无字'].check(o)) return false
            if (YAKU['缺一门'].check(o)) return false
            if (YAKU['幺九刻'].check(o)) return false
            if (YAKU['幺九刻x2'].check(o)) return false
            if (YAKU['幺九刻x3'].check(o)) return false
            if (YAKU['幺九刻x4'].check(o)) return false
            if (YAKU['一般高'].check(o)) return false
            if (YAKU['一般高x2'].check(o)) return false
            if (YAKU['喜相逢'].check(o)) return false
            if (YAKU['喜相逢x2'].check(o)) return false
            if (YAKU['连六'].check(o)) return false
            if (YAKU['连六x2'].check(o)) return false
            if (YAKU['老少副'].check(o)) return false
            if (YAKU['老少副x2'].check(o)) return false
            if (YAKU['边张'].check(o)) return false
            if (YAKU['嵌张'].check(o)) return false
            if (YAKU['单钓将'].check(o)) return false
            if (YAKU['自摸'].check(o)) return false
            return true
        }
    },
    "混一色": {
        "han": 6, "check": (o) => {
            if (YAKU['连七对'].check(o)) return false
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['一色双龙会'].check(o)) return false
            if (YAKU['绿一色'].check(o)) return false
            if (YAKU['九莲宝灯'].check(o)) return false
            if (YAKU['清一色'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let allow = ['1z', '2z', '3z', '4z', '5z', '6z', '7z']
            let d = ''
            for (let v of o.hai) {
                if (['m', 'p', 's'].includes(v[1])) {
                    d = v[1]
                    break
                }
            }
            if (!d) {
                for (let v of o.furo) {
                    for (let vv of v) {
                        if (['m', 'p', 's'].includes(vv[1])) {
                            d = vv[1]
                            break
                        }
                    }
                }
            }
            if (!d)
                return false
            for (let i = 1; i <= 9; i++)
                allow.push(i + d)
            return checkAllowed(o, allow)
        }
    },
    "五门齐": {
        "han": 6, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res = [false, false, false, false, false]
            for (let v of o.currentPattern)
                if (v.length === 2) {
                    if (v[1] == 'm') res[0] = true
                    else if (v[1] == 'p') res[1] = true
                    else if (v[1] == 's') res[2] = true
                    else if (v == '1z' || v == '2z' || v == '3z' || v == '4z') res[3] = true
                    else if (v == '5z' || v == '6z' || v == '7z') res[4] = true
                }
                else {
                    if (v[0][1] == 'm') res[0] = true
                    else if (v[0][1] == 'p') res[1] = true
                    else if (v[0][1] == 's') res[2] = true
                    else if (v[0] == '1z' || v[0] == '2z' || v[0] == '3z' || v[0] == '4z') res[3] = true
                    else if (v[0] == '5z' || v[0] == '6z' || v[0] == '7z') res[4] = true
                }
            return res[0] && res[1] && res[2] && res[3] && res[4]
        }
    },
    "碰碰和": {
        "han": 6, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['字一色'].check(o)) return false
            if (YAKU['四暗刻'].check(o)) return false
            if (YAKU['清幺九'].check(o)) return false
            if (YAKU['一色四节高'].check(o)) return false
            if (YAKU['混幺九'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res = 0
            for (let v of o.currentPattern)
                if (v.length === 1 || v[0] === v[1])
                    res++
            return res === 4
        }
    },
    "双箭刻": {
        "han": 6, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['小三元'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let need = ['5z', '6z', '7z']
            let res = 0
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if (v.length === 1 && need.includes(v[0]))
                    res++
            }
            return res === 2
        }
    },
    "双暗杠": {
        "han": 6, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res1 = 0
            let res2 = 0
            for (let v of o.currentPattern)
                if (typeof v !== 'string' && v.length === 4)
                    res1++
                else if (typeof v !== 'string' && v.length === 2)
                    res2++
            return res1 === 0 && res2 === 2
        }
    },
    "全求人": {
        "han": 6, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            if (o.isTsumo) return false
            let res = 0
            for (let v of o.currentPattern)
                if (typeof v !== 'string' && v.length === 2)
                    res++
            return o.furo.length === 4 && res === 0
        }
    },
    "明暗杠": {
        "han": 6, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res1 = 0
            let res2 = 0
            for (let v of o.currentPattern)
                if (typeof v !== 'string' && v.length === 4)
                    res1++
                else if (typeof v !== 'string' && v.length === 2)
                    res2++
            return res1 === 1 && res2 === 1
        }
    },
    "双明杠": {
        "han": 4, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res1 = 0
            let res2 = 0
            for (let v of o.currentPattern)
                if (typeof v !== 'string' && v.length === 4)
                    res1++
                else if (typeof v !== 'string' && v.length === 2)
                    res2++
            return res1 === 2 && res2 === 0
        }
    },
    "三色三步高": {
        "han": 6, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let arr = []
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if (v.length !== 3 || v[0] === v[1])
                    arr.push('--')
                else {
                    arr.push(v[0])
                }
            }
            let res012 = [Number(arr[0][0]), Number(arr[1][0]), Number(arr[2][0])].sort()
            let res013 = [Number(arr[0][0]), Number(arr[1][0]), Number(arr[3][0])].sort()
            let res023 = [Number(arr[0][0]), Number(arr[2][0]), Number(arr[3][0])].sort()
            let res123 = [Number(arr[1][0]), Number(arr[2][0]), Number(arr[3][0])].sort()
            return (res012[0] === res012[1] - 1 && res012[0] === res012[2] - 2 && (arr[0][1] !== arr[1][1] && arr[0][1] !== arr[2][1] && arr[1][1] !== arr[2][1]))
                || (res013[0] === res013[1] - 1 && res013[0] === res013[2] - 2 && (arr[0][1] !== arr[1][1] && arr[0][1] !== arr[3][1] && arr[1][1] !== arr[3][1]))
                || (res023[0] === res023[1] - 1 && res023[0] === res023[2] - 2 && (arr[0][1] !== arr[2][1] && arr[0][1] !== arr[3][1] && arr[2][1] !== arr[3][1]))
                || (res123[0] === res123[1] - 1 && res123[0] === res123[2] - 2 && (arr[1][1] !== arr[2][1] && arr[1][1] !== arr[3][1] && arr[2][1] !== arr[3][1]))

        }
    },
    "不求人": {
        "han": 4, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['九莲宝灯'].check(o)) return false
            if (YAKU['四暗刻'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res = 0
            for (let v of o.currentPattern)
                if (typeof v !== 'string' && v.length === 2)
                    res++
            return o.furo.length === res && o.isTsumo
        }
    },
    "全带幺": {
        "han": 4, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['清幺九'].check(o)) return false
            if (YAKU['混幺九'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let allow = ['1m', '9m', '1p', '9p', '1s', '9s', '1z', '2z', '3z', '4z', '5z', '6z', '7z']
            return checkChanta(o, allow)
        }
    },
    "和绝张": {
        "han": 4, "check": (o) => {
            let t = 0
            for (let i = 0; i < o.hai.length; i++) {
                if (o.hai[i] === o.agari) t++
                if (t === 2) break
            }
            return o.extra.includes('j') && t === 1
        }
    },
    "门前清": {
        "han": 2, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['九莲宝灯'].check(o)) return false
            if (YAKU['四暗刻'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['不求人'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res = 0
            for (let v of o.currentPattern)
                if (typeof v !== 'string' && v.length === 2)
                    res++
            return o.furo.length === res
        }
    },
    "暗杠": {
        "han": 2, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res1 = 0
            let res2 = 0
            for (let v of o.currentPattern)
                if (typeof v !== 'string' && v.length === 4)
                    res1++
                else if (typeof v !== 'string' && v.length === 2)
                    res2++
            return res1 === 0 && res2 === 1
        }
    },
    "双暗刻": {
        "han": 2, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res = 0
            for (let v of o.currentPattern) {
                if (typeof v !== 'string' && v.length <= 2)
                    res++
            }
            return res === 2
        }
    },
    "双同刻": {
        "han": 2, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['清幺九'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res = [0, 0, 0, 0, 0, 0, 0, 0, 0]
            for (let v of o.currentPattern) {
                if ((v.length === 1 || v[0] === v[1]) && !v[0].includes('z'))
                    res[parseInt(v[0]) - 1]++
                else
                    continue
            }
            let count = 0
            for (let i = 0; i < 8; i++) {
                if (res[i] == 2) count++
            }
            return count === 1
        }
    },
    "双同刻x2": {
        "han": 4, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res = [0, 0, 0, 0, 0, 0, 0, 0, 0]
            for (let v of o.currentPattern) {
                if ((v.length === 1 || v[0] === v[1]) && !v[0].includes('z'))
                    res[parseInt(v[0]) - 1]++
                else
                    continue
            }
            let count = 0
            for (let i = 0; i < 8; i++) {
                if (res[i] == 2) count++
            }
            return count === 2
        }
    },
    "断幺": {
        "han": 2, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            if (YAKU['全双刻'].check(o)) return false
            if (YAKU['全带五'].check(o)) return false
            if (YAKU['全中'].check(o)) return false
            for (let v of o.currentPattern)
                if (!o.allowKuitan && v.length !== 2)
                    return false
            let allow = ['2m', '3m', '4m', '5m', '6m', '7m', '8m', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '2s', '3s', '4s', '5s', '6s', '7s', '8s']
            return checkAllowed(o, allow)
        }
    },
    "平和": {
        "han": 2, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['一色双龙会'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            if (YAKU['三色双龙会'].check(o)) return false
            let res = 0
            for (let v of o.currentPattern) {
                if (typeof (v) === 'string' && v.includes('z'))
                    return false
                if (v.length === 3 && v[0] !== v[1])
                    res++
            }
            return res === 4
        }
    },
    "圈风刻": {
        "han": 2, "check": (o) => {
            if (YAKU['大四喜'].check(o)) return false
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            return checkYakuhai(o, o.bakaze)
        }
    },
    "门风刻": {
        "han": 2, "check": (o) => {
            if (YAKU['大四喜'].check(o)) return false
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            return checkYakuhai(o, o.jikaze)
        }
    },
    "箭刻": {
        "han": 2, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let need = ['5z', '6z', '7z']
            let res = 0
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if (v.length === 1 && need.includes(v[0]))
                    res++
            }
            return res === 1
        }
    },
    "四归一": {
        "han": 2, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['一色四同顺'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res = [...o.haiArray[0], ...o.haiArray[1], ...o.haiArray[2], ...o.haiArray[3]]
            for (let v of o.furo) {
                if (v.length === 1) res[MPSZ.indexOf(v[0][1]) * 9 + Number(v[0][0])] += 3
                else if (v.length === 3) {
                    res[MPSZ.indexOf(v[0][1]) * 9 + Number(v[0][0]) - 1] += 1
                    res[MPSZ.indexOf(v[0][1]) * 9 + Number(v[0][0])] += 1
                    res[MPSZ.indexOf(v[0][1]) * 9 + Number(v[0][0]) + 1] += 1
                }
            }
            let count = 0
            for (let i = 0; i < 34; i++) {
                if (res[i] == 4) count++
            }
            return count === 1
        }
    },
    "四归一x2": {
        "han": 4, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['一色四同顺'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res = [...o.haiArray[0], ...o.haiArray[1], ...o.haiArray[2], ...o.haiArray[3]]
            for (let v of o.furo) {
                if (v.length === 1) res[MPSZ.indexOf(v[0][1]) * 9 + Number(v[0][0])] += 3
                else if (v.length === 3) {
                    res[MPSZ.indexOf(v[0][1]) * 9 + Number(v[0][0]) - 1] += 1
                    res[MPSZ.indexOf(v[0][1]) * 9 + Number(v[0][0])] += 1
                    res[MPSZ.indexOf(v[0][1]) * 9 + Number(v[0][0]) + 1] += 1
                }
            }
            let count = 0
            for (let i = 0; i < 34; i++) {
                if (res[i] == 4) count++
            }
            return count === 2
        }
    },
    "四归一x3": {
        "han": 6, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['一色四同顺'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res = [...o.haiArray[0], ...o.haiArray[1], ...o.haiArray[2], ...o.haiArray[3]]
            for (let v of o.furo) {
                if (v.length === 1) res[MPSZ.indexOf(v[0][1]) * 9 + Number(v[0][0])] += 3
                else if (v.length === 3) {
                    res[MPSZ.indexOf(v[0][1]) * 9 + Number(v[0][0]) - 1] += 1
                    res[MPSZ.indexOf(v[0][1]) * 9 + Number(v[0][0])] += 1
                    res[MPSZ.indexOf(v[0][1]) * 9 + Number(v[0][0]) + 1] += 1
                }
            }
            let count = 0
            for (let i = 0; i < 34; i++) {
                if (res[i] == 4) count++
            }
            return count === 3
        }
    },
    "无字": {
        "han": 1, "check": (o) => {
            if (YAKU['连七对'].check(o)) return false
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['九莲宝灯'].check(o)) return false
            if (YAKU['一色双龙会'].check(o)) return false
            if (YAKU['清幺九'].check(o)) return false
            if (YAKU['清一色'].check(o)) return false
            if (YAKU['全双刻'].check(o)) return false
            if (YAKU['断幺'].check(o)) return false
            if (YAKU['平和'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            if (YAKU['大于五'].check(o)) return false
            if (YAKU['小于五'].check(o)) return false
            if (YAKU['全带五'].check(o)) return false
            if (YAKU['全大'].check(o)) return false
            if (YAKU['全中'].check(o)) return false
            if (YAKU['全小'].check(o)) return false
            if (YAKU['三色双龙会'].check(o)) return false
            for (let v of o.currentPattern)
                if (!o.allowKuitan && v.length !== 2)
                    return false
            let allow = ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '1s', '2s', '3s', '4s', '5s', '6s', '7s', '8s', '9s']
            return checkAllowed(o, allow)
        }
    },
    "缺一门": {
        "han": 1, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['大三元'].check(o)) return false
            if (YAKU['小三元'].check(o)) return false
            if (YAKU['一色四节高'].check(o)) return false
            if (YAKU['一色四步高'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            if (YAKU['推不倒'].check(o)) return false
            let res = [false, false, false]
            for (let v of o.currentPattern)
                if (v.length === 2) {
                    if (v[1] == 'm') res[0] = true
                    else if (v[1] == 'p') res[1] = true
                    else if (v[1] == 's') res[2] = true
                }
                else {
                    if (v[0][1] == 'm') res[0] = true
                    else if (v[0][1] == 'p') res[1] = true
                    else if (v[0][1] == 's') res[2] = true
                }
            return (res[0] && res[1] && !res[2]) || (res[0] && !res[1] && res[2]) || (!res[0] && res[1] && res[2])
        }
    },
    "明杠": {
        "han": 1, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let res1 = 0
            let res2 = 0
            for (let v of o.currentPattern)
                if (typeof v !== 'string' && v.length === 4)
                    res1++
                else if (typeof v !== 'string' && v.length === 2)
                    res2++
            return res1 === 1 && res2 === 0
        }
    },
    "幺九刻": {
        "han": 1, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['大四喜'].check(o)) return false
            if (YAKU['字一色'].check(o)) return false
            if (YAKU['小四喜'].check(o)) return false
            if (YAKU['清幺九'].check(o)) return false
            if (YAKU['混幺九'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let need = ['1m', '9m', '1p', '9p', '1s', '9s', '1z', '2z', '3z', '4z']
            let res = 0
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if ((v.length === 1 || v[0] === v[1]) && need.includes(v[0]))
                    res++
            }
            res -= YAKU['三风刻'].check(o) * 3
            if (!YAKU['三风刻'].check(o)) {
                res -= YAKU['圈风刻'].check(o)
                res -= YAKU['门风刻'].check(o)
            }
            res -= YAKU['九莲宝灯'].check(o)
            return res === 1
        }
    },
    "幺九刻x2": {
        "han": 2, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['大四喜'].check(o)) return false
            if (YAKU['字一色'].check(o)) return false
            if (YAKU['小四喜'].check(o)) return false
            if (YAKU['清幺九'].check(o)) return false
            if (YAKU['混幺九'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let need = ['1m', '9m', '1p', '9p', '1s', '9s', '1z', '2z', '3z', '4z']
            let res = 0
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if ((v.length === 1 || v[0] === v[1]) && need.includes(v[0]))
                    res++
            }
            res -= YAKU['三风刻'].check(o) * 3
            if (!YAKU['三风刻'].check(o)) {
                res -= YAKU['圈风刻'].check(o)
                res -= YAKU['门风刻'].check(o)
            }
            res -= YAKU['九莲宝灯'].check(o)
            return res === 2
        }
    },
    "幺九刻x3": {
        "han": 3, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['大四喜'].check(o)) return false
            if (YAKU['字一色'].check(o)) return false
            if (YAKU['小四喜'].check(o)) return false
            if (YAKU['清幺九'].check(o)) return false
            if (YAKU['混幺九'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let need = ['1m', '9m', '1p', '9p', '1s', '9s', '1z', '2z', '3z', '4z']
            let res = 0
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if ((v.length === 1 || v[0] === v[1]) && need.includes(v[0]))
                    res++
            }
            res -= YAKU['三风刻'].check(o) * 3
            if (!YAKU['三风刻'].check(o)) {
                res -= YAKU['圈风刻'].check(o)
                res -= YAKU['门风刻'].check(o)
            }
            res -= YAKU['九莲宝灯'].check(o)
            return res === 3
        }
    },
    "幺九刻x4": {
        "han": 4, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['大四喜'].check(o)) return false
            if (YAKU['字一色'].check(o)) return false
            if (YAKU['小四喜'].check(o)) return false
            if (YAKU['清幺九'].check(o)) return false
            if (YAKU['混幺九'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let need = ['1m', '9m', '1p', '9p', '1s', '9s', '1z', '2z', '3z', '4z']
            let res = 0
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if ((v.length === 1 || v[0] === v[1]) && need.includes(v[0]))
                    res++
            }
            res -= YAKU['三风刻'].check(o) * 3
            if (!YAKU['三风刻'].check(o)) {
                res -= YAKU['圈风刻'].check(o)
                res -= YAKU['门风刻'].check(o)
            }
            res -= YAKU['九莲宝灯'].check(o)
            return res === 4
        }
    },
    "一般高": {
        "han": 1, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['一色双龙会'].check(o)) return false
            if (YAKU['一色四同顺'].check(o)) return false
            if (YAKU['一色三同顺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['一般高x2'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let arr = []
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if (v.length !== 3 || v[0] === v[1])
                    arr.push('--')
                else {
                    arr.push(v[0])
                }
            }
            return (arr[0] != '--' && arr[0] === arr[1])
                || (arr[0] != '--' && arr[0] === arr[2])
                || (arr[0] != '--' && arr[0] === arr[3])
                || (arr[1] != '--' && arr[1] === arr[2])
                || (arr[1] != '--' && arr[1] === arr[3])
                || (arr[2] != '--' && arr[2] === arr[3])
        }
    },
    "一般高x2": {
        "han": 2, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['一色双龙会'].check(o)) return false
            if (YAKU['一色四同顺'].check(o)) return false
            if (YAKU['一色三同顺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let arr = []
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if (v.length !== 3 || v[0] === v[1])
                    return false
                arr.push(v[0])
            }
            arr = arr.sort((a, b) => MPSZ.indexOf(a[1]) * 9 + Number(a[0]) - MPSZ.indexOf(b[1]) * 9 - Number(b[0]))
            return arr[0] + arr[2] === arr[1] + arr[3]
        }
    },
    "喜相逢": {
        "han": 1, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['喜相逢x2'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            if (YAKU['三色三同顺'].check(o)) return false
            if (YAKU['三色双龙会'].check(o)) return false
            let arr = []
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if (v.length !== 3 || v[0] === v[1])
                    arr.push('--')
                else {
                    arr.push(v[0])
                }
            }
            return (arr[0][0] === arr[1][0] && arr[0][1] !== arr[1][1])
                || (arr[0][0] === arr[2][0] && arr[0][1] !== arr[2][1])
                || (arr[0][0] === arr[3][0] && arr[0][1] !== arr[3][1])
                || (arr[1][0] === arr[2][0] && arr[1][1] !== arr[2][1])
                || (arr[1][0] === arr[3][0] && arr[1][1] !== arr[3][1])
                || (arr[2][0] === arr[3][0] && arr[2][1] !== arr[3][1])
        }
    },
    "喜相逢x2": {
        "han": 2, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            if (YAKU['三色三同顺'].check(o)) return false
            if (YAKU['三色双龙会'].check(o)) return false
            if (YAKU['一般高x2'].check(o)) return false
            let arr = []
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if (v.length !== 3 || v[0] === v[1])
                    return false
                arr.push(v[0])
            }
            arr = arr.sort((a, b) => MPSZ.indexOf(a[1]) * 9 + Number(a[0]) - MPSZ.indexOf(b[1]) * 9 - Number(b[0]))
            return (arr[0][0] + arr[1][0] === arr[2][0] + arr[3][0] && arr[0][1] !== arr[2][1] && arr[1][1] != arr[3][1])
                || (arr[0][0] + arr[2][0] === arr[1][0] + arr[3][0] && arr[0][1] !== arr[1][1] && arr[2][1] != arr[3][1])
        }
    },
    "连六": {
        "han": 1, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['一色四步高'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['连六x2'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            if (YAKU['花龙'].check(o)) return false
            if (YAKU['清龙'].check(o)) return false
            let arr = []
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if (v.length !== 3 || v[0] === v[1])
                    arr.push('--')
                else {
                    arr.push(v[0])
                }
            }
            return (arr[0][0] === (Number(arr[1][0]) - 3).toString() && arr[0][1] === arr[1][1])
                || (arr[0][0] === (Number(arr[2][0]) - 3).toString() && arr[0][1] === arr[2][1])
                || (arr[0][0] === (Number(arr[3][0]) - 3).toString() && arr[0][1] === arr[3][1])
                || (arr[1][0] === (Number(arr[2][0]) - 3).toString() && arr[1][1] === arr[2][1])
                || (arr[1][0] === (Number(arr[3][0]) - 3).toString() && arr[1][1] === arr[3][1])
                || (arr[2][0] === (Number(arr[3][0]) - 3).toString() && arr[2][1] === arr[3][1])

        }
    },
    "连六x2": {
        "han": 2, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['一色四步高'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['喜相逢x2'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            if (YAKU['花龙'].check(o)) return false
            if (YAKU['清龙'].check(o)) return false
            let arr = []
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if (v.length !== 3 || v[0] === v[1])
                    return false
                arr.push(v[0])
            }
            arr = arr.sort((a, b) => MPSZ.indexOf(a[1]) * 9 + Number(a[0]) - MPSZ.indexOf(b[1]) * 9 - Number(b[0]))
            return (arr[0][0] + arr[1][0] === (Number(arr[2][0]) - 3).toString() + (Number(arr[3][0]) - 3).toString() && arr[0][1] === arr[2][1] && arr[1][1] === arr[3][1])
                || (arr[0][0] + arr[2][0] === (Number(arr[1][0]) - 3).toString() + (Number(arr[3][0]) - 3).toString() && arr[0][1] === arr[1][1] && arr[2][1] === arr[3][1])
        }
    },
    "老少副": {
        "han": 1, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['一色双龙会'].check(o)) return false
            if (YAKU['一色四步高'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['老少副x2'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            if (YAKU['花龙'].check(o)) return false
            if (YAKU['清龙'].check(o)) return false
            if (YAKU['三色双龙会'].check(o)) return false
            let arr = []
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if (v.length !== 3 || v[0] === v[1])
                    arr.push('--')
                else {
                    arr.push(v[0])
                }
            }
            return (arr[0][0] === (Number(arr[1][0]) - 6).toString() && arr[0][1] === arr[1][1])
                || (arr[0][0] === (Number(arr[2][0]) - 6).toString() && arr[0][1] === arr[2][1])
                || (arr[0][0] === (Number(arr[3][0]) - 6).toString() && arr[0][1] === arr[3][1])
                || (arr[1][0] === (Number(arr[2][0]) - 6).toString() && arr[1][1] === arr[2][1])
                || (arr[1][0] === (Number(arr[3][0]) - 6).toString() && arr[1][1] === arr[3][1])
                || (arr[2][0] === (Number(arr[3][0]) - 6).toString() && arr[2][1] === arr[3][1])

        }
    },
    "老少副x2": {
        "han": 2, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['一色双龙会'].check(o)) return false
            if (YAKU['一色四步高'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['喜相逢x2'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            if (YAKU['花龙'].check(o)) return false
            if (YAKU['清龙'].check(o)) return false
            if (YAKU['三色双龙会'].check(o)) return false
            let arr = []
            for (let v of o.currentPattern) {
                if (typeof v === 'string')
                    continue
                if (v.length !== 3 || v[0] === v[1])
                    return false
                arr.push(v[0])
            }
            return (arr[0][0] + arr[1][0] === (Number(arr[2][0]) - 6).toString() + (Number(arr[3][0]) - 6).toString() && arr[0][1] === arr[2][1] && arr[1][1] === arr[3][1])
                || (arr[0][0] + arr[2][0] === (Number(arr[1][0]) - 6).toString() + (Number(arr[3][0]) - 6).toString() && arr[0][1] === arr[1][1] && arr[2][1] === arr[3][1])
        }
    },
    "边张": {
        "han": 1, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let O = JSON.parse(JSON.stringify(o.haiArray))
            if (o.agari[1] === 'm') O[0][Number(o.agari[0]) - 1]--
            else if (o.agari[1] === 'p') O[1][Number(o.agari[0]) - 1]--
            else if (o.agari[1] === 's') O[2][Number(o.agari[0]) - 1]--
            else if (o.agari[1] === 'z') O[3][Number(o.agari[0]) - 1]--
            let count = hupaicount(O)
            if (o.agari[1] === 'm') O[0][Number(o.agari[0]) - 1]++
            else if (o.agari[1] === 'p') O[1][Number(o.agari[0]) - 1]++
            else if (o.agari[1] === 's') O[2][Number(o.agari[0]) - 1]++
            else if (o.agari[1] === 'z') O[3][Number(o.agari[0]) - 1]++
            if (count != 1) return false
            if (o.agari[1] !== 'z') {
                for (let i = 0; i < o.agariPatterns.length; i++) {
                    if (o.agari[0] === '3') {
                        if (o.agariPatterns[i].length == 3 && o.agariPatterns[i][0] !== o.agariPatterns[i][1] && o.agariPatterns[i][0] === '1' + o.agari[1]) return true
                    }
                    if (o.agari[0] === '7') {
                        if (o.agariPatterns[i].length == 3 && o.agariPatterns[i][0] !== o.agariPatterns[i][1] && o.agariPatterns[i][0] === '7' + o.agari[1]) return true
                    }
                }
            }

            return false
        }
    },
    "嵌张": {
        "han": 1, "check": (o) => {
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['边张'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let O = JSON.parse(JSON.stringify(o.haiArray))
            if (o.agari[1] === 'm') O[0][Number(o.agari[0]) - 1]--
            else if (o.agari[1] === 'p') O[1][Number(o.agari[0]) - 1]--
            else if (o.agari[1] === 's') O[2][Number(o.agari[0]) - 1]--
            else if (o.agari[1] === 'z') O[3][Number(o.agari[0]) - 1]--
            let count = hupaicount(O)
            if (o.agari[1] === 'm') O[0][Number(o.agari[0]) - 1]++
            else if (o.agari[1] === 'p') O[1][Number(o.agari[0]) - 1]++
            else if (o.agari[1] === 's') O[2][Number(o.agari[0]) - 1]++
            else if (o.agari[1] === 'z') O[3][Number(o.agari[0]) - 1]++
            if (count != 1) return false
            if (o.agari[1] !== 'z') {
                for (let i = 0; i < o.agariPatterns.length; i++) {
                    if (o.agariPatterns[i].length === 3 && o.agariPatterns[i][0] !== o.agariPatterns[i][1] && o.agariPatterns[i][0] === (Number(o.agari[0]) - 1) + o.agari[1]) return true
                }
            }
            return false
        }
    },
    "单钓将": {
        "han": 1, "check": (o) => {
            if (YAKU['四杠'].check(o)) return false
            if (YAKU['十三幺'].check(o)) return false
            if (YAKU['七对'].check(o) || YAKU['连七对'].check(o)) return false
            if (YAKU['全求人'].check(o)) return false
            if (YAKU['边张'].check(o)) return false
            if (YAKU['嵌张'].check(o)) return false
            if (YAKU['七星不靠'].check(o)) return false
            if (YAKU['全不靠'].check(o)) return false
            let O = JSON.parse(JSON.stringify(o.haiArray))
            if (o.agari[1] == 'm') O[0][Number(o.agari[0]) - 1]--
            else if (o.agari[1] == 'p') O[1][Number(o.agari[0]) - 1]--
            else if (o.agari[1] == 's') O[2][Number(o.agari[0]) - 1]--
            else if (o.agari[1] == 'z') O[3][Number(o.agari[0]) - 1]--
            let count = hupaicount(O)
            if (o.agari[1] == 'm') O[0][Number(o.agari[0]) - 1]++
            else if (o.agari[1] == 'p') O[1][Number(o.agari[0]) - 1]++
            else if (o.agari[1] == 's') O[2][Number(o.agari[0]) - 1]++
            else if (o.agari[1] == 'z') O[3][Number(o.agari[0]) - 1]++
            if (count != 1) return false
            for (let i = 0; i < o.agariPatterns.length; i++) {
                if (o.agariPatterns[i] === o.agari) return true
            }
            return false
        }
    },
    "自摸": {
        "han": 1, "check": (o) => {
            if (YAKU['妙手回春'].check(o)) return false
            if (YAKU['杠上开花'].check(o)) return false
            if (YAKU['不求人'].check(o)) return false
            return o.isTsumo
        }
    },
    "花牌": {
        "han": 1, "check": (o) => {
            if (o.hua === 1) return true
            return false
        }
    },
    "花牌x2": {
        "han": 2, "check": (o) => {
            if (o.hua === 2) return true
            return false
        }
    },
    "花牌x3": {
        "han": 3, "check": (o) => {
            if (o.hua === 3) return true
            return false
        }
    },
    "花牌x4": {
        "han": 4, "check": (o) => {
            if (o.hua === 4) return true
            return false
        }
    },
    "花牌x5": {
        "han": 5, "check": (o) => {
            if (o.hua === 5) return true
            return false
        }
    },
    "花牌x6": {
        "han": 6, "check": (o) => {
            if (o.hua === 6) return true
            return false
        }
    },
    "花牌x7": {
        "han": 7, "check": (o) => {
            if (o.hua === 7) return true
            return false
        }
    },
    "花牌x8": {
        "han": 8, "check": (o) => {
            if (o.hua === 8) return true
            return false
        }
    },
}
