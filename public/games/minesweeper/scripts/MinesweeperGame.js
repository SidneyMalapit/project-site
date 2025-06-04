import { default as Cell } from './MinesweeperCell.js';
var MinesweeperGame = /** @class */ (function () {
    function MinesweeperGame(rowCount, columnCount) {
        this._isUninitialized = true;
        this.mineCount = 0;
        this._rows = rowCount;
        this._columns = columnCount;
        this.grid = Array.from({ length: this.size }, function () { return new Cell; });
    }
    MinesweeperGame.prototype.populate = function (mineCount, saved) {
        var _a = this, grid = _a.grid, size = _a.size;
        if (mineCount <= 0 || mineCount >= size) {
            throw RangeError("cannot populate field of size ".concat(size, " with ").concat(mineCount, " mines"));
        }
        this.validate.apply(this, saved);
        // plant mines and setup cell values
        var saveIndex = this.coordinateToIndex.apply(this, saved);
        var neighborIndices = this.getNeighborIndices.apply(this, saved);
        for (var index = Math.floor(this.random * size); mineCount > 0; mineCount--) {
            while (grid[index].isMine || index === saveIndex || neighborIndices.includes(index)) {
                index = Math.floor(this.random * size);
            }
            grid[index].rig();
            var n = [];
            for (var _i = 0, _b = this.getNeighbors.apply(this, this.indexToCoordinate(index)); _i < _b.length; _i++) {
                var neighbor = _b[_i];
                n.push(neighbor);
                if (!neighbor || neighbor.isMine) {
                    continue;
                }
                neighbor.increment();
            }
        }
        this.mineCount = mineCount;
        this.cellsRevealed = 0;
        this._isUninitialized = false;
    };
    MinesweeperGame.prototype.getNeighborIndices = function (r, c) {
        var indices = [];
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (!i && !j || !this.isValidCoordinate(r + i, c + j)) {
                    continue;
                }
                indices.push(this.coordinateToIndex(r + i, c + j));
            }
        }
        return indices;
    };
    MinesweeperGame.prototype.getNeighbors = function (r, c) {
        var neighbors = [];
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (!i && !j) {
                    continue;
                }
                neighbors.push(this.isValidCoordinate(r + i, c + j) ? this.at(r + i, c + j) : null);
            }
        }
        return neighbors;
    };
    /**
     * @returns {boolean} true if a mine was found
     **/
    MinesweeperGame.prototype.dig = function (coords, modifiedCoords, mineCount) {
        var _a;
        if (modifiedCoords === void 0) { modifiedCoords = null; }
        if (mineCount === void 0) { mineCount = NaN; }
        if (!this._isUninitialized && !isNaN(mineCount)) {
            console.trace('attempted to reinitialize minefield');
        }
        else if (this.at.apply(this, coords).isFlagged) {
            return false;
        }
        else {
            this.populate(mineCount, coords);
        }
        var r = coords[0], c = coords[1];
        this.validate.apply(this, coords);
        var cell = this.at.apply(this, coords);
        if (cell.isDug) {
            return false;
        }
        cell.dig();
        this.cellsRevealed++;
        (_a = modifiedCoords === null || modifiedCoords === void 0 ? void 0 : modifiedCoords.push) === null || _a === void 0 ? void 0 : _a.call(modifiedCoords, [r, c]);
        if (cell.isMine) {
            return true;
        }
        var mineFound = false;
        if (cell.count === 0) {
            for (var _i = 0, _b = this.getNeighborIndices(r, c); _i < _b.length; _i++) {
                var i = _b[_i];
                var coord = this.indexToCoordinate(i);
                if (i === this.coordinateToIndex(r, c)) {
                    continue;
                }
                var result = this.dig(coord, modifiedCoords);
                mineFound || (mineFound = result);
            }
        }
        return mineFound;
    };
    /**
     * @returns {boolean} true if a mine was found
     **/
    MinesweeperGame.prototype.digNeighborsIfFlagged = function (coords, modifiedCoords) {
        var _this = this;
        if (modifiedCoords === void 0) { modifiedCoords = null; }
        var neighborIndices = this.getNeighborIndices.apply(this, coords);
        var adjacentFlagCount = neighborIndices.reduce(function (acc, coord) { return acc + +_this.grid[coord].isFlagged; }, 0);
        var _a = this.at.apply(this, coords), isMine = _a.isMine, count = _a.count, isDug = _a.isDug;
        if (!isDug || adjacentFlagCount !== count) {
            return false;
        }
        var mineFound = false;
        for (var _i = 0, neighborIndices_1 = neighborIndices; _i < neighborIndices_1.length; _i++) {
            var i = neighborIndices_1[_i];
            mineFound || (mineFound = this.dig(this.indexToCoordinate(i), modifiedCoords));
        }
        return mineFound;
    };
    MinesweeperGame.prototype.toggleFlag = function (r, c) { return this.at(r, c).toggleFlag(); };
    MinesweeperGame.prototype.at = function (r, c) {
        this.validate(r, c);
        return this.grid[this.coordinateToIndex(r, c)];
    };
    MinesweeperGame.prototype.validate = function (r, c) {
        if (this.isValidCoordinate(r, c)) {
            return;
        }
        throw RangeError("coordinate (".concat(c, ", ").concat(r, ") out of bounds"));
    };
    MinesweeperGame.prototype.isValidCoordinate = function (r, c) { return r >= 0 && c >= 0 && r < this.rows && c < this.columns; };
    MinesweeperGame.prototype.indexToCoordinate = function (i) { return [Math.floor(i / this.columns), i % this.columns]; };
    MinesweeperGame.prototype.coordinateToIndex = function (r, c) { return r * this.columns + c; };
    Object.defineProperty(MinesweeperGame.prototype, "rows", {
        get: function () { return this._rows; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MinesweeperGame.prototype, "columns", {
        get: function () { return this._columns; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MinesweeperGame.prototype, "size", {
        get: function () { return this.rows * this.columns; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MinesweeperGame.prototype, "isWon", {
        get: function () { return this.cellsRevealed === this.size - this.mineCount; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MinesweeperGame.prototype, "isUninitialized", {
        get: function () { return this._isUninitialized; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MinesweeperGame.prototype, "random", {
        get: function () { return Math.random(); },
        enumerable: false,
        configurable: true
    });
    return MinesweeperGame;
}());
export default MinesweeperGame;
