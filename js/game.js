'strict'
var MINE = '💣';
var Flag = '🚩';
var gElsmile = document.querySelector('.gsmiley');

// var MINE = '<img src="img/mini.png">';
//MODEL
var gGame;



var gBoard;
var gLevel;
var gisShow = false;
var gIntervalTime;
var gEmptyCells;

function init(level) {
    gGame = {
        isStart: false,
        isFlagged: false,
        flagCount: 0,
        cellshowed: 0
    }
    gLevel = { size: 0, mines: 0 };
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none';

    switch (level) {

        case 4:
            gLevel = { size: 4, mines: 2 };
            gBoard = createModelBorad(gLevel.size, gLevel.mines);
            console.table(gBoard);
            renderGameStart();
            renderBoard(gBoard);
            break;
        case 8:

            gLevel = { size: 8, mines: 12 };
            gBoard = createModelBorad(gLevel.size, gLevel.mines);
            console.table(gBoard);
            renderBoard(gBoard);
            renderGameStart();
            break;
        case 12:
            gLevel = { size: 12, mines: 30 };
            gBoard = createModelBorad(gLevel.size, gLevel.mines);
            renderBoard(gBoard);
            renderGameStart();
            break;
    }


}



function createModelBorad(size, minesCount) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                i: i,
                j: j,
                isShow: false,
                isMine: false,
                isFlagged: false,
                isMined: false,
                numNeig: 0
            }
        }
    }
    board = randomMines(board, minesCount);
    board = runGeneration(board);
    return board;


}

function randomMines(board, minesCount) {
    for (var i = 0; i < minesCount; i++) {
        // console.log(i);
        var iRandom = getRandomInt(0, board.length);
        var jRandom = getRandomInt(0, board.length);
        board[iRandom][jRandom].isMine = true
    }
    return board;
}



function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var cellClass = '';
            var cellContent = '';

            cellClass = (cell.isShow) ? 'show-cell' : '';
            if (cell.isMine) {
                cellContent = MINE;
            } else if (cell.numNeig) {
                cellContent = cell.numNeig;
            }
            if (cell.isMined) {
                cellClass += ' lose';
            }
            if (cell.isFlagged && gGame.isStart) cellContent = Flag;
            strHTML += `
            <td class="cell${cellClass}" data-i="${i}" data-j="${j}" oncontextmenu="flagCell(${i},${j},event,this)" onclick="cellClicked( ${i}, ${j},this)" >`
            strHTML += cell.isShow ? '' : `<div class="hide-cell">`;
            strHTML += cellContent;
            strHTML += `</div></td>\n`



        }
        strHTML += '</tr>'
    }


    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function cellClicked( i, j,elCell) {
    if (!gGame.isStart) {
        gGame.isStart = true
        gIntervalTime = setInterval(countTimer, 100);
    }

    var targetCell = gBoard[i][j];
    if (targetCell.numNeig !== 0 && !targetCell.isShow) {
        // showCell( i, j,elCell);
        targetCell.isShow=true;
        gGame.cellshowed++;
        renderBoard(gBoard);
        renderGameStart();
        checkVictory();
        return;

    } else if (!targetCell.isShow) {
        targetCell.isShow = true;
        gGame.cellshowed++;
        renderBoard(gBoard);
        renderGameStart();
        checkVictory();
        

    }


    if (targetCell.isMine) {
        new Audio('bomb.mp3.mpeg').play();
        targetCell.isMined = true;
        showMines(elCell, targetCell);
        gameOver();
    }

    var cellsNeig=(checkCellArea(i,j));
        for(var i=0;i<cellsNeig.numCells.length;i++){
           var coords=cellsNeig.numCells[i];
           if(!gBoard[coords.i][coords.j].isShow){
            gBoard[coords.i][coords.j].isShow=true;
            gGame.cellshowed++;
           }

        }

        while(cellsNeig.emptyCells.length){
            var currCell=cellsNeig.emptyCells.pop();
            console.log(currCell);
            cellClicked(currCell.i,currCell.j);
        }
        renderBoard(gBoard);
        renderGameStart();
        checkVictory();
    




}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;

}

function showMines(gameOverCell) {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (gameOverCell === cell) continue;
            if (cell.isMine) {
                cell.isShow = true;

            }
        }
    }
    renderBoard(gBoard);
}


function showCell( i, j,elCell) {
    var cell = gBoard[i][j];
    if (cell.isMine) {
        elCell.innerHTML = MINE;
        cell.isShow = true;
    } else if (cell.numNeig) {
        elCell.innerHTML = cell.numNeig;
        cell.isShow = true;
    } else {
        elCell.innerHTML = '';
        cell.isShow = true;
    }

}

function gameOver() {
    clearInterval(gIntervalTime);
    gGame.isStart = false;
    gElsmile.innerHTML = '😵';
    showModal('YOU LOSE!');
    new Audio('gameover.mpeg').play();
}

function flagCell(i, j, event, elcell) {
    event.preventDefault();

    if (!gGame.isStart) return;

    var cell = gBoard[i][j];
    //if cell is show, not allow to flag
    if (cell.isShow && !cell.isFlagged) return;

    //cell not falgged
    if (!cell.isFlagged) {
        //if not have flags do nothing
        if (gGame.flagCount >= gLevel.mines) {
            renderMsg('you used all flags!', 2);
            return;
        }

        cell.isFlagged = true;
        cell.isShow = true;
        gGame.flagCount++;

    } else {//cell is flagged
        cell.isFlagged = false;
        cell.isShow = false;
        gGame.flagCount--;
    }

    if (gGame.flagCount === gLevel.mines) checkVictory();
    renderBoard(gBoard);
    renderGameStart();



}

function checkVictory() {
    var tableCells = gLevel.size * gLevel.size;
    var cellsOutMines = tableCells - gLevel.mines;

    if ((gGame.flagCount===gLevel.mines) && (gGame.cellshowed === cellsOutMines)) {
        new Audio('victory.mpeg').play();
        console.log('victory!!');
        gGame.isStart = false;
        showModal('YOU WON!!')
        gElsmile.innerHTML = '😎';
        clearTimeout(gIntervalTime);
        renderBoard(gBoard);
    }

}

function renderGameStart() {
    //flags render
    var flagCount = document.querySelector('.flag-counter');
    if (gGame.isStart) {
        flagCount.innerText = `Flags:${gLevel.mines - gGame.flagCount}`;
    } else flagCount.innerText = '';

    //smile render
    gElsmile.innerText = '😊';
}

function showModal(txt) {
    var elModal = document.querySelector('.modal');
    var elH3 = elModal.querySelector('h3');
    elH3.innerText = txt;
    elModal.style.display = 'block';

}

var totalSeconds = 0;
function countTimer() {
    var elTimer = document.querySelector('.timer');
    ++totalSeconds;
    var hour = Math.floor(totalSeconds / 3600);
    var minute = Math.floor((totalSeconds - hour * 3600) / 60);
    var seconds = totalSeconds - (hour * 3600 + minute * 60);
    if (hour < 10)
        hour = "0" + hour;
    if (minute < 10)
        minute = "0" + minute;
    if (seconds < 10)
        seconds = "0" + seconds;
    elTimer.innerHTML = + minute + ":" + seconds;
}

function playAgain() {
    location.reload();

}






