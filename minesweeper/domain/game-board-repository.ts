import { BoardGameI, InitialData } from '@domain/game-board'

export interface GameBoardRepository {
	saveGameBoard: (params: InitialData) => Promise<BoardGameI>
}
