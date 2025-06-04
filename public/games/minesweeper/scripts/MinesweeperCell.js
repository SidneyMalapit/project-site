var MinesweeperCell = /** @class */ (function () {
    function MinesweeperCell(isMine) {
        if (isMine === void 0) { isMine = false; }
        this.state = 0;
        this._isDug = false;
        this._isFlagged = false;
        isMine && (this.state = -1);
    }
    Object.defineProperty(MinesweeperCell.prototype, "count", {
        get: function () { return this.state; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MinesweeperCell.prototype, "isMine", {
        get: function () { return this.state === -1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MinesweeperCell.prototype, "isDug", {
        get: function () { return this._isDug; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MinesweeperCell.prototype, "isFlagged", {
        get: function () { return this._isFlagged; },
        enumerable: false,
        configurable: true
    });
    /**
     * @returns true if successfully switched states
     */
    MinesweeperCell.prototype.toggleFlag = function () {
        if (this.isDug) {
            return false;
        }
        this._isFlagged = !this._isFlagged;
        return true;
    };
    /**
     * @returns true if successfully dug
     */
    MinesweeperCell.prototype.dig = function () {
        if (this.isDug || this.isFlagged) {
            return false;
        }
        this._isDug = true;
        return true;
    };
    MinesweeperCell.prototype.increment = function () {
        if (this.isMine) {
            throw TypeError('attempted to increment a mine');
        }
        if (this.state === 8) {
            throw RangeError('adjacent mine count cannot exceed 8');
        }
        this.state++;
    };
    MinesweeperCell.prototype.rig = function () {
        if (this.isMine) {
            throw TypeError('attempted to rig an existing mine');
        }
        this.state = -1;
    };
    return MinesweeperCell;
}());
export default MinesweeperCell;
