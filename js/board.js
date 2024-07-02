/**
 * @author xsir317@gmail.com
 * @license http://creativecommons.org/licenses/by-sa/3.0/deed.zh
 */
let board = function (div, gameinit) {
    let boardobj = this;
    this.gameinit = (typeof gameinit == 'string') ? gameinit : div.attr('game');
    this.currgame = '';
    this.endgame = '';
    this.currcolor = 'black';
    this.currstep = 1;
    boardobj.Boardview = div;
    boardobj.Boardview.html('');
    boardobj.Boardview.mousedown(function (e) {
        if (e.which == 3) {
            boardobj.pre();
            return false;
        }
    });
    this.setCurrGame = function (curr,check) {
        console.log("board: " + curr);
        window.location.hash = '#' + curr;
        this.currgame = curr;
        if(check){
            if (boardobj.currcolor === 'black' && document.getElementById('modeButton').textContent === '自动走黑') this.solve();
            if (boardobj.currcolor === 'white' && document.getElementById('modeButton').textContent === '自动走白') this.solve();
    
        }
       
    };
    boardobj.Boardview.bind("contextmenu", function () { return false; });
    this.next = function () {
        if (boardobj.endgame != boardobj.currgame) {
            let nextstep = boardobj.endgame.substr(boardobj.currgame.length, 2);
            let nextstepcell = boardobj.Boardview.find('.' + nextstep);
            nextstepcell.removeClass('blank').addClass(boardobj.currcolor).html(boardobj.currstep++);
            boardobj.currcolor = (boardobj.currcolor == 'black' ? 'white' : 'black');
            boardobj.setCurrGame(boardobj.currgame + nextstep,true);
            return true;
        }
        else {
            return false;
        }
    };
    this.pre = function () {
        if (boardobj.currgame != '') {
            let currstep = boardobj.currgame.substr(boardobj.currgame.length - 2, 2);
            let currstepcell = boardobj.Boardview.find('.' + currstep);
            currstepcell.removeClass('black white').addClass('blank').html('');
            boardobj.currcolor = (boardobj.currcolor == 'black' ? 'white' : 'black');
            boardobj.setCurrGame(boardobj.currgame.substr(0, boardobj.currgame.length - 2),false);
            boardobj.currstep--;
            return true;
        }
        else {
            return false;
        }
    };
    this.clean = function () {
        while (boardobj.pre());
    };
    this.end = function () {
        while (boardobj.next());

    };

    this.init = function () {
        boardobj.endgame = boardobj.gameinit;
        boardobj.setCurrGame('',false);
        boardobj.currcolor = 'black';
        boardobj.currstep = 1;
        boardobj.Boardview.find('.row div').removeClass('black white').addClass('blank').html('');
        boardobj.end();
    };
    for (let i = 15; i > 0; i--) {
        //insert a row
        let newrow = $(document.createElement("div"));
        newrow.addClass('row');
        boardobj.Boardview.append(newrow);
        for (let j = 1; j <= 15; j++) {
            //insert a cross point
            let newcell = $(document.createElement("div"));
            newcell.addClass(j.toString(16) + i.toString(16));
            newcell.attr('alt', j.toString(16) + i.toString(16));
            newcell.addClass('blank');
            newrow.append(newcell);
        }
    }
    this.solve = function () {
        document.getElementById('info').value = '----------------\n' + document.getElementById('info').value;
        const board = new Board(15);
        let map = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, 'a': 9, 'b': 10, 'c': 11, 'd': 12, 'e': 13, 'f': 14 }
        // 解析字符串并填入数组
        for (let i = 0; i < boardobj.currgame.length; i += 2) {
            let n1 = map[boardobj.currgame[i]];
            let n2 = map[boardobj.currgame[i + 1]];
            board.put(n1, n2, i % 4 === 0 ? 1 : -1);
        }
        minmax(board, boardobj.currcolor === 'black' ? 1 : -1, 2000).then(res => {
            boardobj.endgame = boardobj.currgame + t(res[1][0]);
            boardobj.next();
        });
    }
    let controlbar = $(document.createElement("div"));
    controlbar.addClass('controlbar');
    boardobj.Boardview.after(controlbar);
    let nextbtn = $(document.createElement("input"));
    let pre = $(document.createElement("input"));
    let end = $(document.createElement("input"));
    let init = $(document.createElement("input"));
    let first = $(document.createElement("input"));
    let solve = $(document.createElement("input"));
    first.attr('type', 'button').val('|<<第一手').click(boardobj.clean).appendTo(controlbar);
    pre.attr('type', 'button').val('<前一手').click(boardobj.pre).appendTo(controlbar);
    nextbtn.attr('type', 'button').val('后一手>').click(boardobj.next).appendTo(controlbar);
    end.attr('type', 'button').val('最后>>|').click(boardobj.end).appendTo(controlbar);
    init.attr('type', 'button').val('恢复').click(boardobj.init).appendTo(controlbar);
    solve.attr('type', 'button').val('计算').click(boardobj.solve).appendTo(controlbar);
    boardobj.Boardview.find('.row div').click(function () {
        console.log("position: " + $(this).attr('alt'));
        if (!$(this).hasClass('blank')) {
            return false;
        }
        $(this).removeClass('blank').addClass(boardobj.currcolor).html(boardobj.currstep++);
        boardobj.currcolor = (boardobj.currcolor == 'black' ? 'white' : 'black');
        boardobj.setCurrGame(boardobj.currgame + $(this).attr('alt'),true);
        boardobj.endgame = boardobj.currgame;
        return true;
    });
    this.init();
};
function numToLetter(num) {
    return String.fromCharCode(num + 65); // 将数字转换为对应的字母（A=1, B=2, ..., Z=26）
}

function convertCoordinate(coordinate) {
    const [col, row] = coordinate;
    return numToLetter(col) + (row + 1);
}

function convertCoordinates(coordinates) {
    return coordinates.map(convertCoordinate).join(' ');
}

function t(i) {
    return (i[0] + 1).toString(16) + (i[1] + 1).toString(16);
}