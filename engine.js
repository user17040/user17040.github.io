function judgeLongBan(board, x, y) {
    let len = 1;

    for (let i = x - 1; i >= 0; i--) {
        if (board[i][y] == 1) len += 1;
        else break;
    }
    for (let i = x + 1; i <= 14; i++) {
        if (board[i][y] == 1) len += 1;
        else break;
    }
    if (len > 5) return 1;

    len = 1;
    for (let i = y - 1; i >= 0; i--) {
        if (board[x][i] == 1) len += 1;
        else break;
    }
    for (let i = x + 1; i <= 14; i++) {
        if (board[x][i] == 1) len += 1;
        else break;
    }
    if (len > 5) return 1;

    len = 1;
    for (let i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] == 1) len += 1;
        else break;
    }
    for (let i = x + 1, j = y + 1; i <= 14 && j <= 14; i++, j++) {
        if (board[i][j] == 1) len += 1;
        else break;
    }
    if (len > 5) return 1;

    len = 1;
    for (let i = x - 1, j = y + 1; i >= 0 && j <= 14; i--, j++) {
        if (board[i][j] == 1) len += 1;
        else break;
    }
    for (let i = x + 1, j = y - 1; i <= 14 && j >= 0; i++, j--) {
        if (board[i][j] == 1) len += 1;
        else break;
    }
    return len > 5;
}

function getFive(board, x, y) {
    let len = 1;

    for (let i = x - 1; i >= 0; i--) {
        if (board[i][y] == 1) len += 1;
        else break;
    }
    for (let i = x + 1; i <= 14; i++) {
        if (board[i][y] == 1) len += 1;
        else break;
    }
    if (len == 5) return 1;

    len = 1;
    for (let i = y - 1; i >= 0; i--) {
        if (board[x][i] == 1) len += 1;
        else break;
    }
    for (let i = y + 1; i <= 14; i++) {
        if (board[x][i] == 1) len += 1;
        else break;
    }
    if (len == 5) return 1;

    len = 1;
    for (let i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] == 1) len += 1;
        else break;
    }
    for (let i = x + 1, j = y + 1; i <= 14 && j <= 14; i++, j++) {
        if (board[i][j] == 1) len += 1;
        else break;
    }
    if (len == 5) return 1;

    len = 1;
    for (let i = x - 1, j = y + 1; i >= 0 && j <= 14; i--, j++) {
        if (board[i][j] == 1) len += 1;
        else break;
    }
    for (let i = x + 1, j = y - 1; i <= 14 && j >= 0; i++, j--) {
        if (board[i][j] == 1) len += 1;
        else break;
    }
    return len == 5;
}

