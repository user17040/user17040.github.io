var pai=[1,2,3,4,5,6,7,8,9,21,22,23,24,25,26,27,28,29,41,42,43,44,45,46,47,48,49,61,64,67,70,73,76,79]
function gethu(a, quetou, wanneng, get, min, GET) {
    a.sort((a, b) => a - b)
    if (a.length == 0 && wanneng == 0 && quetou == 1) {
        GET.push(get)
        return
    }
    if (quetou == 0) {
        for (var i = 0; i < a.length; i++) {
            if (i < a.length - 1 && a[i] == a[i + 1] && a[i] != a[i - 1]) {
                gethu(a.slice(0, i).concat(a.slice(i + 2, a.length)), quetou + 1, wanneng, get.concat([[a[i], a[i]]]), 0, GET)
            }
            if (wanneng > 0 && a[i] != a[i - 1]) {
                gethu(a.slice(0, i).concat(a.slice(i + 1, a.length)), quetou + 1, wanneng - 1, get.concat([[a[i], -a[i]]]), 0, GET)
            }
        }
    } else {
        for (var i = 0; i < a.length; i++) {
            for (var j = i + 1; j < a.length; j++) {
                if (a[j] != a[j - 1] || j == i + 1) {
                    var id = getid([a[i], a[j], -a[k]])
                    if (wanneng > 0 && id >= min) {
                        if (a[i] == a[j]) {
                            gethu(a.slice(0, i).concat(a.slice(i + 1, j)).concat(a.slice(j + 1, a.length)), quetou, wanneng - 1, get.concat([[a[i], a[j], -a[i]]]), id, GET)
                        }
                        if (a[i] == a[j] - 1 && pai.includes(a[i+2])) {
                            gethu(a.slice(0, i).concat(a.slice(i + 1, j)).concat(a.slice(j + 1, a.length)), quetou, wanneng - 1, get.concat([[a[i], a[j], -a[i] - 2]]), id, GET)
                        }
                        if (a[i] == a[j] - 2 && pai.includes(a[i+1])) {
                            gethu(a.slice(0, i).concat(a.slice(i + 1, j)).concat(a.slice(j + 1, a.length)), quetou, wanneng - 1, get.concat([[a[i], -a[i] - 1, a[j]]]), id, GET)
                        }
                    }
                    for (var k = j + 1; k < a.length; k++) {
                        if (a[k] != a[k - 1] || k == j + 1) {
                            var id = getid([a[i], a[j], a[k]])
                            if (id >= min) {
                                if ((a[i] == a[j] - 1 && a[i] == a[k] - 2) || (a[i] == a[j] && a[i] == a[k])) {
                                    gethu(a.slice(0, i).concat(a.slice(i + 1, j)).concat(a.slice(j + 1, k)).concat(a.slice(k + 1, a.length)), quetou, wanneng, get.concat([[a[i], a[j], a[k]]]), id, GET)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return uniq(GET)
}
function getid(a) {
    if (a[0] == a[1]) {
        if (a[0] < 0) {
            return a[0] + 0.375
        }
        if (a[1] < 0) {
            return a[0] + 0.25
        }
        if (a[2] < 0) {
            return a[0] + 0.125
        }
        return a[0]
    }
    if (a[0] < 0 && a[1] < 0 && a[2] < 0) {
        return a[0] + 0.9375
    }
    if (a[0] < 0 && a[1] < 0 && a[2] > 0) {
        return a[0] + 0.875
    }
    if (a[0] < 0 && a[1] > 0 && a[2] < 0) {
        return a[0] + 0.8125
    }
    if (a[0] < 0 && a[1] > 0 && a[2] > 0) {
        return a[0] + 0.75
    }
    if (a[0] > 0 && a[1] < 0 && a[2] < 0) {
        return a[0] + 0.6875
    }
    if (a[0] > 0 && a[1] < 0 && a[2] > 0) {
        return a[0] + 0.625
    }
    if (a[0] > 0 && a[1] > 0 && a[2] < 0) {
        return a[0] + 0.5625
    }
    return a[0] + 0.5
}
function uniq(array) {
    var temp = []
    var index = []
    var l = array.length
    for (var i = 0; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
            if (JSON.stringify(array[i]) === JSON.stringify(array[j])) {
                i++
                j = i
            }
        }
        temp.push(array[i])
        index.push[i]
    }
    return temp
}