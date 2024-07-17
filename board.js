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
	this.search = function () {
		document.getElementById('info').value = '';
		// 计算黑方得分率
		let blackWins = 0;
		let draws = 0;
		let whiteWins = 0;
		// 循环遍历每个 <game> 元素
		for (let i = 0; i < games.length; i++) {
			let pa = -1;
			let game = games[i];
			// 获取当前 <game> 的 move 文本内容
			let moveText = game.querySelector('move').textContent.trim();

			// 将 move 文本内容按空格分割成数组
			let moves = moveText.split(' ');

			// 转换 move 数组中的每个位置
			let convertedMoves = moves.map(function (move) {
				return convertMoveToHex(move);
			});

			// 取前 boardobj.currgame.length 位与 boardobj.currgame 比较
			let firstChars = convertedMoves.join('').substring(0, boardobj.currgame.length);

			// 如果相等则输出当前 game 的 id
			if (firstChars === boardobj.currgame) {
				pa = 0;
			} else if (interleaveSort(firstChars) === interleaveSort(trans1(boardobj.currgame))) {
				pa = 1;
			} else if (interleaveSort(firstChars) === interleaveSort(trans2(boardobj.currgame))) {
				pa = 2;
			} else if (interleaveSort(firstChars) === interleaveSort(trans3(boardobj.currgame))) {
				pa = 3;
			} else if (interleaveSort(firstChars) === interleaveSort(trans4(boardobj.currgame))) {
				pa = 4;
			} else if (interleaveSort(firstChars) === interleaveSort(trans1(trans4(boardobj.currgame)))) {
				pa = 5;
			} else if (interleaveSort(firstChars) === interleaveSort(trans2(trans4(boardobj.currgame)))) {
				pa = 6;
			} else if (interleaveSort(firstChars) === interleaveSort(trans3(trans4(boardobj.currgame)))) {
				pa = 7;
			}
			else {
				continue;
			}
			var blackPlayerId = game.getAttribute('black');
			var whitePlayerId = game.getAttribute('white');
			var tournamentId = game.getAttribute('tournament');
			let bresult = parseFloat(game.getAttribute('bresult'));
			var blackPlayer = playersMap[blackPlayerId];
			var whitePlayer = playersMap[whitePlayerId];
			// 获取比赛信息
			var tournamentInfo = tournamentMap[tournamentId];
			document.getElementById('info').value = `赛事: ${tournamentInfo.name} 时间: ${tournamentInfo.start} 至 ${tournamentInfo.end}\n`+ document.getElementById('info').value;
			if (bresult === 1) {
				blackWins++;
				document.getElementById('info').value = `${blackPlayer.name} (黑胜) 对 ${whitePlayer.name} (白)\n`+ document.getElementById('info').value;
			} else if (bresult === 0.5) {
				draws++;
				document.getElementById('info').value = `${blackPlayer.name} (黑平) 对 ${whitePlayer.name} (白平)\n`+ document.getElementById('info').value;
			} else if (bresult === 0) {
				whiteWins++;
				document.getElementById('info').value = `${blackPlayer.name} (黑) 对 ${whitePlayer.name} (白胜)\n`+ document.getElementById('info').value;
			}
			document.getElementById('info').value = '----------------\n' + document.getElementById('info').value;
		}
		// 计算得分率
		let totalGames = blackWins + draws + whiteWins;
		let blackWinRate = blackWins / totalGames;
		let blackRate = (blackWins + draws * 0.5) / totalGames;
		let drawRate = draws / totalGames;
		let whiteWinRate = whiteWins / totalGames;
		let whiteRate = (whiteWins + draws * 0.5) / totalGames;
		document.getElementById('info').value = '白得分率: ' + (whiteRate).toFixed(3) + '\n' + document.getElementById('info').value;
		document.getElementById('info').value = '黑得分率: ' + (blackRate).toFixed(3) + '\n' + document.getElementById('info').value;
		document.getElementById('info').value = '白胜: ' + whiteWins + ' (' + (whiteWinRate * 100).toFixed(1) + '%)\n' + document.getElementById('info').value;
		document.getElementById('info').value = '和棋: ' + draws + ' (' + (drawRate * 100).toFixed(1) + '%)\n' + document.getElementById('info').value;
		document.getElementById('info').value = '黑胜: ' + blackWins + ' (' + (blackWinRate * 100).toFixed(1) + '%)\n' + document.getElementById('info').value;
		document.getElementById('info').value = '总对局数: ' + totalGames + '\n' + document.getElementById('info').value;
	}
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

	let controlbar = $(document.createElement("div"));
	controlbar.addClass('controlbar');
	boardobj.Boardview.after(controlbar);
	let nextbtn = $(document.createElement("input"));
	let pre = $(document.createElement("input"));
	let end = $(document.createElement("input"));
	let init = $(document.createElement("input"));
	let first = $(document.createElement("input"));
	let search = $(document.createElement("input"));
	first.attr('type', 'button').val('|<<第一手').click(boardobj.clean).appendTo(controlbar);
	pre.attr('type', 'button').val('<前一手').click(boardobj.pre).appendTo(controlbar);
	nextbtn.attr('type', 'button').val('后一手>').click(boardobj.next).appendTo(controlbar);
	end.attr('type', 'button').val('最后>>|').click(boardobj.end).appendTo(controlbar);
	init.attr('type', 'button').val('恢复').click(boardobj.init).appendTo(controlbar);
	search.attr('type', 'button').val('查谱').click(boardobj.search).appendTo(controlbar);
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