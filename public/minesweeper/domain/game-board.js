var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GameBoard_bombs;
import { Cell, CellInBoard } from './cell';
// const markCellAsBomb = (board: IGameBoard, cell: ICellInBoard) => {
// 	if(board.getRemainingBoms()){
// 	}
// }
export class GameBoard {
    constructor({ rows, columns, totalBombs, }) {
        this.hasLostGame = false;
        this.hasWonGame = false;
        _GameBoard_bombs.set(this, void 0);
        this.markCellAsBomb = (cell) => {
            // const cell = this.getCell(id)
            // if (!cell || this.getRemainingBoms() <= 0) return
            if (this.getRemainingBoms() <= 0)
                return;
            cell.markAsBomb();
            this.decrementRemainingBombs();
            if (this.isWonGame()) {
                // this.table.winGame() // revisar
                this.cells.forEach(cell => {
                    // !cell.isExposed() && !cell.isBomb && cell.expose()
                    cell.expose();
                });
                // this.#handleWin()
            }
        };
        // - si se desmarcar una celda se debe aumentar las bombas que quedan
        // - las celdas marcadas como bomba no pueden ser menor a cero
        this.unCheckAsBomb = (cell) => {
            cell === null || cell === void 0 ? void 0 : cell.unCheckAsBomb();
            if (this.remainingBoms >= this.totalBombs)
                return;
            this.incrementRemainingBombs();
        };
        this.exposeCell = (cell) => {
            const z = [];
            const alo = (id) => {
                var _a;
                const cell = this.getCell(id);
                if (!cell)
                    return;
                if (cell.getTotalBombsAround() === 0 &&
                    !cell.isExposed() &&
                    !cell.isMarkAsBomb()) {
                    cell.expose();
                    console.log(cell.getId());
                    z.push(cell);
                    (_a = cell.getIdsOfCellsAround()) === null || _a === void 0 ? void 0 : _a.forEach(id => {
                        alo(id);
                    });
                }
                if (!cell.isMarkAsBomb() && !cell.isExposed()) {
                    cell.expose();
                    console.log(cell.getId());
                    z.push(cell);
                }
            };
            alo(cell.getId());
            cell.expose();
            if (cell.isBomb && !cell.isMarkAsBomb()) {
                // this.#handleLose()
                return this.getCells().filter(cell => {
                    cell.isBomb && cell.expose();
                    return cell.isBomb;
                });
            }
            return z;
        };
        this.setBombs = () => {
            if (this.totalBombs === __classPrivateFieldGet(this, _GameBoard_bombs, "f").filter(bomb => bomb).length) {
                return;
            }
            const random = getRandomValue(this.rows * this.columns);
            if (!__classPrivateFieldGet(this, _GameBoard_bombs, "f")[random]) {
                __classPrivateFieldGet(this, _GameBoard_bombs, "f")[random] = true;
            }
            return this.setBombs();
        };
        this.getCells = () => this.cells;
        this.getRemainingBoms = () => this.remainingBoms;
        this.getCell = (id) => {
            // console.log(this.cells[id])
            return this.cells[id];
        };
        this.getCellsAround = (cells, cell) => {
            const { x, y } = cell.getPosition();
            const filterCellsAround = (cell) => {
                const { x: cellX, y: cellY } = cell.getPosition();
                return (cellX >= x - 1 &&
                    cellX <= x + 1 &&
                    cellY >= y - 1 &&
                    cellY <= y + 1 &&
                    (cellX !== x || cellY !== y));
            };
            return cells.filter(filterCellsAround);
            // return {
            // cellsAround,
            // positions: cellsAround.map(a => ({ x: a.position.x, y: a.position.y })),
            // positions: cellsAround.map(a => a.index),
            // }
        };
        this.getTotalBombsAround = (cells, cell) => {
            const cellsAround = this.getCellsAround(cells, cell);
            return cellsAround.filter(cell => cell.isBomb).length;
        };
        this.decrementRemainingBombs = () => this.remainingBoms--;
        this.incrementRemainingBombs = () => this.remainingBoms++;
        this.isWonGame = () => this.getRemainingBoms() === 0 &&
            this.getCells().every(cell => cell.isBomb === cell.isMarkAsBomb());
        this.rows = rows;
        this.columns = columns;
        this.totalBombs = totalBombs;
        this.remainingBoms = totalBombs;
        __classPrivateFieldSet(this, _GameBoard_bombs, Array(rows * columns).fill(false), "f");
        this.setBombs();
        let x = -1;
        let y = 0;
        const cells = __classPrivateFieldGet(this, _GameBoard_bombs, "f").map((isBomb, index) => {
            x++;
            if (x >= columns) {
                y++;
                x = 0;
            }
            return new Cell(x, y, index, isBomb);
        });
        this.cells = cells.map(cell => {
            return new CellInBoard(cell, this.getCellsAround(cells, cell).map(c => c.getId()), this.getTotalBombsAround(cells, cell));
        });
    }
}
_GameBoard_bombs = new WeakMap();
function getRandomValue(maxValue) {
    return Math.floor(Math.random() * maxValue);
}