function getFive_w(board, x, y) {
    let len = 1;

    for (let i = x - 1; i >= 0; i--) {
        if (board[i][y] == 2) len += 1;
        else break;
    }
    for (let i = x + 1; i <= 14; i++) {
        if (board[i][y] == 2) len += 1;
        else break;
    }
    if (len > 4) return 1;

    len = 1;
    for (let i = y - 1; i >= 0; i--) {
        if (board[x][i] == 2) len += 1;
        else break;
    }
    for (let i = y + 1; i <= 14; i++) {
        if (board[x][i] == 2) len += 1;
        else break;
    }
    if (len > 4) return 1;

    len = 1;
    for (let i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] == 2) len += 1;
        else break;
    }
    for (let i = x + 1, j = y + 1; i <= 14 && j <= 14; i++, j++) {
        if (board[i][j] == 2) len += 1;
        else break;
    }
    if (len > 4) return 1;

    len = 1;
    for (let i = x - 1, j = y + 1; i >= 0 && j <= 14; i--, j++) {
        if (board[i][j] == 2) len += 1;
        else break;
    }
    for (let i = x + 1, j = y - 1; i <= 14 && j >= 0; i++, j--) {
        if (board[i][j] == 2) len += 1;
        else break;
    }
    return len > 4;
}
function getAFourOnOneLine(board, x, y, dx, dy) {
    let before = 0;
    let middle = 1;
    let after = 0;
    let flag = 0;
    for (let i = x - dx, j = y - dy; ; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 2) {
            if (!flag) before = -1;
            break;
        }
        if (board[i][j] == 1) {
            if (flag) before += 1;
            else middle += 1;
        } else {
            if (flag) break;
            flag = 1;
        }
    }
    flag = 0;
    for (let i = x + dx, j = y + dy; ; i += dx, j += dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 2) {
            if (!flag) after = -1;
            break;
        }
        if (board[i][j] == 1) {
            if (flag) after += 1;
            else middle += 1;
        } else {
            if (flag) break;
            flag = 1;
        }
    }
    if (middle == 4) return before == 0 && after == 0;
    return 0;
}
function getAFourOnOneLine_w(board, x, y, dx, dy) {
    let before = 0;
    let middle = 1;
    let after = 0;
    for (let i = x - dx, j = y - dy; ; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 1) {
            before = -1;
            break;
        }
        if (board[i][j] == 2) {
            middle += 1;
        } else {
            break;
        }
    }
    for (let i = x + dx, j = y + dy; ; i += dx, j += dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 1) {
            after = -1;
            break;
        }
        if (board[i][j] == 2) {
            middle += 1;
        } else {
            break;
        }
    }
    if (middle == 4) return before == 0 && after == 0;
    return 0;
}
function getFourOnOneLine(board, x, y, dx, dy) {
    let before = 0;
    let middle = 1;
    let after = 0;
    let flag = 0;
    for (let i = x - dx, j = y - dy; ; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 2) {
            if (!flag) before = -1;
            break;
        }
        if (board[i][j] == 1) {
            if (flag) before += 1;
            else middle += 1;
        } else {
            if (flag) break;
            flag = 1;
        }
    }
    flag = 0;
    for (let i = x + dx, j = y + dy; ; i += dx, j += dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 2) {
            if (!flag) after = -1;
            break;
        }
        if (board[i][j] == 1) {
            if (flag) after += 1;
            else middle += 1;
        } else {
            if (flag) break;
            flag = 1;
        }
    }
    if (middle === 4) return before === 0 || after === 0 ? 1 : 0;
    return (before > 0 && before + middle == 4 ? 1 : 0) + (after > 0 && middle + after == 4 ? 1 : 0);
}
function getFourOnOneLine_w(board, x, y, dx, dy) {
    let before = 0;
    let middle = 1;
    let after = 0;
    let flag = 0;
    for (let i = x - dx, j = y - dy; ; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 1) {
            if (!flag) before = -1;
            break;
        }
        if (board[i][j] == 2) {
            if (flag) before += 1;
            else middle += 1;
        } else {
            if (flag) break;
            flag = 1;
        }
    }
    flag = 0;
    for (let i = x + dx, j = y + dy; ; i += dx, j += dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 1) {
            if (!flag) after = -1;
            break;
        }
        if (board[i][j] == 2) {
            if (flag) after += 1;
            else middle += 1;
        } else {
            if (flag) break;
            flag = 1;
        }
    }
    if (middle === 4) return before === 0 || after === 0 ? 1 : 0;
    return (before > 0 && before + middle == 4 ? 1 : 0) + (after > 0 && middle + after == 4 ? 1 : 0);
}
function judgeBan(board, x, y) {
    board[x][y] = 1;
    const long = judgeLongBan(board, x, y);
    const five = getFive(board, x, y);
    const fourCount = getFourOnOneLine(board, x, y, 1, 0)
        + getFourOnOneLine(board, x, y, 0, 1)
        + getFourOnOneLine(board, x, y, -1, 1)
        + getFourOnOneLine(board, x, y, 1, 1);
    const threeCount = getAThreeOnOneLine(board, x, y, 1, 0)
        + getAThreeOnOneLine(board, x, y, 0, 1)
        + getAThreeOnOneLine(board, x, y, -1, 1)
        + getAThreeOnOneLine(board, x, y, 1, 1);
    board[x][y] = 0;
    return !five && (long || fourCount > 1 || threeCount > 1);
}
function getAThreeOnOneLine(board, x, y, dx, dy) {
    let beforeBefore = 0;
    let before = 0;
    let middle = 1;
    let after = 0;
    let afterAfter = 0;
    let flag = 0;
    for (let i = x - dx, j = y - dy; ; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 2) {
            if (flag == 0) before = -1;
            if (flag == 1) beforeBefore = -1;
            break;
        }
        if (board[i][j] == 1) {
            if (flag == 1) before += 1;
            else if (flag == 2) beforeBefore += 1;
            else middle += 1;
        } else if (flag == 2) {
            break;
        } else {
            flag += 1;
        }
    }
    const deltaMiddle = middle;
    flag = 0;
    for (let i = x + dx, j = y + dy; ; i += dx, j += dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 2) {
            if (flag == 0) after = -1;
            if (flag == 1) afterAfter = -1;
            break;
        }
        if (board[i][j] == 1) {
            if (flag == 1) after += 1;
            else if (flag == 2) afterAfter += 1;
            else middle += 1;
        } else if (flag == 2) {
            break;
        } else {
            flag += 1;
        }
    }
    if (before == -1 || after == -1 || middle > 3) return 0;
    if (middle == 3) {
        if (before !== 0 || after !== 0) return 0;
        if (beforeBefore == -1 && afterAfter == -1) return 0;
        if (beforeBefore == -1) {
            if (afterAfter > 0) return 0;
            return judgeBan(board, x + dx * (4 - deltaMiddle), y + dy * (4 - deltaMiddle)) ? 0 : 1.2;
        }
        if (afterAfter == -1) {
            if (beforeBefore > 0) return 0;
            return judgeBan(board, x - dx * deltaMiddle, y - dy * deltaMiddle) ? 0 : 1.2;
        }
        if (beforeBefore > 0 && afterAfter > 0) return 0;
        const a = judgeBan(board, x - dx * deltaMiddle, y - dy * deltaMiddle);
        const b = judgeBan(board, x + dx * (4 - deltaMiddle), y + dy * (4 - deltaMiddle));
        return a && b ? 0 : 1.2;
    }
    if (middle == 2) {
        if (before == 1 && after == 0) {
            if (beforeBefore == -1) return 0;
            return judgeBan(board, x - dx * deltaMiddle, y - dy * deltaMiddle) ? 0 : 1.1;
        }
        if (before == 0 && after == 1) {
            if (afterAfter == -1) return 0;
            return judgeBan(board, x + dx * (3 - deltaMiddle), y + dy * (3 - deltaMiddle)) ? 0 : 1.1;
        }
        return 0;
    }
    if (middle == 1) {
        if (before == 2 && after == 0) {
            if (beforeBefore == -1) return 0;
            return judgeBan(board, x - dx, y - dy) ? 0 : 1.1;
        }
        if (before == 0 && after == 2) {
            if (afterAfter == -1) return 0;
            return judgeBan(board, x + dx, y + dy) ? 0 : 1.1;
        }
        return 0;
    }

}

