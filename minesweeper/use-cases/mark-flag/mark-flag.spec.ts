import { markFlagUseCase } from "./mark-flag";

describe("markFlagUseCase", () => {
  it("should board with a flag marked", () => {
    const { flags } = markFlagUseCase({ position: [5, 7] });
    expect(flags[0].position).toStrictEqual([5, 7]);
  });
  it.todo(
    "should not add a flag in a position outside the limits of the board"
  );
  it.todo("should not add a flag where there is already a flag");
  it.todo("should not add a flag when there is no flag available");
  it.todo("should not add a flag when there is a cell already exposed");

  it.todo("should only allows natural numbers as props");
});
