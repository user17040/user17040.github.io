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
		console.log("board: " + curr);
		window.location.hash = '#' + curr;
		this.currgame = curr;
	};
	boardobj.Boardview.bind("contextmenu", function () { return false; });
	//根据endgame的记录，落下后面一手棋
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
	//前一手
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
	//回到第一手
	this.clean = function () {
		while (boardobj.pre());
	};
	//到最后一手
	this.end = function () {
		while (boardobj.next());
	};

	//根据gameinit显示整盘棋
	this.init = function () {
		boardobj.endgame = boardobj.gameinit;
		boardobj.setCurrGame('');
		boardobj.currcolor = 'black';
		boardobj.currstep = 1;
		boardobj.Boardview.find('.row div').removeClass('black white').addClass('blank').html('');
		boardobj.end();
	};
	//生成棋盘
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
	


	this.solve_f = function () {
		let rows = 15;
		let cols = 15;
		let array = Array.from({ length: rows }, () => Array(cols).fill(0));
		
		// 解析字符串并填入数组
		for (let i = 0; i < boardobj.currgame.length; i += 2) {
			let n1 = boardobj.currgame[i];
			let n2 = boardobj.currgame[i + 1];
			// 填入数组
			array[!isNaN(n1) ? Number(n1)-1 : n1.charCodeAt(0) - "a".charCodeAt(0) + 9][!isNaN(n2) ? Number(n2)-1 : n2.charCodeAt(0) - 'a'.charCodeAt(0) + 9] = i % 4 == 0 ? 1 : 2;
		}
		let time=new Date();
		let d=1;
		function searchAndUpdate() {
			let c=boardobj.currcolor === "black" ? 1 : 2;
			let e=evaluate(array,c);
			let r = search(array, d, d, -Infinity, Infinity, e[0],e[1],c);
			$("#myTable tr:eq(0)").text("最佳棋步路线：" + convertCoordinates(r.path));
			$("#myTable tr:eq(1)").text("最佳棋步分数：" + r.ev.toFixed(1));
			$("#myTable tr:eq(2)").text("搜索深度：" + d);
			$("#myTable tr:eq(3)").text("搜索时间：" + (new Date() - time));

			if (new Date() - time <= 200) {
				d++;
				setTimeout(searchAndUpdate, 1); // 递归调用以继续搜索
			}
		}
		setTimeout(searchAndUpdate, 1);
		
}
		



	//生成控制按钮
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
	solve.attr('type', 'button').val('计算').click(boardobj.solve_f).appendTo(controlbar);
	boardobj.Boardview.find('.row div').click(function () {
		console.log("position: " + $(this).attr('alt'));
		//落子
		if (!$(this).hasClass('blank')) {
			return false;
		}
		$(this).removeClass('blank').addClass(boardobj.currcolor).html(boardobj.currstep++);
		boardobj.currcolor = (boardobj.currcolor == 'black' ? 'white' : 'black');
		boardobj.setCurrGame(boardobj.currgame + $(this).attr('alt'));
		boardobj.endgame = boardobj.currgame;
		return true;
	});
	//恢复棋盘。
	this.init();
};