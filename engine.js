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
    if (len > 5) return true;

    len = 1;
    for (let i = y - 1; i >= 0; i--) {
        if (board[x][i] == 1) len += 1;
        else break;
    }
    for (let i = x + 1; i <= 14; i++) {
        if (board[x][i] == 1) len += 1;
        else break;
    }
    if (len > 5) return true;

    len = 1;
    for (let i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] == 1) len += 1;
        else break;
    }
    for (let i = x + 1, j = y + 1; i <= 14 && j <= 14; i++, j++) {
        if (board[i][j] == 1) len += 1;
        else break;
    }
    if (len > 5) return true;

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
    if (len == 5) return true;

    len = 1;
    for (let i = y - 1; i >= 0; i--) {
        if (board[x][i] == 1) len += 1;
        else break;
    }
    for (let i = y + 1; i <= 14; i++) {
        if (board[x][i] == 1) len += 1;
        else break;
    }
    if (len == 5) return true;

    len = 1;
    for (let i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] == 1) len += 1;
        else break;
    }
    for (let i = x + 1, j = y + 1; i <= 14 && j <= 14; i++, j++) {
        if (board[i][j] == 1) len += 1;
        else break;
    }
    if (len == 5) return true;

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
    if (len > 4) return true;

    len = 1;
    for (let i = y - 1; i >= 0; i--) {
        if (board[x][i] == 2) len += 1;
        else break;
    }
    for (let i = y + 1; i <= 14; i++) {
        if (board[x][i] == 2) len += 1;
        else break;
    }
    if (len > 4) return true;

    len = 1;
    for (let i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] == 2) len += 1;
        else break;
    }
    for (let i = x + 1, j = y + 1; i <= 14 && j <= 14; i++, j++) {
        if (board[i][j] == 2) len += 1;
        else break;
    }
    if (len > 4) return true;

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
    let flag = false;
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
            flag = true;
        }
    }
    flag = false;
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
            flag = true;
        }
    }
    if (middle == 4) return before == 0 && after == 0;
    return false;
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
    return false;
}
function getFourOnOneLine(board, x, y, dx, dy) {
    let before = 0;
    let middle = 1;
    let after = 0;
    let flag = false;
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
            flag = true;
        }
    }
    flag = false;
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
            flag = true;
        }
    }
    if (middle === 4) return before === 0 || after === 0 ? 1 : 0;
    return (before > 0 && before + middle == 4 ? 1 : 0) + (after > 0 && middle + after == 4 ? 1 : 0);
}
function getFourOnOneLine_w(board, x, y, dx, dy) {
    let before = 0;
    let middle = 1;
    let after = 0;
    let flag = false;
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
            flag = true;
        }
    }
    flag = false;
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
            flag = true;
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
            return judgeBan(board, x + dx * (4 - deltaMiddle), y + dy * (4 - deltaMiddle)) ? 0 : 1;
        }
        if (afterAfter == -1) {
            if (beforeBefore > 0) return 0;
            return judgeBan(board, x - dx * deltaMiddle, y - dy * deltaMiddle) ? 0 : 1;
        }
        if (beforeBefore > 0 && afterAfter > 0) return 0;
        const a = judgeBan(board, x - dx * deltaMiddle, y - dy * deltaMiddle);
        const b = judgeBan(board, x + dx * (4 - deltaMiddle), y + dy * (4 - deltaMiddle));
        return a && b ? 0 : 1;
    }
    if (middle == 2) {
        if (before == 1 && after == 0) {
            if (beforeBefore == -1) return 0;
            return judgeBan(board, x - dx * deltaMiddle, y - dy * deltaMiddle) ? 0 : 1;
        }
        if (before == 0 && after == 1) {
            if (afterAfter == -1) return 0;
            return judgeBan(board, x + dx * (3 - deltaMiddle), y + dy * (3 - deltaMiddle)) ? 0 : 1;
        }
        return 0;
    }
    if (middle == 1) {
        if (before == 2 && after == 0) {
            if (beforeBefore == -1) return 0;
            return judgeBan(board, x - dx, y - dy) ? 0 : 1;
        }
        if (before == 0 && after == 2) {
            if (afterAfter == -1) return 0;
            return judgeBan(board, x + dx, y + dy) ? 0 : 1;
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
        return 1;
    }
    if (middle == 2) {
        if (before == 1 && after == 0) {
            return 1;
        }
        if (before == 0 && after == 1) {
            return 1;
        }
        return 0;
    }
    if (middle == 1) {
        if (before == 2 && after == 0) {
            return 1;
        }
        if (before == 0 && after == 2) {
            return 1;
        }
        return 0;
    }

}

