import { BoardModel } from '@minesweeper/domain/Board.model'
import { BombModel } from '@minesweeper/domain/Bomb.model'
import { CellModel } from '@minesweeper/domain/Cell.model'
import { FlagModel } from '@minesweeper/domain/Flag.model'
import { NeighborsBombsCounter } from '@minesweeper/domain/NeighborsBombsCounter.model'

interface IStartGameProps {
	rows: number
	columns: number
	bombs: number
}

type IBoardResponse = BoardModel

type IStartGameUseCase = (props: IStartGameProps) => IBoardResponse

/**
 * start game base on initial props
 */

export const startGameUseCase: IStartGameUseCase = ({
	bombs: bombsInput,
	rows,
	columns,
}) => {
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

	const neighBorsBombsCounter: NeighborsBombsCounter[] = Array(totalCells)
	const bombs: BombModel[] = Array(bombsInput)

	return {
		id: '111-222-333',
		cells,
		bombs_available: bombsInput,
		bombs,
		rows,
		columns,
		flag_available: bombsInput,
		flags: [],
		neighBorsBombsCounter,
	}
}
