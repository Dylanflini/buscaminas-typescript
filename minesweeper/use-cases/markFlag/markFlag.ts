import { BoardModel } from "@minesweeper/domain/Board.model";
import { IPosition } from "@minesweeper/domain/commons.type";
import {
  makeValidations,
  MarkFlagUCError,
  GeneralError,
} from "./markFlag.validations";

export type IMarkFlagProps = IPosition;
export type IMarkFlagResponse = BoardModel;
export type IMarkFlagUseCase = (props: IMarkFlagProps) => IMarkFlagResponse;

/**
 * Mark flag in board
 */
export const markFlagUseCase: IMarkFlagUseCase = (props) => {
  const board: IMarkFlagResponse = {
    id: "111-222-333",
    flag_available: 10,
    bombs_available: 10,
    rows: 10,
    columns: 10,
    bombs: [{ position: [0, 0] }],
    cells: [{ position: [0, 0], exposed: false }],
    neighBorsBombsCounter: [{ position: [0, 0], quantity: 5 }],
    flags: [],
  };

  const {
    ALREADY_A_FLAG,
    CELL_ALREADY_EXPOSED,
    NO_FLAGS_AVAILABLE,
    OUTSIDE_BOARD,
    NOT_NATURAL_NUMBER,
  } = makeValidations(props, board);

  if (ALREADY_A_FLAG) throw Error(MarkFlagUCError.ALREADY_A_FLAG);
  if (CELL_ALREADY_EXPOSED) throw Error(MarkFlagUCError.CELL_ALREADY_EXPOSED);
  if (NO_FLAGS_AVAILABLE) throw Error(MarkFlagUCError.NO_FLAGS_AVAILABLE);
  if (OUTSIDE_BOARD) throw Error(MarkFlagUCError.OUTSIDE_BOARD);
  if (NOT_NATURAL_NUMBER) throw Error(GeneralError.NOT_NATURAL_NUMBER);

  board.flags = [props];

  return board;
};

export * from "./markFlag.validations";
