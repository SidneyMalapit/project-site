import { default as Game } from './MinesweeperGame.js';
import colors from './colors.js';
document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('minesweeper-field');
    const game = new Game(24, 24);
    createGameTable(game, table);
    for (let i = 1; i <= 8; i++) {
        table.style.setProperty(`--color-${i}`, colors[i - 1]);
    }
    // dig event
    table.addEventListener('click', ({ target }) => {
        if (!(target instanceof HTMLElement)) {
            return;
        }
        const cellElement = target.closest('td');
        if (!(cellElement instanceof HTMLTableCellElement)) {
            return;
        }
        const coord = [cellElement.getAttribute('data-row'), cellElement.getAttribute('data-column')];
        if (coord[0] === null || coord[1] === null) {
            throw TypeError('row or column attribute not found');
        }
        const { isUninitialized } = game;
        dig(game, (coord.map(n => parseInt(n))), [], game.size / 10);
        if (!isUninitialized) {
            return;
        }
        for (const cellElement of Array.from(table.querySelectorAll('td'))) {
            const coord = [cellElement.dataset.row, cellElement.dataset.column];
            if (coord[0] === null || coord[1] === null) {
                throw TypeError('row or column attribute not found');
            }
            const { count } = game.at(parseInt(coord[0]), parseInt(coord[1]));
            cellElement.setAttribute('data-count', count.toString());
            cellElement.children[0].textContent = count > 0 ? count.toString() : '\u00a0';
        }
    });
    // flag event
    table.addEventListener('mousedown', event => {
        switch (event.button) {
            case 1: return handleMiddleClick(event);
            case 2: return handleRightClick(event);
            default: return;
        }
    });
    function handleRightClick(event) {
        event.preventDefault();
        const { target } = event;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        const cellElement = target.closest('td');
        if (!(cellElement instanceof HTMLTableCellElement)) {
            return;
        }
        const coord = [cellElement.getAttribute('data-row'), cellElement.getAttribute('data-column')];
        if (!(coord[0] ?? coord[1] ?? undefined)) {
            throw TypeError('row or column attribute not found');
        }
        toggleFlag(game, coord.map(n => parseInt(n)));
    }
    function handleMiddleClick(event) {
        event.preventDefault();
        const { target } = event;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        const cellElement = target.closest('td');
        if (!(cellElement instanceof HTMLTableCellElement)) {
            return;
        }
        const coord = [cellElement.getAttribute('data-row'), cellElement.getAttribute('data-column')];
        if (!(coord[0] ?? coord[1] ?? undefined)) {
            throw TypeError('row or column attribute not found');
        }
        const coords = [];
        digNeighborsIfFlagged(game, coord.map(n => parseInt(n)), coords);
        for (const coord of coords) {
            updateCellState(getCell(...coord), game.at(...coord));
        }
    }
    table.addEventListener('contextmenu', event => event.preventDefault());
});
function lose() { }
function displayGridString({ grid, columns }) {
    const str = grid.map(cellToCharacter).join('').replace(new RegExp(`(.{${columns}})`, 'g'), '$1\n');
    return str;
}
function cellToCharacter({ count, isMine, isDug }) {
    return (isDug ? isMine ? 'X' : count || ' ' : '\u2588').toString();
}
function dig(game, ...args) {
    const [, modifiedCoords] = args;
    const result = game.dig(...args);
    if (!modifiedCoords) {
        return;
    }
    for (const coord of modifiedCoords) {
        updateCellState(getCell(...coord), game.at(...coord));
    }
    result && lose();
}
function digNeighborsIfFlagged(game, ...args) {
    const [, modifiedCoords] = args;
    const result = game.digNeighborsIfFlagged(...args);
    if (!modifiedCoords) {
        return;
    }
    for (const coord of modifiedCoords) {
        updateCellState(getCell(...coord), game.at(...coord));
    }
    result && lose();
}
function toggleFlag(game, [r, c]) {
    if (!game.toggleFlag(r, c)) {
        return;
    }
    updateCellState(getCell(r, c), game.at(r, c));
}
function createGameTable({ rows, columns, grid }, { tBodies: [tbody] }) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const cellElement = document.createElement('td');
            cellElement.id = `minesweeper-row-${r}-col-${c}`;
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
function updateCellState(cellElement, { isDug, isMine, isFlagged, count }, isUninitialized = false) {
    const { classList } = cellElement;
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
    const result = document.getElementById(`minesweeper-row-${row}-col-${column}`);
    if (result) {
        return result;
    }
    throw Error(`could not find a cell at row ${row}, column ${column}`);
}
