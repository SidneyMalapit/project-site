import { default as Game } from './MinesweeperGame.js';
import colors from './colors.js';
document.addEventListener('DOMContentLoaded', function () {
    var table = document.getElementById('minesweeper-field');
    var game = new Game(24, 24);
    createGameTable(game, table);
    for (var i = 1; i <= 8; i++) {
        table.style.setProperty("--color-".concat(i), colors[i - 1]);
    }
    // dig event
    table.addEventListener('click', function (_a) {
        var target = _a.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        var cellElement = target.closest('td');
        if (!(cellElement instanceof HTMLTableCellElement)) {
            return;
        }
        var coord = [cellElement.getAttribute('data-row'), cellElement.getAttribute('data-column')];
        if (coord[0] === null || coord[1] === null) {
            throw TypeError('row or column attribute not found');
        }
        var isUninitialized = game.isUninitialized;
        dig(game, (coord.map(function (n) { return parseInt(n); })), [], game.size / 10);
        if (!isUninitialized) {
            return;
        }
        for (var _i = 0, _b = Array.from(table.querySelectorAll('td')); _i < _b.length; _i++) {
            var cellElement_1 = _b[_i];
            var coord_1 = [cellElement_1.dataset.row, cellElement_1.dataset.column];
            if (coord_1[0] === null || coord_1[1] === null) {
                throw TypeError('row or column attribute not found');
            }
            var count = game.at(parseInt(coord_1[0]), parseInt(coord_1[1])).count;
            cellElement_1.setAttribute('data-count', count.toString());
            cellElement_1.children[0].textContent = count > 0 ? count.toString() : '\u00a0';
        }
    });
    // flag event
    table.addEventListener('mousedown', function (event) {
        switch (event.button) {
            case 1: return handleMiddleClick(event);
            case 2: return handleRightClick(event);
            default: return;
        }
    });
    function handleRightClick(event) {
        var _a, _b;
        event.preventDefault();
        var target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        var cellElement = target.closest('td');
        if (!(cellElement instanceof HTMLTableCellElement)) {
            return;
        }
        var coord = [cellElement.getAttribute('data-row'), cellElement.getAttribute('data-column')];
        if (!((_b = (_a = coord[0]) !== null && _a !== void 0 ? _a : coord[1]) !== null && _b !== void 0 ? _b : undefined)) {
            throw TypeError('row or column attribute not found');
        }
        toggleFlag(game, coord.map(function (n) { return parseInt(n); }));
    }
    function handleMiddleClick(event) {
        var _a, _b;
        event.preventDefault();
        var target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        var cellElement = target.closest('td');
        if (!(cellElement instanceof HTMLTableCellElement)) {
            return;
        }
        var coord = [cellElement.getAttribute('data-row'), cellElement.getAttribute('data-column')];
        if (!((_b = (_a = coord[0]) !== null && _a !== void 0 ? _a : coord[1]) !== null && _b !== void 0 ? _b : undefined)) {
            throw TypeError('row or column attribute not found');
        }
        var coords = [];
        digNeighborsIfFlagged(game, coord.map(function (n) { return parseInt(n); }), coords);
        for (var _i = 0, coords_1 = coords; _i < coords_1.length; _i++) {
            var coord_2 = coords_1[_i];
            updateCellState(getCell.apply(void 0, coord_2), game.at.apply(game, coord_2));
        }
    }
    table.addEventListener('contextmenu', function (event) { return event.preventDefault(); });
});
function lose() { }
function displayGridString(_a) {
    var grid = _a.grid, columns = _a.columns;
    var str = grid.map(cellToCharacter).join('').replace(new RegExp("(.{".concat(columns, "})"), 'g'), '$1\n');
    return str;
}
function cellToCharacter(_a) {
    var count = _a.count, isMine = _a.isMine, isDug = _a.isDug;
    return (isDug ? isMine ? 'X' : count || ' ' : '\u2588').toString();
}
function dig(game) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var modifiedCoords = args[1];
    var result = game.dig.apply(game, args);
    if (!modifiedCoords) {
        return;
    }
    for (var _a = 0, modifiedCoords_1 = modifiedCoords; _a < modifiedCoords_1.length; _a++) {
        var coord = modifiedCoords_1[_a];
        updateCellState(getCell.apply(void 0, coord), game.at.apply(game, coord));
    }
    result && lose();
}
function digNeighborsIfFlagged(game) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var modifiedCoords = args[1];
    var result = game.digNeighborsIfFlagged.apply(game, args);
    if (!modifiedCoords) {
        return;
    }
    for (var _a = 0, modifiedCoords_2 = modifiedCoords; _a < modifiedCoords_2.length; _a++) {
        var coord = modifiedCoords_2[_a];
        updateCellState(getCell.apply(void 0, coord), game.at.apply(game, coord));
    }
    result && lose();
}
function toggleFlag(game, _a) {
    var r = _a[0], c = _a[1];
    if (!game.toggleFlag(r, c)) {
        return;
    }
    updateCellState(getCell(r, c), game.at(r, c));
}
function createGameTable(_a, _b) {
    var rows = _a.rows, columns = _a.columns, grid = _a.grid;
    var tbody = _b.tBodies[0];
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < columns; c++) {
            var cellElement = document.createElement('td');
            cellElement.id = "minesweeper-row-".concat(r, "-col-").concat(c);
            cellElement.setAttribute('data-row', r.toString());
            cellElement.setAttribute('data-column', c.toString());
            cellElement.tabIndex = 0;
            cellElement.append(document.createElement('span'));
            updateCellState(cellElement, grid[r * columns + c], true);
            tbody.append(cellElement);
        }
    }
    tbody.style.setProperty('--rows', rows.toString());
    tbody.style.setProperty('--columns', columns.toString());
}
function updateCellState(cellElement, _a, isUninitialized) {
    var isDug = _a.isDug, isMine = _a.isMine, isFlagged = _a.isFlagged, count = _a.count;
    if (isUninitialized === void 0) { isUninitialized = false; }
    var classList = cellElement.classList;
    if (isFlagged) {
        classList.add('flagged');
        return;
    }
    classList.remove('flagged');
    isDug && classList.add('dug');
    if (isMine) {
        classList.remove('empty');
        classList.add('mine');
    }
    else if (!count && !isUninitialized) {
        classList.remove('mine');
        classList.add('empty');
    }
}
function getCell(row, column) {
    var result = document.getElementById("minesweeper-row-".concat(row, "-col-").concat(column));
    if (result) {
        return result;
    }
    throw Error("could not find a cell at row ".concat(row, ", column ").concat(column));
}