function getAThreeOnOneLine_w(board, x, y, dx, dy) {
    let beforeBefore = 0;
    let before = 0;
    let middle = 1;
    let after = 0;
    let afterAfter = 0;
    let flag = 0;
    for (let i = x - dx, j = y - dy; ; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 1) {
            if (flag == 0) before = -1;
            if (flag == 1) beforeBefore = -1;
            break;
        }
        if (board[i][j] == 2) {
            if (flag == 1) before += 1;
            else if (flag == 2) beforeBefore += 1;
            else middle += 1;
        } else if (flag == 2) {
            break;
        } else {
            flag += 1;
        }
    }
    flag = 0;
    for (let i = x + dx, j = y + dy; ; i += dx, j += dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 1) {
            if (flag == 0) after = -1;
            if (flag == 1) afterAfter = -1;
            break;
        }
        if (board[i][j] == 2) {
            if (flag == 1) after += 1;
            else if (flag == 2) afterAfter += 1;
            else middle += 1;
        } else if (flag == 2) {
            break;
        } else {
            flag += 1;
        }
    }
    if (before == -1 || after == -1 || middle > 3) return 0;
    if (middle == 3) {
        if (before !== 0 || after !== 0) return 0;
        if (beforeBefore == -1 && afterAfter == -1) return 0;
        return 1.2;
    }
    if (middle == 2) {
        if (before == 1 && after == 0) {
            return 1.1;
        }
        if (before == 0 && after == 1) {
            return 1.1;
        }
        return 0;
    }
    if (middle == 1) {
        if (before == 2 && after == 0) {
            return 1.1;
        }
        if (before == 0 && after == 2) {
            return 1.1;
        }
        return 0;
    }

}

