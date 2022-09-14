import { BoardModel } from '@minesweeper/domain/Board.model'
import { BombModel } from '@minesweeper/domain/Bomb.model'
import { CellModel } from '@minesweeper/domain/Cell.model'
import { IDataRepository } from '@minesweeper/domain/data.repository'
import { NeighborsBombsCounter } from '@minesweeper/domain/NeighborsBombsCounter.model'

interface IStartGameProps {
	data: IDataRepository
	rows: number
	columns: number
	bombs: number
}

type IBoardResponse = BoardModel

type IStartGameUseCase = (props: IStartGameProps) => Promise<IBoardResponse>

/**
 * start game base on initial props
 */

export const startGameUseCase: IStartGameUseCase = async ({
	bombs: bombsInput,
	rows,
	columns,
	data,
}) => {
	if (bombsInput < 1) {
		throw new Error('bombs must be greater than 0')
	}
	if (rows < 2) {
		throw new Error('rows must be greater than 1')
	}
	if (columns < 2) {
		throw new Error('columns must be greater than 1')
	}

	const totalCells = columns * rows

	const cells: CellModel[] = [...Array(totalCells)].map(() => ({
		exposed: false,
		position: [0, 0],
	}))

	let total = 0

	for (let y = 0; y < columns; y++) {
		for (let x = 0; x < rows; x++) {
			cells[total].position = [x, y]
			total++
		}
	}

	const getRandomNumber = (max: number): number =>
		Math.round(Math.random() * max)

	let bombs: BombModel[] = []

	while (bombs.length < bombsInput) {
		const newBomb: BombModel = {
			position: [getRandomNumber(rows - 1), getRandomNumber(columns - 1)],
		}

		const haveSamePosition = bombs.some(
			bomb =>
				bomb.position[0] === newBomb.position[0] &&
				bomb.position[1] === newBomb.position[1]
		)

		if (!haveSamePosition) {
			bombs.push(newBomb)
		}
	}

	const neighBorsBombsCounter: NeighborsBombsCounter[] = Array(totalCells)

	const boardWithoutId: Omit<BoardModel, 'id'> = {
		cells,
		bombs_available: bombsInput,
		bombs,
		rows,
		columns,
		flag_available: bombsInput,
		flags: [],
		neighBorsBombsCounter,
	}

	const { id } = await data.saveBoard(boardWithoutId)

	return {
		id,
		...boardWithoutId,
	}
}
