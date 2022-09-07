// Domain

export interface P23osition2123 {
	x: number
	y: number
}

// interface Cell {
// 	isBomb: boolean
// 	wasMarkedAsBomb: boolean
// 	wasExposed: boolean
// 	totalVecinos?: number
// 	vecinos?: Cell[]
// 	id?: string
// 	position: Position
// }

// interface ICell {}

// interface Table {
// 	rows: number
// 	columns: number
// 	totalBombs: number
// 	remainingBoms: number
// 	cells: Cell[]
// }

// interface ITable {
// 	createTable: () => Table
// 	markCellAsBomb: (table: Table, position: Position) => void
// 	// exposeCell: (table: Table, position: Position) => void
// }

// // Aplication - Use Cases
// function tableUseCase(): ITable {
// 	return {
// 		createTable: () => {
// 			const initial = { rows: 2, columns: 3, totalBombs: 2, remainingBoms: 2 }
// 			const cells: Cell[] = []

// 			for (let row = 0; row < initial.rows; row++) {
// 				// const algo = [];
// 				for (let column = 0; column < initial.columns; column++) {
// 					const cell = createCell(row, column)
// 					cells.push(cell)
// 				}
// 				// cells.push(algo);
// 			}

// 			function getRandomValue() {
// 				return Math.floor(Math.random() * (initial.rows * initial.columns))
// 			}

// 			function setBombs():any {
// 				if (initial.totalBombs === cells.filter(cell => cell.isBomb).length) {
// 					return
// 				}
// 				const random = getRandomValue()
// 				if (!cells[random].isBomb) {
// 					cells[random].isBomb = true
// 				}
// 				return setBombs()
// 			}

// 			setBombs()

// 			return { ...initial, cells }
// 		},
// 		markCellAsBomb: (table, position) => {
// 			const cell = table.cells.find(
// 				cell => cell.position.x === position.x && cell.position.y === position.y
// 			)
// 			if (cell) cell.wasMarkedAsBomb = true
// 		},
// 	}
// }

// function createCell(x: number, y: number): Cell {
// 	return {
// 		position: { x, y },
// 		isBomb: false,
// 		wasExposed: false,
// 		wasMarkedAsBomb: false,
// 	}
// }

// // function createTable(): Table {
// // const initial = { rows: 2, columns: 3, totalBombs: 2, remainingBoms: 2 }
// // const cells: Cell[] = []
// // for (let row = 0; row < initial.rows; row++) {
// // 	// const algo = [];
// // 	for (let column = 0; column < initial.columns; column++) {
// // 		const cell = createCell(row, column)
// // 		cells.push(cell)
// // 	}
// // 	// cells.push(algo);
// // }
// // function getRandomValue() {
// // 	return Math.floor(Math.random() * (initial.rows * initial.columns))
// // }
// // function setBombs() {
// // 	if (initial.totalBombs === cells.filter(cell => cell.isBomb).length) {
// // 		return
// // 	}
// // 	const random = getRandomValue()
// // 	if (!cells[random].isBomb) {
// // 		cells[random].isBomb = true
// // 	}
// // 	return setBombs()
// // }
// // setBombs()
// // return { ...initial, cells }
// // }

// // Infrastructure

// const table = tableUseCase().createTable()
// tableUseCase().markCellAsBomb(table, { x: 1, y: 2 })
// console.log(table)
