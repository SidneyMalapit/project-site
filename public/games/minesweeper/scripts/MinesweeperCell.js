export default class MinesweeperCell {
    state = 0;
    _isDug = false;
    _isFlagged = false;
    constructor(isMine = false) { isMine && (this.state = -1); }
    get count() { return this.state; }
    get isMine() { return this.state === -1; }
    get isDug() { return this._isDug; }
    get isFlagged() { return this._isFlagged; }
    /**
     * @returns true if successfully switched states
     */
    toggleFlag() {
        if (this.isDug) {
            return false;
        }
        this._isFlagged = !this._isFlagged;
        return true;
    }
    /**
     * @returns true if successfully dug
     */
    dig() {
        if (this.isDug || this.isFlagged) {
            return false;
        }
        this._isDug = true;
        return true;
    }
    increment() {
        if (this.isMine) {
            throw TypeError('attempted to increment a mine');
        }
        if (this.state === 8) {
            throw RangeError('adjacent mine count cannot exceed 8');
        }
        this.state++;
    }
    rig() {
        if (this.isMine) {
            throw TypeError('attempted to rig an existing mine');
        }
        this.state = -1;
    }
}
