import { BoardModel } from "@minesweeper/domain/Board.model";
import { TPosition } from "@minesweeper/domain/commons.type";

interface IMarkFlagProps {
  position: TPosition;
}

type IMarkFlagResponse = BoardModel;

type IMarkFlagUseCase = (props: IMarkFlagProps) => IMarkFlagResponse;

/**
 * Mark flag in board
 */
export const markFlagUseCase: IMarkFlagUseCase = (props) => {
  return {
    id: "111-222-333",
    flag_available: 10,
    bombs_available: 10,
    rows: 10,
    columns: 10,
    bombs: [{ position: [0, 0] }],
    cells: [{ position: [0, 0], exposed: false }],
    neighBorsBombsCounter: [{ position: [0, 0], quantity: 5 }],
    flags: [props],
  };
};
