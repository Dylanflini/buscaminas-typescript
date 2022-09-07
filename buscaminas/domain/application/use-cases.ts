import { ICellInBoard } from '../entity/cell'
import { GameBoard, IGameBoard } from '../entity/game-board'
/*
	casos de uso / acciones del usuario:

 - obtener tablero de juego
 - reiniciar el juego
 - marcar una celda como bomba
 - desmarcar una celda como bomba
 - exponer el contenido de una celda

*/

/*

	lógica del juego:

	- si se hace click en una celda que tiene una mina, se pierde el juego -> como consecuencia --> todas las minas del tablero deben ser expuestas

	- si todas las celdas que tienen minas son marcadas como minas, se gana el juego




	- las celdas marcadas como posible bomba no pueden ser expuestas
	- las celdas marcadas como bomba no pueden ser mayor a la cantidad de bombas totales

- si se expone una bomba, todas las bombas del tablero deben ser expuestas y se pierde el juego

- se gana el juego si las celdas marcadas como bomba son las mismas que las bombas ó
si las celdas que quedan sin marcar son las mismas que las bombas.


- si se marcar una celda se debe disminuir las bombas que quedan
- las celdas marcadas como bomba no pueden ser mayor a la cantidad de bombas totales



*/

export interface IUseCase {
	// new (table: Table, generateId: () => string): UseCase
	markCellAsBomb: (id: number) => void
	unCheckAsBomb: (id: number) => void
	exposeCell: (id: number) => ICellInBoard[]
	onLose: (fn: () => void) => void
	onWin: (fn: () => void) => void
}

export class UseCase implements IUseCase {
	table: IGameBoard
	#handleLose: () => void = () => null
	#handleWin: () => void = () => null

	constructor(table: { rows: number; columns: number; totalBombs: number }) {
		this.table = new GameBoard(table)
	}

	markCellAsBomb = (id: number) => {
		const cell = this.table.getCell(id)
		if (!cell || this.table.getRemainingBoms() <= 0) return

		this.table.markCellAsBomb(cell)
	}

	unCheckAsBomb = (id: number) => {
		const cell = this.table.getCell(id)
		if (!cell) return

		this.table.unCheckAsBomb(cell)
	}

	exposeCell = (id: number) => {
		const cell = this.table.getCell(id)
		if (!cell) return []

		return this.table.exposeCell(cell)
	}

	getCells = () => this.table.getCells()

	isCellMarkedHasBomb = (id: number): boolean => {
		const cell = this.table.getCell(id)
		return cell?.isMarkAsBomb() || false
	}

	onLose = (fn: () => void) => {
		this.#handleLose = fn
	}

	onWin = (fn: () => void) => {
		this.#handleWin = fn
	}
}
