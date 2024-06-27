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

	this.setCurrGame = function (curr) {
		window.location.hash = '#' + curr;
		this.currgame = curr;
	};
	boardobj.Boardview.bind("contextmenu", function () { return false; });
	this.next = function () {
		if (boardobj.endgame != boardobj.currgame) {
			let nextstep = boardobj.endgame.substr(boardobj.currgame.length, 2);
			let nextstepcell = boardobj.Boardview.find('.' + nextstep);
			nextstepcell.removeClass('blank').addClass(boardobj.currcolor).html(boardobj.currstep++);
			boardobj.currcolor = (boardobj.currcolor == 'black' ? 'white' : 'black');
			boardobj.setCurrGame(boardobj.currgame + nextstep);
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
			boardobj.setCurrGame(boardobj.currgame.substr(0, boardobj.currgame.length - 2));
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
		boardobj.setCurrGame('');
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
		const game = new Gomoku();
		let a;
		let b;
		for (let i = 0; i < boardobj.currgame.length; i += 2) {
			if (boardobj.currgame[i] >= 'a' && boardobj.currgame[i] <= 'f') {
				a = boardobj.currgame[i].charCodeAt(0) - 'a'.charCodeAt(0) + 9;
			} else {
				a = boardobj.currgame[i] - 1;
			}
			if (boardobj.currgame[i + 1] >= 'a' && boardobj.currgame[i + 1] <= 'f') {
				b = boardobj.currgame[i + 1].charCodeAt(0) - 'a'.charCodeAt(0) + 9;
			} else {
				b = boardobj.currgame[i + 1] - 1;
			}
			game.placePiece(a, b, i % 4 == 0 ? 1 : -1);
		}
		let res = game.negamax(6,6, boardobj.currgame.length % 4 == 0 ? 1 : -1, -Infinity, Infinity);
		$("#myTable tr:eq(0)").text(`局面评分: ${res.score}`);
		$("#myTable tr:eq(1)").text(`最佳路线: ${path_t(res.path)}`);
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
		boardobj.setCurrGame(boardobj.currgame + $(this).attr('alt'));
		boardobj.endgame = boardobj.currgame;
		return true;
	});
	this.init();
};
function path_t(array) {
	let str = ''
	for (let i of array) {
		str += String.fromCharCode(i.x + 65) + (i.y + 1) + ' ';
	}
	return str;
}