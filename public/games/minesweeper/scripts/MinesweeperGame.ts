import { default as Cell } from './MinesweeperCell.js';

export default class MinesweeperGame {
  readonly grid: readonly Cell[];
  private readonly _rows: number;
  private readonly _columns: number;
  private cellsRevealed: number;
  private _isUninitialized = true;
  private mineCount = 0;
  constructor(rowCount: number, columnCount: number) {
    this._rows = rowCount;
    this._columns = columnCount;
    this.grid = Array.from({ length: this.size }, () => new Cell);
  }
  private populate(mineCount: number, saved: readonly [number, number]) {
    const { grid, size } = this;
    if (mineCount <= 0 || mineCount >= size) { throw RangeError(`cannot populate field of size ${size} with ${mineCount} mines`); }
    this.validate(...saved);

    // plant mines and setup cell values
    const saveIndex = this.coordinateToIndex(...saved);
    const neighborIndices = this.getNeighborIndices(...saved);
    for (let index = Math.floor(this.random * size); mineCount > 0; mineCount--) {
      while (grid[index].isMine || index === saveIndex || neighborIndices.includes(index)) {
        index = Math.floor(this.random * size);
      }
      grid[index].rig();
      const n: (Cell | null)[] = [];
      for (const neighbor of this.getNeighbors(...this.indexToCoordinate(index))) {
        n.push(neighbor);
        if (!neighbor || neighbor.isMine) { continue; }
        neighbor.increment();
      }
    }

    this.mineCount = mineCount;
    this.cellsRevealed = 0;
    this._isUninitialized = false;
  }
  getNeighborIndices(r: number, c: number): readonly number[] { // includes given coordinate
    const indices: number[] = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (!i && !j || !this.isValidCoordinate(r + i, c + j)) { continue; }
        indices.push(this.coordinateToIndex(r + i, c + j));
      }
    }
    return indices;
  }
  getNeighbors(r: number, c: number): readonly (Cell | null)[] {
    const neighbors: (Cell | null)[] = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (!i && !j) { continue; }
        neighbors.push(this.isValidCoordinate(r + i, c + j) ? this.at(r + i, c + j) : null);
      }
    }
    return neighbors;
  }
  /**
   * @returns {boolean} true if a mine was found
   **/
  dig(coords: readonly [number, number], modifiedCoords: [number, number][] | null = null, mineCount = NaN): boolean {
    if (!this._isUninitialized && !isNaN(mineCount)) {
      console.trace('attempted to reinitialize minefield');
    } else if (this.at(...coords).isFlagged) {
      return false;
    } else {
      this.populate(mineCount, coords);
    }

    const [r, c] = coords;
    this.validate(...coords);

    const cell = this.at(...coords);
    if (cell.isDug) { return false; }
    cell.dig();
    this.cellsRevealed++;
    modifiedCoords?.push?.([r, c]);
    if (cell.isMine) { return true; }
    let mineFound = false;
    if (cell.count === 0) {
      for (const i of this.getNeighborIndices(r, c)) {
        const coord = this.indexToCoordinate(i);
        if (i === this.coordinateToIndex(r, c)) { continue; }
        const result = this.dig(coord, modifiedCoords);
        mineFound ||= result;
      }
    }
    return mineFound;
  }
  /**
   * @returns {boolean} true if a mine was found
   **/
  digNeighborsIfFlagged(coords: readonly [number, number], modifiedCoords: [number, number][] | null = null): boolean {
    const neighborIndices = this.getNeighborIndices(...coords);
    const adjacentFlagCount = neighborIndices.reduce((acc, coord) => acc + +this.grid[coord].isFlagged, 0);
    const { isMine, count, isDug } = this.at(...coords);
    if (!isDug || adjacentFlagCount !== count) { return false; }
    let mineFound = false;
    for (const i of neighborIndices) { mineFound ||= this.dig(this.indexToCoordinate(i), modifiedCoords); }
    return mineFound;
  }
  toggleFlag(r: number, c: number) { return this.at(r, c).toggleFlag(); }
  at(r: number, c: number) {
    this.validate(r, c);
    return this.grid[this.coordinateToIndex(r, c)];
  }
  validate(r: number, c: number) {
    if (this.isValidCoordinate(r, c)) { return; }
    throw RangeError(`coordinate (${c}, ${r}) out of bounds`);
  }
  isValidCoordinate(r: number, c: number) { return r >= 0 && c >= 0 && r < this.rows && c < this.columns; }
  indexToCoordinate(i: number): readonly [number, number] { return [Math.floor(i / this.columns), i % this.columns]; }
  coordinateToIndex(r: number, c: number) { return r * this.columns + c; }
  get rows() { return this._rows; }
  get columns() { return this._columns; }
  get size() { return this.rows * this.columns; }
  get isWon() { return this.cellsRevealed === this.size - this.mineCount; }
  get isUninitialized() { return this._isUninitialized; }
  private get random() { return Math.random(); }
}