function getThreeOnOneLine(board, x, y, dx, dy) {
    let cnt = 0;
    for (let i = x - dx, j = y - dy; cnt < 5; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 2) {
            break;
        }
        if (board[i][j] == 0) {
            if (getFourOnOneLine(board, i, j, dx, dy)) {
                return true;
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
                return true;
            }
        }
        cnt++;
    }
    return false;

}
function getThreeOnOneLine_w(board, x, y, dx, dy) {
    let cnt = 0;
    for (let i = x - dx, j = y - dy; cnt < 5; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 1) {
            break;
        }
        if (board[i][j] == 0) {
            if (getFourOnOneLine_w(board, i, j, dx, dy)) {
                return true;
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
                return true;
            }
        }
        cnt++;
    }
    return false;

}
function getATwoOnOneLine(board, x, y, dx, dy) {
    let cnt = 0;
    for (let i = x - dx, j = y - dy; cnt < 5; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 2) {
            break;
        }
        if (board[i][j] == 0) {
            if (getAThreeOnOneLine(board, i, j, dx, dy)) {
                return true;
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
            if (getAThreeOnOneLine(board, i, j, dx, dy)) {
                return true;
            }
        }
        cnt++;
    }
    return false;

}
function getATwoOnOneLine_w(board, x, y, dx, dy) {
    let cnt = 0;
    for (let i = x - dx, j = y - dy; cnt < 5; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 1) {
            break;
        }
        if (board[i][j] == 0) {
            if (getAThreeOnOneLine_w(board, i, j, dx, dy)) {
                return true;
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
            if (getAThreeOnOneLine_w(board, i, j, dx, dy)) {
                return true;
            }
        }
        cnt++;
    }
    return false;

}
function getTwoOnOneLine(board, x, y, dx, dy) {
    let cnt = 0;
    for (let i = x - dx, j = y - dy; cnt < 5; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 2) {
            break;
        }
        if (board[i][j] == 0) {
            if (getThreeOnOneLine(board, i, j, dx, dy)) {
                return true;
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
                return true;
            }
        }
        cnt++;
    }
    return false;

}
function getTwoOnOneLine_w(board, x, y, dx, dy) {
    let cnt = 0;
    for (let i = x - dx, j = y - dy; cnt < 5; i -= dx, j -= dy) {
        if (!(i >= 0 && i <= 14 && j >= 0 && j <= 14) || board[i][j] == 1) {
            break;
        }
        if (board[i][j] == 0) {
            if (getThreeOnOneLine_w(board, i, j, dx, dy)) {
                return true;
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
                return true;
            }
        }
        cnt++;
    }
    return false;

}
function evaluate(board, color) {
    let ev = 0;
    for (let x = 0; x < 15; x++) {
        for (let y = 0; y < 15; y++) {
            if (board[x][y] == 1) {
                if (getFive(board, x, y)) {
                    return color == 1 ? 50000 : -50000;
                }
                if (getAFourOnOneLine(board, x, y, 1, 0) || getAFourOnOneLine(board, x, y, 0, 1) || getAFourOnOneLine(board, x, y, -1, 1) || getAFourOnOneLine(board, x, y, 1, 1)) {
                    if (color == 1) {
                        return 45000;
                    }
                    ev -= 2500;
                } else {
                    const fourCount = getFourOnOneLine(board, x, y, 1, 0) + getFourOnOneLine(board, x, y, 0, 1) + getFourOnOneLine(board, x, y, -1, 1) + getFourOnOneLine(board, x, y, 1, 1);
                    if (color == 1 && fourCount > 0) {
                        return 45000;
                    }
                    if (fourCount > 1) {
                        ev -= 2500;
                    } else if (fourCount > 0) {
                        ev -= 500;
                    }
                }
                const threeCount = getAThreeOnOneLine(board, x, y, 1, 0) + getAThreeOnOneLine(board, x, y, 0, 1) + getAThreeOnOneLine(board, x, y, -1, 1) + getAThreeOnOneLine(board, x, y, 1, 1);
                if (threeCount > 1) {
                    color == 1 ? ev += 1000 : ev -= 500;
                } else if (threeCount > 0) {
                    color == 1 ? ev += 200 : ev -= 100;
                } else if (getThreeOnOneLine(board, x, y, 1, 0) || getThreeOnOneLine(board, x, y, 0, 1) || getThreeOnOneLine(board, x, y, -1, 1) || getThreeOnOneLine(board, x, y, 1, 1)) {
                    color == 1 ? ev += 50 : ev -= 25;
                }
                const twoCount = getATwoOnOneLine(board, x, y, 1, 0) + getATwoOnOneLine(board, x, y, 0, 1) + getATwoOnOneLine(board, x, y, -1, 1) + getATwoOnOneLine(board, x, y, 1, 1);
                if (twoCount > 0) {
                    color == 1 ? ev += 10 : ev -= 5;
                } else if (getTwoOnOneLine(board, x, y, 1, 0) || getTwoOnOneLine(board, x, y, 0, 1) || getTwoOnOneLine(board, x, y, -1, 1) || getTwoOnOneLine(board, x, y, 1, 1)) {
                    color == 1 ? ev += 2 : ev -= 1;
                }
            }
            else if (board[x][y] == 2) {
                if (getFive_w(board, x, y)) {
                    return color == 2 ? 50000 : -50000;
                }
                if (getAFourOnOneLine_w(board, x, y, 1, 0) || getAFourOnOneLine_w(board, x, y, 0, 1) || getAFourOnOneLine_w(board, x, y, -1, 1) || getAFourOnOneLine_w(board, x, y, 1, 1)) {
                    if (color == 2) {
                        return 45000;
                    }
                    ev -= 2500;
                } else {
                    const fourCount = getFourOnOneLine_w(board, x, y, 1, 0) + getFourOnOneLine_w(board, x, y, 0, 1) + getFourOnOneLine_w(board, x, y, -1, 1) + getFourOnOneLine_w(board, x, y, 1, 1);
                    if (color == 2 && fourCount > 0) {
                        return 45000;
                    }
                    if (fourCount > 1) {
                        ev -= 2500;
                    } else if (fourCount > 0) {
                        ev -= 500;
                    }
                }
                const threeCount = getAThreeOnOneLine_w(board, x, y, 1, 0) + getAThreeOnOneLine_w(board, x, y, 0, 1) + getAThreeOnOneLine_w(board, x, y, -1, 1) + getAThreeOnOneLine_w(board, x, y, 1, 1);
                if (threeCount > 1) {
                    color == 2 ? ev += 1000 : ev -= 500;
                } else if (threeCount > 0) {
                    color == 2 ? ev += 200 : ev -= 100;
                } else if (getThreeOnOneLine_w(board, x, y, 1, 0) || getThreeOnOneLine_w(board, x, y, 0, 1) || getThreeOnOneLine_w(board, x, y, -1, 1) || getThreeOnOneLine_w(board, x, y, 1, 1)) {
                    color == 2 ? ev += 50 : ev -= 25;
                }
                const twoCount = getATwoOnOneLine_w(board, x, y, 1, 0) + getATwoOnOneLine_w(board, x, y, 0, 1) + getATwoOnOneLine_w(board, x, y, -1, 1) + getATwoOnOneLine_w(board, x, y, 1, 1);
                if (twoCount > 0) {
                    color == 2 ? ev += 10 : ev -= 5;
                } else if (getTwoOnOneLine_w(board, x, y, 1, 0) || getTwoOnOneLine_w(board, x, y, 0, 1) || getTwoOnOneLine_w(board, x, y, -1, 1) || getTwoOnOneLine_w(board, x, y, 1, 1)) {
                    color == 2 ? ev += 2 : ev -= 1;
                }
            }
        }
    }
    return Math.min(ev, 40000);

}
function evaluate_one(board, x, y, color) {
    let ev = 0;
    if (color == 1) {
        if (getFive(board, x, y)) {
            return 50000;
        }
        if (getAFourOnOneLine(board, x, y, 1, 0) || getAFourOnOneLine(board, x, y, 0, 1) || getAFourOnOneLine(board, x, y, -1, 1) || getAFourOnOneLine(board, x, y, 1, 1)) {
            if (color == 1) {
                return 45000;
            }
            ev -= 2500;
        } else {
            const fourCount = getFourOnOneLine(board, x, y, 1, 0) + getFourOnOneLine(board, x, y, 0, 1) + getFourOnOneLine(board, x, y, -1, 1) + getFourOnOneLine(board, x, y, 1, 1);
            if (color == 1 && fourCount > 0) {
                return 45000;
            }
            if (fourCount > 1) {
                ev -= 2500;
            } else if (fourCount > 0) {
                ev -= 500;
            }
        }
        const threeCount = getAThreeOnOneLine(board, x, y, 1, 0) + getAThreeOnOneLine(board, x, y, 0, 1) + getAThreeOnOneLine(board, x, y, -1, 1) + getAThreeOnOneLine(board, x, y, 1, 1);
        if (threeCount > 1) {
            ev += 1000;
        } else if (threeCount > 0) {
            ev += 200;
        } else if (getThreeOnOneLine(board, x, y, 1, 0) || getThreeOnOneLine(board, x, y, 0, 1) || getThreeOnOneLine(board, x, y, -1, 1) || getThreeOnOneLine(board, x, y, 1, 1)) {
            ev += 50;
        }
        const twoCount = getATwoOnOneLine(board, x, y, 1, 0) + getATwoOnOneLine(board, x, y, 0, 1) + getATwoOnOneLine(board, x, y, -1, 1) + getATwoOnOneLine(board, x, y, 1, 1);
        if (twoCount > 0) {
            ev += 10;
        } else if (getTwoOnOneLine(board, x, y, 1, 0) || getTwoOnOneLine(board, x, y, 0, 1) || getTwoOnOneLine(board, x, y, -1, 1) || getTwoOnOneLine(board, x, y, 1, 1)) {
            ev += 2;
        }
    }
    else if (color == 2) {
        if (getFive_w(board, x, y)) {
            return 50000;
        }
        if (getAFourOnOneLine_w(board, x, y, 1, 0) || getAFourOnOneLine_w(board, x, y, 0, 1) || getAFourOnOneLine_w(board, x, y, -1, 1) || getAFourOnOneLine_w(board, x, y, 1, 1)) {
            if (color == 2) {
                return 45000;
            }
            ev -= 2500;
        } else {
            const fourCount = getFourOnOneLine_w(board, x, y, 1, 0) + getFourOnOneLine_w(board, x, y, 0, 1) + getFourOnOneLine_w(board, x, y, -1, 1) + getFourOnOneLine_w(board, x, y, 1, 1);
            if (color == 2 && fourCount > 0) {
                return 45000;
            }
            if (fourCount > 1) {
                ev -= 2500;
            } else if (fourCount > 0) {
                ev -= 500;
            }
        }
        const threeCount = getAThreeOnOneLine_w(board, x, y, 1, 0) + getAThreeOnOneLine_w(board, x, y, 0, 1) + getAThreeOnOneLine_w(board, x, y, -1, 1) + getAThreeOnOneLine_w(board, x, y, 1, 1);
        if (threeCount > 1) {
            ev += 1000;
        } else if (threeCount > 0) {
            ev += 200;
        } else if (getThreeOnOneLine_w(board, x, y, 1, 0) || getThreeOnOneLine_w(board, x, y, 0, 1) || getThreeOnOneLine_w(board, x, y, -1, 1) || getThreeOnOneLine_w(board, x, y, 1, 1)) {
            ev += 50;
        }
        const twoCount = getATwoOnOneLine_w(board, x, y, 1, 0) + getATwoOnOneLine_w(board, x, y, 0, 1) + getATwoOnOneLine_w(board, x, y, -1, 1) + getATwoOnOneLine_w(board, x, y, 1, 1);
        if (twoCount > 0) {
            ev += 10;
        } else if (getTwoOnOneLine_w(board, x, y, 1, 0) || getTwoOnOneLine_w(board, x, y, 0, 1) || getTwoOnOneLine_w(board, x, y, -1, 1) || getTwoOnOneLine_w(board, x, y, 1, 1)) {
            ev += 2;
        }
    }
    return Math.min(ev, 40000);

}
function has_nei(board, x, y, r) {
    for (let i = -r; i <= r; i++) {
        for (let j = -r; j <= r; j++) {
            if ((i == 0 && j == 0) || !(x + i >= 0 && x + i <= 14 && y + j >= 0 && y + j <= 14)) {
                continue;
            }
            if (board[x + i][y + j] != 0) {
                return true;
            }
        }
    }
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
                    if (ev_1 == 50000) {
                        return [[x, y, ev_1]];
                    }
                    if (ev_2 == 50000) {
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
function search(board, maxdepth, depth, alpha, beta, color) {
    let ev = evaluate(board, color);
    if (ev == 50000) {
        return { ev: 50000 - maxdepth + depth, path: [] };
    }
    if (ev == -50000) {
        return { ev: -50000 + maxdepth - depth, path: [] };
    }
    if (depth == 0) {
        return { ev: ev, path: [] };
    }
    const moves = gen_moves(board, color);
    let maxev = -Infinity;
    let bestPath = [];
    for (const move of moves) {
        board[move[0]][move[1]] = color;
        let ev_path = search(board, maxdepth, depth - 1, -beta, -alpha, 3 - color);
        let ev = -ev_path.ev;
        let path = ev_path.path;
        board[move[0]][move[1]] = 0;
        if (ev > maxev) {
            maxev = ev;
            bestPath = [move, ...path];
        }
        if (ev > alpha) {
            alpha = ev;
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
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]