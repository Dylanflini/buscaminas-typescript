import { markFlagUseCase } from "./mark-flag";

describe("markFlagUseCase", () => {
  it("should board with a flag marked", () => {
    const {flags} = markFlagUseCase({ position: [5, 7] });
    expect(flags[0].position).toStrictEqual([5,7])
  });
  it("should not add a flag in a position outside the limits of the board",()=>{
    const {flags} = markFlagUseCase({ position: [500, 700] });
    expect(flags[0].position).toStrictEqual([5,7])
  })
});
