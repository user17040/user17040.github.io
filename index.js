
const MPSZ = ['m', 'p', 's', 'z']
const KAZE = [undefined, '东', '南', '西', '北']
const ceil10 = (num) => {
    return Math.ceil(num / 10) * 10
}
const ceil100 = (num) => {
    return Math.ceil(num / 100) * 100
}
const isHai = (text) => {
    return typeof text === 'string' && text.length === 2 && !isNaN(text[0]) && MPSZ.includes(text[1])
}
const is19 = (text) => {
    return isHai(text) && (text.includes('1') || text.includes('9') || text.includes('z'))
}
const isFuro = (arr) => {
    if (arr instanceof Array !== true || arr.length > 4 || arr.length < 2)
        return false
    let set = new Set(arr)
    if (set.size === 1)
        return isHai(arr[0])
    else {
        if (set.size !== 3)
            return false
        let minus1 = parseInt(arr[1]) - parseInt(arr[0])
        let minus2 = parseInt(arr[2]) - parseInt(arr[1])
        if (minus1 !== minus2 || minus1 !== 1)
            return false
    }
    return true
}
const parse = (text) => {
    let tmp = []
    for (let v of text) {
        if (!isNaN(v)) {

            tmp.push(v)
        }
        if (MPSZ.includes(v)) {
            for (let k in tmp)
                if (!isNaN(tmp[k]))
                    tmp[k] += v
        }
    }
    let res = []
    for (let v of tmp)
        if (isNaN(v))
            res.push(v)
    return { 'res': tmp }
}

class Riichi {
    constructor(data) {
        this.hai = []
        this.haiArray = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
        ]
        this.furo = []
        this.agari = ''
        this.extra = ''
        this.isTsumo = true
        this.isOya = false
        this.bakaze = 0
        this.jikaze = 0
        this.hua = 0
        this.agariPatterns = []
        this.currentPattern
        this.tmpResult = {
            'isAgari': false,
            'yaku': {},
            'han': 0,
            'ten': 0,
            'name': '',
            'text': '',
            'error': true
        }
        this.finalResult

        this.allLocalEnabled = false
        this.localEnabled = []
        this.disabled = []
        this.allowWyakuman = true
        this.allowKuitan = true
        this.allowAka = true
        this.hairi = true


        if (typeof data !== 'string')
            return
        data = data.toLowerCase()
        let arr = data.split('+')
        let hai = arr.shift()
        for (let v of arr) {
            if (!v.includes('m') && !v.includes('p') && !v.includes('s') && !v.includes('z') && !v.includes('f') && isNaN(v))
                this.extra = v
            else if (!isNaN(v)) {
                this.bakaze = v[0]
                this.jikaze = v[1]
            }
            else if (v[0] === 'f')
                this.hua = Number(v[1])
            else if (isHai(v)) {
                hai += v
                this.isTsumo = false
            } else {
                let tmp = []
                for (let vv of v) {
                    if (MPSZ.includes(vv)) {
                        for (let k in tmp)
                            tmp[k] += vv
                        if (isFuro(tmp))
                            this.furo.push(tmp.sort())
                        tmp = []
                    }
                    else {
                        tmp.push(vv)
                    }
                }
            }
        }
        let tmp = parse(hai)
        this.hai = tmp.res
        this.agari = this.hai.slice(-1)[0]
        if (this.hai.length % 3 === 0)
            return
        if (this.hai.length + this.furo.length * 3 > 14)
            return


        for (let v of this.hai) {
            let n = parseInt(v)
            let i = MPSZ.indexOf(v.replace(n, ''))
            this.haiArray[i][n - 1]++
        }


