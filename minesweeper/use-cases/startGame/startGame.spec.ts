import { startGameUseCase } from './startGame'

describe('start game', () => {
	describe('props validations', () => {
		it('should throw if props columns or rows are not valid', () => {
			expect(() =>
				startGameUseCase({ bombs: 1, columns: 3, rows: 1 })
			).toThrowError('rows must be greater than 1')

			expect(() =>
				startGameUseCase({ bombs: 1, columns: 1, rows: 3 })
			).toThrowError('columns must be greater than 1')
		})

		it('should throw if props not contain bombs', () => {
			const props = { bombs: -1, rows: 2, columns: 2 }

			expect(() => startGameUseCase(props)).toThrowError(
				'bombs must be greater than 0'
			)
		})
	})

	it('shoult return initial board', () => {
		const props = { bombs: 2, columns: 3, rows: 2 }

		const {
			id,
			cells,
			columns,
			rows,
			bombs_available,
			flag_available,
			flags,
			bombs,
			neighBorsBombsCounter,
		} = startGameUseCase(props)

		expect(id).toBeTruthy()
		expect(id).not.toBe('')
		expect(cells.length).toBe(props.columns * props.rows)

		expect(bombs_available).toBe(props.bombs)
		expect(bombs.length).toBe(props.bombs)

		expect(columns).toBe(props.columns)
		expect(rows).toBe(props.rows)

		expect(flag_available).toBe(props.bombs)
		expect(flags.length).toBe(0)

		expect(neighBorsBombsCounter.length).toBe(props.columns * props.rows)
	})

	it('should return initial cells', () => {
		const props = { bombs: 1, rows: 3, columns: 2 }

		const { cells } = startGameUseCase(props)

		expect(cells).toStrictEqual([
			{ exposed: false, position: [0, 0] },
			{ exposed: false, position: [1, 0] },
			{ exposed: false, position: [2, 0] },
			{ exposed: false, position: [0, 1] },
			{ exposed: false, position: [1, 1] },
			{ exposed: false, position: [2, 1] },
		])
	})

	it('should all cells not to initilize exposed', () => {
		const props = { bombs: 2, columns: 3, rows: 2 }

		const { cells } = startGameUseCase(props)

		const match = cells.every(({ exposed }) => exposed === false)

		expect(match).toBe(true)
	})

	it('should all cells have diferente position', () => {
		const props = { bombs: 2, columns: 3, rows: 3 }

		const { cells } = startGameUseCase(props)
	})

	it.todo(
		'las bombas que se generan no deberian tener la misma posicion que otra'
	)

	it.todo('should all vecinos have value between 0 to 8')
	it.todo('should return 3 if initial bombs is 1 and row and column 2')
})
