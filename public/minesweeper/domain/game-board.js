"use strict";
// import { Cell, CellInBoard, ICell, ICellInBoard } from './cell'
// /*
// lógica de negocio:
// - si se expone una bomba, todas las bombas del tablero deben ser expuestas y se pierde el juego
// - se gana el juego si las celdas marcadas como bomba son las mismas que las bombas ó
// si las celdas que quedan sin marcar son las mismas que las bombas.
// - si se marcar una celda se debe disminuir las bombas que quedan
// - las celdas marcadas como bomba no pueden ser mayor a la cantidad de bombas totales
// */
// export interface InitialData {
// 	rows: number
// 	columns: number
// 	totalBombs: number
// }
// export interface BoardGameI {
// 	cells: { x: number; y: number }[]
// 	totalMines: number
// 	remainingMines: number
// 	hasWonGame: boolean
// 	hasLostGame: boolean
// }
// // const markCellAsBomb = (board: IGameBoard, cell: ICellInBoard) => {
// // 	if(board.getRemainingBoms()){
// // 	}
// // }
// export class GameBoard implements IGameBoard {
// 	hasLostGame = false
// 	hasWonGame = false
// 	rows: number
// 	columns: number
// 	remainingBoms: number
// 	totalBombs: number
// 	cells: ICellInBoard[]
// 	#bombs: boolean[]
// 	markCellAsBomb = (cell: ICellInBoard) => {
// 		// const cell = this.getCell(id)
// 		// if (!cell || this.getRemainingBoms() <= 0) return
// 		if (this.getRemainingBoms() <= 0) return
// 		cell.markAsBomb()
// 		this.decrementRemainingBombs()
// 		if (this.isWonGame()) {
// 			// this.table.winGame() // revisar
// 			this.cells.forEach(cell => {
// 				// !cell.isExposed() && !cell.isBomb && cell.expose()
// 				cell.expose()
// 			})
// 			// this.#handleWin()
// 		}
// 	}
// 	// - si se desmarcar una celda se debe aumentar las bombas que quedan
// 	// - las celdas marcadas como bomba no pueden ser menor a cero
// 	unCheckAsBomb = (cell: ICellInBoard) => {
// 		cell?.unCheckAsBomb()
// 		if (this.remainingBoms >= this.totalBombs) return
// 		this.incrementRemainingBombs()
// 	}
// 	exposeCell = (cell: ICellInBoard) => {
// 		const z: ICellInBoard[] = []
// 		const alo = (id: number) => {
// 			const cell = this.getCell(id)
// 			if (!cell) return
// 			if (
// 				cell.getTotalBombsAround() === 0 &&
// 				!cell.isExposed() &&
// 				!cell.isMarkAsBomb()
// 			) {
// 				cell.expose()
// 				console.log(cell.getId())
// 				z.push(cell)
// 				cell.getIdsOfCellsAround()?.forEach(id => {
// 					alo(id)
// 				})
// 			}
// 			if (!cell.isMarkAsBomb() && !cell.isExposed()) {
// 				cell.expose()
// 				console.log(cell.getId())
// 				z.push(cell)
// 			}
// 		}
// 		alo(cell.getId())
// 		cell.expose()
// 		if (cell.isBomb && !cell.isMarkAsBomb()) {
// 			// this.#handleLose()
// 			return this.getCells().filter(cell => {
// 				cell.isBomb && cell.expose()
// 				return cell.isBomb
// 			})
// 		}
// 		return z
// 	}
// 	constructor({
// 		rows,
// 		columns,
// 		totalBombs,
// 	}: {
// 		rows: number
// 		columns: number
// 		totalBombs: number
// 	}) {
// 		this.rows = rows
// 		this.columns = columns
// 		this.totalBombs = totalBombs
// 		this.remainingBoms = totalBombs
// 		this.#bombs = Array(rows * columns).fill(false)
// 		this.setBombs()
// 		let x = -1
// 		let y = 0
// 		const cells = this.#bombs.map((isBomb, index) => {
// 			x++
// 			if (x >= columns) {
// 				y++
// 				x = 0
// 			}
// 			return new Cell(x, y, index, isBomb)
// 		})
// 		this.cells = cells.map(cell => {
// 			return new CellInBoard(
// 				cell,
// 				this.getCellsAround(cells, cell).map(c => c.getId()),
// 				this.getTotalBombsAround(cells, cell)
// 			)
// 		})
// 	}
// 	setBombs = (): void => {
// 		if (this.totalBombs === this.#bombs.filter(bomb => bomb).length) {
// 			return
// 		}
// 		const random = getRandomValue(this.rows * this.columns)
// 		if (!this.#bombs[random]) {
// 			this.#bombs[random] = true
// 		}
// 		return this.setBombs()
// 	}
// 	getCells = () => this.cells
// 	getRemainingBoms = () => this.remainingBoms
// 	getCell = (id: number): ICellInBoard | undefined => {
// 		// console.log(this.cells[id])
// 		return this.cells[id]
// 	}
// 	getCellsAround = (cells: ICell[], cell: ICell): ICell[] => {
// 		const { x, y } = cell.getPosition()
// 		const filterCellsAround = (cell: ICell): boolean => {
// 			const { x: cellX, y: cellY } = cell.getPosition()
// 			return (
// 				cellX >= x - 1 &&
// 				cellX <= x + 1 &&
// 				cellY >= y - 1 &&
// 				cellY <= y + 1 &&
// 				(cellX !== x || cellY !== y)
// 			)
// 		}
// 		return cells.filter(filterCellsAround)
// 		// return {
// 		// cellsAround,
// 		// positions: cellsAround.map(a => ({ x: a.position.x, y: a.position.y })),
// 		// positions: cellsAround.map(a => a.index),
// 		// }
// 	}
// 	getTotalBombsAround = (cells: ICell[], cell: ICell) => {
// 		const cellsAround = this.getCellsAround(cells, cell)
// 		return cellsAround.filter(cell => cell.isBomb).length
// 	}
// 	decrementRemainingBombs = () => this.remainingBoms--
// 	incrementRemainingBombs = () => this.remainingBoms++
// 	isWonGame = () =>
// 		this.getRemainingBoms() === 0 &&
// 		this.getCells().every(cell => cell.isBomb === cell.isMarkAsBomb())
// 	// winGame  () => void
// }
// function getRandomValue(maxValue: number) {
// 	return Math.floor(Math.random() * maxValue)
// }
// export interface IGameBoard {
// 	// rows: number
// 	// columns: number
// 	// remainingBoms: number
// 	// totalBombs: number
// 	// cells: ICellInBoard[]
// 	isWonGame: () => boolean
// 	getRemainingBoms: () => number
// 	getCell: (id: number) => ICellInBoard | undefined
// 	getCells: () => ICellInBoard[]
// 	incrementRemainingBombs: () => void
// 	decrementRemainingBombs: () => void
// 	markCellAsBomb: (cell: ICellInBoard) => void
// 	unCheckAsBomb: (cell: ICellInBoard) => void
// 	exposeCell: (cell: ICellInBoard) => ICellInBoard[]
// }
