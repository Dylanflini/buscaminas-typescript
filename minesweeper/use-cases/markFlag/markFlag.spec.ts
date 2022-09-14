import { markFlagUseCase, MarkFlagUCError, GeneralError } from "./markFlag";
import { TPosition } from "@minesweeper/domain/commons.type";

describe("markFlagUseCase", () => {
  it("should mark a flag in the board", () => {
    const { flags } = markFlagUseCase({ position: [5, 7] });
    expect(flags[0].position).toStrictEqual([5, 7]);
  });
  it("should not add a flag in a position outside the limits of the board", () => {
    const inside = 7;
    const outside = 20;

    expect(() =>
      markFlagUseCase({ position: [inside, inside] })
    ).not.toThrowError(MarkFlagUCError.OUTSIDE_BOARD);

    expect(() => markFlagUseCase({ position: [outside, inside] })).toThrowError(
      MarkFlagUCError.OUTSIDE_BOARD
    );

    expect(() => markFlagUseCase({ position: [inside, outside] })).toThrowError(
      MarkFlagUCError.OUTSIDE_BOARD
    );

    expect(() =>
      markFlagUseCase({ position: [outside, outside] })
    ).toThrowError(MarkFlagUCError.OUTSIDE_BOARD);
  });
  it("should not add a flag where there is already a flag", () => {
    const x = 2;
    const y = 4;

    expect(() => markFlagUseCase({ position: [x, y] })).not.toThrowError(
      MarkFlagUCError.ALREADY_A_FLAG
    );

    expect(() => markFlagUseCase({ position: [x, y] })).toThrowError(
      MarkFlagUCError.ALREADY_A_FLAG
    );
  });
  it("should not add a flag when there is no flag available", () => {
    expect(() => markFlagUseCase({ position: [1, 2] })).not.toThrowError(
      MarkFlagUCError.NO_FLAGS_AVAILABLE
    );

    expect(() => markFlagUseCase({ position: [3, 4] })).toThrowError(
      MarkFlagUCError.NO_FLAGS_AVAILABLE
    );
  });
  it("should not add a flag in a cell which is already exposed", () => {
    const cellExposed: TPosition = [2, 2];

    expect(() => markFlagUseCase({ position: cellExposed })).not.toThrowError(
      MarkFlagUCError.CELL_ALREADY_EXPOSED
    );

    expect(() => markFlagUseCase({ position: cellExposed })).toThrowError(
      MarkFlagUCError.CELL_ALREADY_EXPOSED
    );
  });

  it("should only allows natural numbers as props", () => {
    const positive = 2;
    const negative = -2;
    const zero = 0;
    const decimal = 2.5;

    expect(() =>
      markFlagUseCase({ position: [positive, positive] })
    ).not.toThrowError(GeneralError.NOT_NATURAL_NUMBER);

    expect(() =>
      markFlagUseCase({ position: [positive, zero] })
    ).not.toThrowError(GeneralError.NOT_NATURAL_NUMBER);

    expect(() =>
      markFlagUseCase({ position: [negative, positive] })
    ).toThrowError(GeneralError.NOT_NATURAL_NUMBER);

    expect(() =>
      markFlagUseCase({ position: [positive, negative] })
    ).toThrowError(GeneralError.NOT_NATURAL_NUMBER);

    expect(() =>
      markFlagUseCase({ position: [positive, decimal] })
    ).toThrowError(GeneralError.NOT_NATURAL_NUMBER);

    expect(() =>
      markFlagUseCase({ position: [negative, negative] })
    ).toThrowError(GeneralError.NOT_NATURAL_NUMBER);
  });
});
