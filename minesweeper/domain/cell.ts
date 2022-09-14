export interface Position {
	x: number
	y: number
}

/*
lógica de negocio:

- si se expone una bomba, todas las bombas del tablero deben ser expuestas y se pierde el juego
- las celdas marcadas como posible bomba no pueden ser expuestas
- las celdas marcadas como bomba no pueden ser mayor a la cantidad de bombas totales

- si la celda no está expuesta no puede mostrar su contenido

*/

















































































































export class Cell implements ICell {
	isBomb: boolean
	#wasMarkedAsBomb: boolean
	#wasExposed: boolean
	id: number
	position: Position

	// las celdas marcadas como posible bomba no pueden ser expuestas
	expose = () => {
		if (!this.#wasMarkedAsBomb && !this.#wasExposed && !this.isBomb) {
			this.#wasExposed = true
		}
	}

	constructor(x: number, y: number, id: number, isBomb: boolean) {
		this.position = { x, y }
		this.id = id
		this.isBomb = isBomb
		this.#wasMarkedAsBomb = false
		this.#wasExposed = false
	}

	markAsBomb = () => (this.#wasMarkedAsBomb = true)
	unCheckAsBomb = () => (this.#wasMarkedAsBomb = false)

	isExposed = () => this.#wasExposed
	isMarkAsBomb = () => this.#wasMarkedAsBomb

	getPosition = () => this.position
	getId = () => this.id
}

export class CellInBoard extends Cell implements ICellInBoard {
	#cellsAround: number[]
	#totalBombsAround: number
	constructor(cell: ICell, cellsAround: number[], totalBombsAround: number) {
		const { x, y } = cell.getPosition()
		super(x, y, cell.getId(), cell.isBomb)

		this.#cellsAround = cellsAround
		this.#totalBombsAround = totalBombsAround
	}
	getIdsOfCellsAround = () => this.#cellsAround
	getTotalBombsAround = () => this.#totalBombsAround
}

export interface ICellInBoard extends ICell {
	getIdsOfCellsAround: () => number[]
	getTotalBombsAround: () => number
}

export interface ICell {
	expose: () => void
	markAsBomb: () => void
	unCheckAsBomb: () => void

	isExposed: () => boolean
	isBomb: boolean
	isMarkAsBomb: () => boolean

	getPosition: () => Position
	getId: () => number
}
