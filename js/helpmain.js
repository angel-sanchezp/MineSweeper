'stric'
function copyMat(mat) {
    var newMat = []
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = []
        for (var j = 0; j < mat.length; j++) {
            newMat[i][j] = mat[i][j]
        }
    }
    return newMat
}

function countNegs(cellI, cellJ, mat) {
    var minesCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j > mat[i].length - 1) continue;
            // if (i === cellI && j === cellJ) continue;
            if (mat[i][j].isMine) minesCount++
        }
    }
    return minesCount;
}




// function countNeighbors(cellI, cellJ, mat) {
//     // debugger;
//     var neighborsCount = 0;
//     for (var i = cellI - 1; i <= cellI + 1; i++) {
//         if (i < 0 || i >= mat.length) continue;
//         for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//             // if (i === cellI && j === cellJ) continue;
//             if (j < 0 || j >= mat[i].length) continue;

//             if (mat[i][j] === MINE) neighborsCount++;
//         }
//     }
//     console.log('neighborsCount',neighborsCount);
//     return neighborsCount;
// }

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is inclusive and the minimum is inclusive
}

function runGeneration(board) {
    var newBoard = copyMat(board);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            if (board[i][j].isMine) continue;
            var numOfNeighbors = countNegs(i, j, board);
            if (numOfNeighbors === 0) {
                board[i][j].numNeig = 0;
            } else if (numOfNeighbors > 0) {
                board[i][j].numNeig = numOfNeighbors;

            }
        }
    }

    return newBoard;

}



function drawCell() {
    var idx = getRandomInt(0, gArr.length);
    var cell = gArr[idx];
    gArr.splice(idx, 1);
    return cell;

}



function getRandomIntInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function checkCellArea(cellI, cellJ) {
    var area = {
        currentCell: [],
        manyMines: [],
        numCells: [],
        emptyCells: []
    };

    for (var i = cellI - 1; i <= cellI + 1; i++) {

        if (i < 0 || i >= gBoard.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;

            if (i === cellI && j === cellJ) {
                area.currentCell.push({ i, j });
                continue;
            }

            var currCell = gBoard[i][j];
            if (currCell.isMine) area.manyMines.push({ i, j });
            if (!currCell.isShow) {
                (currCell.numNeig) ? area.numCells.push({ i, j }) : area.emptyCells.push({ i, j })

            }


        }

    }
    return area;
}