        this.tmpResult.error = false
        this.finalResult = JSON.parse(JSON.stringify(this.tmpResult))
    }

    isMenzen() {
        for (let v of this.furo)
            if (v.length > 2)
                return false
        return true
    }
    calcFu() {
        let fu = 0
        if (this.tmpResult.yaku['-']) {
            fu = 25
        } else if (this.tmpResult.yaku['-']) {
            fu = this.isTsumo ? 20 : 30
        } else {
            fu = 20
            let hasAgariFu = false
            if (!this.isTsumo && this.isMenzen())
                fu += 10
            for (let v of this.currentPattern) {
                if (typeof v === 'string') {
                    if (v.includes('z'))
                        for (let vv of [this.bakaze, this.jikaze, 5, 6, 7])
                            if (parseInt(v) === vv)
                                fu += 2
                    if (this.agari === v)
                        hasAgariFu = true
                } else {
                    if (v.length === 4)
                        fu += is19(v[0]) ? 16 : 8
                    else if (v.length === 2)
                        fu += is19(v[0]) ? 32 : 16
                    else if (v.length === 1)
                        fu += is19(v[0]) ? 8 : 4
                    else if (v.length === 3 && v[0] === v[1])
                        fu += is19(v[0]) ? 4 : 2
                    else if (!hasAgariFu) {
                        if (v[1] === this.agari)
                            hasAgariFu = true
                        else if (v[0] === hasAgariFu && parseInt(v[2]) === 9)
                            hasAgariFu = true
                        else if (v[2] === hasAgariFu && parseInt(v[0]) === 1)
                            hasAgariFu = true
                    }
                }
            }

            if (hasAgariFu)
                fu += 2
            if (this.isTsumo)
                fu += 2

            fu = ceil10(fu)
            if (fu < 30)
                fu = 30
        }
        this.tmpResult.fu = fu
    }

    calcTen() {
        this.tmpResult.name = ''
        this.tmpResult.text = `${KAZE[this.bakaze]}风圈`
        this.tmpResult.text += ' ' + KAZE[this.jikaze] + '家'
        this.tmpResult.text += this.isTsumo ? '自摸' : '点和'
        this.tmpResult.text += ' ' + this.tmpResult.han + '番'
        this.tmpResult.text += (this.tmpResult.name ? ' ' : '') + this.tmpResult.name
        if (this.isTsumo) {
            this.tmpResult.text += ' ' + (8 + this.tmpResult.han) + 'all'
            this.tmpResult.text += ' ' + (24 + 3 * this.tmpResult.han) + '分'
        } else {
            this.tmpResult.text += ' ' + (8 + this.tmpResult.han) + '-8'
            this.tmpResult.text += ' ' + (24 + this.tmpResult.han) + '分'
        }

    }
    calcYaku() {
        this.tmpResult.yaku = {}
        this.tmpResult.han = 0
        for (let k in YAKU) {
            let v = YAKU[k]
            if (this.disabled.includes(k))
                continue
            if (v.isLocal && !this.allLocalEnabled && !this.localEnabled.includes(k))
                continue
            if (this.tmpResult.yakuman && !v.yakuman)
                continue
            if (v.check(this)) {
                let n = v.han
                this.tmpResult.yaku[k] = n + '番'
                this.tmpResult.han += n
            }
        }
    }



    disableWyakuman() {
        this.allowWyakuman = false
    }
    disableKuitan() {
        this.allowKuitan = false
    }
    disableAka() {
        this.allowAka = false
    }
    enableLocalYaku(name) {
        this.localEnabled.push(name)
    }
    disableYaku(name) {
        this.disabled.push(name)
    }




    disableHairi() {
        this.hairi = false
    }
    calc() {
        if (this.tmpResult.error) {
            return this.tmpResult
        }
        this.tmpResult.isAgari = agari.checkAll(this.haiArray)
        if (!this.tmpResult.isAgari || this.hai.length + this.furo.length * 3 !== 14) {
            return this.tmpResult
        }
        this.finalResult.isAgari = true
        if (this.extra.includes('o'))
            this.allLocalEnabled = true

        this.agariPatterns = agari(this.haiArray)
        if (!this.agariPatterns.length)
            this.agariPatterns.push([])
        let maxhan = 0
        let maxname
        let p = this.agariPatterns
        for (let v of p) {
            if (!this.isTsumo) {
                for (let k in v) {
                    let vv = v[k]
                    if (vv.length === 1 && vv[0] === this.agari) {
                        let i = MPSZ.indexOf(this.agari[1])
                        if (this.haiArray[i][parseInt(this.agari) - 1] < 4)
                            v[k] = [vv[0], vv[0], vv[0]]
                    }
                }
            }
            this.currentPattern = v.concat(this.furo)
            this.agariPatterns = v
            this.calcYaku()
            if (this.tmpResult.han > maxhan) {
                maxhan = this.tmpResult.han
                maxname = this.tmpResult.yaku
            }
            this.tmpResult.yaku = maxname
            this.tmpResult.han = maxhan
            this.calcTen()
            this.finalResult = JSON.parse(JSON.stringify(this.tmpResult))
        }
        return this.finalResult
    }
}
hupaicount = function (arr) {
    let count = 0
    for (let i = 0; i < 4; i++) {
        for (let ii = 0; ii < 9; ii++) {
            arr[i][ii]++
            if (agari.checkAll(arr)) count++
            arr[i][ii]--
            if (i == 3 && ii == 6) break
        }
    }
    return count
}