/**
 * SpatialGrid — Grid-based spatial partitioning for efficient proximity detection.
 *
 * Instead of O(n²) distance checks between all user pairs,
 * we partition the world into cells and only check neighbors
 * in the 3×3 surrounding cells → O(n × k) where k = avg users per neighborhood.
 */
export default class SpatialGrid {
  constructor(cellSize) {
    this.cellSize = cellSize;
    /** @type {Map<string, Set<string>>} cellKey → Set of userIds */
    this.cells = new Map();
    /** @type {Map<string, string>} userId → cellKey */
    this.userCells = new Map();
  }

  _getCellKey(x, y) {
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);
    return `${col}:${row}`;
  }

  updateUser(userId, x, y) {
    const oldCellKey = this.userCells.get(userId);
    const newCellKey = this._getCellKey(x, y);

    if (oldCellKey === newCellKey) return;

    if (oldCellKey) {
      const oldCell = this.cells.get(oldCellKey);
      if (oldCell) {
        oldCell.delete(userId);
        if (oldCell.size === 0) this.cells.delete(oldCellKey);
      }
    }

    if (!this.cells.has(newCellKey)) {
      this.cells.set(newCellKey, new Set());
    }
    this.cells.get(newCellKey).add(userId);
    this.userCells.set(userId, newCellKey);
  }

  removeUser(userId) {
    const cellKey = this.userCells.get(userId);
    if (cellKey) {
      const cell = this.cells.get(cellKey);
      if (cell) {
        cell.delete(userId);
        if (cell.size === 0) this.cells.delete(cellKey);
      }
      this.userCells.delete(userId);
    }
  }

  getNearbyUserIds(x, y) {
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);
    const nearby = [];

    for (let dc = -1; dc <= 1; dc++) {
      for (let dr = -1; dr <= 1; dr++) {
        const key = `${col + dc}:${row + dr}`;
        const cell = this.cells.get(key);
        if (cell) {
          for (const userId of cell) {
            nearby.push(userId);
          }
        }
      }
    }
    return nearby;
  }

  getStats() {
    return {
      totalCells: this.cells.size,
      totalUsers: this.userCells.size,
    };
  }
}