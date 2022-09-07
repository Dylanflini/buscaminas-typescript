import { tableUseCase } from './tableUseCases'

describe('asdasd', () => {
	it('1123123', () => {
		const table = tableUseCase().createTable({
			rows: 2,
			columns: 3,
			totalBombs: 2,
		})

		const position = { x: 1, y: 1 }
		tableUseCase().markCellAsBomb(table, position)

		expect(table.getCell(position)?.wasMarkedAsBomb).toBe(true)
	})

	it('1112312323123', () => {
		const table = tableUseCase().createTable({
			rows: 3,
			columns: 3,
			totalBombs: 2,
		})

		const position = { x: 1, y: 1 }
		tableUseCase().exposeCell(table, position)
		const cell = table.getCell(position)

		console.log(cell)

		expect(cell?.cellsAround?.length).toBe(8)
	})

	it('11123123233123', () => {
		const table = tableUseCase().createTable({
			rows: 3,
			columns: 3,
			totalBombs: 2,
		})

		const position = { x: 0, y: 0 }
		tableUseCase().exposeCell(table, position)
		const cell = table.getCell(position)

		expect(cell?.cellsAround?.length).toBe(3)
	})

	it('zzzz', () => {
		const table = tableUseCase().createTable({
			rows: 3,
			columns: 3,
			totalBombs: 2,
		})

		const board = {
			cell: [
				{ isMine: true, id: 0, position: { x: 0, y: 0 } },
				{ isMine: false, id: 1, position: { x: 1, y: 0 } },
				{ isMine: false, id: 2, position: { x: 0, y: 1 } },
				{ isMine: false, id: 3, position: { x: 1, y: 1 } },
			],
		}

		//caso de uso:

		// exposeCell(board, cell)

		const position = { x: 0, y: 0 }
		tableUseCase().exposeCell(table, position)
		const cell = table.getCell(position)

		expect(cell?.cellsAround?.length).toBe(3)
	})
})