function getThreeOnOneLine(board, x, y, dx, dy) {
    let t = board[x][y];
    board[x][y] = 1;
    let cnt = 0;
    for (let i = x - dx, j = y - dy; cnt < 5; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 2) {
            break;
        }
        if (board[i][j] == 0) {
            if (getFourOnOneLine(board, i, j, dx, dy)) {
                board[x][y] = t;
                return 1;
            }
        }
        cnt++;
    }
    cnt = 0;
    for (let i = x + dx, j = y + dy; cnt < 5; i += dx, j += dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 2) {
            break;
        }
        if (board[i][j] == 0) {
            if (getFourOnOneLine(board, i, j, dx, dy)) {
                board[x][y] = t;
                return 1;
            }
        }
        cnt++;
    }
    board[x][y] = t;
    return 0;

}
function getThreeOnOneLine_w(board, x, y, dx, dy) {
    let t = board[x][y];
    board[x][y] = 2;
    let cnt = 0;
    for (let i = x - dx, j = y - dy; cnt < 5; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 1) {
            break;
        }
        if (board[i][j] == 0) {
            if (getFourOnOneLine_w(board, i, j, dx, dy)) {
                board[x][y] = t;
                return 1;
            }
        }
        cnt++;
    }
    cnt = 0;
    for (let i = x + dx, j = y + dy; cnt < 5; i += dx, j += dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 1) {
            break;
        }
        if (board[i][j] == 0) {
            if (getFourOnOneLine_w(board, i, j, dx, dy)) {
                board[x][y] = t;
                return 1;
            }
        }
        cnt++;
    }
    board[x][y] = t;
    return 0;

}
function getATwoOnOneLine(board, x, y, dx, dy) {
    let t = board[x][y];
    board[x][y] = 1;
    let cnt = 0;
    let ev_equals_1 = 0;
    for (let i = x - dx, j = y - dy; cnt < 5; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 2) {
            break;
        }
        if (board[i][j] == 0) {
            let ev = getAThreeOnOneLine(board, i, j, dx, dy);
            ev_equals_1 += (ev - 1) / 3;
        }
        cnt++;
    }
    cnt = 0;
    for (let i = x + dx, j = y + dy; cnt < 5; i += dx, j += dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 2) {
            break;
        }
        if (board[i][j] == 0) {
            let ev = getAThreeOnOneLine(board, i, j, dx, dy);
            ev_equals_1 += (ev - 1) / 3;
        }
        cnt++;
    }
    board[x][y] = t;
    if (ev_equals_1 == 1) return 0;
    return ev_equals_1;

}
function getATwoOnOneLine_w(board, x, y, dx, dy) {
    let t = board[x][y];
    board[x][y] = 2;
    let cnt = 0;
    let ev_equals_1 = 1;
    for (let i = x - dx, j = y - dy; cnt < 5; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 1) {
            break;
        }
        if (board[i][j] == 0) {
            let ev = getAThreeOnOneLine(board, i, j, dx, dy);
            ev_equals_1 += (ev - 1) / 3;
        }
        cnt++;
    }
    cnt = 0;
    for (let i = x + dx, j = y + dy; cnt < 5; i += dx, j += dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 1) {
            break;
        }
        if (board[i][j] == 0) {
            let ev = getAThreeOnOneLine(board, i, j, dx, dy);
            ev_equals_1 += (ev - 1) / 3;
        }
        cnt++;
    }
    board[x][y] = t;
    if (ev_equals_1 == 1) return 0;
    return ev_equals_1;

}
function getTwoOnOneLine(board, x, y, dx, dy) {
    let t = board[x][y];
    board[x][y] = 1;
    let cnt = 0;
    for (let i = x - dx, j = y - dy; cnt < 5; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 2) {
            break;
        }
        if (board[i][j] == 0) {
            if (getThreeOnOneLine(board, i, j, dx, dy)) {
                board[x][y] = t;
                return 1;
            }
        }
        cnt++;
    }
    cnt = 0;
    for (let i = x + dx, j = y + dy; cnt < 5; i += dx, j += dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 2) {
            break;
        }
        if (board[i][j] == 0) {
            if (getThreeOnOneLine(board, i, j, dx, dy)) {
                board[x][y] = t;
                return 1;
            }
        }
        cnt++;
    }
    board[x][y] = t;
    return 0;

}
function getTwoOnOneLine_w(board, x, y, dx, dy) {
    let t = board[x][y];
    board[x][y] = 2;
    let cnt = 0;
    for (let i = x - dx, j = y - dy; cnt < 5; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 1) {
            break;
        }
        if (board[i][j] == 0) {
            if (getThreeOnOneLine_w(board, i, j, dx, dy)) {
                board[x][y] = t;
                return 1;
            }
        }
        cnt++;
    }
    cnt = 0;
    for (let i = x + dx, j = y + dy; cnt < 5; i += dx, j += dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 1) {
            break;
        }
        if (board[i][j] == 0) {
            if (getThreeOnOneLine_w(board, i, j, dx, dy)) {
                board[x][y] = t;
                return 1;
            }
        }
        cnt++;
    }
    board[x][y] = t;
    return 0;

}
function evaluate(board) {
    let bev = 0; let wev = 0;
    for (let x = 0; x < 15; x++) {
        for (let y = 0; y < 15; y++) {
            if (board[x][y] == 1) {
                if (getFive(board, x, y)) {
                    return [1000000, 0];
                }
                bev += 5000 * (getAFourOnOneLine(board, x, y, 1, 0) + getAFourOnOneLine(board, x, y, 0, 1) + getAFourOnOneLine(board, x, y, -1, 1) + getAFourOnOneLine(board, x, y, 1, 1));
                bev += 1000 * (getFourOnOneLine(board, x, y, 1, 0) + getFourOnOneLine(board, x, y, 0, 1) + getFourOnOneLine(board, x, y, -1, 1) + getFourOnOneLine(board, x, y, 1, 1));
                bev += 200 * (getAThreeOnOneLine(board, x, y, 1, 0) + getAThreeOnOneLine(board, x, y, 0, 1) + getAThreeOnOneLine(board, x, y, -1, 1) + getAThreeOnOneLine(board, x, y, 1, 1));
                bev += 50 * (getThreeOnOneLine(board, x, y, 1, 0) + getThreeOnOneLine(board, x, y, 0, 1) + getThreeOnOneLine(board, x, y, -1, 1) + getThreeOnOneLine(board, x, y, 1, 1));
                bev += 10 * (getATwoOnOneLine(board, x, y, 1, 0) + getATwoOnOneLine(board, x, y, 0, 1) + getATwoOnOneLine(board, x, y, -1, 1) + getATwoOnOneLine(board, x, y, 1, 1));
                bev += 2 * (getTwoOnOneLine(board, x, y, 1, 0) + getTwoOnOneLine(board, x, y, 0, 1) + getTwoOnOneLine(board, x, y, -1, 1) + getTwoOnOneLine(board, x, y, 1, 1));
            }
            else if (board[x][y] == 2) {
                if (getFive_w(board, x, y)) {
                    return [0, 1000000];
                }
                wev += 5000 * (getAFourOnOneLine_w(board, x, y, 1, 0) + getAFourOnOneLine_w(board, x, y, 0, 1) + getAFourOnOneLine_w(board, x, y, -1, 1) + getAFourOnOneLine_w(board, x, y, 1, 1));
                wev += 1000 * (getFourOnOneLine_w(board, x, y, 1, 0) + getFourOnOneLine_w(board, x, y, 0, 1) + getFourOnOneLine_w(board, x, y, -1, 1) + getFourOnOneLine_w(board, x, y, 1, 1));
                wev += 200 * (getAThreeOnOneLine_w(board, x, y, 1, 0) + getAThreeOnOneLine_w(board, x, y, 0, 1) + getAThreeOnOneLine_w(board, x, y, -1, 1) + getAThreeOnOneLine_w(board, x, y, 1, 1));
                wev += 50 * (getThreeOnOneLine_w(board, x, y, 1, 0) + getThreeOnOneLine_w(board, x, y, 0, 1) + getThreeOnOneLine_w(board, x, y, -1, 1) + getThreeOnOneLine_w(board, x, y, 1, 1));
                wev += 10 * (getATwoOnOneLine_w(board, x, y, 1, 0) + getATwoOnOneLine_w(board, x, y, 0, 1) + getATwoOnOneLine_w(board, x, y, -1, 1) + getATwoOnOneLine_w(board, x, y, 1, 1));
                wev += 2 * (getTwoOnOneLine_w(board, x, y, 1, 0) + getTwoOnOneLine_w(board, x, y, 0, 1) + getTwoOnOneLine_w(board, x, y, -1, 1) + getTwoOnOneLine_w(board, x, y, 1, 1));
            }
        }
    }
    return [bev, wev];

}
function evaluate_one(board, x, y, color) {
    let ev = 0;
    if (color == 1) {
        if (getFive(board, x, y)) {
            return 1000000;
        }
        ev += 5000 * (getAFourOnOneLine(board, x, y, 1, 0) + getAFourOnOneLine(board, x, y, 0, 1) + getAFourOnOneLine(board, x, y, -1, 1) + getAFourOnOneLine(board, x, y, 1, 1));
        ev += 1000 * (getFourOnOneLine(board, x, y, 1, 0) + getFourOnOneLine(board, x, y, 0, 1) + getFourOnOneLine(board, x, y, -1, 1) + getFourOnOneLine(board, x, y, 1, 1));
        ev += 200 * (getAThreeOnOneLine(board, x, y, 1, 0) + getAThreeOnOneLine(board, x, y, 0, 1) + getAThreeOnOneLine(board, x, y, -1, 1) + getAThreeOnOneLine(board, x, y, 1, 1));
        ev += 50 * (getThreeOnOneLine(board, x, y, 1, 0) + getThreeOnOneLine(board, x, y, 0, 1) + getThreeOnOneLine(board, x, y, -1, 1) + getThreeOnOneLine(board, x, y, 1, 1));
        ev += 10 * (getATwoOnOneLine(board, x, y, 1, 0) + getATwoOnOneLine(board, x, y, 0, 1) + getATwoOnOneLine(board, x, y, -1, 1) + getATwoOnOneLine(board, x, y, 1, 1));
        ev += 2 * (getTwoOnOneLine(board, x, y, 1, 0) + getTwoOnOneLine(board, x, y, 0, 1) + getTwoOnOneLine(board, x, y, -1, 1) + getTwoOnOneLine(board, x, y, 1, 1));
    }
    else if (color == 2) {
        if (getFive_w(board, x, y)) {
            return 1000000;
        }
        ev += 5000 * (getAFourOnOneLine_w(board, x, y, 1, 0) + getAFourOnOneLine_w(board, x, y, 0, 1) + getAFourOnOneLine_w(board, x, y, -1, 1) + getAFourOnOneLine_w(board, x, y, 1, 1));
        ev += 1000 * (getFourOnOneLine_w(board, x, y, 1, 0) + getFourOnOneLine_w(board, x, y, 0, 1) + getFourOnOneLine_w(board, x, y, -1, 1) + getFourOnOneLine_w(board, x, y, 1, 1));
        ev += 200 * (getAThreeOnOneLine_w(board, x, y, 1, 0) + getAThreeOnOneLine_w(board, x, y, 0, 1) + getAThreeOnOneLine_w(board, x, y, -1, 1) + getAThreeOnOneLine_w(board, x, y, 1, 1));
        ev += 50 * (getThreeOnOneLine_w(board, x, y, 1, 0) + getThreeOnOneLine_w(board, x, y, 0, 1) + getThreeOnOneLine_w(board, x, y, -1, 1) + getThreeOnOneLine_w(board, x, y, 1, 1));
        ev += 10 * (getATwoOnOneLine_w(board, x, y, 1, 0) + getATwoOnOneLine_w(board, x, y, 0, 1) + getATwoOnOneLine_w(board, x, y, -1, 1) + getATwoOnOneLine_w(board, x, y, 1, 1));
        ev += 2 * (getTwoOnOneLine_w(board, x, y, 1, 0) + getTwoOnOneLine_w(board, x, y, 0, 1) + getTwoOnOneLine_w(board, x, y, -1, 1) + getTwoOnOneLine_w(board, x, y, 1, 1));
    }
    return ev;

}
function evaluate_dx_dy(board, x, y, dx, dy, color) {
    let ev = 0;
    if (color == 1) {
        if (getFive(board, x, y)) {
            return 1000000;
        }
        ev += 5000 * getAFourOnOneLine(board, x, y, dx, dy);
        ev += 1000 * getFourOnOneLine(board, x, y, dx, dy);
        ev += 200 * getAThreeOnOneLine(board, x, y, dx, dy);
        ev += 50 * getThreeOnOneLine(board, x, y, dx, dy);
        ev += 10 * getATwoOnOneLine(board, x, y, dx, dy);
        ev += 2 * getTwoOnOneLine(board, x, y, dx, dy);
    }
    else if (color == 2) {
        if (getFive_w(board, x, y)) {
            return 1000000;
        }
        ev += 5000 * getAFourOnOneLine_w(board, x, y, dx, dy);
        ev += 1000 * getFourOnOneLine_w(board, x, y, dx, dy);
        ev += 200 * getAThreeOnOneLine_w(board, x, y, dx, dy);
        ev += 50 * getThreeOnOneLine_w(board, x, y, dx, dy);
        ev += 10 * getATwoOnOneLine_w(board, x, y, dx, dy);
        ev += 2 * getTwoOnOneLine_w(board, x, y, dx, dy);
    }
    return ev;
}
function has_nei(board, x, y, r) {
    for (let i = -r; i <= r; i++) {
        for (let j = -r; j <= r; j++) {
            if ((i == 0 && j == 0) || !(x + i >= 0 && x + i <= 14 && y + j >= 0 && y + j <= 14)) {
                continue;
            }
            if (board[x + i][y + j] != 0) {
                return 1;
            }
        }
    }
    return 0;
}
function onload_ev(board, x, y, dx, dy, color) {
    let delta_bev = 0; let delta_wev = 0;
    for (let i = -5; i <= 5; i++) {
        let nx = x + i * dx;
        let ny = y + i * dy;
        if (!(nx >= 0 && nx <= 14 && ny >= 0 && ny <= 14)) {
            break;
        }
        if (i == 0) {
            if (color == 1) {
                delta_bev += evaluate_dx_dy(board, nx, ny, dx, dy, 1);
            } else if (color == 2) {
                delta_wev += evaluate_dx_dy(board, nx, ny, dx, dy, 2);
            }
            continue;
        }
        let c = board[nx][ny];
        if (c == 0) {
            continue;
        }
        if (c == 1) {
            delta_bev -= evaluate_dx_dy(board, nx, ny, dx, dy, c);
            board[x][y] = color;
            let ev = evaluate_dx_dy(board, nx, ny, dx, dy, c);
            if (ev == 1000000) {
                return [ev, 0]
            } else {
                delta_bev += evaluate_dx_dy(board, nx, ny, dx, dy, c);
            }
        } else if (c == 2) {
            delta_wev -= evaluate_dx_dy(board, nx, ny, dx, dy, c);
            board[x][y] = color;
            let ev = evaluate_one(board, nx, ny, c);
            if (ev == 1000000) {
                return [0, ev]
            } else {
                delta_wev += evaluate_dx_dy(board, nx, ny, dx, dy, c);
            }
        }
        board[x][y] = 0;
    }
    return [delta_bev, delta_wev];
}
function gen_moves(board, color) {
    let moves = [];
    let temp = [];
    for (let x = 0; x < 15; x++) {
        for (let y = 0; y < 15; y++) {
            if (board[x][y] == 0 && !(color == 1 && judgeBan(board, x, y))) {
                if (has_nei(board, x, y, 2)) {
                    let ev_1 = evaluate_one(board, x, y, color);
                    let ev_2 = evaluate_one(board, x, y, 3 - color);
                    if (ev_1 == 1000000) {
                        return [[x, y, ev_1]];
                    }
                    if (ev_2 == 1000000) {
                        temp.push([x, y, ev_1]);
                    }
                    moves.push([x, y, ev_1 + ev_2]);
                }
            }
        }
    }
    if (temp.length > 0) {
        return temp;
    }
    return moves.sort((a, b) => b[2] - a[2]);
}
function evaluate_b_w(bev, wev, color) {
    if (color == 1) {
        if (bev >= 1000000) return 1000000;
        if (wev >= 1000000) return -1000000;
        return bev - wev / 2;
    }
    else if (color == 2) {
        if (bev >= 1000000) return -1000000;
        if (wev >= 1000000) return 1000000;
        return wev - bev / 2;
    }
}
function search(board, maxdepth, depth, alpha, beta, bev, wev, color) {
    let ev = evaluate_b_w(bev, wev, color);
    //console.log([bev, wev], evaluate(board, color))
    if (ev >= 500000) {
        return { ev: 1000000 - maxdepth + depth, path: [] };
    }
    if (ev <= -500000) {
        return { ev: -1000000 + maxdepth - depth, path: [] };
    }
    if (depth == 0) {
        return { ev: ev, path: [] };
    }
    const moves = gen_moves(board, color);
    let maxev = -Infinity;
    let bestPath = [];
    for (const move of moves) {
        d=new Date()
        let delta_ev_1 = onload_ev(board, move[0], move[1], 1, 0, color);
        let delta_ev_2 = onload_ev(board, move[0], move[1], 0, 1, color);
        let delta_ev_3 = onload_ev(board, move[0], move[1], 1, 1, color);
        let delta_ev_4 = onload_ev(board, move[0], move[1], -1, 1, color);
        if (delta_ev_1[0] == 1000000 || delta_ev_2[0] == 1000000 || delta_ev_3[0] == 1000000 || delta_ev_4[0] == 1000000) {
            bev += 1000000;
        }
        else if (delta_ev_1[1] == 1000000 || delta_ev_2[1] == 1000000 || delta_ev_3[1] == 1000000 || delta_ev_4[1] == 1000000) {
            wev += 1000000;
        } else {
            bev += delta_ev_1[0] + delta_ev_2[0] + delta_ev_3[0] + delta_ev_4[0];
            wev += delta_ev_1[1] + delta_ev_2[1] + delta_ev_3[1] + delta_ev_4[1];
        }
        board[move[0]][move[1]] = color;
        let ev_path = search(board, maxdepth, depth - 1, -beta, -alpha, bev, wev, 3 - color);
        let EV = -ev_path.ev;
        let PATH = ev_path.path;
        if (delta_ev_1[0] == 1000000 || delta_ev_2[0] == 1000000 || delta_ev_3[0] == 1000000 || delta_ev_4[0] == 1000000) {
            bev -= 1000000;
        }
        else if (delta_ev_1[1] == 1000000 || delta_ev_2[1] == 1000000 || delta_ev_3[1] == 1000000 || delta_ev_4[1] == 1000000) {
            wev -= 1000000;
        } else {
            bev -= delta_ev_1[0] + delta_ev_2[0] + delta_ev_3[0] + delta_ev_4[0];
            wev -= delta_ev_1[1] + delta_ev_2[1] + delta_ev_3[1] + delta_ev_4[1];
        }
        board[move[0]][move[1]] = 0;
        if (EV > maxev) {
            maxev = EV;
            bestPath = [move, ...PATH];
        }
        if (EV > alpha) {
            alpha = EV;
        }
        if (alpha >= beta) {
            break;
        }
    }
    return { ev: maxev, path: bestPath };
}
let board1 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
//console.log(onload_ev(board1, 8, 7, 0, 1, 1))
//console.log(evaluate(board1, 1))